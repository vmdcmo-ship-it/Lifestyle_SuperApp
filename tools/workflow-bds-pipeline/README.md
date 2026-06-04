# @lifestyle/workflow-bds-pipeline (P1)

Pipeline lọc **RAW → CLEAN** cho [Workflow bán hàng BĐS](../../docs/workflow-bds/README.md):
chuẩn hóa SĐT (kể cả số viết lóng), khử trùng, đối chiếu CRM, và chấm điểm Lead bằng **Claude API** (có fallback offline).

## Cài đặt

```bash
cd tools/workflow-bds-pipeline
npm install
cp .env.example .env   # điền ANTHROPIC_API_KEY
```

## Chạy

```bash
# Có Claude (đọc ANTHROPIC_API_KEY từ env)
npm run clean -- --input ../../docs/workflow-bds/templates/01_RAW.csv \
  --output ./CLEAN.csv \
  --crm ../../docs/workflow-bds/templates/04_CRM.csv

# Offline (không gọi Claude, tiết kiệm token khi test)
USE_CLAUDE=false npm run clean -- --input ./RAW.csv --output ./CLEAN.csv
```

| Tham số | Bắt buộc | Ý nghĩa |
|---|---|---|
| `--input` | ✅ | File CSV RAW (đúng cột tab `RAW`) |
| `--output` | ✅ | File CSV CLEAN xuất ra |
| `--crm` | ❌ | File CSV CRM để gắn cờ `in_crm` |

## Biến môi trường

| Biến | Mặc định | Mô tả |
|---|---|---|
| `ANTHROPIC_API_KEY` | — | API key Claude |
| `CLAUDE_MODEL` | `claude-sonnet-4-5` | Model dùng để bóc SĐT + chấm điểm (đổi theo model khả dụng) |
| `USE_CLAUDE` | `true` | `false` = chỉ chạy offline |
| `LEAD_SCORE_MIN` | `50` | Ngưỡng giữ Lead (0–100) |

## Luồng xử lý

1. Đọc RAW (CSV).
2. Với mỗi dòng: phân tích offline (need/budget/area/score) + Claude (bóc SĐT lóng, chấm điểm) nếu bật.
3. Chốt SĐT: `phone_raw` → Claude → bóc từ text (chuẩn hóa về `84xxxxxxxxx`).
4. Loại dòng không có SĐT, khử trùng theo SĐT, gắn cờ `in_crm`.
5. Loại Lead có điểm < `LEAD_SCORE_MIN`.
6. Ghi CLEAN (CSV) + in thống kê.

## Kiến trúc module

| File | Trách nhiệm |
|---|---|
| `src/types.ts` | Kiểu RAW/CLEAN/LeadAnalysis/Config |
| `src/phone.ts` | Chuẩn hóa SĐT VN + bóc số viết lóng (offline) |
| `src/scoring.ts` | Phát hiện nhu cầu/ngân sách/khu vực + chấm điểm offline |
| `src/claude.ts` | Gọi Claude API trả JSON có cấu trúc |
| `src/pipeline.ts` | Orchestrator RAW→CLEAN (dedup, CRM, ngưỡng) |
| `src/csv.ts` | Parse/serialize CSV tối giản |
| `src/cli.ts` | Giao diện dòng lệnh |

## Ghi chú

- Claude là "bộ não" cho số viết lóng phức tạp; offline làm sàn an toàn — nếu Claude lỗi, pipeline vẫn chạy bằng kết quả offline.
- `lead_score` cuối = `max(Claude, offline)` để tránh tụt điểm Lead tốt.

---

# P2 — Google Sheets API + Tầng tri thức RAG (Qdrant + Voyage AI)

## Thành phần

| Module | Trách nhiệm |
|---|---|
| `src/embeddings/*` | Voyage AI embedder (`voyage-3-lite`) + Mock embedder (test) |
| `src/vectorstore/qdrant.ts` | Qdrant store: 1 collection/namespace `kb_project_<id>` |
| `src/kb/sync.ts` | Đồng bộ KB: diff theo `content_hash` -> chỉ embed dòng đổi; xóa dòng `active=FALSE`/gỡ |
| `src/kb/retriever.ts` | Truy xuất RAG **chỉ trong namespace của 1 dự án** (chống nhầm) |
| `src/kb/csvSource.ts`, `sheetsSource.ts` | Nguồn KB từ CSV hoặc Google Sheet KB Master |
| `src/sheets/googleSheets.ts` | Đọc/ghi tab Google Sheet (RAW/CLEAN/CRM, META/KB) |

