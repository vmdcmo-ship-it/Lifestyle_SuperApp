/**
 * Hướng dẫn chi tiết đăng ký đối tác kinh doanh theo từng nhóm
 * Tách riêng khỏi partner-registration.ts để dễ bảo trì nội dung
 */

import type { BusinessGroupId } from './partner-registration';

export interface PartnerGuideStep {
  title: string;
  description: string;
  details?: string[];
}

export interface PartnerGuide {
  /** Tiêu đề nhóm */
  groupTitle: string;
  /** Mô tả ngắn */
  summary: string;
  /** Hồ sơ cần chuẩn bị */
  requirements: string[];
  /** Quy trình từng bước */
  steps: PartnerGuideStep[];
  /** Thời gian xử lý ước tính */
  estimatedDays: string;
  /** Lợi ích khi tham gia */
  benefits: string[];
  /** Lưu ý quan trọng */
  notes?: string[];
}

const PARTNER_GUIDES: Record<BusinessGroupId, PartnerGuide> = {
  FOOD_DELIVERY: {
    groupTitle: 'Giao thức ăn',
    summary:
      'Đưa món ăn của bạn đến hàng triệu khách hàng. Nhà hàng, cà phê, tiệm bánh — bắt đầu nhận đơn trong vài ngày.',
    requirements: [
      'Giấy phép đăng ký kinh doanh (hoặc hộ kinh doanh cá thể)',
      'Menu với giá và mô tả món',
      'Ảnh cửa hàng và món ăn (tối thiểu 5 món)',
      'Thông tin liên hệ chủ cửa hàng / quản lý',
    ],
    steps: [
      {
        title: '1. Điền form đăng ký',
        description: 'Cung cấp thông tin cửa hàng, liên hệ và chọn ngành (nhà hàng, cà phê, đồ ăn nhanh...)',
        details: ['Điền chính xác tên cửa hàng và địa chỉ', 'Email và SĐT dùng để KODO liên hệ'],
      },
      {
        title: '2. Xác minh và tham quan',
        description: 'Đội ngũ KODO liên hệ trong 1-2 ngày làm việc để xác minh thông tin.',
        details: [
          'Có thể hẹn thăm cửa hàng (nếu trong khu vực hỗ trợ)',
          'Chuẩn bị menu giấy hoặc file để trao đổi',
        ],
      },
      {
        title: '3. Ký hợp đồng đối tác',
        description: 'Hoàn tất hồ sơ pháp lý và ký hợp đồng hợp tác trực tuyến.',
        details: ['Chuẩn bị bản scan/photo giấy phép kinh doanh', 'Ký điện tử qua link email'],
      },
      {
        title: '4. Setup menu trên App Merchant',
        description: 'Tải App KODO Merchant, đăng nhập và thiết lập menu, giá, ảnh món.',
        details: [
          'Mỗi món cần: tên, giá, ảnh, mô tả ngắn',
          'Ảnh rõ nét, đúng món — giúp tăng tỉ lệ đặt hàng',
          'Hỗ trợ đóng gói theo chuẩn (nếu có yêu cầu)',
        ],
      },
      {
        title: '5. Bắt đầu nhận đơn',
        description: 'Kích hoạt shop, nhận thông báo đơn qua App và bắt đầu giao hàng.',
      },
    ],
    estimatedDays: '3-5 ngày làm việc',
    benefits: [
      'Tiếp cận hàng triệu khách hàng qua App KODO',
      'Phí hoa hồng cạnh tranh, minh bạch',
      'App Merchant quản lý đơn đơn giản',
      'Hỗ trợ đối tác vận chuyển giao hàng',
    ],
    notes: [
      'Menu cần cập nhật giá và tình trạng (bán/ngừng) thường xuyên',
      'Đóng gói đảm bảo vệ sinh, đúng món giúp giảm khiếu nại',
    ],
  },

  GROCERY: {
    groupTitle: 'Bách hóa (mua hộ, đi chợ hộ)',
    summary:
      'Cửa hàng tạp hóa, siêu thị mini hoặc dịch vụ mua hộ — kết nối với khách hàng qua nền tảng KODO.',
    requirements: [
      'Giấy phép đăng ký kinh doanh',
      'Danh mục sản phẩm / nhóm hàng (nếu có)',
      'Ảnh cửa hàng, khu vực trưng bày',
      'Thông tin chủ cửa hàng hoặc người phụ trách',
    ],
    steps: [
      {
        title: '1. Điền form đăng ký',
        description: 'Chọn nhóm Bách hóa và loại hình (cửa hàng tạp hóa, siêu thị mini, mua hộ/đi chợ hộ).',
      },
      {
        title: '2. Xác minh thông tin',
        description: 'KODO liên hệ xác minh địa chỉ kinh doanh và hồ sơ pháp lý.',
      },
      {
        title: '3. Ký hợp đồng đối tác',
        description: 'Hoàn tất hồ sơ và ký hợp đồng.',
      },
      {
        title: '4. Cấu hình sản phẩm trên App Merchant',
        description:
          'Đăng nhập App Merchant, thêm nhóm hàng và sản phẩm. Với mua hộ/đi chợ: cấu hình phạm vi mua, thời gian phục vụ.',
        details: [
          'Cửa hàng: đăng sản phẩm có sẵn',
          'Mua hộ/đi chợ: cấu hình loại đơn nhận (mua theo list, đi chợ theo nhu cầu...)',
        ],
      },
      {
        title: '5. Nhận đơn và phục vụ',
        description: 'Nhận thông báo đơn, chuẩn bị hàng hoặc thực hiện mua hộ theo yêu cầu.',
      },
    ],
    estimatedDays: '3-7 ngày làm việc',
    benefits: [
      'Mở rộng kênh bán hàng ra ngoài khu vực',
      'Tích hợp dịch vụ mua hộ / đi chợ hộ',
      'Quản lý đơn và kho qua App Merchant',
    ],
    notes: ['Cần có khu vực đóng gói sạch sẽ', 'Thời gian phục vụ rõ ràng giúp khách chủ động đặt đơn'],
  },

  LOCAL_SERVICE: {
    groupTitle: 'Giới thiệu dịch vụ',
    summary:
      'Spa, salon, gym, phòng khám, sửa chữa — hiển thị trên mục "Dịch vụ quanh đây" để khách tìm và đặt lịch.',
    requirements: [
      'Giấy phép kinh doanh (nếu ngành có yêu cầu)',
      'Mô tả dịch vụ và bảng giá',
      'Ảnh cơ sở, không gian phục vụ',
      'Địa chỉ chính xác trên bản đồ',
    ],
    steps: [
      {
        title: '1. Điền form đăng ký',
        description: 'Chọn nhóm Giới thiệu dịch vụ và loại hình (spa, salon, gym, phòng khám, sửa chữa...).',
      },
      {
        title: '2. Xác minh và kiểm tra',
        description: 'KODO xác minh thông tin và địa chỉ để hiển thị chính xác trên bản đồ.',
      },
      {
        title: '3. Ký hợp đồng đối tác',
        description: 'Hoàn tất hồ sơ và ký hợp đồng hợp tác.',
      },
      {
        title: '4. Thiết lập thông tin trên App',
        description:
          'Cập nhật thông tin cơ sở: địa chỉ, giờ mở cửa, dịch vụ, bảng giá, ảnh.',
        details: [
          'Địa chỉ GPS chính xác giúp khách tìm dễ',
          'Bảng giá minh bạch tăng tỉ lệ đặt lịch',
        ],
      },
      {
        title: '5. Hiển thị và nhận đặt lịch',
        description: 'Cơ sở xuất hiện trên "Dịch vụ quanh đây", khách có thể tìm và đặt lịch trực tiếp.',
      },
    ],
    estimatedDays: '3-5 ngày làm việc',
    benefits: [
      'Xuất hiện trên bản đồ tìm kiếm "Dịch vụ quanh đây"',
      'Khách đặt lịch trực tiếp qua App',
      'Tăng độ nhận diện địa phương',
    ],
    notes: [
      'Giờ mở cửa chính xác để tránh đặt nhầm',
      'Ảnh phản ánh thực tế cơ sở giúp khách tin tưởng',
    ],
  },

  SHOPPING_MALL: {
    groupTitle: 'Shopping Mall',
    summary:
      'Thời trang hàng hiệu, mỹ phẩm, đồng hồ, hoa tươi, Hamper — bán trên sàn TMĐT cao cấp KODO.',
    requirements: [
      'Giấy phép đăng ký kinh doanh',
      'Catalog sản phẩm hoặc thương hiệu đại diện',
      'Ảnh sản phẩm chất lượng cao',
      'Chính sách đổi trả, bảo hành (nếu có)',
    ],
    steps: [
      {
        title: '1. Điền form đăng ký',
        description:
          'Chọn nhóm Shopping Mall và ngành (thời trang, mỹ phẩm, đồng hồ, hoa, Hamper...).',
      },
      {
        title: '2. Thẩm định thương hiệu',
        description: 'KODO xem xét hồ sơ và thương hiệu để đảm bảo phù hợp sàn cao cấp.',
        details: [
          'Cung cấp thêm thông tin nguồn hàng nếu là đại lý',
          'Ảnh sản phẩm mẫu giúp quy trình nhanh hơn',
        ],
      },
      {
        title: '3. Ký hợp đồng đối tác',
        description: 'Hoàn tất hồ sơ pháp lý và ký hợp đồng với KODO Shopping Mall.',
      },
      {
        title: '4. Đăng sản phẩm lên sàn',
        description:
          'Dùng App Merchant hoặc bảng điều khiển Web để tạo shop, đăng sản phẩm với ảnh, giá, mô tả.',
        details: [
          'Ảnh sản phẩm rõ nét, đúng màu sắc',
          'Mô tả đầy đủ: xuất xứ, chất liệu, kích thước',
        ],
      },
      {
        title: '5. Bắt đầu bán hàng',
        description: 'Shop kích hoạt, sản phẩm hiển thị trên sàn. Đối tác vận chuyển KODO xử lý giao hàng.',
      },
    ],
    estimatedDays: '5-10 ngày làm việc',
    benefits: [
      'Bán trên sàn TMĐT cao cấp KODO',
      'Đối tác vận chuyển chuyên nghiệp',
      'Tiếp cận khách hàng có thu nhập cao',
      'App Merchant quản lý đơn, tồn kho',
    ],
    notes: [
      'Sản phẩm cần đảm bảo nguồn gốc, chính hãng',
      'Chính sách đổi trả rõ ràng tăng uy tín shop',
    ],
  },
};

export function getPartnerGuide(groupId: BusinessGroupId): PartnerGuide {
  return PARTNER_GUIDES[groupId] ?? PARTNER_GUIDES.SHOPPING_MALL;
}
