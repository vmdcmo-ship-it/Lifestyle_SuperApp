/**
 * Dữ liệu bài viết Tin Bất Động Sản - dùng khi API backend chưa có
 */

export interface BdsArticleStatic {
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  image?: string | null;
  tags?: string[];
}

export const BDS_ARTICLES_STATIC: BdsArticleStatic[] = [
  {
    slug: 'bat-dong-san-2024-xu-huong',
    title: 'Bất động sản 2024: Xu hướng và triển vọng',
    excerpt: 'Phân tích thị trường BDS 2024, các chính sách mới ảnh hưởng đến thị trường.',
    content:
      '<p>Thị trường bất động sản 2024 dự kiến có nhiều biến chuyển. Các chính sách hỗ trợ lãi suất, tháo gỡ vướng mắc pháp lý sẽ tạo điều kiện cho thị trường phục hồi.</p><p><em>(Nội dung SEO chi tiết cập nhật từ CMS)</em></p>',
    date: '2024-03-01',
    tags: ['thi-truong', 'xu-huong'],
  },
  {
    slug: 'chinh-sach-lai-suat-moi-anh-huong-bds',
    title: 'Chính sách lãi suất mới ảnh hưởng thế nào đến BDS?',
    excerpt: 'Ngân hàng giảm lãi suất cho vay mua nhà – cơ hội cho người mua.',
    content:
      '<p>Lãi suất cho vay mua nhà giảm mạnh tạo cơ hội cho người có nhu cầu ở thực.</p><p><em>(Nội dung chi tiết cập nhật từ CMS)</em></p>',
    date: '2024-02-28',
    tags: ['chinh-sach'],
  },
  {
    slug: 'du-an-chung-cu-moi-khai-truong-tphcm',
    title: 'Dự án chung cư mới khai trương tại TP.HCM',
    excerpt: 'Tổng hợp dự án chung cư cao cấp, hạng sang đang mở bán.',
    content:
      '<p>Các dự án chung cư mới tại TP.HCM đang thu hút nhiều nhà đầu tư và người mua.</p><p><em>(Danh sách dự án chi tiết cập nhật từ CMS)</em></p>',
    date: '2024-02-25',
    tags: ['du-an', 'chung-cu'],
  },
  {
    slug: 'nha-o-xa-hoi-quy-dinh-moi-2024',
    title: 'Nhà ở xã hội: Quy định mới 2024',
    excerpt: 'Luật Nhà ở 2023 và các nghị định hướng dẫn về nhà ở xã hội.',
    content:
      '<p>Luật Nhà ở 2023 có hiệu lực từ 01/01/2024 với nhiều quy định mới về nhà ở xã hội.</p><p><em>(Nội dung chi tiết cập nhật từ CMS)</em></p>',
    date: '2024-02-20',
    tags: ['nha-o-xa-hoi'],
  },
];
