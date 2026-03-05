/**
 * Seed script: Danh mục Đào tạo mẫu (Training categories)
 * Chạy: cd services/main-api && npx ts-node prisma/seed-training.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TRAINING_CATEGORIES = [
  {
    slug: 'dao-tao-tai-xe-quy-tac-ung-xu',
    name: 'Đào tạo tài xế - Quy tắc ứng xử',
    description: 'Quy tắc ứng xử với khách hàng, an toàn giao thông, tiêu chuẩn dịch vụ',
    sortOrder: 1,
  },
  {
    slug: 'ky-nang-phuc-vu-khach-hang',
    name: 'Kỹ năng phục vụ khách hàng',
    description: 'Giao tiếp, xử lý tình huống, nâng cao trải nghiệm khách hàng',
    sortOrder: 2,
  },
  {
    slug: 'faq-tai-xe',
    name: 'FAQ - Câu hỏi thường gặp (Tài xế)',
    description: 'Giải đáp thắc mắc về đăng ký, thu nhập, chính sách tài xế',
    sortOrder: 3,
  },
  {
    slug: 'ky-nang-quan-ly-tai-chinh',
    name: 'Kỹ năng quản lý tài chính',
    description: 'Quản lý thu chi, tiết kiệm, kế hoạch tài chính cá nhân',
    sortOrder: 4,
  },
  {
    slug: 'huong-dan-su-dung-ung-dung',
    name: 'Hướng dẫn sử dụng ứng dụng',
    description: 'Cách đặt xe, nhận đơn, thanh toán qua ứng dụng',
    sortOrder: 5,
  },
];

async function main() {
  console.log('>>> Seeding training categories...');

  for (const cat of TRAINING_CATEGORIES) {
    const created = await prisma.training_category.upsert({
      where: { slug: cat.slug },
      create: {
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        sortOrder: cat.sortOrder,
      },
      update: {
        name: cat.name,
        description: cat.description,
        sortOrder: cat.sortOrder,
      },
    });
    console.log(`  - ${created.slug}: ${created.name}`);
  }

  console.log('>>> Training categories seed completed.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
