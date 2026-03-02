# Insurance Operations Workflow
## Quy trình vận hành bán bảo hiểm bán tự động

> **Hướng dẫn chi tiết cho nhân viên vận hành (Ops) để xử lý đơn hàng bảo hiểm**

---

## 🎯 Overview

### Business Model

```
Customer/Driver/Merchant
        ↓
    [Mua BH trên App]
        ↓
    Chuyển khoản → Lifestyle Account
        ↓
    Upload biên lai
        ↓
  [Auto: Email/SMS confirmation]
        ↓
    ⏰ Chờ xử lý (< 24h)
        ↓
 [Nhân viên Ops khai báo lên hệ thống BH]
        ↓
    Nhận chứng nhận từ công ty BH
        ↓
    Upload lên hệ thống
        ↓
  [Auto: Email/SMS gửi chứng nhận]
        ↓
    ✅ Hoàn tất
        ↓
    ⏰ Sau 30 ngày
        ↓
    Nhận hoa hồng từ công ty BH
```

### Key Metrics (SLA)

```
Thời gian xử lý:        < 24 giờ (mục tiêu: 4-8 giờ)
Email/SMS gửi:          < 5 phút sau khi hoàn tất
Tỷ lệ thành công:      > 98%
Tỷ lệ chứng nhận đúng:  > 99.9%
Hotline response:       < 2 phút
```

---

## 📋 Quy trình chi tiết

### Step 1: Khách hàng mua bảo hiểm trên App

**Actor:** Customer/Driver/Merchant

**Actions:**
1. Chọn loại bảo hiểm (TNDS, Vật chất, etc.)
2. Điền thông tin người mua (Tên, CMND, SĐT, Email, Địa chỉ)
3. Điền thông tin xe (Biển số, Hãng, Dòng, Năm SX, Số khung, Số máy)
4. Upload giấy tờ:
   - CMND/CCCD (2 mặt)
   - Giấy đăng ký xe (2 mặt)
   - Giấy phép KD vận tải (nếu là xe kinh doanh)
5. Chọn tùy chọn (cho vật chất: Mức khấu trừ, Điều khoản bổ sung)
6. Xác nhận thông tin & đồng ý điều khoản
7. Chọn phương thức thanh toán → Chuyển khoản ngân hàng
8. Upload biên lai chuyển khoản
9. Hoàn tất

**Output:**
- ✅ Đơn hàng được tạo (Status: `PAYMENT_CONFIRMED`)
- ✅ Email/SMS xác nhận gửi đến khách hàng
- ✅ Đơn hàng xuất hiện trong queue của Ops

**Email Template (Step 1 - Payment Confirmed):**
```
Subject: ✅ Đã nhận thanh toán - Đơn hàng bảo hiểm #LS-INS-240214-001

Kính gửi Anh/Chị Nguyễn Văn A,

Cảm ơn Anh/Chị đã mua bảo hiểm tại Lifestyle Super App!

✅ Thông tin đơn hàng:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mã đơn hàng:    LS-INS-240214-001
Loại bảo hiểm:  TNDS Bắt buộc + Vật chất xe
Xe:             Toyota Vios 2020 - Biển số: 51G-12345
Phí bảo hiểm:   ₫12,880,700
Thanh toán:     Đã xác nhận
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Bước tiếp theo:
Nhân viên của chúng tôi sẽ khai báo thông tin lên hệ thống công ty bảo hiểm 
và gửi chứng nhận chính thức cho Anh/Chị qua email trong vòng 24 giờ.

📅 Thời hạn bảo hiểm:
Hiệu lực: 01/01/2026 - 31/12/2026 (12 tháng)

📞 Liên hệ hỗ trợ:
Hotline: 1900 123456
Email: support@lifestyle.vn
Chat: Trong app (Tab Hỗ trợ)

Trân trọng,
Lifestyle Insurance Team
```

**SMS Template:**
```
Lifestyle: Da nhan thanh toan don BH #LS-INS-240214-001. 
Chung nhan se duoc gui qua email trong 24h. 
Hotline: 1900123456
```

---

### Step 2: Ops nhận và xem xét đơn hàng

**Actor:** Nhân viên Ops (Operations Team)

**Platform:** Admin Ops App

**Dashboard View:**

