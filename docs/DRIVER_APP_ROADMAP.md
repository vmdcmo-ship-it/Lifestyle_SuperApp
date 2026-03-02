# Roadmap — Hoàn thành ứng dụng tài xế

Danh sách việc đã xong và việc nên làm tiếp để hoàn thiện dự án.

---

## Đã hoàn thành

| Hạng mục | Nội dung |
|----------|----------|
| **Backend** | Auth, driver profile/dashboard/stats, booking (available/accept/reject/complete), wallet, driver settings (cài đặt nhận đơn, khai báo tiền), PATCH status/location |
| **App** | Đăng nhập/đăng ký, Dashboard, Đơn hàng, Thu nhập, Tài khoản, Cài đặt, Cài đặt nhận đơn |
| **Tài khoản** | Thông tin tài khoản, Cập nhật giấy tờ, Bảng giá, FAQ, Tổng đài (0826600800) |
| **Chính sách** | Yêu cầu nhận diện khuôn mặt, ảnh đại diện, ảnh phương tiện (có biển số), giai đoạn đầu không bắt đồng phục/mũ |
| **Deploy** | Tài liệu VPS, build & EAS (`docs/BUILD_AND_VPS_WHEN_READY.md`), `eas.json`, script prebuild/build |

---

## Nên làm tiếp (theo thứ tự ưu tiên)

### 1. Kiểm thử end-to-end với API thật (ưu tiên cao)

- [ ] Deploy/kiểm tra backend trên VPS (health, auth, driver API).
- [ ] Test trên app: đăng ký tài xế mới → đăng nhập → dashboard → cài đặt nhận đơn → ví.
- [ ] Test flow đơn: tạo đơn từ web/Postman → app driver thấy đơn available → nhận/từ chối → hoàn thành → cập nhật ví/thống kê.
- [ ] Test 3 tài khoản demo (nếu đã tạo trên backend) và 1 tài khoản thật.

**Kết quả:** Đảm bảo app + API production hoạt động đúng trước khi mở rộng tính năng.

---

### 2. Màn Phương tiện (ưu tiên cao)

- [ ] Màn **Phương tiện** trong tab Tài khoản: danh sách xe từ `GET /drivers/vehicles`.
- [ ] Cho phép **thêm xe** (form + gọi `POST /drivers/vehicles`) — backend đã có DTO.
- [ ] Hiển thị trạng thái duyệt (nếu backend trả về), hoặc “Đang chờ duyệt”.

**Lý do:** Hiện menu “Phương tiện” chỉ báo “đang phát triển”; backend đã sẵn, chỉ cần gắn UI.

---

### 3. Upload ảnh giấy tờ & ảnh xe (ưu tiên trung bình)

- [ ] Màn đăng ký tài xế / cập nhật hồ sơ: chụp hoặc chọn ảnh (GPLX, CCCD, đăng ký xe, BHTNDS, **ảnh xe có biển số**).
- [ ] Upload lên server (storage S3/backend hoặc API upload hiện có).
- [ ] Gửi URL ảnh vào `POST /drivers/register` hoặc PATCH profile/vehicles.

**Lưu ý:** Backend đã nhận URL ảnh trong DTO; cần thêm API upload file (multipart) nếu chưa có, hoặc dùng base64/storage có sẵn.

---

### 4. Thông báo đẩy (push notification) — ưu tiên trung bình

- [ ] Tích hợp FCM (Android) và APNs (iOS) qua Expo (`expo-notifications`).
- [ ] Lưu device token, gửi lên backend khi đăng nhập.
- [ ] Khi có đơn mới / trạng thái đơn thay đổi, backend gửi push; app hiển thị và (tùy chọn) mở đúng màn.

**Lý do:** Tài xế cần nhận thông báo đơn mới khi không mở app.

---

### 5. Xác thực khuôn mặt (ưu tiên trung bình / sau)

- [ ] Chọn giải pháp: SDK bên thứ ba (FaceVerify, eKYC…) hoặc tự xử lý (chụp + so khớp với ảnh CCCD).
- [ ] Màn “Xác thực khuôn mặt” trong luồng đăng ký hoặc Tài khoản.
- [ ] Định kỳ / ngẫu nhiên nhắc tài xế xác thực lại (theo chính sách đã nêu trong Thông tin tài khoản).

**Lưu ý:** Có thể làm sau khi đã có người dùng thật và yêu cầu pháp lý rõ ràng.

---

### 6. Chuẩn bị phát hành (khi app ổn định)

- [ ] Cập nhật `app.json`: version, tên hiển thị, icon, splash cho bản chính thức.
- [ ] Build bản preview (APK) qua EAS hoặc `expo run:android`, cài lên thiết bị test.
- [ ] (Tùy chọn) Sentry hoặc công cụ báo lỗi.
- [ ] Chuẩn bị nội dung store: mô tả, ảnh, chính sách bảo mật/điều khoản.
- [ ] Phân phối nội bộ (link tải APK) hoặc nộp lên Play Store / App Store theo `docs/BUILD_AND_VPS_WHEN_READY.md`.

---

## Tóm tắt thứ tự gợi ý

1. **Test E2E** với API production (VPS + app).
2. **Màn Phương tiện** (danh sách xe + thêm xe).
3. **Upload ảnh** giấy tờ và ảnh xe (có ảnh biển số).
4. **Push notification** cho đơn mới.
5. **Xác thực khuôn mặt** (có thể làm sau).
6. **Build & phát hành** theo `docs/BUILD_AND_VPS_WHEN_READY.md`.

Sau bước 1 và 2, app đã đủ dùng cho đợt chạy thử nội bộ / pilot. Các bước 3–5 nâng trải nghiệm và đáp ứng chính sách; bước 6 là bắt buộc khi muốn đưa lên store hoặc phân phối rộng.
