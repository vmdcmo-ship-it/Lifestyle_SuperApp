# Workflow Bán Hàng Bất Động Sản — Tự Động Hóa (OpenClaw + Claude API)

> **Mục đích**: Tài liệu chuẩn, duy nhất, ghi nhận toàn bộ kế hoạch xây dựng workflow tự động hóa quy trình bán BĐS: **Tìm khách FB → Lấy SĐT → Lọc → Check Zalo → Kết bạn/Nhắn tin giới thiệu → Kéo vào nhóm → Thu Lead về CRM**, có tầng tri thức riêng từng dự án + phong cách tư vấn nhân bản.
>
> **BẮT BUỘC đọc trước khi code/triển khai**:
> - [Kiến trúc & Clean Code](../architecture/README_ARCHITECTURE.md)
> - [Kế hoạch AI Ops đa Bot (tham chiếu)](../KE_HOACH_AI_OPS_DA_BOT_THAM_CHIEU.md) — Lark, n8n, OpenClaw, sandbox & phân quyền bot
> - [Quy trình Triển khai Deploy](../QUY_TRINH_TRIEN_KHAI_DEPLOY.md) — khi deploy lên VPS
> - [OpenClaw Quick Reference](../../openclaw-kodo/OPENCLAW_QUICK_REFERENCE.md)
>
> **Trạng thái**: 🟢 P0–P7 đã build & test (logic + Claude/Voyage/Qdrant thật) trong `tools/workflow-bds-pipeline`. Còn lại: ghép OpenClaw thật (Zalo/FB executor), cấp Google Service Account, deploy Qdrant lên VPS, rồi go-live.
> **Phiên bản tài liệu**: v1.1 — Cập nhật: 2026-06-03

---

## ⚠️ 0. Cảnh báo pháp lý & rủi ro (ĐỌC TRƯỚC)

| Vấn đề | Mức độ | Bắt buộc |
|---|---|---|
| Scraping Facebook (UID, profile, SĐT) vi phạm ToS của Meta | Cao | Ưu tiên kênh chính thống (Lead Ads, form opt-in) |
| Automation Zalo cá nhân vi phạm ToS Zalo → khóa nick | Cao | Hạn ngạch thấp + nuôi acc + có người giám sát |
| Thu thập SĐT không có đồng ý → vi phạm **NĐ 13/2023/NĐ-CP** (dữ liệu cá nhân) | Pháp lý | Tách luồng "lạnh" (chỉ kéo về OA/fanpage) vs "ấm" (đã opt-in mới nhắn trực tiếp) |

**Nguyên tắc an toàn**: Hệ thống chạy ở chế độ **bán tự động có giám sát (human-in-the-loop)**, KHÔNG full-auto 100%. Khâu nhạy cảm (kết bạn, nhắn tin, comment, add nhóm) phải qua người duyệt hoặc giới hạn quota chặt.

---

## 1. Tổng quan kiến trúc

```
[Kênh quét của bạn] ──UID/ID/SĐT──┐
                                  ▼
[FB Scraper (OpenClaw)] ──► [Google Sheet: RAW] ──► [CLEAN] ──► [QUEUE_TODAY]
                                                       ▲              │
                                  [Claude API: lọc/chấm điểm] ────────┘
                                                                      ▼
                                                        [Zalo Checker (OpenClaw)]
                                                                      │ HAS_ZALO
                                                                      ▼
                                  [Claude API: soạn tin] ──► [Zalo Bot: kết bạn → nhắn → add nhóm]
                                                                      │
                                                                      ▼
                                  [FB Comment Bot (nuôi tệp)] ── và ──► [CRM Sheet + Tag]
```

**Thành phần chính**:
- **OpenClaw**: thực thi hành vi trình duyệt (scrape FB, check/nhắn Zalo, comment).
- **Claude API**: "bộ não" — phân tích, chấm điểm Lead, bóc SĐT, soạn nội dung cá nhân hóa, phân tích phản hồi.
- **Google Sheet**: hàng đợi dữ liệu (RAW/CLEAN/QUEUE/CRM) + KB Master từng dự án.
- **Vector DB** (Pinecone/Qdrant/pgvector): tầng tri thức RAG, **namespace theo `project_id`**.

---

## 2. Quy trình chi tiết (9 bước)

