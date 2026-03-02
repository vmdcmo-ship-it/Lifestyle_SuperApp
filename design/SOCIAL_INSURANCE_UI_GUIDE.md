# Quỹ An Sinh Lifestyle - UI/UX Guide
## BHXH Tự nguyện - Lead Generation Model

> **"An tâm hiện tại - Yên tâm tương lai"**

---

## 🎯 Brand Naming Strategy

### Main Product Name

```
🏛️ QUỸ AN SINH LIFESTYLE
   (Lifestyle Security Fund)

Tagline: "Của để dành cho tương lai - Đơn giản như... tích Xu"
```

**Tại sao tên này?**
- **"Quỹ"** → Cảm giác tin cậy, chuyên nghiệp (như quỹ đầu tư)
- **"An Sinh"** → Emotional appeal, touch vào nỗi lo về già
- **"Lifestyle"** → Branding consistency, thuộc hệ sinh thái

### App-Specific Messaging (Tên ấn tượng)

#### 1. User App: "TÍCH LŨY THẢNH THƠI" 💐

```
Icon: 🌸 (hoa, tượng trưng sự nhẹ nhàng)
Color: Soft Pink #FFB6C1 hoặc Mint Green #98D8C8

Headline: "Tích lũy thảnh thơi - Về già nhận lương"

Subheadline: 
"Mỗi tháng chỉ từ 800K, bạn sẽ có lương hưu 
4 triệu đồng/tháng khi về già. Đơn giản như tích Xu!"

Emotional Hook:
"Bạn đang tích Xu để đổi voucher... 
Sao không tích một chút cho tương lai?"
```

**Insight:**
- User thường trẻ (25-40 tuổi), quan tâm đến lifestyle > financial planning
- Ngôn ngữ phải nhẹ nhàng, không "nghiêm túc" quá → "Thảnh thơi"
- So sánh với tích Xu (familiar concept) để giảm độ xa lạ của BHXH

#### 2. Driver App: "CỦA ĐỂ DÀNH CHO NGHỀ TỰ DO" 🛡️

```
Icon: 🛡️ (lá chắn, tượng trưng bảo vệ)
Color: Strong Blue #2E5090 (tin cậy, an toàn)

Headline: "Của để dành cho nghề tự do"

Subheadline:
"Bạn không có BHXH bắt buộc như nhân viên văn phòng.
Nhưng bạn xứng đáng có một khoản lương hưu khi về già."

Emotional Hook:
"Một phao cứu sinh cho những ngày không còn chạy xe"

Call-to-Action:
"💪 Tạo phao cứu sinh ngay"
```

**Insight:**
- Driver thường lo nghĩ về tương lai (nghề lái xe không thể làm mãi)
- Pain point: "Tôi về già sống bằng gì?"
- Ngôn ngữ phải strong, masculine → "Của để dành", "Phao cứu sinh"
- Emphasize: Không có BHXH bắt buộc = Rủi ro cao

#### 3. Merchant App: "PHÚC LỢI CHỦ HỘMASK KINH DOANH" 👔

```
Icon: 👔 (cà vạt, tượng trưng chuyên nghiệp)
Color: Professional Gold #D4AF37

Headline: "Phúc lợi chủ hộ kinh doanh"

Subheadline:
"Vận hành cửa hàng + Có lương hưu như nhân viên văn phòng.
Bạn xứng đáng có cả hai!"

Emotional Hook:
"Nhân viên của bạn có BHXH bắt buộc.
Còn bạn - người chủ - thì sao?"

Call-to-Action:
"📊 Tính ngay quyền lợi của tôi"
```

**Insight:**
- Merchant có thu nhập ổn định hơn driver, quan tâm đến "phúc lợi"
- Pain point: "Nhân viên có BHXH, còn tôi thì không"
- Positioning: Bạn là chủ, bạn cũng xứng đáng được bảo vệ
- Ngôn ngữ: Chuyên nghiệp, business-oriented

---

## 📱 Screen Architecture

### Navigation Structure

**User App:**
```
Lifestyle Tab
├─ 💰 Ví Lifestyle
├─ 🎁 Tiết kiệm
├─ 🛡️ Bảo hiểm
│   ├─ Bảo hiểm xe (TNDS, Vật chất)
│   └─ 🌸 Quỹ An Sinh (BHXH) ← NEW
└─ 🎫 Voucher
```

