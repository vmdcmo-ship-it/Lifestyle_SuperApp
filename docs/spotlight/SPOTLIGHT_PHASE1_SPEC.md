# ĐẶC TẢ CHI TIẾT: LIFESTYLE SPOTLIGHT - PHASE 1

**Phiên bản:** 1.0  
**Ngày:** 2025-02-23  
**Phạm vi:** Feed, Chi tiết, Tạo post, Like/Comment, Link sản phẩm dịch vụ

---

## 1. TỔNG QUAN KỸ THUẬT

### 1.1 Mục tiêu Phase 1
- Web User là nền tảng chính cho Spotlight
- Video chỉ embed từ URL YouTube/Facebook (không upload)
- Đăng xong hiển thị ngay (không duyệt)
- Địa điểm theo đơn vị hành chính Việt Nam
- Link sản phẩm/dịch vụ dưới mỗi video

### 1.2 Các entity hiện có (tái sử dụng)
| Bảng | Mục đích |
|------|----------|
| `Redcomment` | Nội dung spotlight |
| `Creator` | Người đăng |
| `Comment` | Bình luận |
| `cta_buttons` | Link CTA |
| `Region` | Địa điểm hành chính VN |

---

## 2. DATABASE SCHEMA

### 2.1 Thay đổi Redcomment

**Các field cần bổ sung/mở rộng:**

| Field | Type | Mô tả | Migration |
|-------|------|-------|-----------|
| `video_source` | `String?` | `YOUTUBE` \| `FACEBOOK` | ADD |
| `region_ids` | `String[]` | UUID của Region (tỉnh/thành) | ADD |
| `spotlight_category_id` | `UUID?` | FK tới spotlight_category | ADD |
| `cover_image_url` | Hiện có | Có thể để nullable khi dùng thumbnail từ YT/FB | - |

**Logic:**
- `video_url` bắt buộc khi format = VIDEO_REEL (cho Spotlight phase 1)
- Parse `video_url` để detect `video_source`:  
  - `youtube.com`, `youtu.be` → YOUTUBE  
  - `facebook.com`, `fb.watch`, `fb.reel` → FACEBOOK
- `status`: Khi tạo với `video_url` (embed) → set `APPROVED` ngay (không duyệt)
- `region_ids`: Mảng UUID, cho phép 0–5 địa điểm

### 2.2 Bảng mới: spotlight_category

```sql
CREATE TABLE spotlight.spotlight_categories (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug       VARCHAR(100) UNIQUE NOT NULL,
  name       VARCHAR(200) NOT NULL,
  "order"    SMALLINT DEFAULT 0,
  is_active  BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Seed Phase 1:**
| slug | name |
|------|------|
| travel | Du lịch |
| food | Ẩm thực |
| resort | Nghỉ dưỡng |
| experience | Trải nghiệm |
| service_review | Review dịch vụ |
| lifestyle | Phong cách sống |

### 2.3 Bảng mới: redcomment_regions (many-to-many)

```sql
CREATE TABLE spotlight.redcomment_regions (
  redcomment_id UUID NOT NULL REFERENCES spotlight.redcomments(id) ON DELETE CASCADE,
  region_id     UUID NOT NULL REFERENCES core.regions(id) ON DELETE CASCADE,
  PRIMARY KEY (redcomment_id, region_id)
);
CREATE INDEX idx_redcomment_regions_region ON spotlight.redcomment_regions(region_id);
```

### 2.4 Mở rộng cta_buttons

| Field | Type | Mô tả | Migration |
|-------|------|-------|-----------|
| `link_type` | `String?` | `INTERNAL` \| `AFFILIATE` | ADD |
| `price_display` | `String?` | VD: "1.290.000đ" | ADD |
| `internal_product_id` | `UUID?` | ID sản phẩm/voucher trên app (nếu INTERNAL) | ADD |

---

## 3. API SPECIFICATION

### 3.1 Base URL
`/api/v1/spotlight`

### 3.2 Public Endpoints

#### GET /spotlight/feed

**Mô tả:** Danh sách video Spotlight (public feed).

**Query params:**

| Param | Type | Mô tả | Ví dụ |
|-------|------|-------|-------|
| page | number | Trang (default 1) | 1 |
| limit | number | Số item/trang (default 20, max 50) | 20 |
| category | string | Slug thể loại | travel |
| regionId | string | UUID Region (tỉnh/thành) | uuid |
| sort | string | `latest` \| `popular` \| `trending` | latest |

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "redcommentNumber": "LS-RC-000001",
      "title": "Top 5 quán café view đẹp Đà Lạt",
      "description": "...",
      "videoUrl": "https://www.youtube.com/watch?v=xxx",
      "videoSource": "YOUTUBE",
      "thumbnailUrl": "https://img.youtube.com/vi/xxx/maxresdefault.jpg",
      "videoDuration": 120,
      "format": "VIDEO_REEL",
      "targetType": "CAFE",
      "seoSlug": "top-5-quan-cafe-view-dep-da-lat",
      "views": 15200,
      "likes": 890,
      "commentsCount": 45,
      "saves": 120,
      "createdAt": "2025-02-23T10:00:00Z",
      "publishedAt": "2025-02-23T10:00:00Z",
      "creator": {
        "id": "uuid",
        "displayName": "Nguyễn Văn A",
        "avatarUrl": "https://...",
        "isVerified": true
      },
      "regions": [
        { "id": "uuid", "name": "Lâm Đồng", "code": "VN-35" }
      ],
      "category": { "slug": "travel", "name": "Du lịch" },
      "ctaButtons": [
        {
          "id": "uuid",
          "text": "Đặt phòng từ 1.290.000đ",
          "targetUrl": "https://...",
          "linkType": "INTERNAL",
          "priceDisplay": "1.290.000đ",
          "clicks": 120
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "totalPages": 8
  }
}
```

