# Xác minh Google Search Console - vmd.asia

## Sitemap & Base URL

**Quan trọng:** Sitemap và canonical URLs phải dùng đúng domain. Cấu hình `NEXT_PUBLIC_BASE_URL` trong production:

- **vmd.asia:** `NEXT_PUBLIC_BASE_URL=https://www.vmd.asia` (khớp GSC property)
- Mặc định fallback đã đổi từ lifestyle-app.com sang www.vmd.asia

Sau khi set env và deploy lại, sitemap tại `https://www.vmd.asia/sitemap.xml` sẽ hiển thị URLs đúng.

## Đã triển khai

1. **Meta tag HTML** – Đã thêm trong `app/layout.tsx` (head):
   - Luôn xuất `<meta name="google-site-verification" content="qdc8IG7BnyrvkhGgm1Jh4DDOU6rUhu0WpL8193qvcxM" />`
   - Dùng khi xác minh **URL prefix** (vd: https://vmd.asia hoặc https://www.vmd.asia)

2. **TXT DNS** – Dùng khi xác minh **Domain** (vmd.asia):
   - Thêm bản ghi TXT tại nhà cung cấp DNS:
   - **Giá trị:** `google-site-verification=qdc8IG7BnyrvkhGgm1Jh4DDOU6rUhu0WpL8193qvcxM`

## Chọn đúng phương thức

| Loại property | Phương thức nên dùng |
|---------------|----------------------|
| **Domain** (vmd.asia) | Chỉ TXT DNS |
| **URL prefix** (https://vmd.asia) | Meta tag hoặc HTML file |

## Nếu đã xác minh mục khác trước đây

- Nếu đã xác minh **Domain** (vmd.asia) bằng TXT → toàn bộ domain (www, không www, subdomain) đã được xác minh, không cần xác minh lại.
- Nếu đã xác minh **URL prefix** (vd: https://vmd.asia) → chỉ URL đó được xác minh. https://www.vmd.asia là property khác.
- Có thể dùng property đã xác minh, thêm site map và theo dõi, không cần tạo property mới nếu URL nằm trong property đó.

## Kiểm tra meta tag

Sau khi deploy, mở https://vmd.asia → View Page Source (Ctrl+U) → tìm `google-site-verification`. Nếu thấy là đã cấu hình đúng.

## Gợi ý khi xác minh lỗi

1. **Meta tag không thấy** – Kiểm tra `NEXT_PUBLIC_GOOGLE_VERIFICATION` trong env production đã set chưa. Layout có fallback nên vẫn hoạt động nếu env trống.
2. **Sai URL** – Đảm bảo property trong GSC khớp với URL thật (có/không www, http/https).
3. **Cache** – Thử ẩn danh hoặc đợi vài giờ rồi xác minh lại.
4. **TXT DNS** – Dùng `nslookup -type=TXT vmd.asia` hoặc https://mxtoolbox.com/SuperTool.aspx để kiểm tra TXT đã trỏ đúng chưa.
