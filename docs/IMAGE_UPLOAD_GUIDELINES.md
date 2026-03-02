# Image Upload Guidelines for Merchants & Partners

## 📸 **Nguyên tắc hình ảnh**

### **1. Tất cả hình ảnh do đối tác/merchant tải lên**
- ✅ **Quán ăn/Cửa hàng**: Upload ảnh thực tế của mình
- ✅ **Sản phẩm/Món ăn**: Upload ảnh thực tế sản phẩm
- ✅ **Logo**: Upload logo thương hiệu
- ❌ **KHÔNG dùng ảnh stock/generic từ hệ thống**

### **2. Đảm bảo niềm tin & chân thật**
- Ảnh phải chụp thực tế tại cơ sở/sản phẩm của merchant
- Không photoshop quá mức, giữ nguyên bản chất
- Ảnh rõ nét, đẹp nhưng phải trung thực

---

## 🏪 **Food Delivery - Quán ăn/Nhà hàng**

### **Ảnh cần upload:**
1. **Cover Image** (coverImage):
   - Ảnh bìa quán (16:9 ratio)
   - Kích thước: 1200x675px (min)
   - Nội dung: Không gian quán, món ăn nổi bật
   
2. **Logo** (logo):
   - Logo thương hiệu quán
   - Kích thước: 200x200px (vuông)
   - Format: PNG với nền trong suốt (nếu có)

3. **Menu Items** (menu[].image):
   - Ảnh từng món ăn
   - Kích thước: 800x800px (vuông)
   - Chụp món ăn thực tế, góc đẹp

### **Example:**
```typescript
{
  id: 'r1',
  name: 'Phở Hòa Pasteur',
  coverImage: 'https://storage.lifestyle.vn/merchants/pho-hoa/cover.jpg', // ✅ Merchant uploads
  logo: 'https://storage.lifestyle.vn/merchants/pho-hoa/logo.png',        // ✅ Merchant uploads
  menu: [
    {
      id: 'r1m1',
      name: 'Phở bò tái nạm',
      image: 'https://storage.lifestyle.vn/merchants/pho-hoa/pho-bo-tai.jpg', // ✅ Merchant uploads
    }
  ]
}
```

---

## 🛒 **Shopping - Cửa hàng/Sản phẩm**

### **Ảnh cần upload:**
1. **Cover Image** (coverImage):
   - Ảnh bìa cửa hàng
   - Kích thước: 1200x675px (min)
   
2. **Logo** (logo):
   - Logo cửa hàng
   - Kích thước: 200x200px

3. **Product Images** (products[].image):
   - Ảnh sản phẩm
   - Kích thước: 800x800px (vuông)
   - Nền trắng/trung tính

### **Example:**
```typescript
{
  id: 's1',
  name: 'Bách Hóa Xanh - Nguyễn Du',
  coverImage: 'https://storage.lifestyle.vn/shops/bhx-nguyen-du/cover.jpg', // ✅ Shop uploads
  logo: 'https://storage.lifestyle.vn/shops/bhx-nguyen-du/logo.png',        // ✅ Shop uploads
  products: [
    {
      id: 's1p1',
      name: 'Rau muống (bó)',
      image: 'https://storage.lifestyle.vn/shops/bhx-nguyen-du/rau-muong.jpg', // ✅ Shop uploads
    }
  ]
}
```

---

## 🎁 **Rewards - Quà tặng/Sản phẩm đổi điểm**

### **Ảnh cần upload:**
- Upload bởi: **Lifestyle Admin** hoặc **Partner**
- Kích thước: 800x800px (vuông)
- Nền: Trắng/trong suốt

### **Example:**
```typescript
{
  id: 'rsi1',
  name: 'Nón visor MOTIVE',
  image: 'https://storage.lifestyle.vn/rewards/non-visor-motive.jpg', // ✅ Admin uploads
}
```

---

## 👥 **Run Groups - Nhóm chạy**

### **Ảnh cần upload:**
- Upload bởi: **Group Creator**
- Kích thước: 800x600px (landscape)
- Nội dung: Ảnh đại diện nhóm (team photo, logo, etc.)

### **Example:**
```typescript
{
  id: 'g1',
  name: 'Hải Dương Runners',
  image: 'https://storage.lifestyle.vn/groups/hai-duong-runners.jpg', // ✅ Creator uploads
}
```

---

## 🔧 **Technical Implementation**

### **Backend API endpoints:**
```
POST /api/merchants/:merchantId/upload-cover
POST /api/merchants/:merchantId/upload-logo
POST /api/merchants/:merchantId/menu-items/:itemId/upload-image
POST /api/shops/:shopId/products/:productId/upload-image
POST /api/rewards/:rewardId/upload-image
POST /api/groups/:groupId/upload-image
```

### **Storage:**
- **Cloud Storage**: AWS S3, Firebase Storage, hoặc Cloudinary
- **CDN**: CloudFront/Fastly để tối ưu tốc độ
- **Backup**: Tự động backup hàng ngày

### **Image Processing:**
```typescript
// Auto-resize, optimize, WebP conversion
// Max upload: 5MB per image
// Auto-generate thumbnails: 200x200, 400x400, 800x800
```

---

## ✅ **Quality Control**

### **Merchant App - Image Upload Flow:**
1. Merchant chọn ảnh từ gallery/camera
2. Crop/adjust trước khi upload
3. System tự động resize & optimize
4. Preview trước khi publish
5. Admin review (nếu cần) trước khi hiển thị public

### **Rejection Criteria:**
- ❌ Ảnh mờ, chất lượng kém
- ❌ Ảnh chứa watermark của người khác
- ❌ Ảnh không liên quan đến sản phẩm
- ❌ Ảnh vi phạm bản quyền
- ❌ Ảnh chứa nội dung không phù hợp

---

## 📝 **Current Mock Data Status**

⚠️ **Tất cả URL Unsplash trong mockData là PLACEHOLDER cho development**

Khi production:
- ✅ Merchants upload qua Merchant App
- ✅ Images lưu trong cloud storage
- ✅ URLs thực tế: `https://storage.lifestyle.vn/...`
- ✅ Có watermark/branding của Lifestyle (nhẹ, góc ảnh)

---

## 🎯 **Summary**

| Loại | Người Upload | Kích thước | Note |
|------|-------------|------------|------|
| Restaurant Cover | Merchant | 1200x675 | Thực tế quán |
| Restaurant Logo | Merchant | 200x200 | Logo brand |
| Menu Item | Merchant | 800x800 | Ảnh món ăn thật |
| Shop Cover | Merchant | 1200x675 | Thực tế cửa hàng |
| Product Image | Merchant | 800x800 | Ảnh sản phẩm thật |
| Reward Item | Admin/Partner | 800x800 | Sản phẩm đổi điểm |
| Group Image | Creator | 800x600 | Ảnh nhóm |

**Mục tiêu:** Tạo niềm tin cho người dùng bằng ảnh thực tế, chân thật từ đối tác.