---

#### GET /spotlight/:id

**Mô tả:** Chi tiết 1 video, tăng view count.

**Params:** `id` (UUID)

**Response 200:**
```json
{
  "id": "uuid",
  "redcommentNumber": "LS-RC-000001",
  "title": "Top 5 quán café view đẹp Đà Lạt",
  "description": "Khám phá 5 quán café...",
  "videoUrl": "https://www.youtube.com/watch?v=xxx",
  "videoSource": "YOUTUBE",
  "thumbnailUrl": "https://...",
  "videoDuration": 120,
  "format": "VIDEO_REEL",
  "targetType": "CAFE",
  "targetTags": ["cafe", "dalat", "view"],
  "seoSlug": "top-5-quan-cafe-view-dep-da-lat",
  "views": 15201,
  "likes": 890,
  "commentsCount": 45,
  "saves": 120,
  "createdAt": "2025-02-23T10:00:00Z",
  "creator": {
    "id": "uuid",
    "displayName": "Nguyễn Văn A",
    "avatarUrl": "https://...",
    "isVerified": true,
    "followerCount": 5000
  },
  "regions": [
    { "id": "uuid", "name": "Lâm Đồng", "code": "VN-35" }
  ],
  "category": { "slug": "travel", "name": "Du lịch" },
  "ctaButtons": [
    {
      "id": "uuid",
      "text": "Đặt phòng từ 1.290.000đ",
      "targetUrl": "https://...",
      "linkType": "INTERNAL",
      "priceDisplay": "1.290.000đ",
      "sortOrder": 0
    }
  ],
  "comments": [
    {
      "id": "uuid",
      "body": "Quán đẹp quá!",
      "likes": 5,
      "createdAt": "2025-02-23T11:00:00Z",
      "user": {
        "id": "uuid",
        "firstName": "Trần",
        "lastName": "Thị B",
        "avatarUrl": "https://..."
      }
    }
  ]
}
```

---

#### GET /spotlight/locations

**Mô tả:** Danh sách địa điểm (tỉnh/thành) theo hành chính VN.

**Query params:**

| Param | Type | Mô tả |
|-------|------|-------|
| level | string | `PROVINCE` (default) |
| parentId | string | UUID parent (null = top level) |

**Response 200:**
```json
{
  "data": [
    { "id": "uuid", "code": "VN-79", "name": "Đồng Tháp", "level": "PROVINCE" },
    { "id": "uuid", "code": "VN-35", "name": "Lâm Đồng", "level": "PROVINCE" }
  ]
}
```

*Ghi chú: Có thể gọi `regions` service hoặc proxy qua `/api/v1/regions`.*

---

#### GET /spotlight/categories

**Mô tả:** Danh sách thể loại Spotlight.

**Response 200:**
```json
{
  "data": [
    { "id": "uuid", "slug": "travel", "name": "Du lịch", "order": 1 },
    { "id": "uuid", "slug": "food", "name": "Ẩm thực", "order": 2 }
  ]
}
```

