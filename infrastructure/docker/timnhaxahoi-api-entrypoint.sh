#!/bin/sh
# Đọc mật khẩu DB từ Docker secret (một nguồn duy nhất với Postgres), rồi chạy API dưới user nestjs.
set -e
if [ -f /run/secrets/timnhaxahoi_db_password ]; then
  export DATABASE_PASSWORD="$(tr -d '\r\n' </run/secrets/timnhaxahoi_db_password)"
fi
if [ -z "$DATABASE_PASSWORD" ]; then
  echo "timnhaxahoi-api: thiếu DATABASE_PASSWORD. Tạo file infrastructure/docker/secrets/timnhaxahoi_db_password (xem secrets/README.md)." >&2
  exit 1
fi
cd /app/services/timnhaxahoi-service
exec dumb-init -- su-exec nestjs node dist/main.js