| Bước | Hành động OpenClaw + Kênh quét | Nhiệm vụ Claude API |
|---|---|---|
| 1. Thu thập đầu vào | Quét UID nhóm → trích ID user → thu SĐT (nếu lộ). Đẩy realtime vào Sheet `RAW`. | Phân loại nguồn (nhóm BĐS/tài chính), gắn nhãn ngữ cảnh nhóm. |
| 2. Chuẩn hóa & lọc | `RAW` → `CLEAN`: chuẩn hóa số (84xxx), loại trùng, loại số rác/cố định, đối chiếu CRM. | Bóc SĐT viết lóng, chấm điểm Lead (nhu cầu/ngân sách/khu vực), giữ Lead ≥ ngưỡng. |
| 3. Hàng đợi có hạn ngạch | Sinh `QUEUE_TODAY` cắt theo quota/ngày/tài khoản. | Xếp ưu tiên Lead nóng; cân bằng tải giữa tài khoản. |
| 4. Kiểm tra Zalo | Mô phỏng "Tìm bạn qua SĐT", đọc kết quả, ghi cờ `HAS_ZALO`. | Đọc ảnh/text kết quả → xác nhận; trùng tên FB thì tăng độ tin cậy. |
| 5. Kết bạn + nhắn giới thiệu | Có Zalo → gửi lời mời + lời nhắn mở đầu; được duyệt mới gửi giới thiệu + brochure. Giãn cách theo delay. | Soạn lời mời & tin giới thiệu cá nhân hóa, nhiều biến thể (anti-spam), chọn dự án đúng phân khúc. |
| 6. Kéo vào nhóm phù hợp | Khách phản hồi tích cực → mời vào nhóm Zalo theo phân khúc. KHÔNG add hàng loạt. | Phân loại khách → chọn đúng nhóm; sinh lời mời tự nhiên, có lý do. |
| 7. Comment tương tác FB (nuôi tệp) | Comment đúng ngữ cảnh, có giá trị; thi thoảng cài SP khéo léo. Like/seen trước khi comment. | Đọc bài → sinh comment "người thật", không trùng mẫu, CTA mềm; tự né nếu bài không phù hợp. |
| 8. Phản hồi & chăm sóc | Lắng nghe hộp thoại Zalo + reply comment FB, gửi tin tiếp theo, gắn cờ cần người thật. | Phân tích ý định (quan tâm/từ chối/hỏi giá), tự trả lời, escalate Lead nóng cho sale. |
| 9. Thu Lead về CRM | Ghi hội thoại + trạng thái + nguồn về Sheet `CRM`; gắn tag. | Trích Lead có cấu trúc (Tên, SĐT, nhu cầu, ngân sách, mức quan tâm) + đề xuất bước tiếp theo. |

---

## 3. Cơ chế Delay & chống checkpoint (BẮT BUỘC)

| Tham số | Khuyến nghị an toàn | Ghi chú |
|---|---|---|
| Kết bạn Zalo / tài khoản / ngày | 10–20 (acc mới: 5–10) | Vượt → checkpoint |
| Tin nhắn mới (chưa là bạn) / ngày | 15–30 | Yếu tố nhạy cảm nhất |
| Add vào nhóm / ngày | 5–10 | Add ồ ạt = báo xấu/khóa |
| Comment FB / tài khoản / ngày | 10–15, rải đều | Không comment 2 bài liên tiếp |
| Delay giữa 2 lệnh | Random **45–180 giây** | Tránh số tròn/đều nhau |
| Khung giờ chạy | Giờ người thật (8–22h), nghỉ trưa | Chạy 24/7 = cờ đỏ |
| Hành vi "nuôi" | Xen kẽ scroll, like, xem story, seen | Tỷ lệ tương tác/chủ động ~ 70/30 |
| Đa tài khoản | Mỗi acc 1 cookie/IP/thiết bị (fingerprint) riêng | Tránh chung dấu vân tay |
| Cơ chế phanh | Tự dừng acc khi gặp captcha/checkpoint + cảnh báo | KHÔNG retry liên tục |

---

## 4. Tầng Tri thức (Knowledge Layer)

Thiết kế **2 nhóm tách biệt**:

### 4.A. Tri thức RIÊNG từng dự án (cô lập tuyệt đối)

