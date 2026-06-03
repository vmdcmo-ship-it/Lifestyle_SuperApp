# Ghép OpenClaw cho 3 Executor (Zalo / Outreach / FB)

> **Mục đích**: Nối pipeline `tools/workflow-bds-pipeline` (đang chạy mock) vào OpenClaw thật đã deploy trên VPS, để thực thi hành động Zalo/Facebook.
> **Trạng thái OpenClaw hiện tại**: container `kodo_openclaw` (`ghcr.io/openclaw/openclaw:latest`), chạy `gateway --bind lan`, gateway nội bộ cổng `18789` → host `8080`, bộ não DeepSeek.

---

## 1. Nguyên tắc kiến trúc (đọc trước khi code)

| Lớp | Ai giữ | Ghi chú |
|-----|--------|---------|
| **Quota / delay / active-hours / checkpoint-pause** | Pipeline (`src/safety/*`) | OpenClaw **không** tự phanh. Pipeline quyết định *có được phép chạy không*, rồi mới gọi. |
| **Sinh nội dung (Claude/persona/RAG)** | Pipeline (`src/advisor`, `src/fb/commentGenerator`) | OpenClaw nhận text đã duyệt, **không** tự nghĩ nội dung. |
| **Human-in-the-loop (duyệt draft)** | Pipeline | Chỉ task `approved = true` mới được đẩy xuống OpenClaw. |
| **Thực thi 1 hành động trình duyệt nguyên tử** | **OpenClaw** | check SĐT / kết bạn / nhắn / mời nhóm / like / comment. Trả JSON. |

⚠️ **Tuân thủ** `docs/KE_HOACH_AI_OPS_DA_BOT_THAM_CHIEU.md`: điều phối tập trung qua **n8n**, không để OpenClaw tự kích hoạt. Vì vậy `OPENCLAW_RUN_URL` **nên trỏ vào n8n webhook**, n8n mới gọi gateway OpenClaw.

```
pipeline (executor) ──HTTP {action,params}──► n8n webhook ──► OpenClaw gateway (browser) ──► JSON {status,data}
        ▲ quota/delay/duyệt                       ▲ validate + correlation_id
```

---

## 2. Hợp đồng HTTP (BẮT BUỘC khớp 2 đầu)

Adapter đã viết: `src/executors/openclawClient.ts`. Nó **POST** tới `OPENCLAW_RUN_URL`:

**Request**
```json
{
  "action": "check_phone | add_friend | send_message | add_group | fb_like | fb_comment",
  "account_id": "zalo_acc01",
  "params": { "phone": "84...", "message": "...", "groupId": "...", "postId": "...", "text": "..." },
  "correlation_id": "uuid-tu-sinh"
}
```
Header: `Authorization: Bearer <OPENCLAW_TOKEN>` (nếu đặt), `Content-Type: application/json`.

**Response** (OpenClaw/n8n phải trả đúng format này)
```json
{ "status": "ok | checkpoint | error", "data": { }, "message": "tuỳ chọn" }
```

Ánh xạ kết quả theo từng action:

| action | params dùng | `data` cần có | Kết quả pipeline |
|--------|-------------|---------------|------------------|
| `check_phone` | `phone` | `{ "has_zalo": true/false, "display_name": "..." }` | `has_zalo` / `no_zalo` |
| `add_friend` | `phone`, `message` | – | `sent` |
| `send_message` | `phone`, `message` | – | `sent` |
| `add_group` | `phone`, `groupId` | – | `sent` |
| `fb_like` | `postId` | – | `sent` |
| `fb_comment` | `postId`, `text` | – | `sent` |

- `status: "checkpoint"` → pipeline đánh dấu checkpoint và **tự pause account** (logic `src/safety`).
- `status: "error"` → ghi lỗi, không pause.

---

## 3. Bật chế độ thật

`.env` của `tools/workflow-bds-pipeline`:
```dotenv
EXECUTOR_MODE=openclaw
OPENCLAW_RUN_URL=http://127.0.0.1:5678/webhook/bds-action
OPENCLAW_TOKEN=<token-bao-ve-webhook>
OPENCLAW_TIMEOUT_MS=120000
```