**Driver App:**
```
Tài xế (Profile) Tab
├─ 💰 Thu nhập
├─ 🛡️ Bảo hiểm
│   ├─ TNDS xe (Bắt buộc)
│   ├─ Vật chất xe
│   └─ 🛡️ Của để dành (BHXH) ← NEW
└─ ⚙️ Cài đặt
```

**Merchant App:**
```
Thêm (More) Tab
├─ 💰 Tài chính
├─ 📊 Thống kê
├─ 🛡️ Bảo hiểm
│   ├─ Bảo hiểm xe giao hàng
│   └─ 👔 Phúc lợi chủ hộ (BHXH) ← NEW
└─ ⚙️ Cài đặt
```

---

## 🎨 Screen Designs

### Screen 1: Landing Page (App-Specific)

#### User App Version: "Tích lũy thảnh thơi"

```
┌─────────────────────────────────────────────────────────┐
│ ╔═══════════════════════════════════════════════════╗   │
│ ║  ← Quỹ An Sinh Lifestyle                 [❓]    ║   │
│ ╚═══════════════════════════════════════════════════╝   │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │ ← Hero
│ │                                                     │ │   Banner
│ │         🌸 TÍCH LŨY THẢNH THƠI 🌸                   │ │   240px
│ │                                                     │ │
│ │       Mỗi tháng chỉ từ 800K                         │ │
│ │       Về già nhận lương 4 triệu/tháng               │ │
│ │                                                     │ │
│ │    [Soft gradient background: Pink → White]         │ │
│ │                                                     │ │
│ │          [✨ Tính ngay quyền lợi]                   │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ━━━━━ Bạn có biết? ━━━━━                               │
│                                                         │
│ 💡 Bạn đang tích Xu để đổi voucher...                  │
│    Sao không tích một chút cho tương lai?               │
│                                                         │
│ ┌───────┬───────┬───────┐                              │
│ │ 💰    │ 🏥    │ 🎯    │                              │
│ │Lương  │ BHYT  │ An tâm│                              │
│ │hưu    │miễn phí│ về già│                              │
│ │4M/tháng│trị giá│ Chắc  │                              │
│ │        │ 2M/năm│ chắn  │                              │
│ └───────┴───────┴───────┘                              │
│                                                         │
│ ━━━━━ Đơn giản 3 bước ━━━━━                            │
│                                                         │
│ ① Điền thông tin (2 phút)                              │
│ ② Xem quyền lợi (ngay lập tức)                         │
│ ③ Nhận tư vấn miễn phí (24 giờ)                        │
│                                                         │
│ [🚀 Bắt đầu ngay]                                       │
│                                                         │
│ ━━━━━ Câu hỏi thường gặp ━━━━━                         │
│                                                         │
│ ▾ BHXH tự nguyện là gì?                                │
│ ▾ Tôi đóng bao nhiêu? Nhận bao nhiêu?                  │
│ ▾ Nếu tôi không đóng nữa thì sao?                      │
│ ▾ Có an toàn không?                                    │
│                                                         │
│ [Xem tất cả câu hỏi]                                   │
│                                                         │
│ ━━━━━ Video chia sẻ thực tế ━━━━━                      │
│                                                         │
│ 🎬 [Video thumbnail]                                    │
│    "Chị Mai, 35 tuổi, chia sẻ về việc                 │
│     tham gia BHXH tự nguyện"                            │
│                                                         │
│ 🎬 [Video thumbnail]                                    │
│    "Anh Tuấn, shipper, về hưu an tâm                  │
│     nhờ tham gia từ sớm"                                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Driver App Version: "Của để dành cho nghề tự do"

```
┌─────────────────────────────────────────────────────────┐
│ ╔═══════════════════════════════════════════════════╗   │
│ ║  ← Của để dành                            [❓]    ║   │
│ ╚═══════════════════════════════════════════════════╝   │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │ ← Hero
│ │                                                     │ │   Banner
│ │         🛡️ CỦA ĐỂ DÀNH CHO NGHỀ TỰ DO             │ │   240px
│ │                                                     │ │
│ │    "Một phao cứu sinh cho những ngày                │ │
│ │     không còn chạy xe"                              │ │
│ │                                                     │ │
│ │    [Strong gradient: Blue → Dark Blue]              │ │
│ │                                                     │ │
│ │          [💪 Tạo phao cứu sinh ngay]                │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ━━━━━ Tại sao tài xế cần BHXH? ━━━━━                   │
│                                                         │
│ ⚠️ Bạn không có BHXH bắt buộc như nhân viên văn phòng   │
│    → Về già sẽ sống bằng gì?                            │
│                                                         │
│ ⚠️ Nghề lái xe không thể làm mãi                        │
│    → Khi không còn sức khỏe, thu nhập = 0               │
│                                                         │
│ ✅ Giải pháp: BHXH tự nguyện                            │
│    → Lương hưu 4-7 triệu/tháng khi về già               │
│    → BHYT miễn phí (tiết kiệm 2 triệu/năm)              │
│    → An tâm cho gia đình                                │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 💬 "Tôi là shipper, 28 tuổi. Tôi đóng BHXH tự      │ │
│ │    nguyện mỗi tháng 1.2 triệu. Khi về già, tôi     │ │
│ │    sẽ nhận 5.5 triệu/tháng. Đáng đầu tư!"          │ │
│ │                            - Anh Minh, TP.HCM       │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ [🧮 Tính ngay quyền lợi của tôi]                        │
│                                                         │
│ ━━━━━ So sánh với không có BHXH ━━━━━                  │
│                                                         │
│ ┌────────────────┬────────────────┐                    │
│ │ KHÔNG CÓ BHXH  │ CÓ BHXH TỰ N.  │                    │
│ ├────────────────┼────────────────┤                    │
│ │ Về già: 0 đồng │ 4-7M/tháng     │                    │
│ │ BHYT: 2M/năm   │ BHYT miễn phí  │                    │
│ │ Lo lắng mãi    │ An tâm trọn đời│                    │
│ └────────────────┴────────────────┘                    │
│                                                         │
│ ━━━━━ Câu chuyện thực tế ━━━━━                         │
│                                                         │
│ 🎬 [Video] "Anh Tuấn - Shipper 15 năm kinh nghiệm"    │
│    Chia sẻ về hành trình tham gia BHXH từ 25 tuổi      │
│                                                         │
│ 📖 [Bài viết] "Tài xế về hưu - Có BHXH vs Không có"   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Merchant App Version: "Phúc lợi chủ hộ kinh doanh"

