# Font Files

Thư mục này dùng để chứa font files tùy chỉnh (.woff2) khi cần self-host thay vì dùng Google Fonts.

**Hiện tại**: Ứng dụng dùng `next/font` với Inter và Be Vietnam Pro từ Google Fonts - được tối ưu tự động khi build.

**Thêm font local** (tùy chọn):
1. Đặt file `.woff2` vào đây (vd: `inter-var-latin.woff2`)
2. Thêm preload trong `app/layout.tsx`:
   ```html
   <link rel="preload" href="/fonts/inter-var-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
   ```
3. Cấu hình `@font-face` trong `styles/globals.css` nếu cần.
