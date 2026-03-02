# ✅ Hệ thống Đăng ký & Đăng nhập - Hoàn chỉnh

> **Tham khảo**: Grab, Xanh SM, Be, Gojek
> **Ngày cập nhật**: 14/02/2026

---

## 📋 Tổng quan

Hệ thống đăng ký/đăng nhập cho 2 loại người dùng:
1. **Member** (Người dùng thường) - Đơn giản, nhanh chóng
2. **Driver Partner** (Tài xế đối tác) - Đầy đủ, bảo mật cao

---

## 👤 1. ĐĂNG KÝ MEMBER (Người dùng)

### 1.1. Thông tin bắt buộc

```typescript
interface MemberRegistration {
  // Thông tin cơ bản
  firstName: string;           // Họ
  lastName: string;            // Tên
  phoneNumber: string;         // SĐT (bắt buộc)
  email: string;               // Email (bắt buộc)
  password: string;            // Mật khẩu (min 8 ký tự)
  
  // Tùy chọn
  dateOfBirth?: Date;          // Ngày sinh
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  referralCode?: string;       // Mã giới thiệu
  
  // Đồng ý điều khoản
  agreedToTerms: boolean;      // Bắt buộc
  agreedToPrivacy: boolean;    // Bắt buộc
}
```

### 1.2. Phương thức đăng ký

#### A. Đăng ký Email/SĐT (Traditional)
```
1. Nhập thông tin cơ bản
2. Xác thực OTP qua SĐT
3. Tạo mật khẩu
4. Hoàn tất → eKYC Level 1
```

#### B. Đăng ký nhanh (Social Login)
```
Cho phép:
- Google OAuth 2.0
- Facebook Login

Flow:
1. Click "Đăng nhập với Google/Facebook"
2. Cấp quyền OAuth
3. Hệ thống tự động lấy: email, tên, ảnh
4. Yêu cầu bổ sung SĐT (bắt buộc)
5. Xác thực OTP SĐT
6. Hoàn tất → eKYC Level 1
```

### 1.3. Xác thực (Verification)

```
Level 0: Chưa xác thực
└─> Đăng ký tài khoản

Level 1: Xác thực OTP
└─> Xác thực SĐT qua OTP
└─> Có thể dùng dịch vụ cơ bản

Level 2: eKYC - CCCD + Sinh trắc học ⭐
└─> Tải CCCD (mặt trước + sau)
└─> Chụp ảnh khuôn mặt
└─> AI xác thực: So khớp ảnh CCCD vs khuôn mặt
└─> Mở khóa: Ví Lifestyle, Giao dịch lớn

Level 3: Xác thực ngân hàng
└─> Liên kết tài khoản ngân hàng
└─> Mở khóa: Vay, Đầu tư
```

---

## 🚗 2. ĐĂNG KÝ DRIVER PARTNER (Tài xế)

### 2.1. Yêu cầu bảo mật cao

**Lý do**: Đảm bảo an toàn khách hàng, tuân thủ pháp luật

### 2.2. Thông tin bắt buộc đầy đủ

#### A. THÔNG TIN CÁ NHÂN
```typescript
{
  // Cơ bản
  fullName: string;              // Họ tên đầy đủ
  phoneNumber: string;           // SĐT (bắt buộc)
  email: string;                 // Email
  dateOfBirth: Date;             // Ngày sinh
  address: string;               // Địa chỉ thường trú
}
```

#### B. CCCD & ĐỊNH DANH ĐIỆN TỬ ⭐
```typescript
{
  // Căn cước công dân (bắt buộc)
  citizenId: string;             // Số CCCD (12 số)
  citizenIdIssueDate: Date;      // Ngày cấp
  citizenIdIssuePlace: string;   // Nơi cấp
  citizenIdExpiry?: Date;        // Ngày hết hạn (nếu có)
  citizenIdFrontImage: File;     // Ảnh mặt trước CCCD
  citizenIdBackImage: File;      // Ảnh mặt sau CCCD
  faceImage: File;               // Ảnh khuôn mặt (sinh trắc học)
  
  // eKYC Level 2 - BẮT BUỘC cho Driver
  ekycLevel: EKYCLevel.LEVEL_2;
}
```

