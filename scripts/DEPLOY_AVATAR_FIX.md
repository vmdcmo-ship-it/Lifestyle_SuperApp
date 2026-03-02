# Deploy fix avatar

## Cách đơn giản — Chỉ 1 lệnh (chạy trên Windows PowerShell)

```
cd C:\Users\nguye\Lifestyle_SuperApp
.\scripts\deploy-avatar-fix.ps1
```

Script sẽ tự:
1. Copy 2 file lên VPS (nhập mật khẩu 2 lần)
2. SSH vào VPS và chạy build + restart (nhập mật khẩu 1 lần)

Chờ xong → Reload Expo Go (r) → Thử upload avatar.

---

## Lưu ý quan trọng

- **Tất cả lệnh chạy trên máy Windows** (PowerShell). Script dùng SSH để chạy lệnh trên VPS tự động.
- **KHÔNG tự chạy** `cd /opt/lifestyle-superapp` trên Windows — đường dẫn `/opt/...` chỉ có trên Linux (VPS).
