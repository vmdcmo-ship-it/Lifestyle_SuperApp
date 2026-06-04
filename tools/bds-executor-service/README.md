# BDS Executor Service (Playwright)

Service thực thi hành động **Zalo/Facebook** bằng trình duyệt, implement đúng **HTTP contract** của `workflow-bds-pipeline`. Thay thế stub/OpenClaw ở khâu thực thi.

> **Triết lý**: Pipeline lo toàn bộ phần AI (sinh nội dung, lọc, chấm điểm bằng Claude) + quota/delay/checkpoint. Service này chỉ **thao tác trình duyệt deterministic** và trả JSON. Không có "não" LLM → nhanh, rẻ, dễ kiểm soát.

## Hợp đồng HTTP
`POST /` (mọi path) — header `Authorization: Bearer <BDS_EXECUTOR_TOKEN>` (nếu bật).
```json
{ "action": "check_phone|add_friend|send_message|add_group|fb_like|fb_comment|fb_message|fb_join_group",
  "account_id": "zalo_acc01", "params": { "phone": "...", "message": "...", "groupId": "...", "postId": "...", "text": "...", "recipientId": "...", "keyword": "...", "max": 1 } }
```
Trả: `{ "status": "ok|checkpoint|error", "data"?: {...}, "message"?: "..." }`
- `check_phone` → `data: { has_zalo: boolean, display_name?: string }`.
- `send_message` → `data: { delivered: boolean, reason?: string }` (`reason: "recipient_blocks_strangers"` khi người nhận chặn tin từ người lạ).
- `fb_join_group` → tìm nhóm theo `keyword`, xin tham gia tối đa `max` nhóm (mặc định 1). `data: { keyword, joined: [...], skipped: [...] }`.
  - **Vượt rào nhóm kín**: nếu hiện hộp thoại "Trả lời câu hỏi để tham gia", service tự điền câu trả lời (answer-bank persona, song ngữ Việt/Anh), tick đồng ý nội quy rồi bấm Gửi.
  - Params tùy chọn: `answers` (mảng `{keys:[],answer}` — câu hỏi chứa 1 trong `keys` thì dùng `answer`), `defaultAnswer` (câu trả lời mặc định khi không khớp), `agreeRules` (mặc định `true`), `phone` (chỉ điền khi câu hỏi hỏi SĐT — KHÔNG bịa số).
  - `joined[].status`: `requested_or_joined` (public/không câu hỏi) hoặc `requested_with_answers` (đã trả lời câu hỏi). Câu hỏi bắt buộc mà không gửi được → vào `skipped` + dump DOM để soi.
- `checkpoint` → pipeline tự phanh account.

## Cài đặt
```powershell
cd tools/bds-executor-service
npm install            # postinstall sẽ tải Chromium (playwright install)
# nếu đã --ignore-scripts thì chạy: npx playwright install chromium
copy .env.example .env # rồi điền cấu hình
```

## Đăng nhập tài khoản (1 lần / account)
```powershell
npm run login -- --account zalo_acc01 --platform zalo
npm run login -- --account fb_acc01  --platform fb
```
Cửa sổ trình duyệt mở → đăng nhập/quét QR → nhấn Enter để lưu. Phiên lưu bền trong `profiles/<account>/`.

## Chạy service
```powershell
npm run start
```
Mặc định cổng `5678`. Trỏ pipeline vào:
```dotenv
# tools/workflow-bds-pipeline/.env
EXECUTOR_MODE=openclaw
OPENCLAW_RUN_URL=http://127.0.0.1:5678/
OPENCLAW_TOKEN=<BDS_EXECUTOR_TOKEN nếu bật>
```
Rồi chạy như bình thường: `npm run zalo:check -- --executor openclaw ...`

## Trên VPS (headful giống người thật)
```bash
HEADLESS=false
xvfb-run -a npm run start   # cần cài xvfb
```
Mỗi account nên gắn proxy riêng: `ACCOUNT_PROXIES={"zalo_acc01":"http://user:pass@host:port"}`.

## ⚠️ Cần chỉnh trước khi chạy thật: SELECTOR
Toàn bộ selector Zalo/Facebook nằm tập trung trong **`src/selectors.ts`** (không nằm rải trong logic).
Mỗi bước là **mảng ứng viên** thử lần lượt (ưu tiên `text=`/`aria-label`/`placeholder` cho bền), helper `clickFirst/fillFirst/firstVisible` (`src/browser/dom.ts`) sẽ chọn cái khớp đầu tiên. UI hai nền tảng đổi thường xuyên nên cần kiểm tra lại bằng DOM thật.

### Quy trình tinh chỉnh (dùng `inspect` với account đã đăng nhập)
```powershell
# 1) Đăng nhập trước (xem mục trên), rồi chạy inspect — trình duyệt mở headful + giữ mở để soi DevTools
npm run inspect -- --account zalo_acc01 --flow open
npm run inspect -- --account zalo_acc01 --flow check_phone   --phone 0901234567
npm run inspect -- --account zalo_acc01 --flow send_message  --phone 0901234567 --message "Chào anh/chị"
npm run inspect -- --account zalo_acc01 --flow add_group     --phone 0901234567 --groupId "Tên nhóm"
npm run inspect -- --account fb_acc01   --flow fb_comment    --postId <url> --text "..."
npm run inspect -- --account fb_acc01   --flow fb_join_group --keyword "bất động sản" --max 1
```
- Mỗi lần chạy tự lưu **screenshot + HTML** vào `debug/` (cả khi 1 bước không tìm thấy selector → file `*-no-*`).
- Mở DevTools (F12) → Inspect phần tử → lấy selector ổn định → điền vào `src/selectors.ts`.
- Lặp `inspect` đến khi flow trả `ok`. Khi mọi flow xanh → bật service chạy thật.

`add_group` đã có khung đầy đủ (tìm nhóm → "Thêm thành viên" → nhập SĐT → xác nhận); chỉ cần khớp selector trong `ZALO.searchConversation / addMemberButton / addMemberConfirm`.

## ⚠️ Pháp lý & rủi ro
Tự động hoá Zalo/Facebook **vi phạm ToS**, rủi ro **khoá tài khoản và pháp lý** (nhắn tin hàng loạt người lạ có thể chạm quy định chống tin nhắn rác). Dùng account phụ đã "nuôi", volume thấp, ưu tiên người đã tương tác/đồng ý, luôn giữ human-in-the-loop (pipeline đã có).

## Cấu trúc
| File | Vai trò |
|------|---------|
| `src/server.ts` | HTTP server + router 6 action |
| `src/config.ts` | Cấu hình (port/token/profiles/proxy/locale) |
| `src/selectors.ts` | **Selector tập trung** (tinh chỉnh tại đây) |
| `src/browser/dom.ts` | `clickFirst/fillFirst/firstVisible` + `dumpDebug` |
| `src/browser/sessionManager.ts` | Context bền/account + `detectCheckpoint` + `humanPause` |
| `src/actions/zalo.ts` | check_phone / add_friend / send_message / add_group |
| `src/actions/facebook.ts` | fb_like / fb_comment / fb_message / fb_join_group |
| `src/login.ts` | CLI đăng nhập lưu phiên |
| `src/inspect.ts` | CLI tinh chỉnh selector (dump DOM/ảnh) |