```
┌─────────────────────────────────────────────────────────┐
│ ╔═══════════════════════════════════════════════════╗   │
│ ║  Đơn hàng bảo hiểm - Chờ xử lý         [Refresh] ║   │
│ ╚═══════════════════════════════════════════════════╝   │
│                                                         │
│ Filter: [Tất cả ▾] [Chờ xử lý (15)] [Đã xử lý]        │
│         Sort by: [Cũ nhất ▾]                            │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ⏰ #LS-INS-240214-001              2h trước          │ │
│ │                                                     │ │
│ │ 👤 Nguyễn Văn A - 0901234567                        │ │
│ │ 🚗 Toyota Vios 2020 - 51G-12345                     │ │
│ │ 🛡️ TNDS + Vật chất                                  │ │
│ │ 💰 ₫12,880,700                                      │ │
│ │                                                     │ │
│ │ ✅ Đã thanh toán  ⏰ Chờ xử lý                      │ │
│ │                                                     │ │
│ │ [👁️ Xem chi tiết] [✅ Xử lý ngay]                   │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ⏰ #LS-INS-240214-002              5h trước          │ │
│ │ ...                                                 │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Order Detail View:**

```
┌─────────────────────────────────────────────────────────┐
│ ╔═══════════════════════════════════════════════════╗   │
│ ║  ← #LS-INS-240214-001                       [•••] ║   │
│ ╚═══════════════════════════════════════════════════╝   │
│                                                         │
│ Status: [⏰ Chờ xử lý]                                  │
│ Created: 14/02/2026 10:30                               │
│ Payment: ✅ Confirmed 14/02/2026 10:35                  │
│ Assigned to: Bạn (Nguyen Van B)                         │
│                                                         │
│ ━━━━━ Thông tin người mua ━━━━━                        │
│                                                         │
│ Tên:          Nguyễn Văn A                              │
│ CMND/CCCD:    001234567890                              │
│ Ngày sinh:    15/03/1990                                │
│ Giới tính:    Nam                                       │
│ SĐT:          0901234567                                │
│ Email:        nguyenvana@email.com                      │
│ Địa chỉ:      123 Nguyễn Huệ, Q1, TP.HCM               │
│                                                         │
│ Giấy tờ:                                                │
│ ┌─────────────┐ ┌─────────────┐                        │
│ │ CMND Trước  │ │ CMND Sau    │                        │
│ │ [View ↗]    │ │ [View ↗]    │                        │
│ └─────────────┘ └─────────────┘                        │
│                                                         │
│ ━━━━━ Thông tin xe ━━━━━                               │
│                                                         │
│ Biển số:      51G-12345                                 │
│ Hãng:         Toyota                                    │
│ Dòng xe:      Vios                                      │
│ Năm SX:       2020                                      │
│ Số khung:     JTDBT923701234567                         │
│ Số máy:       1NZ1234567                                │
│ Giá trị:      ₫800,000,000                              │
│ Loại:         Ô tô không kinh doanh, dưới 6 chỗ        │
│                                                         │
│ Giấy tờ:                                                │
│ ┌─────────────┐ ┌─────────────┐                        │
│ │ ĐK Xe Trước │ │ ĐK Xe Sau   │                        │
│ │ [View ↗]    │ │ [View ↗]    │                        │
│ └─────────────┘ └─────────────┘                        │
│                                                         │
│ BH cũ hết hạn: 31/12/2025                               │
│ → BH mới hiệu lực: 01/01/2026                           │
│                                                         │
│ ━━━━━ Bảo hiểm đã chọn ━━━━━                           │
│                                                         │
│ 1. TNDS Bắt buộc (Xe <6 chỗ, không KD)                 │
│    Công ty: Bảo Việt                                    │
│    Phí: ₫480,700/năm                                    │
│                                                         │
│ 2. Vật chất xe (thân vỏ)                                │
│    Công ty: Bảo Việt                                    │
│    Giá trị xe: ₫800,000,000                             │
│    Tỷ lệ: 1.5%                                          │
│    Khấu trừ: ₫1,000,000/vụ                              │
│    Quyền lợi bổ sung:                                   │
│    - Ngập nước (thủy kích) +₫160,000                    │
│    - Mất cắp bộ phận +₫80,000                           │
│    - Mất cắp toàn bộ xe +₫160,000                       │
│    Phí: ₫12,400,000/năm                                 │
│                                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ Tổng phí:                           ₫12,880,700        │
│                                                         │
│ ━━━━━ Thanh toán ━━━━━                                 │
│                                                         │
│ Phương thức: Chuyển khoản ngân hàng                     │
│ Ngân hàng: Vietcombank                                  │
│ Số tiền: ₫12,880,700                                    │
│ Nội dung CK: LS-INS-240214-001                          │
│ Thời gian: 14/02/2026 10:35                             │
│                                                         │
│ Biên lai:                                               │
│ ┌─────────────┐                                        │
│ │ Biên Lai    │                                        │
│ │ [View ↗]    │                                        │
│ └─────────────┘                                        │
│                                                         │
│ ━━━━━ Hành động ━━━━━                                  │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [❌ Từ chối]  [📝 Ghi chú]  [✅ Xử lý & Khai báo]   │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Verification Checklist:**