```
┌─────────────────────────────────────────────────────────┐
│ ╔═══════════════════════════════════════════════════╗   │
│ ║  ← Phúc lợi chủ hộ                        [❓]    ║   │
│ ╚═══════════════════════════════════════════════════╝   │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │ ← Hero
│ │                                                     │ │   Banner
│ │      👔 PHÚC LỢI CHỦ HỘ KINH DOANH                  │ │   240px
│ │                                                     │ │
│ │    Vận hành cửa hàng + Có lương hưu                 │ │
│ │    như nhân viên văn phòng                          │ │
│ │                                                     │ │
│ │    Bạn xứng đáng có cả hai!                         │ │
│ │                                                     │ │
│ │    [Professional gradient: Gold → White]            │ │
│ │                                                     │ │
│ │          [📊 Tính ngay quyền lợi]                   │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ━━━━━ Bạn có biết? ━━━━━                               │
│                                                         │
│ 🤔 Nhân viên của bạn có BHXH bắt buộc                   │
│    → Họ sẽ có lương hưu khi về già                      │
│                                                         │
│ 🤔 Còn bạn - người chủ - thì sao?                       │
│    → Không BHXH = Không lương hưu                       │
│                                                         │
│ ✅ Giải pháp: BHXH tự nguyện cho chủ hộ kinh doanh      │
│    → Bạn cũng xứng đáng được bảo vệ!                    │
│                                                         │
│ ━━━━━ Quyền lợi dành cho chủ hộ ━━━━━                  │
│                                                         │
│ ┌───────┬───────┬───────┐                              │
│ │ 💼    │ 🏥    │ 📈    │                              │
│ │Lương  │ BHYT  │ Tài sản│                              │
│ │hưu    │ như NV│ tương  │                              │
│ │ổn định│văn    │ lai    │                              │
│ │       │phòng  │ vững   │                              │
│ └───────┴───────┴───────┘                              │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 💬 "Tôi vận hành cửa hàng tạp hóa 10 năm. Nhân     │ │
│ │    viên của tôi có BHXH, còn tôi thì không. Tôi   │ │
│ │    đã tham gia BHXH tự nguyện và rất yên tâm!"    │ │
│ │                          - Chị Lan, Quận 7, HCM    │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ [🚀 Bắt đầu tham gia]                                   │
│                                                         │
│ ━━━━━ So sánh chi phí ━━━━━                            │
│                                                         │
│ Chi phí BHYT mỗi năm (nếu mua riêng): 2 triệu          │
│ Chi phí BHXH tự nguyện: 800K-2M/tháng                   │
│ → Bạn vừa có BHYT + Lương hưu + An tâm!                │
│                                                         │
│ ━━━━━ Hỗ trợ từ chính phủ ━━━━━                        │
│                                                         │
│ 💰 Chính phủ hỗ trợ 30-50% mức đóng                     │
│    cho một số đối tượng                                 │
│                                                         │
│ 📋 Điều kiện: Hộ nghèo, cận nghèo, lao động nông thôn  │
│                                                         │
│ [Kiểm tra điều kiện hỗ trợ]                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### Screen 2: Pre-check Form (Step 1)

```
┌─────────────────────────────────────────────────────────┐
│ ╔═══════════════════════════════════════════════════╗   │
│ ║  ← Đăng ký tư vấn                    Bước 1/3    ║   │
│ ╚═══════════════════════════════════════════════════╝   │
│                                                         │
│ ● ━━━━━ ○ ━━━━━ ○                                     │ ← Progress
│ Thông tin Tính toán Xác nhận                            │
│                                                         │
│ ━━━━━ Thông tin cơ bản ━━━━━                           │
│                                                         │
│ Họ và tên: *                                            │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [Nguyễn Văn A____________________________]          │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Giới tính: *                                            │
│ ● Nam    ○ Nữ                                          │
│                                                         │
│ Ngày sinh: *                                            │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [15/03/1990                                     📅] │ │
│ └─────────────────────────────────────────────────────┘ │
│ → Tuổi hiện tại: 36 tuổi                                │
│ → Tuổi nghỉ hưu: 62 tuổi (Nam)                          │
│ → Còn 26 năm đến nghỉ hưu                               │
│                                                         │
│ Số CMND/CCCD: *                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [001234567890______________________]                │ │
│ └─────────────────────────────────────────────────────┘ │
│ 💡 Để kiểm tra lịch sử đóng BHXH (nếu có)              │
│                                                         │
│ Số điện thoại: *                                        │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [0901234567_________________________]               │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Email: (Tùy chọn)                                       │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [nguyenvana@email.com_______________]               │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ━━━━━ Tình trạng hiện tại ━━━━━                        │
│                                                         │
│ Bạn đã có sổ BHXH chưa?                                 │
│ ○ Chưa (đóng lần đầu)                                  │
│ ● Đã có (đã đóng trước đây)                            │
│                                                         │
│ (If "Đã có":)                                           │
│ Số năm đã đóng BHXH: *                                  │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [___5___] năm                                       │ │
│ └─────────────────────────────────────────────────────┘ │
│ → Còn cần đóng thêm 15 năm để đủ điều kiện hưu         │
│    (Tối thiểu 20 năm)                                   │
│                                                         │
│ ━━━━━ Mong muốn của bạn ━━━━━                          │
│                                                         │
│ Bạn muốn nhận bao nhiêu khi về hưu?                     │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ₫ [___4,000,000___]/tháng                           │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Quick: [₫3M] [₫4M] [₫5M] [₫7M] [₫10M]                  │
│                                                         │
│ 💡 Gợi ý: Lương hưu trung bình hiện nay: 3-5 triệu/tháng│
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │           [Hủy]  [Tiếp tục tính toán >]             │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### Screen 3: Calculator Results (Step 2) - "Chốt bằng con số"