---

### 3.3 Authenticated Endpoints

#### POST /spotlight

**Mô tả:** Tạo post Spotlight mới (video embed).

**Headers:** `Authorization: Bearer <token>`

**Request body:**
```json
{
  "title": "Top 5 quán café view đẹp Đà Lạt",
  "description": "Khám phá 5 quán...",
  "videoUrl": "https://www.youtube.com/watch?v=xxx",
  "format": "VIDEO_REEL",
  "targetType": "CAFE",
  "categorySlug": "travel",
  "regionIds": ["uuid-1", "uuid-2"],
  "tags": ["cafe", "dalat", "review"],
  "videoDuration": 120,
  "ctaLinks": [
    {
      "text": "Đặt phòng từ 1.290.000đ",
      "url": "https://lifestyle.app/voucher/xxx",
      "linkType": "INTERNAL",
      "priceDisplay": "1.290.000đ"
    },
    {
      "text": "Xem tour trên Klook",
      "url": "https://klook.com/...",
      "linkType": "AFFILIATE"
    }
  ]
}
```

**Validation:**
- `title`: required, max 300 ký tự
- `videoUrl`: required, must match `youtube.com`, `youtu.be`, `facebook.com`, `fb.watch`, `fb.reel`, `fb.com`
- `format`: `VIDEO_REEL` (phase 1 chỉ hỗ trợ VIDEO_REEL)
- `targetType`: enum hiện có
- `categorySlug`: optional
- `regionIds`: optional, max 5, phải tồn tại trong Region
- `ctaLinks`: optional, max 5 items
- `videoDuration`: optional, 1–600 (giây)

**Response 201:**
```json
{
  "id": "uuid",
  "redcommentNumber": "LS-RC-000001",
  "seoSlug": "top-5-quan-cafe-view-dep-da-lat",
  "status": "APPROVED",
  "createdAt": "2025-02-23T10:00:00Z"
}
```

**Logic:**
- Tạo Creator nếu user chưa có
- Parse `video_url` → `video_source`
- Lấy thumbnail từ YouTube oEmbed hoặc Facebook Graph (fallback: placeholder)
- Set `status = APPROVED`, `publishedAt = now()`
- Tạo `cta_buttons` từ `ctaLinks`
- Ghi `redcomment_regions` từ `regionIds`

---

#### POST /spotlight/:id/like

**Mô tả:** Like/unlike (toggle).

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "liked": true,
  "likesCount": 891
}
```

*Ghi chú: Cần bảng `redcomment_likes` (userId, redcommentId) để toggle. Nếu chưa có thì Phase 1 có thể chỉ increment `likes` (không hỗ trợ unlike).*

---

#### GET /spotlight/:id/comments

**Mô tả:** Danh sách comment.

**Query params:** `page`, `limit`

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "body": "Quán đẹp quá!",
      "likes": 5,
      "createdAt": "2025-02-23T11:00:00Z",
      "user": {
        "id": "uuid",
        "firstName": "Trần",
        "lastName": "Thị B",
        "avatarUrl": "https://..."
      }
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 45, "totalPages": 3 }
}
```

---

#### POST /spotlight/:id/comments

**Mô tả:** Thêm comment.

**Headers:** `Authorization: Bearer <token>`

**Request body:**
```json
{
  "content": "Quán đẹp quá!",
  "parentId": null
}
```

**Validation:**
- `content`: required, max 1000 ký tự
- `parentId`: optional (reply)

**Response 201:**
```json
{
  "id": "uuid",
  "body": "Quán đẹp quá!",
  "likes": 0,
  "createdAt": "2025-02-23T11:00:00Z",
  "user": {
    "id": "uuid",
    "firstName": "Trần",
    "lastName": "Thị B",
    "avatarUrl": "https://..."
  }
}
```

---

#### POST /spotlight/:id/link-click

**Mô tả:** Ghi log click CTA (tracking).

**Request body:**
```json
{
  "ctaButtonId": "uuid"
}
```

**Headers:** Optional `Authorization` (nếu có user thì ghi userId).

**Response 200:**
```json
{ "ok": true }
```

**Logic:**
- Increment `cta_buttons.clicks`
- Ghi vào bảng `link_click_log` (phase 2) hoặc dùng `clicks` trong `cta_buttons`