## Chạy Qdrant (Docker)

```bash
docker run -d --name bds-qdrant -p 6333:6333 qdrant/qdrant:latest
```

## Đồng bộ KB của 1 dự án vào vector DB

```bash
# Từ CSV (KB Master mẫu DA001)
npm run kb:sync -- --source csv \
  --meta ../../docs/workflow-bds/templates/KB_DA001_VinhomeQ9__META.csv \
  --kb   ../../docs/workflow-bds/templates/KB_DA001_VinhomeQ9__KB.csv

# Từ Google Sheet KB Master (mỗi dự án 1 spreadsheet)
npm run kb:sync -- --source sheets --sheet-id <SPREADSHEET_ID>
```

Đồng bộ là **incremental**: chạy lại chỉ embed lại dòng có nội dung thay đổi (so `content_hash`), nên rẻ.

## Truy vấn KB (RAG)

```bash
npm run kb:query -- --project DA001 --query "giá căn 2 phòng ngủ bao nhiêu" --topk 3
```

## Google Sheets thay CSV (mọi CLI hành động)

Tất cả CLI đều nhận `--source sheets` để đọc/ghi **tab** trong 1 Google Sheet vận hành thay vì file CSV. Cần `--sheet-id <OPS_SHEET_ID>` (hoặc đặt `OPS_SHEET_ID` trong `.env`) + service account đã share quyền sửa Sheet.

```bash
# RAW -> CLEAN
npm run clean -- --source sheets --sheet-id <OPS_SHEET_ID>
# Check Zalo: đọc tab QUEUE_TODAY + CONFIG -> ghi tab ZALO_CHECK_RESULTS
npm run zalo:check -- --source sheets --sheet-id <OPS_SHEET_ID> --executor openclaw
# Outreach: đọc OUTREACH_QUEUE + CONFIG -> ghi OUTREACH_RESULTS
npm run outreach   -- --source sheets --sheet-id <OPS_SHEET_ID> --executor openclaw
# FB comment: đọc FB_POSTS_QUEUE + CONFIG -> ghi FB_COMMENT_RESULTS
npm run fb:comment -- --source sheets --sheet-id <OPS_SHEET_ID> --executor openclaw
# CRM: đọc CONVERSATIONS -> APPEND vào CRM
npm run crm        -- --source sheets --sheet-id <OPS_SHEET_ID>
```

Tên tab mặc định khớp `docs/workflow-bds/templates/README_IMPORT.md`. Có thể đổi qua cờ `--queue-tab`, `--config-tab`, `--result-tab`, `--input-tab`. Bỏ `--source sheets` → quay về chế độ CSV cũ (`--queue/--config/--output/--input`), không phá vỡ luồng hiện có.

## Cấu hình `.env` (P2)

| Biến | Mô tả |
|---|---|
| `EMBEDDING_PROVIDER` | `voyage` (mặc định) hoặc `mock` (test không tốn tiền) |
| `VOYAGE_API_KEY` / `VOYAGE_MODEL` | Key + model Voyage (`voyage-3-lite` = 512 chiều) |
| `QDRANT_URL` / `QDRANT_API_KEY` | Endpoint Qdrant (Windows dùng `127.0.0.1`) |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Đường dẫn file service account JSON |
| `OPS_SHEET_ID` | ID Google Sheet vận hành |

## Thiết lập Google Service Account (tóm tắt)

1. Google Cloud Console → tạo project → bật **Google Sheets API**.
2. Tạo **Service Account** → tạo key JSON → tải về, trỏ `GOOGLE_SERVICE_ACCOUNT_JSON` tới file.
3. **Share** Google Sheet (OPS và từng KB Master) cho email service account (quyền Editor).

## Nguyên tắc chống nhầm dự án (RAG)

- Mỗi dự án = **1 collection Qdrant** tên `kb_project_<id>`. Retriever chỉ tìm trong namespace của `project_id` truyền vào → **không thể** kéo nhầm dữ liệu dự án khác.
- `chunk_id` (vd `DA001-001`) map 1–1 với điểm vector (qua UUID tất định). Sửa nội dung → đổi `content_hash` → tự re-embed.

