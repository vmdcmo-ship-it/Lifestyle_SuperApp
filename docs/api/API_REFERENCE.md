# Lifestyle Super App - API Reference

> **Version:** 1.0.0  
> **Base URL:** `http://localhost:3000/api/v1`  
> **Format:** REST + JSON  
> **Auth:** JWT Bearer Token

---

## 📋 Quick Reference - All Endpoints

### 🔐 Auth (8 endpoints)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | No | Đăng ký tài khoản mới |
| `POST` | `/auth/login` | No | Đăng nhập (email/SĐT) |
| `POST` | `/auth/login/social` | No | Đăng nhập MXH (Google/Facebook/Zalo) |
| `POST` | `/auth/send-otp` | No | Gửi OTP xác thực |
| `POST` | `/auth/verify-otp` | No | Xác thực OTP |
| `POST` | `/auth/refresh-token` | No | Refresh access token |
| `POST` | `/auth/logout` | Yes | Đăng xuất |
| `POST` | `/auth/forgot-password` | No | Quên mật khẩu |
| `POST` | `/auth/reset-password` | No | Đặt lại mật khẩu |

### 👤 Users (7 endpoints)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/users/me` | Yes | Lấy thông tin cá nhân |
| `PATCH` | `/users/me` | Yes | Cập nhật thông tin |
| `PUT` | `/users/me/avatar` | Yes | Upload avatar |
| `PUT` | `/users/me/preferences` | Yes | Cập nhật preferences |
| `POST` | `/users/me/change-password` | Yes | Đổi mật khẩu |
| `GET` | `/users/me/addresses` | Yes | Danh sách địa chỉ |
| `POST` | `/users/me/addresses` | Yes | Thêm địa chỉ |
| `PUT` | `/users/me/addresses/:id` | Yes | Cập nhật địa chỉ |
| `DELETE` | `/users/me/addresses/:id` | Yes | Xóa địa chỉ |

### 🚗 Drivers (7 endpoints)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/drivers/register` | Yes | Đăng ký tài xế |
| `GET` | `/drivers/me` | Yes | Hồ sơ tài xế |
| `POST` | `/drivers/me/identity` | Yes | Nộp giấy tờ (CCCD, GPLX) |
| `POST` | `/drivers/me/vehicle` | Yes | Đăng ký xe |
| `PATCH` | `/drivers/me/status` | Yes | Online/Offline |
| `PUT` | `/drivers/me/location` | Yes | Cập nhật vị trí GPS |
| `GET` | `/drivers/me/earnings` | Yes | Thống kê thu nhập |
| `GET` | `/drivers/me/stats` | Yes | Thống kê tổng quan |

### 🏪 Merchants (6 endpoints)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/merchants/register` | Yes | Đăng ký cửa hàng |
| `GET` | `/merchants/:id` | No | Thông tin cửa hàng (public) |
| `PATCH` | `/merchants/:id` | Yes | Cập nhật cửa hàng |
| `PUT` | `/merchants/:id/business-hours` | Yes | Cập nhật giờ mở cửa |
| `GET` | `/merchants/:id/staff` | Yes | Danh sách nhân viên |
| `POST` | `/merchants/:id/staff` | Yes | Thêm nhân viên |
| `GET` | `/merchants/search` | No | Tìm kiếm cửa hàng |

### 💰 Wallets (3 endpoints)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/wallets/me` | Yes | Thông tin ví (balance, Xu) |
| `GET` | `/wallets/me/transactions` | Yes | Lịch sử giao dịch |
| `GET` | `/wallets/me/bank-accounts` | Yes | Danh sách TK ngân hàng |
| `POST` | `/wallets/me/bank-accounts` | Yes | Liên kết TK ngân hàng |

### 💳 Payments (7 endpoints)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/payments/top-up` | Yes | Nạp tiền vào ví |
| `POST` | `/payments/pay` | Yes | Thanh toán đơn hàng |
| `POST` | `/payments/withdraw` | Yes | Rút tiền về ngân hàng |
| `GET` | `/payments/vnpay-callback` | No | VNPay return URL |
| `POST` | `/payments/vnpay-ipn` | No | VNPay webhook (IPN) |
| `POST` | `/payments/sepay-webhook` | Key | **SePay webhook (Bank Transfer)** |
| `POST` | `/payments/momo-ipn` | No | MoMo webhook |

