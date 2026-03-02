import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Prisma, user_role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(opts: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
  } = {}) {
    const page = opts.page ?? 1;
    const limit = opts.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = { deletedAt: null };

    if (opts.role) {
      where.role = opts.role as user_role;
    }
    if (opts.isActive !== undefined) {
      where.isActive = opts.isActive;
    }
    if (opts.search?.trim()) {
      const q = `%${opts.search.trim()}%`;
      where.OR = [
        { displayName: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { phoneNumber: { contains: opts.search.trim(), mode: 'insensitive' } },
        { firstName: { contains: q, mode: 'insensitive' } },
        { lastName: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          phoneNumber: true,
          firstName: true,
          lastName: true,
          displayName: true,
          avatar_url: true,
          role: true,
          isActive: true,
          ekycLevel: true,
          xuBalance: true,
          createdAt: true,
          lastLoginAt: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        driver: true,
        addresses: true,
        creator: true,
        wallets: true,
      },
    });

    if (!user || user.deletedAt) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async update(id: string, requestUserId: string, dto: UpdateUserDto) {
    if (id !== requestUserId) {
      throw new ForbiddenException('Bạn chỉ có thể cập nhật profile của mình');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user || user.deletedAt) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.firstName && { firstName: dto.firstName }),
        ...(dto.lastName && { lastName: dto.lastName }),
        ...(dto.displayName && { displayName: dto.displayName }),
        ...(dto.dateOfBirth && { dateOfBirth: new Date(dto.dateOfBirth) }),
        ...(dto.gender && { gender: dto.gender as any }),
        ...(dto.avatar && { avatar_url: dto.avatar }),
      },
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        firstName: true,
        lastName: true,
        displayName: true,
        avatar_url: true,
        dateOfBirth: true,
        gender: true,
        role: true,
        ekycLevel: true,
        xuBalance: true,
        updatedAt: true,
      },
    });

    return updated;
  }

  async softDelete(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');

    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });

    return { message: 'Xóa tài khoản thành công' };
  }

  async getStats() {
    const [totalUsers, activeUsers, drivers, merchants] = await Promise.all([
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.user.count({ where: { isActive: true, deletedAt: null } }),
      this.prisma.driver.count(),
      this.prisma.user.count({
        where: { role: 'RESTAURANT_OWNER', deletedAt: null },
      }),
    ]);

    return {
      totalUsers,
      activeUsers,
      drivers,
      merchants,
      inactiveUsers: totalUsers - activeUsers,
    };
  }
}
