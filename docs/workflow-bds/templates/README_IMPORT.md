# Hướng dẫn import template Google Sheet — Workflow BĐS (P0)

> Bộ CSV này là **bản gốc cấu trúc**. Import vào Google Sheets để dựng nhanh 2 loại file:
> 1. **Sheet vận hành** (pipeline Lead) — 1 file duy nhất, nhiều tab.
> 2. **KB Master** — **MỖI DỰ ÁN 1 FILE RIÊNG** (chống nhầm thông tin).

---

## A. Sheet vận hành — file `WORKFLOW_BDS_OPS`

Tạo 1 Google Sheet mới tên `WORKFLOW_BDS_OPS`, rồi import từng CSV thành 1 tab (đặt tên tab đúng như cột "Tab"):

| Thứ tự | File CSV | Tab | Vai trò |
|---|---|---|---|
| 1 | `01_RAW.csv` | `RAW` | Dữ liệu thô từ scraper/kênh quét |
| 2 | `02_CLEAN.csv` | `CLEAN` | Đã chuẩn hóa SĐT + chấm điểm Lead |
| 3 | `03_QUEUE_TODAY.csv` | `QUEUE_TODAY` | Hàng đợi check Zalo theo quota/ngày |
| 4 | `04_CRM.csv` | `CRM` | Lead thu được + tag + log hội thoại |
| 5 | `05_CONFIG_QUOTA_DELAY.csv` | `CONFIG` | Hạn ngạch & delay chống checkpoint |
| 6 | `06_OUTREACH_QUEUE.csv` | `OUTREACH_QUEUE` | Hàng đợi kết bạn/nhắn tin/kéo nhóm Zalo |
| 7 | `07_FB_POSTS_QUEUE.csv` | `FB_POSTS_QUEUE` | Hàng đợi comment bài Facebook |
| 8 | `08_CONVERSATIONS.csv` | `CONVERSATIONS` | Log hội thoại để trích Lead vào CRM |

### Tab bổ sung — luồng FB → Zalo (xem [WORKFLOW_FB_ZALO_FUNNEL.md](../WORKFLOW_FB_ZALO_FUNNEL.md))

| File CSV | Tab | Vai trò |
|---|---|---|
| `FB_KEYWORDS.csv` | `FB_KEYWORDS` | Từ khóa tìm nhóm FB (đa vertical) |
| `FB_GROUPS_JOINED.csv` | `FB_GROUPS_JOINED` | Nhóm đã join + `first_comment_after` (+3 ngày) |
| `ZALO_LINKS_FOUND.csv` | `ZALO_LINKS_FOUND` | Link/QR Zalo trích từ post FB |
| `ZALO_GROUP_MEMBERS.csv` | `ZALO_GROUP_MEMBERS` | Member + role admin/phó |
| `FRIEND_FOLLOWUP.csv` | `FRIEND_FOLLOWUP` | Nhắc FB trước khi unfriend Zalo |

**Cách import 1 tab**: File → Import → Upload → chọn CSV → "Insert new sheet(s)" → đổi tên tab cho đúng.

> Tab tên `CONFIG` (không phải `CONFIG_QUOTA_DELAY`). Các tab kết quả `ZALO_CHECK_RESULTS`, `OUTREACH_RESULTS`, `FB_COMMENT_RESULTS` **không cần tạo trước** — pipeline tự ghi đè khi chạy `--source sheets`.

---

## B. KB Master — mỗi dự án 1 file `KB_<project_id>_<Tên>`

Mẫu sẵn cho dự án **DA001 (Vinhome Q9)**. Tạo Google Sheet tên `KB_DA001_VinhomeQ9`, import 4 CSV thành 4 tab:

| File CSV | Tab | Vai trò |
|---|---|---|
| `KB_DA001_VinhomeQ9__META.csv` | `META` | Định danh dự án + version + namespace |
| `KB_DA001_VinhomeQ9__KB.csv` | `KB` | Tri thức chính (mỗi dòng = 1 chunk) |
| `KB_DA001_VinhomeQ9__CAM_NOI.csv` | `CẤM_NÓI` | Lằn ranh đỏ riêng dự án |
| `KB_DA001_VinhomeQ9__CHANGELOG.csv` | `CHANGELOG` | Nhật ký thay đổi |

**Dự án mới**: copy nguyên bộ 4 file KB này → đổi `project_id`, `project_name`, `namespace` trong `META` và prefix `id` (vd `DA002-001`).

---

## C. Quy tắc vàng (BẮT BUỘC)

1. **1 dự án = 1 file KB = 1 namespace** (`kb_project_<id>`). Không gộp nhiều dự án vào 1 file.
2. Cột `id` trong tab `KB` **không đổi** (map 1–1 với vector DB). Tắt thông tin sai bằng `active = FALSE`, đừng xóa dòng.
3. Mỗi lần sửa `KB` → tăng `version` ở `META` + ghi 1 dòng `CHANGELOG`.
4. SĐT luôn chuẩn hóa về dạng `84xxxxxxxxx` (không dấu cách, không +).
5. `CONFIG` là nguồn sự thật cho quota/delay — pipeline phải đọc từ đây, không hardcode.

---

## D. Bước tiếp theo (P1 → P2)

- P1: viết pipeline lọc `RAW → CLEAN` (chuẩn hóa số + chấm điểm Lead bằng Claude API).
- P2: Apps Script đọc KB Master → re-embedding theo hash → upsert vào namespace.

> Lưu ý ký tự tiếng Việt: khi import giữ encoding **UTF-8** để không vỡ dấu.