**Quy trình xác thực:**
1. Upload ảnh CCCD (mặt trước + sau)
2. Chụp ảnh khuôn mặt
3. AI OCR: Trích xuất thông tin từ CCCD
4. AI Face Match: So khớp khuôn mặt vs ảnh CCCD
5. Kiểm tra CCCD hợp lệ qua cơ sở dữ liệu Bộ Công An
6. ✅ Xác thực thành công → eKYC Level 2

#### C. GIẤY PHÉP LÁI XE
```typescript
{
  driverLicenseNumber: string;     // Số GPLX
  driverLicenseClass: string;      // Hạng: A1, A2, B1, B2, C, D, E, F
  driverLicenseIssueDate: Date;    // Ngày cấp
  driverLicenseExpiry: Date;       // Ngày hết hạn
  driverLicenseImage: File;        // Ảnh GPLX
}
```

**Lưu ý:**
- Xe máy: Hạng A1, A2
- Ô tô 4 chỗ: Hạng B1, B2
- Ô tô 7 chỗ: Hạng B2, C
- Kiểm tra hạng GPLX phù hợp với loại xe đăng ký

#### D. LÝ LỊCH TƯ PHÁP (Mẫu số 2) ⭐
```typescript
{
  criminalRecordNumber: string;      // Số giấy tờ
  criminalRecordIssueDate: Date;     // Ngày cấp
  criminalRecordImage: File;         // Ảnh lý lịch tư pháp
}
```

**Yêu cầu:**
- Lý lịch tư pháp theo mẫu số 2
- Còn hiệu lực (trong 6 tháng)
- Không có tiền án, tiền sự về các tội:
  - Giết người, cướp, trộm cắp
  - Ma túy
  - Giao thông nghiêm trọng

#### E. THÔNG TIN PHƯƠNG TIỆN ⭐

```typescript
{
  // Thông tin xe
  vehicleType: VehicleType;          // BIKE, CAR_4_SEATS, CAR_7_SEATS, TRUCK
  licensePlate: string;              // Biển số xe (bắt buộc)
  brand: string;                     // Hãng xe (Honda, Toyota, ...)
  model: string;                     // Dòng xe (Wave, Vios, ...)
  year: number;                      // Năm sản xuất
  color: string;                     // Màu sắc
  
  // Hình ảnh phương tiện (BẮT BUỘC 5 ảnh) ⭐
  vehicleFrontImage: File;           // Góc trước (phải thấy rõ biển số)
  vehicleBackImage: File;            // Góc sau
  vehicleLeftImage: File;            // Góc trái
  vehicleRightImage: File;           // Góc phải
  licensePlateCloseupImage: File;    // Ảnh cận cảnh biển số
  
  // Đăng ký xe
  registrationNumber: string;        // Số đăng ký xe
  registrationIssueDate: Date;       // Ngày cấp
  registrationExpiry: Date;          // Ngày hết hạn
  registrationImage: File;           // Ảnh đăng ký xe (giấy đăng kiểm)
}
```

**Yêu cầu hình ảnh:**
- Độ phân giải: Tối thiểu 1280x720px
- Format: JPG, PNG (< 5MB/ảnh)
- Ánh sáng tốt, rõ nét
- **Biển số xe phải rõ ràng** (góc trước + ảnh cận cảnh)
- Không chỉnh sửa, không filter

#### F. BẢO HIỂM TNDS ⭐

```typescript
{
  insuranceNumber: string;           // Số hợp đồng bảo hiểm
  insuranceProvider: string;         // Nhà cung cấp (Bảo Việt, PVI, ...)
  insuranceIssueDate: Date;          // Ngày có hiệu lực
  insuranceExpiry: Date;             // Ngày hết hạn
  insuranceImage: File;              // Ảnh giấy bảo hiểm
}
```

**Yêu cầu:**
- Bảo hiểm TNDS (Trách nhiệm dân sự) bắt buộc
- Còn hiệu lực (chưa hết hạn)
- Mức bảo hiểm tối thiểu theo quy định pháp luật
- Phương tiện trong hợp đồng khớp với biển số đăng ký