Hoặc override từng lần chạy bằng cờ CLI (không cần sửa `.env`):
```powershell
npm run zalo:check -- --executor openclaw --queue <QUEUE.csv> --config <05_CONFIG_QUOTA_DELAY.csv> --output <out.csv>
npm run outreach   -- --executor openclaw --queue <06_OUTREACH_QUEUE.csv> --config <05_CONFIG_QUOTA_DELAY.csv> --output <out.csv>
npm run fb:comment -- --executor openclaw --queue <07_FB_POSTS_QUEUE.csv> --config <05_CONFIG_QUOTA_DELAY.csv> --output <out.csv>
```
Không truyền `--executor` → lấy `EXECUTOR_MODE` trong `.env` (mặc định `mock`).

---

## 4. Phía thực thi — cách hiện thực endpoint

> ✅ **Hướng đã chọn: service Playwright riêng** (`tools/bds-executor-service`) — implement đúng contract này, không cần "não" LLM cho khâu thực thi (pipeline đã lo phần AI). Xem `tools/bds-executor-service/README.md`. Hai cách qua OpenClaw dưới đây giữ lại để tham khảo.

### Cách A (khuyến nghị): qua n8n — ĐÃ CÓ WORKFLOW SẴN
File: `docs/workflow-bds/n8n/bds-action.workflow.json` (import thẳng vào n8n: **Workflows → Import from File**).

Luồng 5 node: `Webhook /bds-action` → `Build OpenClaw Prompt` (map action→prompt skill) → `Call OpenClaw Gateway` → `Normalize Response` (ép về `{status,data,message}`) → `Respond to Pipeline`.

**Gateway API thật** (đã xác minh): `POST http://<gateway>:18789/api/v1/message`
body `{ "channel":"api", "message":"<prompt>", "wait_for_response":true, "timeout_ms":110000 }`,
header `Authorization: Bearer <gateway token>`.

**Biến môi trường cho n8n** (Settings → Variables hoặc env của container n8n):
| Biến | Giá trị |
|------|---------|
| `OPENCLAW_GATEWAY_URL` | `http://kodo_openclaw:18789/api/v1/message` (n8n cùng Docker network) hoặc `http://127.0.0.1:8080/api/v1/message` (qua port map host) |
| `OPENCLAW_GATEWAY_TOKEN` | token gateway (xem `openclaw-kodo/openclaw/openclaw.json` → `gateway.auth.token`) |
| `BDS_WEBHOOK_TOKEN` | (tùy chọn) token bảo vệ webhook; phải khớp `OPENCLAW_TOKEN` phía pipeline |

Phía pipeline trỏ `OPENCLAW_RUN_URL=https://<n8n-host>/webhook/bds-action` và `OPENCLAW_TOKEN=<BDS_WEBHOOK_TOKEN>`.

Lợi ích: tập trung audit (`correlation_id`), whitelist hành động, dễ thêm rate-limit/kill-switch — đúng kiến trúc AI Ops.

> ⚠️ **Điều kiện tiên quyết phía OpenClaw**: agent phải **thật sự có kỹ năng (skill) điều khiển Zalo/Facebook** (browser automation + phiên đăng nhập sẵn). Workflow chỉ *ra lệnh bằng prompt*; nếu OpenClaw chưa có skill/đăng nhập tương ứng, nó sẽ không thao tác được và nên trả `status:"error"`. Bộ não hiện tại là DeepSeek — cần kiểm tra khả năng tool-use/skill trước khi chạy thật.

### Cách B: gọi thẳng gateway
Trỏ `OPENCLAW_RUN_URL` vào endpoint gateway của OpenClaw và bọc một lớp mỏng (skill/route) trả đúng JSON contract. Đơn giản hơn nhưng mất lớp điều phối/whitelist của n8n → chỉ nên dùng khi test.

---

## 5. Skill/Prompt mẫu cho OpenClaw (ép trả JSON nghiêm ngặt)

Mỗi action là một "nhiệm vụ trình duyệt" trên profile/tài khoản tương ứng `account_id`. Yêu cầu OpenClaw **chỉ in JSON**, không văn xuôi.

**check_phone**
```
Trên tài khoản Zalo {{account_id}}: mở "Thêm bạn" → tìm theo số {{params.phone}}.
Nếu hiện hồ sơ người dùng → has_zalo=true, lấy tên hiển thị.
Nếu báo không tìm thấy → has_zalo=false.
Nếu gặp captcha/đăng nhập lại/cảnh báo bất thường → status="checkpoint".
CHỈ in JSON: {"status":"ok","data":{"has_zalo":true,"display_name":"..."}}
```