```
☑️ Thông tin người mua đầy đủ và chính xác
   - Họ tên khớp với CMND/CCCD
   - Số CMND/CCCD hợp lệ (9 hoặc 12 số)
   - SĐT hợp lệ (10 số)
   - Email hợp lệ
   - Ảnh CMND/CCCD rõ ràng, đọc được thông tin

☑️ Thông tin xe đầy đủ và chính xác
   - Biển số xe đúng format
   - Số khung, số máy đọc rõ trên giấy đăng ký
   - Giấy đăng ký xe rõ ràng, đọc được thông tin
   - Xe chưa hết hạn đăng kiểm (nếu có thông tin)

☑️ Thanh toán hợp lệ
   - Biên lai chuyển khoản rõ ràng
   - Số tiền khớp với tổng phí
   - Nội dung chuyển khoản khớp với mã đơn hàng
   - Tên người chuyển khớp hoặc gần khớp với tên người mua

☑️ Không có dấu hiệu gian lận
   - Ảnh giấy tờ không bị photoshop
   - Thông tin không mâu thuẫn
   - Không có cảnh báo từ hệ thống
```

**Actions:**
- ✅ Nếu mọi thứ OK: Click [✅ Xử lý & Khai báo]
- ❌ Nếu có vấn đề: Click [❌ Từ chối] và chọn lý do
- 📝 Nếu cần thêm info: Click [📝 Ghi chú] và liên hệ khách hàng

---

### Step 3: Khai báo lên hệ thống công ty bảo hiểm

**Actor:** Nhân viên Ops

**Platform:** 
1. Admin Ops App (Lifestyle)
2. Insurance Company Portal (e.g., Bảo Việt Portal)

**Workflow:**

#### 3.1. Prepare Data Package

**On Lifestyle Admin Ops:**

Click [✅ Xử lý & Khai báo] → Mở form submission:

```
┌─────────────────────────────────────────────────────────┐
│ ╔═══════════════════════════════════════════════════╗   │
│ ║  Khai báo lên công ty BH            [#LS-INS-001] ║   │
│ ╚═══════════════════════════════════════════════════╝   │
│                                                         │
│ ━━━━━ Bước 1: Chọn công ty bảo hiểm ━━━━━              │
│                                                         │
│ Công ty: *                                              │
│ ● Bảo Việt                                              │
│ ○ PVI                                                   │
│ ○ PTI                                                   │
│                                                         │
│ Portal URL: https://agent.baoviet.com.vn                │
│ Agent Code: LS-AGENT-001                                │
│                                                         │
│ ━━━━━ Bước 2: Tải xuống data package ━━━━━             │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Data package đã được chuẩn bị sẵn:                  │ │
│ │                                                     │ │
│ │ 📄 customer_info.pdf (Thông tin người mua)          │ │
│ │ 📄 vehicle_info.pdf (Thông tin xe)                  │ │
│ │ 📄 id_front.jpg (CMND mặt trước)                    │ │
│ │ 📄 id_back.jpg (CMND mặt sau)                       │ │
│ │ 📄 vehicle_reg_front.jpg (Đăng ký xe trước)         │ │
│ │ 📄 vehicle_reg_back.jpg (Đăng ký xe sau)            │ │
│ │ 📄 payment_proof.jpg (Biên lai thanh toán)          │ │
│ │                                                     │ │
│ │ [📥 Tải xuống tất cả (.zip)]                        │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ━━━━━ Bước 3: Khai báo thủ công trên portal BH ━━━━━   │
│                                                         │
│ Hướng dẫn:                                              │
│ 1. Đăng nhập vào portal Bảo Việt                        │
│ 2. Chọn "Tạo hợp đồng mới"                             │
│ 3. Điền thông tin từ data package                       │
│ 4. Upload ảnh giấy tờ                                   │
│ 5. Xác nhận và gửi                                      │
│ 6. Chờ công ty BH duyệt (thường < 2h)                  │
│ 7. Tải chứng nhận BH (PDF)                              │
│                                                         │
│ [📖 Xem hướng dẫn chi tiết] [🎬 Video tutorial]        │
│                                                         │
│ ━━━━━ Bước 4: Upload chứng nhận về hệ thống ━━━━━      │
│                                                         │
│ Sau khi nhận được chứng nhận từ công ty BH, vui lòng:  │
│ 1. Tải file PDF chứng nhận                              │
│ 2. Upload vào hệ thống bên dưới                         │
│ 3. Nhập số chứng nhận và ngày hiệu lực                  │
│ 4. Hoàn tất để gửi email cho khách hàng                │
│                                                         │
│ [Tiếp tục đến bước tiếp theo]                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### 3.2. Submit to Insurance Company Portal

**On Insurance Company Portal (External):**

**Example: Bảo Việt Agent Portal**

1. Login: https://agent.baoviet.com.vn
   - Username: `LS-AGENT-001`
   - Password: `******`

2. Navigate: Dashboard → Tạo hợp đồng mới → TNDS Bắt buộc

3. Fill Form:
   ```
   ━━━━━ Thông tin người mua ━━━━━
   Họ và tên:        Nguyễn Văn A
   CMND/CCCD:        001234567890
   Ngày sinh:        15/03/1990
   Giới tính:        Nam
   SĐT:              0901234567
   Email:            nguyenvana@email.com
   Địa chỉ:          123 Nguyễn Huệ, Q1, TP.HCM
   
   ━━━━━ Thông tin xe ━━━━━
   Biển số:          51G-12345
   Loại xe:          Ô tô con (dưới 6 chỗ)
   Mục đích:         Không kinh doanh
   Hãng xe:          Toyota
   Dòng xe:          Vios
   Năm SX:           2020
   Số khung:         JTDBT923701234567
   Số máy:           1NZ1234567
   Giá trị xe:       800,000,000 VND (cho vật chất)
   
   ━━━━━ Bảo hiểm ━━━━━
   Loại:             TNDS Bắt buộc
   Thời hạn:         12 tháng
   Ngày hiệu lực:    01/01/2026
   Phí:              480,700 VND
   
   [+ Thêm bảo hiểm vật chất]
   Loại:             Vật chất xe (thân vỏ)
   Giá trị BH:       800,000,000 VND
   Tỷ lệ:            1.5%
   Khấu trừ:         1,000,000 VND/vụ
   Quyền lợi bổ sung:
   ☑️ Ngập nước (thủy kích)
   ☑️ Mất cắp bộ phận
   ☑️ Mất cắp toàn bộ xe
   Phí:              12,400,000 VND
   
   Tổng phí:         12,880,700 VND
   ```

4. Upload Documents:
   - CMND/CCCD (2 ảnh)
   - Giấy đăng ký xe (2 ảnh)
   - Biên lai thanh toán (1 ảnh)

5. Review & Submit:
   - Kiểm tra kỹ thông tin
   - Click [Gửi hồ sơ]
   - Chờ duyệt (thường 1-2 giờ, max 24 giờ)

6. Download Certificate:
   - Sau khi được duyệt, portal sẽ gửi email thông báo
   - Login lại portal
   - Navigate: Dashboard → Hợp đồng → #BV-TNDS-2026-12345
   - Click [Tải chứng nhận] → Download PDF

**Certificate PDF contains:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         CHỨNG NHẬN BẢO HIỂM
         BẢO VIỆT - TỔNG CÔNG TY BẢO HIỂM BẢO VIỆT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Số chứng nhận: BV-TNDS-2026-12345

I. THÔNG TIN BÊN MUA BẢO HIỂM
Tên:          Nguyễn Văn A
CMND/CCCD:    001234567890
Địa chỉ:      123 Nguyễn Huệ, Quận 1, TP.HCM

II. THÔNG TIN XE
Biển số:      51G-12345
Loại xe:      Ô tô con dưới 6 chỗ
Hãng:         Toyota
Dòng:         Vios
Năm SX:       2020

III. PHẠM VI BẢO HIỂM
1. TNDS Bắt buộc
   - Thiệt hại về người: 100 triệu đồng/người
   - Thiệt hại về tài sản: 50 triệu đồng/vụ

2. Vật chất xe
   - Giá trị bảo hiểm: 800,000,000 VND
   - Khấu trừ: 1,000,000 VND/vụ
   - Quyền lợi: Va chạm, Cháy nổ, Ngập nước, Mất cắp

IV. THỜI HẠN BẢO HIỂM
Hiệu lực từ:  00:00 ngày 01/01/2026
Đến hết:      24:00 ngày 31/12/2026

V. PHÍ BẢO HIỂM
Phí TNDS:     480,700 VND
Phí Vật chất: 12,400,000 VND
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tổng phí:     12,880,700 VND (Đã thanh toán)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ngày cấp: 14/02/2026

[Chữ ký số]             [Dấu công ty]
Người đại diện          Bảo Việt
```

