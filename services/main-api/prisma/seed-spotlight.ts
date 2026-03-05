/**
 * Seed script: Spotlight Phase 1 - Categories & Regions (63 tỉnh/thành)
 * Chạy: npx ts-node prisma/seed-spotlight.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SPOTLIGHT_CATEGORIES = [
  { slug: 'travel', name: 'Du lịch', order: 1 },
  { slug: 'food', name: 'Ẩm thực', order: 2 },
  { slug: 'resort', name: 'Nghỉ dưỡng', order: 3 },
  { slug: 'experience', name: 'Trải nghiệm', order: 4 },
  { slug: 'service_review', name: 'Review dịch vụ', order: 5 },
  { slug: 'lifestyle', name: 'Phong cách sống', order: 6 },
  { slug: 'psychology', name: 'Tâm lý', order: 7 },
  { slug: 'learning', name: 'Học tập', order: 8 },
];

// 63 tỉnh/thành phố VN (theo mã GSO - Tổng cục Thống kê)
const PROVINCES = [
  { code: 'VN-01', name: 'Hà Nội' },
  { code: 'VN-02', name: 'Hà Giang' },
  { code: 'VN-04', name: 'Cao Bằng' },
  { code: 'VN-06', name: 'Bắc Kạn' },
  { code: 'VN-08', name: 'Tuyên Quang' },
  { code: 'VN-10', name: 'Lào Cai' },
  { code: 'VN-11', name: 'Điện Biên' },
  { code: 'VN-12', name: 'Lai Châu' },
  { code: 'VN-14', name: 'Sơn La' },
  { code: 'VN-15', name: 'Yên Bái' },
  { code: 'VN-17', name: 'Hòa Bình' },
  { code: 'VN-19', name: 'Thái Nguyên' },
  { code: 'VN-20', name: 'Lạng Sơn' },
  { code: 'VN-22', name: 'Quảng Ninh' },
  { code: 'VN-24', name: 'Bắc Giang' },
  { code: 'VN-25', name: 'Phú Thọ' },
  { code: 'VN-26', name: 'Vĩnh Phúc' },
  { code: 'VN-27', name: 'Bắc Ninh' },
  { code: 'VN-30', name: 'Hải Dương' },
  { code: 'VN-31', name: 'Hải Phòng' },
  { code: 'VN-33', name: 'Hưng Yên' },
  { code: 'VN-34', name: 'Thái Bình' },
  { code: 'VN-35', name: 'Hà Nam' },
  { code: 'VN-36', name: 'Nam Định' },
  { code: 'VN-37', name: 'Ninh Bình' },
  { code: 'VN-38', name: 'Thanh Hóa' },
  { code: 'VN-40', name: 'Nghệ An' },
  { code: 'VN-42', name: 'Hà Tĩnh' },
  { code: 'VN-44', name: 'Quảng Bình' },
  { code: 'VN-45', name: 'Quảng Trị' },
  { code: 'VN-46', name: 'Thừa Thiên Huế' },
  { code: 'VN-48', name: 'Đà Nẵng' },
  { code: 'VN-49', name: 'Quảng Nam' },
  { code: 'VN-51', name: 'Quảng Ngãi' },
  { code: 'VN-52', name: 'Bình Định' },
  { code: 'VN-54', name: 'Phú Yên' },
  { code: 'VN-56', name: 'Khánh Hòa' },
  { code: 'VN-58', name: 'Ninh Thuận' },
  { code: 'VN-60', name: 'Bình Thuận' },
  { code: 'VN-62', name: 'Kon Tum' },
  { code: 'VN-64', name: 'Gia Lai' },
  { code: 'VN-66', name: 'Đắk Lắk' },
  { code: 'VN-67', name: 'Đắk Nông' },
  { code: 'VN-68', name: 'Lâm Đồng' },
  { code: 'VN-70', name: 'Bình Phước' },
  { code: 'VN-72', name: 'Tây Ninh' },
  { code: 'VN-74', name: 'Bình Dương' },
  { code: 'VN-75', name: 'Đồng Nai' },
  { code: 'VN-77', name: 'Bà Rịa - Vũng Tàu' },
  { code: 'VN-79', name: 'Hồ Chí Minh' },
  { code: 'VN-80', name: 'Long An' },
  { code: 'VN-82', name: 'Tiền Giang' },
  { code: 'VN-83', name: 'Bến Tre' },
  { code: 'VN-84', name: 'Trà Vinh' },
  { code: 'VN-86', name: 'Vĩnh Long' },
  { code: 'VN-87', name: 'Đồng Tháp' },
  { code: 'VN-89', name: 'An Giang' },
  { code: 'VN-91', name: 'Kiên Giang' },
  { code: 'VN-92', name: 'Cần Thơ' },
  { code: 'VN-93', name: 'Hậu Giang' },
  { code: 'VN-94', name: 'Sóc Trăng' },
  { code: 'VN-95', name: 'Bạc Liêu' },
  { code: 'VN-96', name: 'Cà Mau' },
];

async function seedCategories(): Promise<void> {
  for (const cat of SPOTLIGHT_CATEGORIES) {
    await prisma.spotlightCategory.upsert({
      where: { slug: cat.slug },
      create: {
        slug: cat.slug,
        name: cat.name,
        order: cat.order,
        is_active: true,
      },
      update: { name: cat.name, order: cat.order },
    });
  }
  console.log(`[OK] Đã seed ${SPOTLIGHT_CATEGORIES.length} thể loại Spotlight`);
}

async function seedRegions(): Promise<void> {
  let created = 0;
  for (const p of PROVINCES) {
    const existing = await prisma.region.findUnique({
      where: { code: p.code },
    });
    if (!existing) {
      await prisma.region.create({
        data: {
          code: p.code,
          name: p.name,
          level: 'PROVINCE',
          is_active: true,
        },
      });
      created++;
    }
  }
  console.log(`[OK] Đã seed ${created} tỉnh/thành mới (tổng ${PROVINCES.length} trong danh sách)`);
}

async function main(): Promise<void> {
  await seedCategories();
  await seedRegions();
}

main()
  .catch((e) => {
    console.error('[ERROR]', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
