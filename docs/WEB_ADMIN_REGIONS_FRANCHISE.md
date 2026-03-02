# Thiết kế: Quản lý Khu vực Địa lý & Công tác Nhượng quyền

> Tham chiếu: [Hiến pháp Lifestyle](../HIEN_PHAP_LIFESTYLE_SUPERAPP.md) – RBAC scope `region`, `service_type`; Dashboard theo vùng/dịch vụ.

---

## 1. Tổng quan

Web Admin cần công cụ quản trị cho:

1. **Công tác nhượng quyền** – Quản lý đối tác nhượng quyền và vùng phụ trách
2. **Quản lý theo khu vực địa lý** – Chỉ áp dụng cho một số nhóm dịch vụ

### Nhóm dịch vụ CÓ quản lý theo khu vực địa lý

| Nhóm | Dịch vụ | Ghi chú |
|------|---------|---------|
| **Gọi xe** | TRANSPORT | Ride-hailing, đặt xe |
| **Gọi thức ăn, quán ăn** | FOOD | Food delivery, nhà hàng, quán ăn |
| **Bách hóa, siêu thị** | GROCERY | Grocery, supermarket |

### Nhóm KHÔNG quản lý theo khu vực địa lý

- Sản phẩm tài chính (Insurance, Wallet, v.v.)
- Dịch vụ subscription
- Sản phẩm phi vật lý (digital goods)

---

## 2. Mô hình dữ liệu

### 2.1 Enum `region_service_type`

```
TRANSPORT  – Gọi xe
FOOD       – Gọi thức ăn, quán ăn
GROCERY    – Bách hóa, siêu thị
```

### 2.2 Bảng `regions` (core schema)

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| id | UUID | PK |
| code | VARCHAR(50) | Mã vùng (vd: HN, HCM, Q1-HCM) |
| name | VARCHAR(200) | Tên hiển thị |
| level | enum | PROVINCE / DISTRICT / AREA |
| parent_id | UUID? | FK → regions (vùng cha) |
| province | VARCHAR(100)? | Tỉnh/TP |
| city | VARCHAR(100)? | Thành phố |
| district | VARCHAR(100)? | Quận/Huyện |
| is_active | Boolean | Trạng thái hoạt động |
| metadata | JSON | Mở rộng |
| created_at, updated_at | Timestamptz | |

### 2.3 Bảng `region_service_config` (core schema)

Mapping: Vùng nào được phép hoạt động dịch vụ nào.

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| id | UUID | PK |
| region_id | UUID | FK → regions |
| service_type | enum | TRANSPORT / FOOD / GROCERY |
| is_active | Boolean | |
| effective_from | Timestamptz | Thời điểm có hiệu lực |
| effective_to | Timestamptz? | Hết hiệu lực (null = không giới hạn) |
| created_at, updated_at | Timestamptz | |

### 2.4 Bảng `franchise_partners` (core schema)

Đối tác nhượng quyền.

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| id | UUID | PK |
| code | VARCHAR(30) | Mã đối tác |
| name | VARCHAR(200) | Tên |
| contact_email | VARCHAR(255)? | |
| contact_phone | VARCHAR(20)? | |
| status | enum | ACTIVE / INACTIVE / PENDING |
| contract_signed_at | Date? | Ngày ký HĐ |
| contract_expires_at | Date? | Ngày hết HĐ |
| metadata | JSON | |
| created_at, updated_at | Timestamptz | |

### 2.5 Bảng `franchise_regions` (core schema)

Mapping: Đối tác nhượng quyền quản lý vùng nào, dịch vụ gì.

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| id | UUID | PK |
| franchise_partner_id | UUID | FK → franchise_partners |
| region_id | UUID | FK → regions |
| service_type | enum | TRANSPORT / FOOD / GROCERY |
| is_active | Boolean | |
| created_at, updated_at | Timestamptz | |

---

## 3. API (main-api)

### 3.1 Regions

| Method | Path | Mô tả |
|--------|------|-------|
| GET | /regions | Danh sách vùng (filter: level, parent_id, is_active) |
| GET | /regions/:id | Chi tiết vùng + services |
| POST | /regions | Tạo vùng |
| PATCH | /regions/:id | Cập nhật vùng |
| GET | /regions/:id/services | Dịch vụ của vùng |
| POST | /regions/:id/services | Gán dịch vụ cho vùng |
| PATCH | /regions/:id/services/:serviceType | Cập nhật config |

### 3.2 Franchise

| Method | Path | Mô tả |
|--------|------|-------|
| GET | /franchise/partners | Danh sách đối tác |
| GET | /franchise/partners/:id | Chi tiết + vùng phụ trách |
| POST | /franchise/partners | Tạo đối tác |
| PATCH | /franchise/partners/:id | Cập nhật |
| GET | /franchise/partners/:id/regions | Vùng của đối tác |
| POST | /franchise/partners/:id/regions | Gán vùng cho đối tác |

---

## 4. Web Admin

### 4.1 Trang Khu vực (/regions)

- Danh sách vùng (bảng, filter theo level, dịch vụ)
- Tạo/Sửa vùng
- Gán dịch vụ cho vùng (TRANSPORT, FOOD, GROCERY)

### 4.2 Trang Nhượng quyền (/franchise)

- Danh sách đối tác nhượng quyền
- Tạo/Sửa đối tác
- Gán vùng + dịch vụ cho từng đối tác

### 4.3 Sidebar

Thêm nhóm mới:

- **Khu vực & Nhượng quyền**
  - Khu vực (/regions)
  - Nhượng quyền (/franchise)

---

## 5. Áp dụng sau

- Gắn merchants, drivers, bookings với region (khi filter/report)
- Dashboard theo vùng/dịch vụ (đã có trong Hiến pháp)
- RBAC scope `region` – user chỉ xem/sửa vùng được gán