---

### Step 4: Upload chứng nhận lên hệ thống Lifestyle

**Actor:** Nhân viên Ops

**Platform:** Admin Ops App

**Form:**

```
┌─────────────────────────────────────────────────────────┐
│ ╔═══════════════════════════════════════════════════╗   │
│ ║  Upload chứng nhận BH           [#LS-INS-001]    ║   │
│ ╚═══════════════════════════════════════════════════╝   │
│                                                         │
│ ━━━━━ Thông tin chứng nhận ━━━━━                       │
│                                                         │
│ Số chứng nhận: *                                        │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [BV-TNDS-2026-12345_____________]                   │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Ngày hiệu lực: *                                        │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [01/01/2026                                     📅] │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Ngày hết hạn: *                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [31/12/2026                                     📅] │ │
│ └─────────────────────────────────────────────────────┘ │
│ → Thời hạn: 365 ngày (12 tháng)                         │
│                                                         │
│ ━━━━━ Upload file PDF ━━━━━                            │
│                                                         │
│ Chứng nhận bảo hiểm (PDF): *                            │
│ ┌───────────────────┐                                  │
│ │                   │                                  │
│ │  [📄 Chọn file]   │  Max 10MB, PDF only              │
│ │                   │                                  │
│ │   (Preview)       │                                  │
│ └───────────────────┘                                  │
│                                                         │
│ ✅ File: BV-TNDS-2026-12345.pdf (2.3 MB)                │
│                                                         │
│ ━━━━━ Xác nhận ━━━━━                                   │
│                                                         │
│ ☑️ Tôi đã kiểm tra kỹ thông tin trên chứng nhận         │
│ ☑️ Thông tin khớp với đơn hàng                          │
│ ☑️ File PDF rõ ràng, đọc được                           │
│                                                         │
│ Ghi chú (nội bộ):                                       │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Đã xử lý xong, chứng nhận đúng, không có vấn đề.   │ │
│ │ ___________________________________________________  │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │      [Hủy]  [✅ Hoàn tất & Gửi email khách hàng]    │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Actions:**
1. Nhập số chứng nhận (copy từ PDF)
2. Nhập ngày hiệu lực & hết hạn
3. Upload file PDF chứng nhận
4. Review preview
5. Check các checkbox xác nhận
6. Ghi chú (nếu cần)
7. Click [✅ Hoàn tất & Gửi email khách hàng]

**System Actions (Automatic):**
1. ✅ Update order status: `PAYMENT_CONFIRMED` → `ACTIVE`
2. ✅ Save certificate number & dates
3. ✅ Upload PDF to cloud storage (S3/GCS)
4. ✅ Generate shareable link for customer
5. ✅ Send Email to customer (with PDF attachment + link)
6. ✅ Send SMS to customer (with link)
7. ✅ Create reminder (for expiry - 7 days before)
8. ✅ Update driver/merchant profile (if applicable)
9. ✅ Log activity for audit trail

---

### Step 5: Email/SMS gửi chứng nhận cho khách hàng

**Actor:** System (Automatic)

**Email Template (Step 5 - Certificate Ready):**

```
Subject: ✅ Chứng nhận bảo hiểm đã sẵn sàng - #LS-INS-240214-001