## Lưu ý

- **MockEmbedder** chỉ để kiểm thử đường ống (vector không mang ngữ nghĩa → kết quả truy vấn không liên quan). Production phải dùng Voyage để có độ liên quan thật.

---

# P3 — Advisor: tư vấn nhân bản (Retriever + Persona + Claude)

Ghép tri thức dự án (A) + phong cách tư vấn (B) thành câu trả lời tự nhiên như người thật, có guardrail chống bịa.

## Thành phần

| Module | Trách nhiệm |
|---|---|
| `assets/persona.json` | Nhân cách (tên, giọng), nguyên tắc, văn phong, **lằn ranh đỏ**, thư viện kịch bản, câu hẹn xác nhận |
| `src/advisor/persona.ts` | Nạp persona (đổi qua `PERSONA_PATH`) |
| `src/advisor/advisor.ts` | Retrieve theo `project_id` → dựng prompt (persona + context) → Claude (writer) → JSON |

## Chạy

```bash
npm run advisor -- --project DA001 --message "Căn 2 phòng ngủ giá bao nhiêu vậy em?"
```

Đầu ra gồm câu trả lời + metadata: `intent`, `escalate`, `has_answer`, `used_chunk_ids`.

## Guardrail (chống bịa & nhầm)

| Tình huống | Hành vi |
|---|---|
| Hỏi thông tin **có** trong KB dự án | Trả lời tự nhiên, `has_answer=true` |
| Hỏi thông tin **không có** trong KB | `has_answer=false`, hẹn xác nhận với phòng kinh doanh, KHÔNG bịa |
| Dự án **chưa có tri thức** (namespace rỗng) | Trả `no_data_reply`, `escalate=true`, không gọi Claude (tiết kiệm) |
| Ngoài phạm vi / cần người thật | `escalate=true` |

## Cấu hình `.env` (P3)

| Biến | Mặc định | Mô tả |
|---|---|---|
| `CLAUDE_MODEL_WRITER` | `claude-sonnet-4-5` | Model soạn câu trả lời (Sonnet cho tự nhiên) |
| `PERSONA_PATH` | `./assets/persona.json` | File persona |
| `RAG_TOP_K` | `4` | Số chunk lấy cho mỗi câu trả lời |

## Kiến trúc model phân tầng (tiết kiệm chi phí)

| Khâu | Model | Biến |
|---|---|---|
| Lọc/chấm điểm Lead (P1) | Claude 3 Haiku | `CLAUDE_MODEL` |
| Soạn câu trả lời tư vấn (P3) | Claude Sonnet | `CLAUDE_MODEL_WRITER` |

## Lưu ý

- Persona là tri thức **dùng chung** mọi dự án; KB là tri thức **riêng** từng dự án — Advisor luôn ghép B (persona, luôn nạp) + A (chỉ namespace của `project_id`).

---

# P4 — Lớp an toàn (quota + delay + phanh checkpoint) & Zalo checker

Lớp điều phối chống bị khóa nick. Hành vi Zalo thật do **OpenClaw** thực thi qua interface `ZaloExecutor`; ở đây có sẵn `MockZaloExecutor` để test logic.

## Thành phần

| Module | Trách nhiệm |
|---|---|
| `src/safety/configLoader.ts` | Đọc CONFIG quota/delay (`05_CONFIG_QUOTA_DELAY.csv`) |
| `src/safety/state.ts` | Lưu trạng thái (usage theo ngày + account paused) ra JSON, tự reset sang ngày mới |
| `src/safety/delay.ts` | Delay ngẫu nhiên [min,max] + kiểm tra khung giờ hoạt động |
| `src/safety/quotaManager.ts` | `permit()` (paused / quota / giờ) + `record()` + `pauseAccount()` |
| `src/zalo/checker.ts` | Orchestrator: duyệt hàng đợi, áp delay, gọi executor, **phanh khi checkpoint** |
| `src/zalo/mockExecutor.ts` | Executor giả lập (tỉ lệ có Zalo + checkpoint cấu hình được) |
| `src/zalo/types.ts` | `ZaloExecutor` interface — **điểm ghép OpenClaw thật** |

## Chạy

