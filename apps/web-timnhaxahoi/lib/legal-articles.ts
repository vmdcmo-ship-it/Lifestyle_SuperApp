/** Bài wiki pháp lý (có thể mở rộng thêm theo từng đợt). */

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
};

export type LegalArticle = {
  slug: string;
  title: string;
  description: string;
  sections: LegalSection[];
};

const articles: LegalArticle[] = [
  {
    slug: 'dieu-kien-noxh-tong-quan',
    title: 'Điều kiện NOXH — tổng quan thực tiễn',
    description:
      'Các nhóm đối tượng, cư trú và thu nhập thường được rà soát sơ bộ; không thay thế văn bản pháp luật.',
    sections: [
      {
        id: 'doi-tuong',
        title: 'Đối tượng và ưu tiên',
        paragraphs: [
          'Nhà ở xã hội hướng tới người có khó khăn về nhà ở, thu nhập thấp và một số nhóm được pháp luật ưu tiên (công nhân khu công nghiệp, lực lượng vũ trang, công chức, v.v.).',
          'Danh mục đối tượng cụ thể và thứ tự ưu tiên theo từng dự án / địa phương có thể khác nhau; cần đối chiếu thông báo mở bán và quy chế của chủ đầu tư.',
        ],
      },
      {
        id: 'cu-tru',
        title: 'Cư trú tại địa phương',
        paragraphs: [
          'Thông thường yêu cầu hộ khẩu thường trú hoặc tạm trú kèm đóng bảo hiểm xã hội đủ thời gian theo quy định địa phương.',
          'Nếu chưa đủ điều kiện cư trú, vẫn có thể chuẩn bị lộ trình (tạm trú, BHXH) trước đợt đăng ký.',
        ],
      },
      {
        id: 'thu-nhap',
        title: 'Thu nhập và tài chính',
        paragraphs: [
          'Ngưỡng thu nhập được áp theo quy định hiện hành và hướng dẫn từng đợt mở bán; mức cụ thể do cơ quan có thẩm quyền và chủ đầu tư công bố.',
          'Ngoài điều kiện pháp lý, khả năng vốn tự có và trả nợ là yếu tố thực tế khi xét hồ sơ vay và nhận nhà.',
        ],
      },
      {
        id: 'luu-y',
        title: 'Lưu ý',
        paragraphs: [
          'Bài viết mang tính giới thiệu; quyết định cuối cùng thuộc cơ quan có thẩm quyền và quy trình từng dự án.',
          'Nội dung được tham chiếu và rà soát với Văn phòng Luật sư Mai Quốc Định.',
        ],
      },
    ],
  },
  {
    slug: 'thu-tuc-ho-so-co-ban',
    title: 'Thủ tục & hồ sơ đăng ký — khung chung',
    description: 'Các nhóm giấy tờ thường gặp khi chuẩn bị hồ sơ mua NOXH (tham khảo).',
    sections: [
      {
        id: 'giay-to-ca-nhan',
        title: 'Giấy tờ cá nhân',
        paragraphs: [
          'CMND/CCCD, hộ khẩu hoặc tạm trú, giấy tờ chứng minh tình trạng hôn nhân (nếu áp dụng).',
          'Xác nhận thu nhập, hợp đồng lao động hoặc tài liệu theo yêu cầu đợt mở bán.',
        ],
      },
      {
        id: 'phap-ly-nha-o',
        title: 'Nhà ở hiện có',
        paragraphs: [
          'Giấy tờ liên quan nhà ở hiện hữu (nếu có) để chứng minh diện tích bình quân / điều kiện thụ hưởng.',
          'Trường hợp đặc thù cần được luật sư / tư vấn viên rà soạn theo từng hồ sơ.',
        ],
      },
      {
        id: 'vay-von',
        title: 'Vay vốn',
        paragraphs: [
          'Khi đăng ký vay đi kèm dự án, ngân hàng thường yêu cầu thêm sao kê, cam kết thu nhập và tài sản đảm bảo theo chính sách từng thời điểm.',
        ],
      },
    ],
  },
];

export function listLegalArticles(): Pick<LegalArticle, 'slug' | 'title' | 'description'>[] {
  return articles.map(({ slug, title, description }) => ({ slug, title, description }));
}

export function getLegalArticle(slug: string): LegalArticle | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getLegalSlugs(): string[] {
  return articles.map((a) => a.slug);
}