Kính gửi Anh/Chị Nguyễn Văn A,

Chứng nhận bảo hiểm của Anh/Chị đã được cấp!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ THÔNG TIN BẢO HIỂM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Số chứng nhận:  BV-TNDS-2026-12345
Loại bảo hiểm:  TNDS Bắt buộc + Vật chất xe
Công ty BH:     Bảo Việt

Xe được bảo hiểm:
Toyota Vios 2020 - Biển số: 51G-12345

Thời hạn bảo hiểm:
📅 Hiệu lực: 01/01/2026
📅 Hết hạn: 31/12/2026 (12 tháng)

Phí bảo hiểm: ₫12,880,700 (Đã thanh toán)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 TẢI CHỨNG NHẬN:
File đính kèm: BV-TNDS-2026-12345.pdf

Hoặc tải tại:
🔗 https://lifestyle.vn/insurance/cert/BV-TNDS-2026-12345

📱 XEM TRÊN APP:
Mở app Lifestyle → Bảo hiểm → Bảo hiểm của tôi

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 QUYỀN LỢI CHÍNH:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛡️ TNDS Bắt buộc:
• Thiệt hại về người: 100 triệu/người
• Thiệt hại về tài sản: 50 triệu/vụ

🚗 Vật chất xe:
• Giá trị bảo hiểm: 800 triệu VND
• Quyền lợi: Va chạm, Cháy nổ, Ngập nước, Mất cắp
• Khấu trừ: 1 triệu/vụ

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚨 KHI CÓ SỰ CỐ:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Giữ hiện trường (nếu có thể)
2. Gọi Hotline Bảo Việt: 1900 558888
3. Hoặc báo qua app: Bảo hiểm → Báo tai nạn
4. Cung cấp số chứng nhận: BV-TNDS-2026-12345

Bảo Việt sẽ hỗ trợ Anh/Chị 24/7!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔔 NHẮC NHỞ GIA HẠN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Chúng tôi sẽ nhắc nhở Anh/Chị gia hạn bảo hiểm trước 7 ngày 
hết hạn để Anh/Chị không bị gián đoạn bảo hiểm.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📞 HỖ TRỢ:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Hotline Lifestyle: 1900 123456
Email: support@lifestyle.vn
Chat: Trong app (Tab Hỗ trợ)

Cảm ơn Anh/Chị đã tin tưởng Lifestyle Super App!

Trân trọng,
Lifestyle Insurance Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Đây là email tự động. Vui lòng không reply email này.
Nếu cần hỗ trợ, vui lòng liên hệ Hotline hoặc Chat trong app.
```

**SMS Template:**

```
Lifestyle: Chung nhan BH #BV-TNDS-2026-12345 da san sang! 
Tai tai: lifestyle.vn/insurance/cert/BV-TNDS-2026-12345
Hieu luc: 01/01/2026-31/12/2026. Chi tiet trong email.
```

**Push Notification (In-app):**

```
🛡️ Chứng nhận bảo hiểm đã sẵn sàng!

Xe: 51G-12345
Hiệu lực: 01/01/2026 - 31/12/2026

Tap để xem chi tiết →
```

---

### Step 6: Commission tracking & payment (After 30 days)

**Actor:** Finance Team + System

**Workflow:**

1. **After 30 days from contract effective date:**
   - System automatically calculates commission
   - Creates commission record in database

2. **Insurance company pays commission to Lifestyle:**
   - Bank transfer from Bảo Việt to Lifestyle
   - Finance team reconciles payment

3. **Lifestyle pays commission to referrer (if any):**
   - If sold by driver/merchant: Pay to their wallet
   - If sold by agent: Pay to agent account

**Commission Structure:**

```
Order: #LS-INS-240214-001
Total Premium: ₫12,880,700

