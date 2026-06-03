# BDS Executor Service (Playwright)

Service thực thi hành động **Zalo/Facebook** bằng trình duyệt, implement đúng **HTTP contract** của `workflow-bds-pipeline`. Thay thế stub/OpenClaw ở khâu thực thi.

> **Triết lý**: Pipeline lo toàn bộ phần AI (sinh nội dung, lọc, chấm điểm bằng Claude) + quota/delay/checkpoint. Service này chỉ **thao tác trình duyệt deterministic** và trả JSON. Không có "não" LLM → nhanh, rẻ, dễ kiểm soát.

## Hợp đồng HTTP
`POST /` (mọi path) — header `Authorization: Bearer <BDS_EXECUTOR_TOKEN>` (nếu bật).
```json
{ "action": "check_phone|add_friend|send_message|add_group|fb_like|fb_comment",
  "account_id": "zalo_acc01", "params": { "phone": "...", "message": "...", "groupId": "...", "postId": "...", "text": "..." } }
```
Trả: `{ "status": "ok|checkpoint|error", "data"?: {...}, "message"?: "..." }`
- `check_phone` → `data: { has_zalo: boolean, display_name?: string }`.
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
Các selector Zalo Web / Facebook là **KHUNG mẫu** (đánh dấu `// TODO[selector]` trong `src/actions/*.ts`).
UI hai nền tảng đổi thường xuyên → phải mở DevTools, kiểm tra và cập nhật selector cho khớp.
`add_group` hiện trả `error` (chưa cấu hình selector) — cần hoàn thiện theo UI nhóm Zalo.

## ⚠️ Pháp lý & rủi ro
Tự động hoá Zalo/Facebook **vi phạm ToS**, rủi ro **khoá tài khoản và pháp lý** (nhắn tin hàng loạt người lạ có thể chạm quy định chống tin nhắn rác). Dùng account phụ đã "nuôi", volume thấp, ưu tiên người đã tương tác/đồng ý, luôn giữ human-in-the-loop (pipeline đã có).

## Cấu trúc
| File | Vai trò |
|------|---------|
| `src/server.ts` | HTTP server + router 6 action |
| `src/config.ts` | Cấu hình (port/token/profiles/proxy/locale) |
| `src/browser/sessionManager.ts` | Context bền/account + `detectCheckpoint` + `humanPause` |
| `src/actions/zalo.ts` | check_phone / add_friend / send_message / add_group |
| `src/actions/facebook.ts` | fb_like / fb_comment |
| `src/login.ts` | CLI đăng nhập lưu phiên |