- **Nguyên tắc vàng**: `1 dự án = 1 Google Sheet = 1 namespace vector DB` (`kb_project_<id>`). Truy vấn chỉ trong namespace của đúng `project_id` → không thể kéo nhầm dữ liệu dự án khác.
- **Nguồn chính xác**: chỉ nhận tài liệu gốc từ CĐT/sale (bảng giá, chính sách, pháp lý, tiến độ, mặt bằng, FAQ). Không tự suy diễn.
- **Chống bịa (hallucination)**: chỉ trả lời từ chunk truy xuất được; thiếu data → "em xác nhận lại với phòng kinh doanh".

### 4.B. Tri thức phong cách tư vấn (dùng CHUNG — định hình "nhân cách")

| Hạng mục | Nội dung | Mục tiêu |
|---|---|---|
| Persona | Tên, vai trò, giọng văn, xưng hô (em/anh-chị) | Nhất quán "một con người", không lộ bot |
| Nguyên tắc tư vấn | Lắng nghe trước, không chào hàng dồn dập, hỏi mở, dẫn theo phễu | Tăng chuyển đổi, tự nhiên |
| Văn phong nhân bản | Câu ngắn, cảm xúc vừa phải, emoji nhẹ, độ trễ như người | Vượt cảm giác "máy trả lời" |
| Thư viện kịch bản | Mẫu mở đầu / xử lý từ chối / chốt hẹn / theo dõi — nhiều biến thể | Anti-spam + linh hoạt |
| Lằn ranh đỏ (chung) | Không cam kết lợi nhuận tuyệt đối, không nói xấu đối thủ, không spam, tuân thủ pháp lý | Bảo vệ thương hiệu & pháp lý |

### Cách Claude kết hợp khi trả lời
1. **Định tuyến**: xác định `project_id` khách quan tâm → khóa context vào đúng namespace.
2. **Truy xuất**: lấy chunk B (persona, luôn nạp) + A (chỉ namespace của project đó).
3. **Lắp prompt**: System = Persona + Lằn ranh đỏ; Context = chunk dự án; Input = câu hỏi khách.
4. **Sinh trả lời**: phong cách B, nội dung *chỉ* từ A; thiếu data thì hẹn xác nhận.
5. **Ghi vết**: log `project_id` + chunk dùng → dễ truy nguồn, sửa KB.

---

## 5. KB Master trên Google Sheet (mỗi dự án 1 file)

Đặt tên: `KB_<project_id>_<TênDựÁn>` (vd: `KB_DA001_VinhomeQ9`).

### Tab `META` (1 dòng)
| project_id | project_name | version | updated_at | owner | status |
|---|---|---|---|---|---|
| DA001 | Vinhome Q9 | 12 | 2026-06-03 | sale_a | active |

### Tab `KB` (mỗi dòng = 1 chunk)
| id | category | question | answer | keywords | priority | active | updated_at |
|---|---|---|---|---|---|---|---|
| DA001-001 | Giá | Giá căn 2PN? | 2PN từ 3.2 tỷ... | giá, 2pn | 1 | TRUE | 2026-06-03 |

`category` chuẩn: `Tổng quan / Vị trí / Giá / Chính sách / Pháp lý / Tiến độ / Tiện ích / USP / FAQ`.

### Tab `CẤM_NÓI`
| id | nội_dung_cấm | lý_do |
|---|---|---|

### Tab `CHANGELOG`
| time | field | old | new | by |
|---|---|---|---|---|