```
┌─────────────────────────────────────────────────────────┐
│ ╔═══════════════════════════════════════════════════╗   │
│ ║  ← Kết quả tính toán                 Bước 2/3    ║   │
│ ╚═══════════════════════════════════════════════════╝   │
│                                                         │
│ ● ━━━━━ ● ━━━━━ ○                                     │
│                                                         │
│ ━━━━━ Thông tin của bạn ━━━━━                          │
│                                                         │
│ 👤 Nguyễn Văn A, 36 tuổi (Nam)                          │
│ 🎯 Mục tiêu lương hưu: ₫4,000,000/tháng                 │
│ ⏰ Còn 26 năm đến nghỉ hưu (62 tuổi)                    │
│                                                         │
│ ━━━━━ Các mức đóng phí ━━━━━                           │
│                                                         │
│ Chọn mức đóng phù hợp với bạn:                          │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ○ Mức 1: ₫499,000/tháng                             │ │
│ │   Lương hưu: ₫2,100,000/tháng                       │ │
│ │   + BHYT miễn phí (₫2M/năm)                         │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ● Mức 2: ₫748,000/tháng ✨ Đề xuất                  │ │
│ │   Lương hưu: ₫3,200,000/tháng                       │ │
│ │   + BHYT miễn phí (₫2M/năm)                         │ │
│ │   Gần với mục tiêu của bạn (80%)                    │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ○ Mức 3: ₫998,000/tháng                             │ │
│ │   Lương hưu: ₫4,300,000/tháng                       │ │
│ │   + BHYT miễn phí (₫2M/năm)                         │ │
│ │   Đạt mục tiêu của bạn! 🎯                          │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ○ Mức 4: ₫1,497,000/tháng                           │ │
│ │   Lương hưu: ₫6,400,000/tháng                       │ │
│ │   + BHYT miễn phí                                   │ │
│ │   Sống sung túc khi về già                          │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ [Xem thêm các mức khác]                                 │
│                                                         │
│ ━━━━━ Chi tiết mức đã chọn (Mức 2) ━━━━━               │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Đóng hàng tháng:              ₫748,000              │ │
│ │ (Bằng 2 bát phở mỗi ngày)                           │ │
│ │                                                     │ │
│ │ Tổng số năm đóng:             26 năm                │ │
│ │ Tổng số tiền đóng:            ₫233,000,000          │ │
│ │                                                     │ │
│ │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ │
│ │                                                     │ │
│ │ Lương hưu nhận được:          ₫3,200,000/tháng     │ │
│ │ BHYT miễn phí:                ₫2,000,000/năm       │ │
│ │                                                     │ │
│ │ Tổng nhận đến 80 tuổi:        ₫691,000,000         │ │
│ │ ROI:                          297% 📈               │ │
│ │ Hoàn vốn sau:                 6 năm                 │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ━━━━━ Hỗ trợ từ chính phủ ━━━━━                        │
│                                                         │
│ 💰 Nếu bạn thuộc diện hỗ trợ (hộ nghèo, cận nghèo):    │
│    Chính phủ hỗ trợ 30-50% mức đóng                     │
│    → Bạn chỉ cần đóng ₫374K-₫524K/tháng!               │
│                                                         │
│ [Kiểm tra điều kiện hỗ trợ]                             │
│                                                         │
│ ━━━━━ Lợi ích vượt trội ━━━━━                          │
│                                                         │
│ ✅ Lương hưu ổn định suốt đời (không giới hạn)         │
│ ✅ BHYT miễn phí (tiết kiệm 2 triệu/năm)                │
│ ✅ Tăng thêm 2%/năm nếu đóng > 15 năm                   │
│ ✅ Được hưởng chế độ ốm đau, thai sản (nếu đủ ĐK)      │
│ ✅ Thân nhân được hưởng chế độ tử tuất                  │
│                                                         │
│ ━━━━━ So với gửi tiết kiệm ━━━━━                       │
│                                                         │
│ ┌────────────────┬────────────────┐                    │
│ │ GỬI TIẾT KIỆM  │ BHXH TỰ NGUYỆN │                    │
│ ├────────────────┼────────────────┤                    │
│ │Lãi suất 6%/năm │ ROI 297%       │                    │
│ │Có giới hạn     │ Suốt đời       │                    │
│ │Không BHYT      │ BHYT miễn phí  │                    │
│ │Rủi ro lạm phát │ Tăng theo LTĐH │                    │
│ └────────────────┴────────────────┘                    │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │    [< Quay lại]  [✅ Đăng ký tư vấn miễn phí]       │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### Screen 4: Consultation Request (Step 3)

```
┌─────────────────────────────────────────────────────────┐
│ ╔═══════════════════════════════════════════════════╗   │
│ ║  ← Đăng ký tư vấn                    Bước 3/3    ║   │
│ ╚═══════════════════════════════════════════════════╝   │
│                                                         │
│ ● ━━━━━ ● ━━━━━ ●                                     │
│                                                         │
│ ━━━━━ Xác nhận thông tin ━━━━━                         │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Thông tin của bạn:                                  │ │
│ │ • Họ tên: Nguyễn Văn A                              │ │
│ │ • Tuổi: 36 (Nam)                                    │ │
│ │ • SĐT: 0901234567                                   │ │
│ │ • Email: nguyenvana@email.com                       │ │
│ │                                                     │ │
│ │ Mức đóng đã chọn: Mức 2                             │ │
│ │ • Đóng: ₫748,000/tháng                              │ │
│ │ • Lương hưu: ₫3,200,000/tháng                       │ │
│ │ • BHYT: Miễn phí (₫2M/năm)                          │ │
│ │                                                     │ │
│ │ [✏️ Sửa thông tin]                                   │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ━━━━━ Bước tiếp theo ━━━━━                             │
│                                                         │
│ ✅ Sau khi bạn đăng ký:                                 │
│                                                         │
│ 1️⃣ Tư vấn viên sẽ liên hệ trong 24 giờ                 │
│    • Xác minh thông tin                                 │
│    • Giải thích chi tiết quyền lợi                      │
│    • Kiểm tra hỗ trợ của chính phủ                      │
│                                                         │
│ 2️⃣ Hướng dẫn chuẩn bị hồ sơ                             │
│    • CMND/CCCD (Photo)                                  │
│    • Sổ hộ khẩu (Photo)                                 │
│    • Ảnh 4×6 (2 ảnh)                                    │
│                                                         │
│ 3️⃣ Nộp hồ sơ vào BHXH Việt Nam                         │
│    • Tư vấn viên hỗ trợ toàn bộ thủ tục                 │
│    • Thời gian xử lý: 7-10 ngày                         │
│                                                         │
│ 4️⃣ Nhận sổ BHXH & Bắt đầu đóng                          │
│    • Nhận sổ BHXH (màu xanh)                            │
│    • Được hướng dẫn cách đóng phí                       │
│    • App sẽ nhắc nhở đóng phí hàng tháng               │
│                                                         │
│ ━━━━━ Cam kết của chúng tôi ━━━━━                      │
│                                                         │
│ ✅ Tư vấn MIỄN PHÍ, không bắt buộc                      │
│ ✅ Thông tin được bảo mật 100%                          │
│ ✅ Liên kết chính thống với BHXH Việt Nam               │
│ ✅ Hỗ trợ suốt quá trình tham gia                       │
│                                                         │
│ 🔒 Chúng tôi cam kết:                                   │
│    • Không bán thông tin khách hàng                     │
│    • Không spam tin nhắn/cuộc gọi                       │
│    • Chỉ liên hệ 1 lần để tư vấn                        │
│                                                         │
│ ━━━━━ Ghi chú (tùy chọn) ━━━━━                         │
│                                                         │
│ Bạn có câu hỏi gì muốn hỏi tư vấn viên?                 │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Tôi muốn hỏi về hỗ trợ của chính phủ____________    │ │
│ │ ___________________________________________________  │ │
│ │ ___________________________________________________  │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Thời gian thuận tiện để nhận cuộc gọi:                  │
│ ○ Sáng (8h-12h)                                        │
│ ● Chiều (13h-17h)                                      │
│ ○ Tối (18h-21h)                                        │
│ ○ Bất kỳ lúc nào                                       │
│                                                         │
│ ☑️ Tôi đồng ý cho Lifestyle liên hệ để tư vấn           │
│ ☑️ Tôi đã đọc và đồng ý với Điều khoản sử dụng          │
│    [Xem điều khoản]                                     │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │         [< Quay lại]  [✅ Gửi yêu cầu tư vấn]       │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### Screen 5: Success Confirmation

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│              ✅ Đã nhận yêu cầu!                         │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │         [Checkmark animation - 120px]               │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Cảm ơn bạn đã tin tưởng Quỹ An Sinh Lifestyle!         │
│                                                         │
│ ━━━━━ Thông tin yêu cầu ━━━━━                          │
│                                                         │
│ 📋 Mã yêu cầu: LS-BHXH-240214-001                       │
│ 👤 Họ tên: Nguyễn Văn A                                 │
│ 📞 SĐT: 0901234567                                      │
│ 💰 Mức đóng: Mức 2 (₫748K/tháng)                        │
│                                                         │
│ ━━━━━ Bước tiếp theo ━━━━━                             │
│                                                         │
│ ⏰ Tư vấn viên sẽ liên hệ trong:                        │
│ ┌─────────────────────────────────────────────────────┐ │
│ │                                                     │ │
│ │                  24 giờ                             │ │
│ │                                                     │ │
│ │          Dự kiến: 15/02/2026 15:00                  │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ✉️  Email xác nhận đã được gửi đến:                     │
│     nguyenvana@email.com                                │
│                                                         │
│ 📱 SMS xác nhận đã được gửi đến:                        │
│     0901234567                                          │
│                                                         │
│ ━━━━━ Trong khi chờ đợi ━━━━━                          │
│                                                         │
│ 📖 [Đọc câu hỏi thường gặp]                            │
│    Tìm hiểu thêm về BHXH tự nguyện                      │
│                                                         │
│ 🎬 [Xem video chia sẻ]                                  │
│    Nghe câu chuyện từ người đã tham gia                 │
│                                                         │
│ 📄 [Tải tài liệu]                                       │
│    Hướng dẫn chi tiết về quyền lợi BHXH                │
│                                                         │
│ ━━━━━ Liên hệ hỗ trợ ━━━━━                             │
│                                                         │
│ 📞 Hotline: 1900 123456                                 │
│ 📧 Email: bhxh@lifestyle.vn                             │
│ 💬 Chat: Trong app (Tab Hỗ trợ)                         │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [📊 Xem lại kết quả tính toán] [🏠 Về trang chủ]    │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Agent Dashboard (For Telesales/Consultants)