#### G. TÀI KHOẢN NGÂN HÀNG

```typescript
{
  accountHolderName: string;         // Tên chủ tài khoản
  accountNumber: string;             // Số tài khoản
  bankName: string;                  // Tên ngân hàng
  bankCode: string;                  // Mã ngân hàng (SWIFT/BIC)
  branchName: string;                // Chi nhánh
}
```

**Lưu ý:**
- Tên chủ TK phải trùng với tên trên CCCD
- Hỗ trợ tất cả ngân hàng Việt Nam
- Dùng để nhận thanh toán thu nhập

### 2.3. Quy trình đăng ký Driver

```
Bước 1: Thông tin cá nhân
├─> Họ tên, SĐT, Email, Địa chỉ
└─> Tạo mật khẩu

Bước 2: CCCD & eKYC Level 2 ⭐
├─> Upload CCCD (trước + sau)
├─> Chụp ảnh khuôn mặt
├─> AI xác thực (OCR + Face Match)
└─> ✅ eKYC Level 2

Bước 3: Giấy phép lái xe
├─> Nhập số GPLX, hạng, ngày hết hạn
└─> Upload ảnh GPLX

Bước 4: Lý lịch tư pháp
├─> Upload lý lịch tư pháp mẫu số 2
└─> Kiểm tra còn hiệu lực

Bước 5: Thông tin phương tiện
├─> Chọn loại xe
├─> Nhập thông tin: biển số, hãng, màu
├─> Upload 5 ảnh xe (4 góc + cận cảnh biển số)
├─> Upload đăng ký xe
└─> Upload bảo hiểm TNDS

Bước 6: Tài khoản ngân hàng
├─> Nhập thông tin TK ngân hàng
└─> Xác thực (chuyển 1đ test)

Bước 7: Xác nhận
├─> Đồng ý điều khoản đối tác
├─> Đồng ý chính sách bảo mật
└─> Gửi hồ sơ

Bước 8: Xét duyệt (1-3 ngày làm việc)
├─> Admin kiểm tra hồ sơ
├─> Gọi điện xác thực
├─> Kiểm tra lý lịch
└─> ✅ Phê duyệt / ❌ Từ chối (kèm lý do)

Bước 9: Kích hoạt
└─> ✅ Tài khoản driver được kích hoạt
```

---

## 🔐 3. ĐĂNG NHẬP

### 3.1. Phương thức đăng nhập

#### A. Email/SĐT + Mật khẩu
```typescript
{
  emailOrPhone: string;    // Email hoặc SĐT
  password: string;        // Mật khẩu
  rememberMe?: boolean;    // Ghi nhớ đăng nhập
}
```

#### B. Social Login (Member only)
```
- Google OAuth 2.0
- Facebook Login

Lưu ý: 
- Chỉ áp dụng cho Member
- Driver phải dùng Email/SĐT + Password
```

#### C. OTP (Quên mật khẩu)
```
1. Nhập SĐT/Email
2. Gửi mã OTP
3. Nhập OTP
4. Đặt lại mật khẩu mới
```

### 3.2. Bảo mật

```typescript
// JWT Token
{
  accessToken: string;     // Hết hạn sau 15 phút
  refreshToken: string;    // Hết hạn sau 30 ngày
  expiresIn: number;       // Timestamp
}

// Refresh Token
// - Tự động gia hạn khi accessToken hết hạn
// - Lưu trong httpOnly cookie

// Rate Limiting
// - Tối đa 5 lần đăng nhập sai / 15 phút
// - Khóa tài khoản 30 phút sau 10 lần sai
```

---

## 📱 4. FLOW UI/UX

### 4.1. Member Registration Flow

```
Trang đăng ký
┌─────────────────────────────────┐
│  Đăng ký tài khoản Lifestyle    │
│                                 │
│  [Đăng ký với Google]  🔴       │
│  [Đăng ký với Facebook] 🔵      │
│                                 │
│  ──── hoặc ────                 │
│                                 │
│  Họ: [_______]  Tên: [_______] │
│  Email: [___________________]   │
│  SĐT: [____________________]    │
│  Mật khẩu: [_______________]    │
│                                 │
│  ☑ Tôi đồng ý với Điều khoản   │
│  ☑ Tôi đồng ý với Chính sách   │
│                                 │
│  [Đăng ký ngay]                 │
│                                 │
│  Đã có tài khoản? Đăng nhập     │
└─────────────────────────────────┘
```

