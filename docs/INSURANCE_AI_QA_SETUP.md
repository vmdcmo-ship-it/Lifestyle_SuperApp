# Thiết lập AI Hỏi đáp Bảo hiểm

## Mục đích

Đảm bảo AI trả lời **chính xác** cho sản phẩm bảo hiểm cụ thể, **không suy diễn** thông tin hợp đồng có thể gây sai lệch.

## Cơ chế hoạt động

1. **RAG (Retrieval Augmented Generation)**: AI chỉ trả lời dựa trên dữ liệu sản phẩm được cung cấp.
2. **Nguồn dữ liệu**: Lấy từ API `GET /api/v1/insurance/products` (main-api).
3. **Quy tắc nghiêm ngặt**:
   - Nếu câu hỏi không có trong context → AI trả lời "Tôi không tìm thấy thông tin chính xác..."
   - Luôn trích dẫn nguồn (tên sản phẩm, nhà cung cấp).
   - Temperature thấp (0.2) để giảm hallucination.

## Cung cấp dữ liệu sản phẩm (DN Bảo hiểm)

### Cách 1: Qua API main-api (hiện tại)

Sản phẩm bảo hiểm được lưu trong bảng `insurance_products` (schema `insurance`). Các trường quan trọng:

| Trường | Mô tả | Dùng cho AI |
|--------|-------|-------------|
| `productCode` | Mã sản phẩm | Có |
| `name` | Tên sản phẩm | Có |
| `type` | HEALTH, LIFE, VEHICLE, ... | Có |
| `provider` | Nhà cung cấp | Có |
| `description` | Mô tả chi tiết | Có |
| `coverageDetails` | JSON quyền lợi, điều khoản | Có |
| `premiumMonthly`, `premiumYearly` | Phí | Có |
| `coverageAmount` | Số tiền bảo hiểm | Có |
| `termMonths` | Thời hạn (tháng) | Có |
| `minAge`, `maxAge` | Độ tuổi áp dụng | Có |

**Cách thêm/sửa**: Qua Web Admin hoặc seed/migration vào PostgreSQL.

### Cách 2: Mở rộng – Tài liệu PDF/Word từ DN

Để bổ sung mô tả chi tiết, điều khoản, FAQ từ DN bảo hiểm:

1. Tạo bảng `insurance_product_documents` với: `productId`, `documentUrl`, `content` (text đã extract).
2. Trong API insurance-qa: fetch cả products + documents, nối vào context.
3. Hoặc dùng vector DB (Pinecone, pgvector) để semantic search trước khi gọi LLM.

### Cấu trúc `coverageDetails` (khuyến nghị)

DN bảo hiểm nên cung cấp JSON rõ ràng, ví dụ:

```json
{
  "quyen_loi_chinh": [
    "Bảo hiểm tử vong: 500 triệu VND",
    "Bảo hiểm thương tật toàn bộ vĩnh viễn: 500 triệu",
    "Bảo hiểm bệnh hiểm nghèo: 200 triệu"
  ],
  "dieu_khoan_loai_tru": [
    "Tự tử trong 2 năm đầu",
    "Bệnh có sẵn trước khi mua"
  ],
  "thoi_gian_cho": "180 ngày với bệnh hiểm nghèo"
}
```

## Kiểm tra

```bash
# Health check API
curl http://localhost:3011/api/wealth/insurance-qa

# Kết quả mong đợi: { "status": "ok", "hasProductData": true/false }
```

## URL

- Trang chat: `/wealth/chat`
- API: `POST /api/wealth/insurance-qa` (body: `{ messages: [...] }`)

## Biến môi trường

- `OPENAI_API_KEY`: Bắt buộc để AI hoạt động.
- `NEXT_PUBLIC_API_URL`: Trỏ tới main-api để lấy danh sách sản phẩm.
