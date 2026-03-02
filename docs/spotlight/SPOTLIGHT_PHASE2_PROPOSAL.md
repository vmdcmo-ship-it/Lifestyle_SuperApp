# SPOTLIGHT PHASE 2 – Trải nghiệm giữ chân người dùng

**Mục tiêu:** Thu hút và giữ người dùng trên nền tảng như TikTok, Facebook – thông qua trải nghiệm mượt, gây nghiện, và vòng lặp tương tác liên tục.

**Tham chiếu:** Nghiên cứu từ TikTok, Facebook Reels, Instagram Reels, YouTube Shorts.

---

## 1. PHÂN TÍCH CÁC NỀN TẢNG THÀNH CÔNG

### 1.1 TikTok

| Yếu tố | Mô tả |
|--------|-------|
| **Infinite scroll** | Cuộn liên tục, không nhấn "Trang tiếp" |
| **For You Page (FYP)** | Thuật toán gợi ý nội dung phù hợp sở thích |
| **Video-first** | Autoplay (muted), full màn hình, swipe để đổi video |
| **Tương tác nhanh** | Like có animation, double-tap to like |
| **Follow creator** | Theo dõi → nhận video mới trong feed |
| **Share** | Chia sẻ qua Zalo, FB, copy link, embed |
| **Save** | Lưu video vào bộ sưu tập riêng |
| **Comment** | Thảo luận, reply, @mention |
| **Sound/trend** | Hashtag, xu hướng giúp khám phá nội dung |

### 1.2 Facebook / Instagram Reels

| Yếu tố | Mô tả |
|--------|-------|
| **Explore** | Feed khám phá theo sở thích |
| **Save** | Lưu video để xem lại |
| **Share to story** | Chia sẻ lên story |
| **Creator profile** | Trang Creator với danh sách video |
| **Follow** | Theo dõi để cập nhật |
| **Notifications** | Thông báo khi có tương tác hoặc bài mới |

### 1.3 Nguyên tắc chung: Vòng lặp engagement

```
Xem nội dung → Thích/Không thích → Thuật toán điều chỉnh
     ↓
Like / Comment / Save / Share → Tạo cảm xúc → Quay lại
     ↓
Follow Creator → Nhận thông báo → Mở app lại
```

---

## 2. ĐỀ XUẤT PHASE 2 – THEO ƯU TIÊN

### Nhóm A: Giảm ma sát, tăng “flow” (Impact cao, effort vừa)

| # | Tính năng | Mô tả | Lý do |
|---|-----------|-------|-------|
| A1 | **Infinite scroll** | Tự load thêm khi cuộn thay vì phân trang | Giảm click, người dùng cuộn liên tục |
| A2 | **Video hover preview** | Hover vào card → preview video (muted), giống TikTok grid | Tăng hứng thú, thu hút click |
| A3 | **Like với animation** | Animation khi like (heart bung, pulse) | Cảm xúc tốt, tăng thói quen like |
| A4 | **Share button + Copy link** | Nút "Chia sẻ" mở menu: Copy link, Zalo, Facebook | Viral nhanh, tăng reach |

### Nhóm B: Giữ người dùng quay lại

| # | Tính năng | Mô tả | Lý do |
|---|-----------|-------|-------|
| B1 | **Save/Bookmark** | Lưu video vào "Đã lưu", xem lại sau | Nội dung giá trị → người dùng quay lại |
| B2 | **Trang "Video đã lưu"** | `/spotlight/saved` – danh sách video đã save | Giá trị rõ ràng cho người dùng |
| B3 | **Follow Creator** | Theo dõi Creator, có feed "Đang theo dõi" | Gắn bó với Creator → quay lại |
| B4 | **Trang Creator** | `/spotlight/creator/[id]` – profile + danh sách video | Khám phá thêm nội dung từ Creator |

### Nhóm C: Feed thông minh & khám phá

| # | Tính năng | Mô tả | Lý do |
|---|-----------|-------|-------|
| C1 | **Tab "Dành cho bạn" / "Đang theo dõi"** | 2 tab trên feed (nếu đã login) | Tương tự TikTok: FYP vs Following |
| C2 | **Feed "Dành cho bạn"** | Ưu tiên nội dung theo category/tag user từng tương tác | Tăng relevance, tăng thời gian xem |
| C3 | **"Video liên quan"** | Dưới video chi tiết – gợi ý cùng category/region | Giữ người dùng trên trang lâu hơn |
| C4 | **Hashtags clickable** | Click tag → filter feed theo tag | Dễ khám phá theo chủ đề |