### ⭐ Spotlight (11 endpoints)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/spotlight/reels` | No | Feed video Redcomment (TikTok-style) |
| `POST` | `/spotlight/redcomments` | Yes | Tạo Redcomment (Creator) |
| `GET` | `/spotlight/redcomments/:id` | No | Chi tiết Redcomment |
| `PATCH` | `/spotlight/redcomments/:id` | Yes | Cập nhật Redcomment |
| `POST` | `/spotlight/redcomments/:id/submit` | Yes | Submit để duyệt |
| `POST` | `/spotlight/redcomments/:id/like` | Yes | Like/Unlike |
| `GET` | `/spotlight/redcomments/:id/comments` | No | Danh sách comments |
| `POST` | `/spotlight/redcomments/:id/comments` | Yes | Viết comment |
| `POST` | `/spotlight/reviews` | Yes | Viết đánh giá |
| `GET` | `/spotlight/reviews/merchant/:id` | No | Reviews của merchant |
| `GET` | `/spotlight/creators/me` | Yes | Creator dashboard |
| `GET` | `/spotlight/creators/me/earnings` | Yes | Thu nhập creator |
| `POST` | `/spotlight/creators/me/payout` | Yes | Rút tiền creator |

### 🎁 Loyalty (4 endpoints)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/loyalty/xu/balance` | Yes | Số dư Xu |
| `GET` | `/loyalty/xu/history` | Yes | Lịch sử Xu |
| `GET` | `/loyalty/referral` | Yes | Thông tin mã giới thiệu |
| `POST` | `/loyalty/referral/apply` | Yes | Áp dụng mã giới thiệu |

### 🔧 Admin (5 endpoints)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/admin/dashboard/stats` | Admin | Tổng quan dashboard |
| `GET` | `/admin/users` | Admin | Danh sách users |
| `GET` | `/admin/drivers/pending` | Admin | Tài xế chờ duyệt |
| `POST` | `/admin/drivers/:id/verify` | Admin | Duyệt/Từ chối tài xế |
| `GET` | `/admin/spotlight/moderation` | Admin | Nội dung chờ duyệt |
| `POST` | `/admin/spotlight/:id/moderate` | Admin | Duyệt/Từ chối nội dung |

---

## 📊 Tổng kết

| Module | Endpoints | Public | Auth Required | Admin Only |
|--------|-----------|--------|---------------|------------|
| Auth | 9 | 8 | 1 | 0 |
| Users | 9 | 0 | 9 | 0 |
| Drivers | 8 | 0 | 8 | 0 |
| Merchants | 7 | 2 | 5 | 0 |
| Wallets | 4 | 0 | 4 | 0 |
| Payments | 7 | 4 | 3 | 0 |
| Spotlight | 13 | 4 | 9 | 0 |
| Loyalty | 4 | 0 | 4 | 0 |
| Admin | 6 | 0 | 0 | 6 |
| **Total** | **67** | **18** | **43** | **6** |

---

## 🛠️ Files

| File | Format | Usage |
|------|--------|-------|
| `docs/api/openapi.yaml` | OpenAPI 3.0 | Swagger UI, code generation |
| `docs/api/Lifestyle_SuperApp.postman_collection.json` | Postman v2.1 | Import vào Postman để test |
| `docs/api/API_REFERENCE.md` | Markdown | Quick reference |

### Import vào Postman

1. Mở Postman → **Import** → **Upload Files**
2. Chọn file `Lifestyle_SuperApp.postman_collection.json`
3. Collection sẽ xuất hiện với 8 folders, 55+ requests
4. Token tự động set khi Login thành công

### Xem Swagger UI

Khi backend NestJS chạy, Swagger UI tự động có tại:
```
http://localhost:3000/api/docs
```

Hoặc dùng online editor:
1. Truy cập https://editor.swagger.io
2. **File → Import File** → chọn `openapi.yaml`
3. Xem documentation interactive
