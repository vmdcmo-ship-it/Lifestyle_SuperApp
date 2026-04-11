# File mật khẩu Postgres (`timnhaxahoi_db_password`)

## File này là gì?

Đây là **một file văn bản**, trong đó có **đúng một dòng**: mật khẩu tài khoản Postgres (thường là user `postgres`) mà **cả** container database **và** container API cùng dùng.

- **Không** ghi mật khẩu này vào file `.env` nữa — tránh nhầm hai chỗ khác nhau.
- Nếu mở `nano timnhaxahoi_db_password` mà thấy **trống** (`[ New File ]`): bạn đang tạo file mới — cần **gõ một dòng mật khẩu** rồi lưu (`Ctrl+O`, Enter, `Ctrl+X`), **hoặc** làm bước “Cách nhanh” bên dưới.

---

## Cách nhanh (khuyến nghị)

Trên VPS, vào **đúng thư mục** (cùng cấp với file README này):

```bash
cd infrastructure/docker/secrets
cp timnhaxahoi_db_password.example timnhaxahoi_db_password
nano timnhaxahoi_db_password
```

File mẫu (`timnhaxahoi_db_password.example`) có sẵn chữ **`postgres`** trên một dòng.

- **Nếu bạn trước giờ chưa đổi mật khẩu database** (chỉ chạy theo hướng dẫn mẫu, compose cũ dùng mặc định): **giữ nguyên** dòng `postgres` là đúng trong đa số trường hợp.
- **Nếu bạn đã từng đặt mật khẩu riêng** trong `.env` (ví dụ `TIMNHAXAHOI_DB_PASSWORD=...`) lúc tạo database lần đầu: thay dòng đó bằng **đúng mật khẩu bạn đã đặt** (một dòng, không thêm dòng trống).

Lưu file, thoát nano. Nên giới hạn quyền file:

```bash
chmod 600 timnhaxahoi_db_password
```

---

## Tại sao phải khớp với “lần đầu”?

Postgres lưu mật khẩu **bên trong ổ dữ liệu** (volume Docker) từ **lần chạy đầu tiên**. Đổi chữ trong `.env` sau đó **không** tự đổi mật khẩu đã lưu trong ổ.

Vì vậy nội dung file `timnhaxahoi_db_password` phải **trùng** mật khẩu mà database đang dùng:

| Tình huống | Việc cần làm |
|------------|----------------|
| Chưa bao giờ đổi, làm theo mẫu | Thường ghi **`postgres`** (như file `.example`). |
| Đã đặt mật khẩu riêng, còn nhớ | Ghi **đúng mật khẩu đó** một dòng. |
| Không nhớ mật khẩu | Tìm trong bản sao `.env` cũ / ghi chú; hoặc chỉ còn cách **tạo lại database** (xóa volume — **mất hết dữ liệu** trong DB) rồi đặt mật khẩu mới trong file này. |

---

## Đổi mật khẩu sau này (giữ dữ liệu)

1. Đổi trong Postgres (ví dụ user `postgres`):

   ```bash
   docker compose -f infrastructure/docker/docker-compose.timnhaxahoi.yml exec timnhaxahoi-db \
     psql -U postgres -d timnhaxahoi -c "ALTER USER postgres PASSWORD 'MAT_KHAU_MOI';"
   ```

2. Ghi **cùng** mật khẩu mới vào `timnhaxahoi_db_password` (một dòng).

3. Khởi động lại API:  
   `docker compose ... up -d --force-recreate timnhaxahoi-api`

---

## Không đưa file thật lên git

File `timnhaxahoi_db_password` đã nằm trong `.gitignore`. Chỉ file mẫu và README được commit.