### Lead Queue

```
┌─────────────────────────────────────────────────────────┐
│ ╔═══════════════════════════════════════════════════╗   │
│ ║  Leads BHXH                           [Refresh]  ║   │
│ ╚═══════════════════════════════════════════════════╝   │
│                                                         │
│ Filter: [Tất cả ▾] [Chờ gọi (12)] [Đang tư vấn]       │
│ Sort: [Mới nhất ▾]                                     │
│ Search: [🔍 Tìm theo tên/SĐT__________]                │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🔴 NEW  #LS-BHXH-240214-001        2h trước         │ │
│ │                                                     │ │
│ │ 👤 Nguyễn Văn A, 36 tuổi (Nam)                      │ │
│ │ 📞 0901234567                                       │ │
│ │ 📱 Source: Driver App                               │ │
│ │                                                     │ │
│ │ 💰 Mức đóng: Mức 2 (₫748K/tháng)                    │ │
│ │ 🎯 Mục tiêu: ₫4M/tháng lương hưu                    │ │
│ │                                                     │ │
│ │ 📝 Note: "Muốn hỏi về hỗ trợ chính phủ"            │ │
│ │ ⏰ Thời gian gọi: Chiều (13h-17h)                   │ │
│ │                                                     │ │
│ │ Status: ⏰ Chờ gọi                                   │ │
│ │                                                     │ │
│ │ [📞 Gọi ngay] [✏️ Ghi chú] [➡️ Assign khác]        │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🟡 #LS-BHXH-240214-002              5h trước        │ │
│ │ ...                                                 │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 Component Library

### 1. Hero Banner (App-specific)

**User App (Soft, Friendly):**
```css
Container: {
  background: linear-gradient(135deg, #FFB6C1 0%, #FFFFFF 100%), // Pink to White
  padding: 32px 24px,
  borderRadius: 16px,
  marginBottom: 24px
}

Icon: {
  fontSize: 48px,
  marginBottom: 12px,
  emoji: '🌸'
}

Headline: {
  fontSize: 24px,
  fontWeight: '700',
  color: '#2E1A47',
  textAlign: 'center',
  marginBottom: 8px
}

Subheadline: {
  fontSize: 16px,
  color: '#4A4A4A',
  textAlign: 'center',
  lineHeight: 1.6
}

CTA Button: {
  backgroundColor: '#FDB813', // Gold
  color: '#2E1A47',
  padding: '16px 32px',
  borderRadius: 24px,
  fontSize: 16px,
  fontWeight: '600',
  marginTop: 20px,
  shadow: '0 4px 12px rgba(253,184,19,0.3)'
}
```

**Driver App (Strong, Protective):**
```css
Container: {
  background: linear-gradient(135deg, #2E5090 0%, #1A3050 100%), // Blue to Dark Blue
  padding: 32px 24px,
  borderRadius: 16px,
  marginBottom: 24px,
  color: '#FFFFFF'
}

Icon: {
  fontSize: 48px,
  marginBottom: 12px,
  emoji: '🛡️'
}

Headline: {
  fontSize: 24px,
  fontWeight: '700',
  color: '#FFFFFF',
  textAlign: 'center'
}

CTA Button: {
  backgroundColor: '#FDB813',
  color: '#2E1A47',
  padding: '16px 32px',
  borderRadius: 24px,
  fontSize: 16px,
  fontWeight: '700',
  icon: '💪',
  shadow: '0 4px 16px rgba(253,184,19,0.4)'
}
```

**Merchant App (Professional, Gold):**
```css
Container: {
  background: linear-gradient(135deg, #D4AF37 0%, #FFFFFF 100%), // Gold to White
  padding: 32px 24px,
  borderRadius: 16px,
  marginBottom: 24px
}

Icon: {
  fontSize: 48px,
  marginBottom: 12px,
  emoji: '👔'
}

CTA Button: {
  backgroundColor: '#2E1A47', // Purple
  color: '#FFFFFF',
  padding: '16px 32px',
  borderRadius: 24px,
  fontSize: 16px,
  fontWeight: '600',
  icon: '📊'
}
```

### 2. Contribution Level Card (Selectable)

```css
Container: {
  padding: 20px,
  backgroundColor: '#FFFFFF',
  borderRadius: 12px,
  border: '2px solid',
  borderColor: selected ? '#FDB813' : '#E0E0E0',
  marginBottom: 12px,
  shadowLevel: selected ? 3 : 1,
  cursor: 'pointer',
  transition: 'all 0.2s'
}

RadioButton: {
  size: 24px,
  checkedColor: '#FDB813',
  uncheckedColor: '#E0E0E0'
}

LevelName: {
  fontSize: 18px,
  fontWeight: '600',
  color: '#2E1A47',
  marginBottom: 8px
}

MonthlyContribution: {
  fontSize: 20px,
  fontWeight: '700',
  color: '#FDB813',
  marginBottom: 4px
}

MonthlyPension: {
  fontSize: 16px,
  color: '#4A4A4A',
  marginBottom: 8px
}

HealthInsurance: {
  fontSize: 14px,
  color: '#4CAF50',
  icon: '🏥'
}

RecommendedBadge: {
  position: 'absolute',
  top: 16px,
  right: 16px,
  backgroundColor: '#FDB813',
  color: '#2E1A47',
  padding: '4px 12px',
  borderRadius: 12px,
  fontSize: 12px,
  fontWeight: '600',
  text: '✨ Đề xuất'
}
```

### 3. Comparison Table

```css
Table: {
  width: '100%',
  backgroundColor: '#FFFFFF',
  borderRadius: 12px,
  border: '1px solid #E0E0E0',
  overflow: 'hidden'
}

HeaderRow: {
  backgroundColor: '#2E1A47',
  color: '#FFFFFF',
  padding: 12px,
  fontSize: 14px,
  fontWeight: '600'
}

DataRow: {
  padding: 16px 12px,
  borderBottom: '1px solid #E0E0E0',
  fontSize: 15px
}

DataRow (alternate): {
  backgroundColor: '#F8F9FA'
}

HighlightColumn: {
  backgroundColor: '#FFF9E6', // Light gold
  fontWeight: '600'
}
```

### 4. Progress Indicator (3-step)

```css
Container: {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 24px
}

Step (completed): {
  width: 32px,
  height: 32px,
  borderRadius: '50%',
  backgroundColor: '#FDB813',
  color: '#2E1A47',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 16px,
  fontWeight: '700'
}

Step (current): {
  width: 36px,
  height: 36px,
  backgroundColor: '#FDB813',
  scale: 1.1,
  shadow: '0 0 0 4px rgba(253,184,19,0.2)'
}

Step (pending): {
  backgroundColor: '#E0E0E0',
  color: '#9E9E9E'
}

Connector (completed): {
  width: 60px,
  height: 4px,
  backgroundColor: '#FDB813'
}

Connector (pending): {
  backgroundColor: '#E0E0E0'
}

Label: {
  fontSize: 12px,
  color: '#4A4A4A',
  textAlign: 'center',
  marginTop: 8px
}
```

---

## 📱 Deep Link Strategy

### Deep Link URLs

```
User App:
lifestyle://social-insurance?source=user

Driver App:
lifestyle://social-insurance?source=driver

Merchant App:
lifestyle://social-insurance?source=merchant

With Campaign:
lifestyle://social-insurance?source=driver&campaign=phao-cuu-sinh

Direct Calculator:
lifestyle://social-insurance/calculator
```

### Web→App Bridge

```
Web URL: https://lifestyle.vn/bhxh?source=user
↓
If app installed:
  → Open app with deep link
  → Preserve source & campaign params
  
If app not installed:
  → Show download prompt
  → Store intent for post-install deep link
```

---

**Version:** 1.0  
**Last Updated:** Feb 14, 2026  
**Status:** 🟢 Complete Design Ready

**"An tâm hiện tại - Yên tâm tương lai" 🌸🛡️👔**
