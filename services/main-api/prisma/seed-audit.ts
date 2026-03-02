import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN', deletedAt: null },
  });
  if (!admin) {
    console.log('Không tìm thấy admin, bỏ qua seed audit.');
    return;
  }

  const count = await prisma.auditLog.count();
  if (count > 0) {
    console.log('Audit logs đã có dữ liệu, bỏ qua seed.');
    return;
  }

  await prisma.auditLog.createMany({
    data: [
      {
        userId: admin.id,
        userEmail: admin.email,
        action: 'LOGIN',
        resource: 'auth',
        details: { source: 'web-admin' },
      },
      {
        userId: admin.id,
        userEmail: admin.email,
        action: 'VIEW',
        resource: 'drivers',
        resourceId: null,
        details: { list: true },
      },
      {
        userId: admin.id,
        userEmail: admin.email,
        action: 'UPDATE',
        resource: 'pricing',
        resourceId: 'CAR_4_SEATS',
        details: { baseFare: 15000 },
      },
    ],
  });
  console.log('Đã seed 3 audit log mẫu.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