---

### 3.4 Parse URL Video

**YouTube:**
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`

**Facebook:**
- `https://www.facebook.com/watch?v=xxx`
- `https://fb.watch/xxx`
- `https://www.facebook.com/reel/xxx`

**Thumbnail:**
- YouTube: `https://img.youtube.com/vi/{VIDEO_ID}/maxresdefault.jpg` (fallback: `hqdefault.jpg`)
- Facebook: Gọi Graph API `https://graph.facebook.com/v18.0/oembed_video?url=...` hoặc dùng placeholder

---

## 4. DTO & VALIDATION

### 4.1 CreateSpotlightPostDto

```typescript
export class CreateSpotlightPostDto {
  @IsString()
  @MaxLength(300)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsUrl()
  @Matches(/^(https:\/\/)?(www\.)?(youtube\.com|youtu\.be|facebook\.com|fb\.watch|fb\.com)\/.+/)
  videoUrl: string;

  @IsEnum(['VIDEO_REEL'])
  format: 'VIDEO_REEL';

  @IsEnum(TargetTypeDto)
  targetType: TargetTypeDto;

  @IsOptional()
  @IsString()
  categorySlug?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMaxSize(5)
  regionIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(600)
  videoDuration?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CtaLinkDto)
  @ArrayMaxSize(5)
  ctaLinks?: CtaLinkDto[];
}

export class CtaLinkDto {
  @IsString()
  @MaxLength(100)
  text: string;

  @IsUrl()
  url: string;

  @IsOptional()
  @IsEnum(['INTERNAL', 'AFFILIATE'])
  linkType?: 'INTERNAL' | 'AFFILIATE';

  @IsOptional()
  @IsString()
  @MaxLength(50)
  priceDisplay?: string;

  @IsOptional()
  @IsUUID()
  internalProductId?: string;
}
```

---

## 5. REGION / ĐỊA ĐIỂM

### 5.1 Chuẩn hành chính VN

Sử dụng bảng `Region` với:
- `level`: PROVINCE (tỉnh/thành), DISTRICT (quận/huyện), AREA
- `code`: Mã chuẩn (VD: VN-79 cho Đồng Tháp)
- `parent_id`: Liên kết cấp cha

### 5.2 Seed 63 tỉnh/thành

Tạo migration/seed với danh sách 63 tỉnh/thành theo [Tổng cục Thống kê](https://www.gso.gov.vn/dan-so/) hoặc nguồn chuẩn Bộ Nội vụ.

---

## 6. ERROR CODES

| HTTP | Code | Mô tả |
|------|------|-------|
| 400 | INVALID_VIDEO_URL | URL không phải YouTube/Facebook |
| 400 | VALIDATION_ERROR | Lỗi validate body |
| 401 | UNAUTHORIZED | Chưa đăng nhập |
| 403 | CREATOR_REQUIRED | User chưa đăng ký Creator |
| 404 | REDCOMMENT_NOT_FOUND | Không tìm thấy |
| 404 | REGION_NOT_FOUND | Region không tồn tại |

---

## 7. THỨ TỰ TRIỂN KHAI ĐỀ XUẤT

1. **Migration Prisma:** Thêm `video_source`, `spotlight_category`, `redcomment_regions`, mở rộng `cta_buttons`
2. **Seed:** spotlight_category, 63 tỉnh/thành (nếu Region chưa có)
3. **Spotlight Service:** Refactor create để nhận `videoUrl`, parse, set APPROVED
4. **Spotlight Controller:** Thêm query `regionId`, `category`, `sort` cho feed
5. **Endpoint link-click:** Tạo mới
6. **Web:** Trang chủ Feed, Chi tiết, Form tạo post

---

## 8. PHỤ LỤC

### A. Embed YouTube

```html
<iframe
  width="100%"
  height="400"
  src="https://www.youtube.com/embed/VIDEO_ID"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
></iframe>
```

### B. Embed Facebook

```html
<iframe
  src="https://www.facebook.com/plugins/video.php?href=URL_ENCODED&show_text=false"
  width="100%"
  height="400"
  style="border:none;overflow:hidden"
  scrolling="no"
  frameborder="0"
  allowfullscreen="true"
></iframe>
```

---

*Tài liệu này là baseline cho Phase 1. Các phase sau có thể bổ sung: save, share tracking, reply comment, analytics dashboard.*