Commission Breakdown:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
From Insurance Company to Lifestyle:
  TNDS:       ₫480,700 × 10% = ₫48,070
  Vật chất:   ₫12,400,000 × 10% = ₫1,240,000
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Total:      ₫1,288,070
  
From Lifestyle to Referrer (Driver/Merchant):
  50% of commission = ₫644,035
  (If they referred the customer)
  
Lifestyle keeps:
  50% = ₫644,035
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Commission Payment Timeline:**

```
Day 0:  Contract effective (01/01/2026)
Day 30: Insurance company pays Lifestyle
Day 32: Lifestyle pays referrer (if any)
Day 35: Commission appears in wallet

Notification sent to referrer:
"💰 Hoa hồng bảo hiểm ₫644,035 đã được nạp vào ví!"
```

---

## 🚨 Error Handling & Edge Cases

### Case 1: Payment Not Confirmed

**Scenario:** Customer uploaded fake payment proof or wrong amount

**Detection:**
- Manual review by Ops sees mismatch
- Or: Bank API integration detects no matching transaction

**Actions:**
1. Update order status: `PAYMENT_CONFIRMED` → `PENDING_PAYMENT`
2. Send email/SMS to customer:
   ```
   ⚠️ Chưa xác nhận được thanh toán

   Đơn hàng: #LS-INS-240214-001
   
   Chúng tôi chưa xác nhận được thanh toán của Anh/Chị.
   
   Vui lòng:
   1. Kiểm tra lại biên lai chuyển khoản
   2. Đảm bảo nội dung CK đúng: LS-INS-240214-001
   3. Đảm bảo số tiền đúng: ₫12,880,700
   4. Upload lại biên lai rõ ràng
   
   Hoặc liên hệ Hotline: 1900 123456
   ```

3. Wait for customer to re-upload payment proof
4. Re-verify

### Case 2: Insurance Company Rejects Application

**Scenario:** Insurance company rejects due to invalid documents or other reasons

**Reasons:**
- Vehicle documents expired (đăng kiểm hết hạn)
- Vehicle under lien/mortgage (xe đang thế chấp)
- Previous insurance claims history
- Incomplete information

**Actions:**
1. Update order status: `SUBMITTED` → `REJECTED`
2. Record rejection reason from insurance company
3. Send email/SMS to customer:
   ```
   ❌ Đơn bảo hiểm không được chấp nhận

   Đơn hàng: #LS-INS-240214-001
   
   Rất tiếc, đơn bảo hiểm của Anh/Chị không được công ty 
   bảo hiểm chấp nhận.
   
   Lý do: Xe chưa đăng kiểm (hết hạn 15/11/2025)
   
   Giải pháp:
   1. Đưa xe đi đăng kiểm
   2. Upload giấy đăng kiểm mới
   3. Đặt lại đơn hàng bảo hiểm
   
   Hoàn tiền:
   Số tiền ₫12,880,700 sẽ được hoàn lại vào ví Lifestyle 
   của Anh/Chị trong 1-2 ngày làm việc.
   
   Liên hệ hỗ trợ: 1900 123456
   ```

4. Process refund to customer wallet

### Case 3: Customer Requests Cancellation

**Scenario:** Customer wants to cancel after submitting order