### Nhóm D: Thông báo & nhắc nhở

| # | Tính năng | Mô tả | Lý do |
|---|-----------|-------|-------|
| D1 | **Notification khi có comment** | "X đã bình luận video của bạn" | Tạo lý do quay lại |
| D2 | **Notification khi Creator mới đăng** | "Creator Y vừa đăng video mới" (nếu đã follow) | Nhắc người dùng mở app |

---

## 3. ROADMAP TRIỂN KHAI ĐỀ XUẤT

### Phase 2.1 – Engagement cơ bản (2–3 tuần)

1. **Infinite scroll** cho feed  
2. **Save video** – API + UI  
3. **Share** – copy link + Web Share API  
4. **Like animation** – micro-interaction  

### Phase 2.2 – Creator & Follow (2–3 tuần)

5. **Follow Creator** – bảng `creator_follows`  
6. **Trang Creator** `/spotlight/creator/[id]`  
7. **Tab "Đang theo dõi"** trong feed  

### Phase 2.3 – Feed thông minh (2–4 tuần)

8. **Video liên quan** dưới trang chi tiết  
9. **Feed "Dành cho bạn"** – dựa trên lịch sử tương tác  
10. **Hashtags clickable**  

### Phase 2.4 – Notification (1–2 tuần)

11. **Notification** cho comment mới  
12. **Notification** cho video mới từ Creator đang follow  

---

## 4. THAY ĐỔI DATABASE CHO PHASE 2

### 4.1 Bảng `redcomment_saves` (Save)

```sql
CREATE TABLE spotlight.redcomment_saves (
  user_id       UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  redcomment_id UUID NOT NULL REFERENCES spotlight.redcomments(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, redcomment_id)
);
CREATE INDEX idx_redcomment_saves_user ON spotlight.redcomment_saves(user_id);
```

### 4.2 Bảng `creator_follows` (Follow Creator)

```sql
CREATE TABLE spotlight.creator_follows (
  user_id    UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES spotlight.creators(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, creator_id)
);
CREATE INDEX idx_creator_follows_user ON spotlight.creator_follows(user_id);
CREATE INDEX idx_creator_follows_creator ON spotlight.creator_follows(creator_id);
```

### 4.3 Bảng `redcomment_likes` (Like toggle – Optional)

Để hỗ trợ unlike và biết user đã like:

```sql
CREATE TABLE spotlight.redcomment_likes (
  user_id       UUID NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  redcomment_id UUID NOT NULL REFERENCES spotlight.redcomments(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, redcomment_id)
);
```

### 4.4 Bảng `user_interaction_log` (Cho feed "Dành cho bạn")

Lưu tương tác để tính điểm relevance:

```sql
CREATE TABLE spotlight.user_interaction_log (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES core.users(id),
  redcomment_id UUID NOT NULL REFERENCES spotlight.redcomments(id),
  action        VARCHAR(20) NOT NULL, -- VIEW, LIKE, SAVE, SHARE, COMMENT
  created_at    TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_interaction_log_user ON spotlight.user_interaction_log(user_id);
```

---

## 5. API BỔ SUNG PHASE 2

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/spotlight/:id/save` | Lưu video (auth) |
| DELETE | `/spotlight/:id/save` | Bỏ lưu |
| GET | `/spotlight/saved` | Danh sách video đã lưu |
| POST | `/spotlight/creator/:id/follow` | Theo dõi Creator |
| DELETE | `/spotlight/creator/:id/follow` | Bỏ theo dõi |
| GET | `/spotlight/creator/:id` | Trang Creator + video |
| GET | `/spotlight/feed` | Mở rộng: `tab=for_you|following`, `cursor` |
| GET | `/spotlight/:id/related` | Video liên quan |
| GET | `/spotlight/:id/liked` | Kiểm tra user đã like (nếu dùng redcomment_likes) |

---

## 6. TỔNG KẾT

| Phase | Tính năng chính | Mục tiêu |
|-------|-----------------|----------|
| **2.1** | Infinite scroll, Save, Share, Like animation | Giảm ma sát, tăng tương tác |
| **2.2** | Follow Creator, Trang Creator, Tab Following | Gắn bó với Creator |
| **2.3** | Video liên quan, Feed "Dành cho bạn", Hashtags | Khám phá và relevance |
| **2.4** | Notifications | Lý do quay lại định kỳ |

**Ưu tiên triển khai trước:** Phase 2.1 – ảnh hưởng nhanh, thay đổi DB ít, dễ thực hiện.