### 4.2. Driver Registration Flow

```
Đăng ký đối tác tài xế
┌─────────────────────────────────┐
│  📝 Bước 1/8: Thông tin cá nhân │
│                                 │
│  Họ tên: [__________________]   │
│  SĐT: [_____________________]   │
│  Email: [___________________]   │
│  Ngày sinh: [DD/MM/YYYY]        │
│  Địa chỉ: [_________________]   │
│                                 │
│  [Tiếp theo >]                  │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  📷 Bước 2/8: CCCD & eKYC       │
│                                 │
│  Số CCCD: [____________]        │
│  Ngày cấp: [DD/MM/YYYY]         │
│  Nơi cấp: [_____________]       │
│                                 │
│  [📸 Chụp mặt trước CCCD]       │
│  [📸 Chụp mặt sau CCCD]         │
│  [📸 Chụp khuôn mặt]            │
│                                 │
│  ℹ️ Đảm bảo ảnh rõ nét, không   │
│     bị mờ hay chói sáng         │
│                                 │
│  [< Quay lại] [Tiếp theo >]    │
└─────────────────────────────────┘

... (7 bước tiếp theo)
```

---

## 🎨 5. VALIDATION RULES

### 5.1. Member

```typescript
{
  firstName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-ZÀ-ỹ\s]+$/
  },
  lastName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-ZÀ-ỹ\s]+$/
  },
  phoneNumber: {
    required: true,
    pattern: /^(0|\+84)[3-9][0-9]{8}$/  // VN phone format
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    required: true,
    minLength: 8,
    mustContain: ['uppercase', 'lowercase', 'number']
  }
}
```

### 5.2. Driver

```typescript
{
  citizenId: {
    required: true,
    pattern: /^[0-9]{12}$/,  // 12 chữ số
    customValidation: 'checkWithMoHA'  // Kiểm tra với Bộ Công An
  },
  driverLicenseNumber: {
    required: true,
    pattern: /^[0-9]{12}$/
  },
  licensePlate: {
    required: true,
    pattern: /^[0-9]{2}[A-Z]{1,2}-[0-9]{4,5}$/  // Format: 29A-12345
  },
  insuranceNumber: {
    required: true,
    customValidation: 'checkInsuranceValid'
  },
  accountNumber: {
    required: true,
    pattern: /^[0-9]{9,14}$/,
    customValidation: 'testBankTransfer'  // Chuyển 1đ test
  }
}
```

---

## 🔧 6. API ENDPOINTS

### 6.1. Member APIs

```typescript
// Đăng ký
POST /api/auth/register/member
Body: RegisterData
Response: { user, accessToken, refreshToken }

// Social Login
POST /api/auth/social/google
Body: { googleToken }
Response: { user, accessToken, refreshToken }

POST /api/auth/social/facebook
Body: { facebookToken }
Response: { user, accessToken, refreshToken }

// Đăng nhập
POST /api/auth/login
Body: { emailOrPhone, password }
Response: { user, accessToken, refreshToken }

// OTP
POST /api/auth/send-otp
Body: { phoneNumber }
Response: { success: true }

POST /api/auth/verify-otp
Body: { phoneNumber, otp }
Response: { success: true }
```

### 6.2. Driver APIs

```typescript
// Đăng ký Driver
POST /api/auth/register/driver
Body: DriverRegistrationRequest (multipart/form-data)
Response: { driverId, status: 'PENDING_VERIFICATION' }

// Upload documents
POST /api/driver/documents/upload
Body: FormData (files)
Response: { documentId, url }

// Check verification status
GET /api/driver/verification/status
Response: { status, approvedDocs, pendingDocs, rejectedDocs }
```

---

## 📊 7. DATABASE SCHEMA