```bash
# --fast: bỏ delay thật để test nhanh (production KHÔNG dùng --fast)
npm run zalo:check -- \
  --queue ../../docs/workflow-bds/templates/03_QUEUE_TODAY.csv \
  --config ../../docs/workflow-bds/templates/05_CONFIG_QUOTA_DELAY.csv \
  --state ./safety-state.json \
  --output ./zalo-check-results.csv \
  --fast --checkpoint-rate 0
```

| Cờ | Mặc định | Ý nghĩa |
|---|---|---|
| `--queue` | (bắt buộc) | CSV hàng đợi (cột `phone`, `account_id`, `action`) |
| `--config` | (bắt buộc) | CSV cấu hình quota/delay |
| `--state` | `./safety-state.json` | File trạng thái (quota + phanh), giữ qua các lần chạy |
| `--output` | `./zalo-check-results.csv` | Kết quả check |
| `--fast` | off | Bỏ sleep thật (chỉ để test) |
| `--checkpoint-rate` | `0` | Tỉ lệ giả lập checkpoint (test phanh) |

## Cơ chế an toàn

- **Quota/ngày/account**: vượt `limit_per_account_per_day` (hoặc `limit_account_new` cho acc mới) → từ chối `quota_exceeded`.
- **Khung giờ**: ngoài `active_hours` → từ chối `outside_active_hours`.
- **Delay**: ngẫu nhiên trong `[delay_min_seconds, delay_max_seconds]` trước mỗi lệnh (tránh nhịp đều).
- **Phanh checkpoint**: gặp captcha/checkpoint → account chuyển `paused`, dừng xử lý account đó; trạng thái **lưu vào state** nên các lần chạy sau vẫn skip cho tới khi được mở lại thủ công.

## Ghép OpenClaw thật (production)

Cài đặt `ZaloExecutor.checkPhone(phone, accountId)` bằng OpenClaw (mở Zalo, "Tìm bạn qua SĐT", đọc kết quả). Thay `MockZaloExecutor` bằng class này — phần orchestrator/quota/delay/phanh giữ nguyên.

## Lưu ý

- Đây là lớp logic; hành vi thật do OpenClaw thực thi.

---

# P5 — Outreach Zalo (kết bạn / nhắn tin / add nhóm) — human-in-the-loop

Dùng lại lớp an toàn (P4) + Advisor (P3). Sinh nội dung trước, **chỉ gửi khi `approved=TRUE`**.

## Thành phần

| Module | Trách nhiệm |
|---|---|
| `src/outreach/contentGenerator.ts` | add_friend/add_group: kịch bản persona; message: `Advisor.composeOutreach` (grounded KB) |
| `src/outreach/orchestrator.ts` | Duyệt task → sinh draft → (nếu duyệt) quota+delay+executor; **phanh checkpoint** |
| `src/outreach/mockOutreachExecutor.ts` | Executor giả lập (addFriend/sendMessage/addToGroup) |
| `src/outreach/types.ts` | `OutreachExecutor` interface — **điểm ghép OpenClaw thật** |

## Queue (CSV)

Cột: `phone, account_id, action, project_id, project_name, lead_name, lead_need, group_id, group_name, approved`.
`action` ∈ `add_friend | message | add_group`. Template: `docs/workflow-bds/templates/06_OUTREACH_QUEUE.csv`.

## Chạy

```bash
npm run outreach -- \
  --queue ../../docs/workflow-bds/templates/06_OUTREACH_QUEUE.csv \
  --config ../../docs/workflow-bds/templates/05_CONFIG_QUOTA_DELAY.csv \
  --state ./safety-state.json \
  --output ./outreach-results.csv \
  --fast
```

## Human-in-the-loop

| `approved` | Hành vi |
|---|---|
| `FALSE` | Sinh **draft** nội dung để người duyệt; KHÔNG gửi, KHÔNG tốn quota |
| `TRUE` | Qua quota/delay → gửi qua executor; checkpoint → phanh account |

File kết quả luôn kèm cột `content` (nội dung đã soạn) để review trước khi bật `approved`.

## Mapping quota

| action | rule trong CONFIG |
|---|---|
| `add_friend` | `zalo:add_friend` |
| `message` | `zalo:message_new` |
| `add_group` | `zalo:add_group` |

## Lưu ý

- Nội dung `message` được Claude soạn **grounded theo KB dự án** (không bịa) + đúng persona.

---

# P6 — FB comment bot nuôi tệp (anti-spam, đúng ngữ cảnh)