**Timeline:**
- **Before submission to insurance company:** Full refund
- **After submission but before certificate issued:** Full refund (if insurance company hasn't processed)
- **After certificate issued:** No refund (per insurance terms)

**Actions:**
1. Customer sends cancellation request via chat/phone
2. Ops checks order status
3. If eligible for refund:
   - Update status: → `CANCELLED`
   - Process refund
   - Send confirmation email
4. If not eligible:
   - Explain insurance terms
   - Suggest alternatives (e.g., transfer to another vehicle)

### Case 4: Certificate Delivery Delay (> 24h)

**Scenario:** Insurance company portal is down or processing is slow

**Actions:**
1. Ops monitors queue for orders > 24h old without certificate
2. Dashboard shows alert: "⚠️ 3 đơn quá hạn 24h"
3. Ops contacts insurance company hotline
4. Send proactive email to customer:
   ```
   ⏰ Đang xử lý đơn bảo hiểm

   Đơn hàng: #LS-INS-240214-001
   
   Đơn bảo hiểm của Anh/Chị đang được xử lý.
   
   Do lượng đơn đông, thời gian xử lý kéo dài hơn dự kiến.
   Chúng tôi đang liên hệ công ty bảo hiểm để xử lý ưu tiên.
   
   Dự kiến hoàn tất: Trong 4-6 giờ tới
   
   Chúng tôi xin lỗi về sự bất tiện này.
   
   Liên hệ: 1900 123456
   ```

5. Escalate to insurance company relationship manager
6. Follow up hourly until resolved

---

## 📊 Metrics & KPIs

### For Ops Team

```
Daily Metrics:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Orders Pending:            15 đơn
Orders Processed Today:    23 đơn
Avg Processing Time:       5.2 giờ ✅ (Target: < 8h)
Success Rate:              97.8% ✅ (Target: > 98%)
Customer Satisfaction:     4.6/5 ⭐

Active Contracts:          1,245 hợp đồng
Expiring This Month:       87 hợp đồng
Renewal Rate:              68% (Target: > 70%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### For Management

```
Monthly Revenue:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Premium Collected:         ₫156M
Commission Earned:         ₫15.6M (10%)
Commission Paid Out:       ₫7.8M (50% to referrers)
Net Revenue:               ₫7.8M
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

New Contracts:             345 hợp đồng
Renewals:                  67 hợp đồng
Cancellations:             12 hợp đồng
Net Growth:                +400 hợp đồng

Customer Acquisition Cost: ₫45K/customer
Customer Lifetime Value:   ₫850K (5 years avg)
```

---

## 🎓 Training Materials

### For Ops Team

**Video Tutorials:**
1. Overview of insurance ops workflow (10 min)
2. How to verify customer documents (15 min)
3. How to submit to Bảo Việt portal (20 min)
4. How to handle common errors (15 min)
5. How to use Admin Ops dashboard (10 min)

**Written Guides:**
- Insurance Operations Manual (50 pages)
- Document Verification Checklist (2 pages)
- Insurance Company Portal Guides (per company)
- FAQ for common customer questions (10 pages)

**Certification:**
- Ops team must complete training + pass quiz (80% score)
- Quarterly refresher training

---

## 📞 Customer Support Scripts

### Script 1: Customer asks "Khi nào có chứng nhận?"

**Response:**
```
Xin chào Anh/Chị,

Cảm ơn Anh/Chị đã mua bảo hiểm tại Lifestyle!

Sau khi Anh/Chị hoàn tất thanh toán và upload biên lai, 
nhân viên của chúng tôi sẽ khai báo thông tin lên hệ thống 
công ty bảo hiểm trong vòng 24 giờ.

Chứng nhận bảo hiểm sẽ được gửi qua email và SMS ngay khi 
công ty bảo hiểm cấp chứng nhận.

Anh/Chị cũng có thể xem chứng nhận trong app:
Lifestyle → Bảo hiểm → Bảo hiểm của tôi

Thời gian dự kiến: Trong 24 giờ

Hiện tại đơn hàng của Anh/Chị: #LS-INS-240214-001
Trạng thái: Đang xử lý ⏰

Nếu có thắc mắc, Anh/Chị vui lòng liên hệ:
Hotline: 1900 123456

Trân trọng!
```

### Script 2: Customer asks "Tôi mất biên lai chuyển khoản, làm sao?"

**Response:**
```
Xin chào Anh/Chị,

Không sao, Anh/Chị có thể:

1. Vào app ngân hàng → Lịch sử giao dịch
   → Tìm giao dịch chuyển khoản
   → Chụp màn hình
   → Upload lên app Lifestyle

2. Nếu chuyển khoản tại quầy:
   → Liên hệ ngân hàng để lấy lại biên lai
   → Hoặc lấy sao kê tài khoản có giao dịch đó
   → Upload lên app

3. Nếu không có cách nào:
   → Liên hệ Hotline: 1900 123456
   → Cung cấp mã đơn hàng: #LS-INS-240214-001
   → Chúng tôi sẽ hỗ trợ xác minh thanh toán qua ngân hàng

Trân trọng!
```

---

**Version:** 1.0  
**Last Updated:** Feb 14, 2026  
**Status:** 🟢 Complete Documentation

**Quy trình minh bạch, hiệu quả, đáng tin cậy! 📋✅**
