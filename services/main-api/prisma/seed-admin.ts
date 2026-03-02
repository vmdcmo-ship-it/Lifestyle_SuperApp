/**
 * Seed script: Tạo tài khoản ADMIN cho Web Admin
 * Chạy: npx ts-node prisma/seed-admin.ts
 */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@lifestyle.local';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123';
const ADMIN_FIRST_NAME = process.env.ADMIN_FIRST_NAME || 'Admin';
const ADMIN_LAST_NAME = process.env.ADMIN_LAST_NAME || 'System';

async function main(): Promise<void> {
  const existing = await prisma.user.findFirst({
    where: { email: ADMIN_EMAIL, deletedAt: null },
  });

  if (existing) {
    if (existing.role === 'ADMIN') {
      console.log(`[OK] Tài khoản ADMIN đã tồn tại: ${ADMIN_EMAIL}`);
      return;
    }
    console.log(`[SKIP] Email ${ADMIN_EMAIL} đã tồn tại với role ${existing.role}`);
    return;
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, salt);

  await prisma.user.create({
    data: {
      email: ADMIN_EMAIL,
      passwordHash,
      firstName: ADMIN_FIRST_NAME,
      lastName: ADMIN_LAST_NAME,
      displayName: `${ADMIN_FIRST_NAME} ${ADMIN_LAST_NAME}`,
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log(`[OK] Đã tạo tài khoản ADMIN: ${ADMIN_EMAIL}`);
  console.log(`    Mật khẩu: ${ADMIN_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error('[ERROR]', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