### Pipeline đồng bộ + re-embedding
| Bước | Cơ chế |
|---|---|
| 1. Team cập nhật | Sale sửa tab `KB`; mỗi lần sửa tăng `version` ở `META`. |
| 2. Trigger | Apps Script `onEdit` hoặc cron (5–15') phát hiện đổi → webhook tới pipeline. |
| 3. Đọc & lọc | Đọc qua Sheets API, chỉ lấy dòng `active = TRUE`. |
| 4. So sánh hash | Hash (`id` + `answer`); chỉ dòng đổi mới re-embedding → tiết kiệm chi phí. |
| 5. Re-embedding | Upsert vào namespace `kb_project_<id>` kèm metadata. |
| 6. Dọn dữ liệu cũ | Dòng `active = FALSE`/đã xóa → xóa vector tương ứng. |
| 7. Xác nhận | Ghi kết quả (số chunk cập nhật) về `CHANGELOG`/log. |

**Quy tắc chống nhầm**: cột `id` ổn định (map vector ↔ dòng 1–1); cột `active` để tắt nhanh thông tin sai mà không xóa dòng.

---

## 6. Cấu trúc Sheet vận hành (pipeline Lead)

| Tab | Vai trò | Cột chính |
|---|---|---|
| `RAW` | Dữ liệu thô từ scraper | uid, fb_id, raw_text, phone_raw, source_group, project_id, created_at |
| `CLEAN` | Đã chuẩn hóa + chấm điểm | phone, name, need, budget, area, lead_score, project_id |
| `QUEUE_TODAY` | Hàng đợi theo quota/ngày | phone, account_id, action, priority, scheduled_at |
| `CRM` | Lead thu được | phone, name, need, budget, interest_level, status, tag, source, conversation_log |

---

## 7. Đánh giá khả thi

| Hạng mục | Khả thi | Rủi ro chính |
|---|---|---|
| Quét UID/ID/SĐT | Cao | FB rate-limit; tỷ lệ lộ SĐT thấp |
| Lọc qua Sheet | Cao | Cần chuẩn hóa + chống trùng |
| Check số có Zalo | TB–Cao | Không có API public → mô phỏng, dễ checkpoint |
| Nhắn/add nhóm Zalo | TB | Giới hạn acc cá nhân, dễ báo xấu |
| Comment FB nhân bản | Cao | Comment lặp mẫu = bay nick |
| Delay/quota | Cao | Yếu tố sống còn |

**Kết luận**: Khả thi ở mức **bán tự động có giám sát**. Chạy nhiều acc "nuôi" + quota thấp + người duyệt khâu nhạy cảm.

---

## 8. Roadmap triển khai (đề xuất thứ tự)

| Phase | Nội dung | Đầu ra | Trạng thái |
|---|---|---|---|
| P0 | Dựng cấu trúc Google Sheet (RAW/CLEAN/QUEUE/CRM) + KB Master mẫu 1 dự án | Sheet template (`docs/workflow-bds/templates/`) | ✅ Xong |
| P1 | Pipeline lọc + chấm điểm (Claude API) RAW→CLEAN | `tools/workflow-bds-pipeline` (Claude Haiku) | ✅ Xong |
| P2 | Tầng tri thức: Qdrant + Voyage + namespace + sync/re-embedding incremental | KB sync + retriever (đã test plumbing) | ✅ Xong |
| P3 | Persona + system prompt + thư viện kịch bản + guardrail | Advisor nhân bản (đã test với Claude thật) | ✅ Xong |
| P4 | Zalo checker + cơ chế delay/quota + phanh checkpoint | Lớp an toàn + Zalo checker (đã test) | ✅ Xong |
| P5 | Kết bạn/nhắn tin/add nhóm Zalo (human-in-the-loop) | Outreach + content grounded (đã test) | ✅ Xong |
| P6 | FB comment bot nuôi tệp (anti-spam) | Cổng lọc + comment grounded (đã test) | ✅ Xong |
| P7 | CRM hoàn chỉnh + tag + báo cáo | Extractor + report (đã test) | ✅ Xong |

---

## 9. Khuyến nghị giảm rủi ro (chốt)

1. **Hợp pháp hóa khâu thu số**: ưu tiên Zalo OA + Facebook Lead Ads + form opt-in → SĐT có đồng ý (NĐ 13/2023).
2. **Tách 2 luồng**: "lạnh" (quét + comment) chỉ kéo về fanpage/OA; "ấm" (đã opt-in) mới nhắn trực tiếp.
3. **Người duyệt** ở bước 5, 6, 7 trước khi gửi.
4. **Một dự án một namespace** — kiểm tra định kỳ tránh trộn dữ liệu.

---

## 10. Checklist trước khi triển khai

- [ ] Đã đọc [README_ARCHITECTURE.md](../architecture/README_ARCHITECTURE.md) và [KE_HOACH_AI_OPS_DA_BOT_THAM_CHIEU.md](../KE_HOACH_AI_OPS_DA_BOT_THAM_CHIEU.md)
- [ ] Đã rà soát cảnh báo pháp lý (mục 0) và chọn mô hình bán tự động có giám sát
- [ ] Đã dựng cấu trúc Sheet vận hành + KB Master mẫu
- [ ] Mỗi dự án có `project_id` + namespace vector DB riêng
- [ ] Đã cấu hình cơ chế delay/quota + phanh checkpoint
- [ ] Có người duyệt khâu nhạy cảm (kết bạn/nhắn/comment/add nhóm)
- [ ] Persona + lằn ranh đỏ được version-controlled