Bình luận giá trị, tự nhiên như người thật vào nhóm FB; chống spam nhiều lớp.

## Thành phần

| Module | Trách nhiệm |
|---|---|
| `src/fb/commentGenerator.ts` | **Cổng lọc** (Haiku, rẻ): bài có phù hợp để comment? → **soạn comment** (Sonnet) chỉ khi phù hợp |
| `src/fb/runner.ts` | Anti-spam (không 2 bài liên tiếp cùng nhóm) + quota/delay/phanh + duyệt + like trước comment |
| `src/fb/mockFbExecutor.ts` + `types.ts` | Executor giả lập + interface ghép OpenClaw |

## Chạy

```bash
npm run fb:comment -- \
  --queue ../../docs/workflow-bds/templates/07_FB_POSTS_QUEUE.csv \
  --config ../../docs/workflow-bds/templates/05_CONFIG_QUOTA_DELAY.csv \
  --state ./safety-state.json \
  --output ./fb-comment-results.csv \
  --fast
```

## Cơ chế chống spam (nhiều lớp)

1. **Cổng lọc ngữ cảnh** (Haiku): bỏ bài không liên quan / nhạy cảm / chính trị / rao bán đối thủ.
2. **Comment có giá trị**: Sonnet viết ngắn, đúng ngữ cảnh, gợi ý sản phẩm rất nhẹ (chỉ khi hợp).
3. **Không 2 bài liên tiếp cùng nhóm** (mỗi account).
4. **Quota/ngày + delay ngẫu nhiên + khung giờ** (tái dùng P4).
5. **Like trước khi comment** (hành vi tự nhiên).
6. **Human-in-the-loop**: `approved=FALSE` → chỉ tạo draft để review (đặc biệt khi `has_cta`).
7. **Phanh checkpoint**: gặp checkpoint → pause account.

## Kiến trúc model phân tầng

| Khâu | Model | Biến |
|---|---|---|
| Lọc bài (gate) | Haiku | `CLAUDE_MODEL` |
| Soạn comment | Sonnet | `CLAUDE_MODEL_WRITER` |

> Model khả dụng tùy tài khoản — kiểm tra bằng `GET https://api.anthropic.com/v1/models`.

## Lưu ý

- Comment được sinh đúng persona + lằn ranh đỏ; cổng lọc loại bài nhạy cảm/sai chủ đề.

---

# P7 — CRM: tổng hợp hội thoại → Lead có cấu trúc + báo cáo

Bước cuối: biến hội thoại thô thành Lead có cấu trúc cho sale.

## Thành phần

| Module | Trách nhiệm |
|---|---|
| `src/crm/extractor.ts` | Claude (Haiku) đọc hội thoại → JSON Lead (need, budget, area, interest_level, status, tags, next_action, summary) |
| `src/crm/report.ts` | Tổng hợp theo mức quan tâm / trạng thái / nhu cầu + danh sách Lead nóng |
| `src/cli-crm.ts` | `npm run crm` — đọc hội thoại, ghi CRM CSV, (tùy chọn) ghi Google Sheet, in báo cáo |

## Chạy

```bash
# Ghi ra CSV
npm run crm -- --input ../../docs/workflow-bds/templates/08_CONVERSATIONS.csv --output ./crm-leads.csv

# Ghi thêm vào tab CRM của Google Sheet vận hành
npm run crm -- --input ./conversations.csv --sheet-id <OPS_SHEET_ID>
```

## Đầu vào (CSV)

Cột: `phone, name, project_id, source, conversation_log` (log dạng nhiều lượt, ngăn bằng `|`).
Template: `docs/workflow-bds/templates/08_CONVERSATIONS.csv`.

## Đầu ra

- CSV theo đúng cột tab `CRM` (+ cột `summary`): `phone, name, need, budget, interest_level, status, tag, project_id, source, ..., next_action, summary`.
- Báo cáo: tổng Lead, phân bố hot/warm/cold, theo trạng thái/nhu cầu, **danh sách Lead nóng cần ưu tiên**.

## Lưu ý

- `interest_level`: `hot` (sẵn sàng gặp/chốt) / `warm` (cần chăm) / `cold` (hờ hững).
- Dùng Haiku (`CLAUDE_MODEL`) vì trích xuất là tác vụ lặp, tiết kiệm token.