**add_friend / send_message / add_group**
```
Trên tài khoản Zalo {{account_id}}, thực hiện ĐÚNG MỘT hành động với {{params.phone}}:
- add_friend: gửi lời mời kèm lời nhắn {{params.message}}
- send_message: gửi tin {{params.message}}
- add_group: mời vào nhóm {{params.groupId}}
Gặp checkpoint/captcha → status="checkpoint". Thành công → status="ok".
CHỈ in JSON: {"status":"ok"}  (hoặc {"status":"checkpoint","message":"..."} )
```

**fb_like / fb_comment**
```
Trên tài khoản Facebook {{account_id}}, mở bài {{params.postId}}.
- fb_like: bấm Thích.
- fb_comment: bình luận đúng nội dung {{params.text}} (KHÔNG sửa, KHÔNG thêm).
Gặp checkpoint → status="checkpoint".
CHỈ in JSON: {"status":"ok"}
```

> Vì "bộ não" OpenClaw là LLM, **luôn parse phòng thủ**: n8n/route phải validate JSON, nếu LLM trả rác thì map về `status:"error"`.

---

## 6. Quy trình test ghép (an toàn → thật)

### 6.0 Stub smoke-test (KHÔNG đụng tài khoản thật) — đã có sẵn
File `scripts/openclaw-stub.mjs` mô phỏng OpenClaw đúng contract.
Quy ước tất định: phone lẻ→`no_zalo`, chẵn→`has_zalo`; chứa `0000`→`checkpoint`; `9999`→`error`.

```powershell
# Terminal 1: chạy stub (cổng 5678)
npm run stub

# Terminal 2: chạy pipeline trỏ vào stub
npm run zalo:check -- --executor openclaw --fast `
  --queue scripts/smoke-zalo-queue.csv `
  --config ../../docs/workflow-bds/templates/05_CONFIG_QUOTA_DELAY.csv `
  --state scripts/smoke-state.json --output scripts/smoke-zalo-results.csv
```
Kỳ vọng: 1 `has_zalo`, 1 `no_zalo`, 1 `checkpoint` + account checkpoint bị phanh.
(Mặc định `OPENCLAW_RUN_URL=http://127.0.0.1:5678/webhook/bds-action` — stub nhận mọi path nên khớp luôn.)

### 6.1 → thật
1. **Smoke contract**: bước 6.0 ở trên — xác nhận client/factory/map/safety chạy đúng.
2. **1 tài khoản nháp, 1 SĐT của chính bạn**: chạy `check_phone` thật.
3. **Outreach 1 lệnh**: `outreach --executor openclaw` với queue 1 dòng đã `approved=true`, quota=1/ngày.
4. **FB 1 comment**: tương tự, quan sát checkpoint.
5. Tăng dần quota trong `05_CONFIG_QUOTA_DELAY` sau khi account "nuôi" ổn định.

---

## 7. Bảo mật cần xử lý ngay

`openclaw-kodo/docker-compose.yml` đang để **secret plaintext** (`LLM_API_KEY`, mật khẩu Supabase trong `DATABASE_URL`, `BOT_TOKEN`).
- Chuyển sang `.env` + `env_file:` trong compose; thêm `.env` vào `.gitignore`.
- **Rotate** các khóa đã lộ (DeepSeek key, Supabase password, Telegram bot token) nếu repo từng push/đồng bộ.
- Đặt `OPENCLAW_TOKEN` cho webhook n8n để tránh ai gọi tuỳ tiện.

---

## 8. File liên quan trong pipeline

| File | Vai trò |
|------|---------|
| `src/executors/openclawClient.ts` | HTTP client + chuẩn hoá response |
| `src/executors/openclawZaloExecutor.ts` | `ZaloExecutor` thật |
| `src/executors/openclawOutreachExecutor.ts` | `OutreachExecutor` thật |
| `src/executors/openclawFbExecutor.ts` | `FbExecutor` thật |
| `src/executors/factory.ts` | Chọn `mock` \| `openclaw` (env hoặc `--executor`) |
| `src/config.ts` → `loadOpenclawConfig`, `loadExecutorMode` | Đọc cấu hình |
| `scripts/openclaw-stub.mjs` + `npm run stub` | Stub smoke-test contract (không đụng tài khoản thật) |
| `docs/workflow-bds/n8n/bds-action.workflow.json` | Workflow n8n nối pipeline → gateway OpenClaw |
