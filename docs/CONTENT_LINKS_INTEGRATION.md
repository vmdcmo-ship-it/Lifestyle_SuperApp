# Tích hợp Trung tâm thông tin với App User / Driver / Merchant

## Tổng quan

Nội dung pháp lý (Điều khoản sử dụng, Chính sách bảo mật, FAQ…) được **quản lý tập trung** tại **Web Admin → Trung tâm thông tin**. Các app (User, Driver, Merchant) **lấy link động** qua API, mở trong WebView – **không cần cập nhật app** khi nội dung thay đổi.

## Luồng hoạt động

```
Web Admin (Trung tâm thông tin)
        │
        ▼
  Main API (legal_documents)
        │
        ├── GET /content/public/links?audience=USER|DRIVER|MERCHANT
        │       → Danh sách { slug, title, url }
        │
        └── GET /content/:slug
                → Nội dung chi tiết (dùng cho Web app)
```

**Web app** (`apps/web`) hiển thị nội dung tại `/content/[slug]`. URL trả về từ API có dạng:
```
{BASE_URL}/content/{slug}?locale=vi
```

## API Public Links

**Endpoint:** `GET /api/v1/content/public/links` (Public, không cần auth)

**Query params:**
| Param    | Bắt buộc | Mô tả                                       |
|----------|----------|---------------------------------------------|
| audience | Có       | `USER` \| `DRIVER` \| `MERCHANT`            |
| locale   | Không    | `vi` (mặc định) \| `en`                     |

**Response:**
```json
{
  "items": [
    {
      "slug": "terms-of-service",
      "title": "Điều khoản dịch vụ & Quyền sử dụng",
      "url": "https://lifestyle-app.com/content/terms-of-service?locale=vi"
    },
    {
      "slug": "privacy-policy",
      "title": "Chính sách bảo mật",
      "url": "https://lifestyle-app.com/content/privacy-policy?locale=vi"
    }
  ]
}
```

Chỉ trả về các văn bản có `targetApps` phù hợp với `audience` (hoặc `ALL`).

## Tích hợp trong App (React Native)

### 1. Gọi API lấy danh sách link

```typescript
const API_BASE = 'https://api.lifestyle-app.com'; // hoặc env

async function fetchContentLinks(audience: 'USER' | 'DRIVER' | 'MERCHANT', locale = 'vi') {
  const res = await fetch(
    `${API_BASE}/api/v1/content/public/links?audience=${audience}&locale=${locale}`
  );
  if (!res.ok) throw new Error('Không tải được danh sách');
  const data = await res.json();
  return data.items as { slug: string; title: string; url: string }[];
}
```

### 2. Hiển thị trong Settings / Cài đặt

```tsx
// Ví dụ: màn hình Cài đặt
const [links, setLinks] = useState<{ slug: string; title: string; url: string }[]>([]);

useEffect(() => {
  fetchContentLinks('DRIVER', 'vi').then(setLinks).catch(console.warn);
}, []);

// Render
{links.map((item) => (
  <TouchableOpacity
    key={item.slug}
    onPress={() => Linking.openURL(item.url)}
    // hoặc mở WebView trong app:
    // onPress={() => navigation.navigate('WebView', { url: item.url, title: item.title })}
  >
    <Text>{item.title}</Text>
  </TouchableOpacity>
))}
```

### 3. Mở trong WebView (tùy chọn)

Dùng `react-native-webview` hoặc `expo-web-browser`:

```tsx
import { WebBrowser } from 'expo-web-browser';

await WebBrowser.openBrowserAsync(item.url, { 
  presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET 
});
```

## Cấu hình `targetApps` tại Web Admin

Khi tạo/sửa văn bản tại **Trung tâm thông tin**, chọn **Đối tượng app hiển thị**:

| Giá trị       | Ý nghĩa                    |
|---------------|-----------------------------|
| Tất cả app    | Hiện ở User, Driver, Merchant |
| Chỉ App User | Chỉ App Hành khách         |
| Chỉ App Tài xế | Chỉ App Driver           |
| Chỉ App Cửa hàng | Chỉ App Merchant       |
| User + Driver | User và Driver            |
| ...           | Kết hợp tùy chọn           |

## Biến môi trường

**Main API** (`services/main-api`):
- `WEB_APP_URL` hoặc `NEXT_PUBLIC_BASE_URL`: URL web app để tạo link (vd: `https://lifestyle-app.com`)

**Mobile app**:
- `API_BASE_URL` hoặc tương đương: Base URL của Main API để gọi `/content/public/links`

## Slug mặc định (Seed)

| Slug              | Tiêu đề                               | targetApps    |
|-------------------|----------------------------------------|---------------|
| privacy-policy    | Chính sách bảo mật                     | ALL           |
| terms-of-service  | Điều khoản dịch vụ & Quyền sử dụng     | USER,DRIVER   |

Có thể thêm slug khác qua Web Admin (vd: `terms-merchant`, `faq`) và gán `targetApps` tương ứng.

---

## Đào tạo & Tin tức (Training & News)

Tương tự, **Đào tạo** và **Tin tức** cũng có API public links:

| Module   | API Links                              | Web viewer URL            |
|----------|----------------------------------------|---------------------------|
| Đào tạo  | GET /api/v1/training/public/links       | /training/[slug]          |
| Tin tức  | GET /api/v1/news/public/links          | /news/[slug]              |

Apps gọi với `?audience=USER|DRIVER|MERCHANT` để lấy danh sách link phù hợp. Quản lý tại Web Admin → Đào tạo, Tin tức.