### 7.1. Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(20) UNIQUE,
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  date_of_birth DATE,
  gender VARCHAR(10),
  role VARCHAR(50) NOT NULL,
  ekyc_level VARCHAR(20) DEFAULT 'LEVEL_0',
  is_email_verified BOOLEAN DEFAULT FALSE,
  is_phone_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 7.2. Driver Identity Table
```sql
CREATE TABLE driver_identities (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  citizen_id VARCHAR(12) UNIQUE NOT NULL,
  citizen_id_issue_date DATE NOT NULL,
  citizen_id_issue_place VARCHAR(255),
  citizen_id_front_image TEXT,
  citizen_id_back_image TEXT,
  face_image TEXT,
  ekyc_level VARCHAR(20),
  driver_license_number VARCHAR(12) NOT NULL,
  driver_license_class VARCHAR(10),
  driver_license_expiry DATE,
  driver_license_image TEXT,
  criminal_record_number VARCHAR(50),
  criminal_record_image TEXT,
  verification_status VARCHAR(20) DEFAULT 'PENDING',
  verified_at TIMESTAMP,
  verified_by UUID,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 7.3. Vehicles Table
```sql
CREATE TABLE vehicles (
  id UUID PRIMARY KEY,
  driver_id UUID REFERENCES users(id),
  vehicle_type VARCHAR(20),
  license_plate VARCHAR(20) UNIQUE NOT NULL,
  brand VARCHAR(100),
  model VARCHAR(100),
  year INTEGER,
  color VARCHAR(50),
  vehicle_front_image TEXT,
  vehicle_back_image TEXT,
  vehicle_left_image TEXT,
  vehicle_right_image TEXT,
  license_plate_closeup_image TEXT,
  registration_number VARCHAR(50),
  registration_expiry DATE,
  registration_image TEXT,
  insurance_number VARCHAR(100),
  insurance_provider VARCHAR(100),
  insurance_expiry DATE,
  insurance_image TEXT,
  verification_status VARCHAR(20) DEFAULT 'PENDING',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## ✅ CHECKLIST IMPLEMENTATION

### Phase 1: Types & Validation ✅
- [x] Update User types với eKYC, VerificationStatus
- [x] Create Driver types (Identity, Vehicle, BankAccount)
- [x] Create validation schemas (Zod)
- [x] Export types từ @lifestyle/types

### Phase 2: Member Registration (TO DO)
- [ ] Create `/signup/member` page
- [ ] Implement Member registration form
- [ ] Add Google OAuth integration
- [ ] Add Facebook Login integration
- [ ] OTP verification flow
- [ ] Form validation với Zod

### Phase 3: Driver Registration (TO DO)
- [ ] Create `/signup/driver` page
- [ ] Multi-step wizard (8 steps)
- [ ] File upload component
- [ ] Image preview & crop
- [ ] eKYC integration (OCR + Face Match)
- [ ] Progress indicator
- [ ] Auto-save drafts

### Phase 4: Login (TO DO)
- [ ] Update `/login` page
- [ ] Add social login buttons
- [ ] Remember me functionality
- [ ] Forgot password flow
- [ ] OTP login

### Phase 5: Backend APIs (TO DO)
- [ ] POST /api/auth/register/member
- [ ] POST /api/auth/register/driver
- [ ] POST /api/auth/login
- [ ] POST /api/auth/social/*
- [ ] POST /api/driver/documents/upload
- [ ] Integration với OCR service
- [ ] Integration với Face recognition

### Phase 6: Admin Panel (TO DO)
- [ ] Driver verification dashboard
- [ ] Document review UI
- [ ] Approve/Reject flows
- [ ] Notification system

---

## 📞 SUPPORT & CONTACT

**Cho Member:**
- Hotline: 1900-xxx-xxx
- Email: support@lifestyle.vn
- Chat: In-app 24/7

**Cho Driver:**
- Hotline Driver: 1900-yyy-yyy
- Email: driver-support@lifestyle.vn
- Telegram: @LifestyleDriverSupport
- Zalo OA: Lifestyle Driver

---

**Document Version**: 1.0
**Last Updated**: 14/02/2026
**Status**: ✅ Types Complete | 🚧 Forms In Progress
