import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  RedeemXuDto,
  CreateCouponDto,
  UpdateCouponDto,
  ApplyCouponDto,
  ReferralQueryDto,
  CouponQueryDto,
} from './dto/loyalty.dto';

@Injectable()
export class LoyaltyService {
  constructor(private readonly prisma: PrismaService) {}

  // ═══ XU SYSTEM ═══════════════════════════════════════════════════════════

  async getXuBalance(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { xuBalance: true, referralCode: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      select: { xu_balance: true, xu_earned_total: true, xu_spent_total: true },
    });

    return {
      xuBalance: Number(user.xuBalance),
      walletXu: wallet ? Number(wallet.xu_balance) : 0,
      totalEarned: wallet ? Number(wallet.xu_earned_total) : 0,
      totalSpent: wallet ? Number(wallet.xu_spent_total) : 0,
      referralCode: user.referralCode,
      conversionRate: { xu: 100, vnd: 1000 },
    };
  }

  async redeemXu(userId: string, dto: RedeemXuDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { xuBalance: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const balance = Number(user.xuBalance);
    if (balance < dto.amount) {
      throw new BadRequestException(
        `Không đủ Xu. Hiện tại: ${balance}, cần: ${dto.amount}`,
      );
    }

    const vndValue = Math.floor(dto.amount / 100) * 1000;

    await this.prisma.user.update({
      where: { id: userId },
      data: { xuBalance: { decrement: dto.amount } },
    });

    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (wallet) {
      await this.prisma.wallet.update({
        where: { userId },
        data: { xu_spent_total: { increment: dto.amount } },
      });
    }

    return {
      redeemed: dto.amount,
      vndValue,
      remainingXu: balance - dto.amount,
      purpose: dto.purpose,
    };
  }

  // ═══ COUPON SYSTEM ════════════════════════════════════════════════════════

  async createCoupon(dto: CreateCouponDto) {
    const existing = await this.prisma.coupon.findUnique({ where: { code: dto.code } });
    if (existing) throw new BadRequestException('Mã coupon đã tồn tại');

    const coupon = await this.prisma.coupon.create({
      data: {
        code: dto.code.toUpperCase(),
        title: dto.title,
        description: dto.description || null,
        discountType: dto.discountType as any,
        discountValue: dto.discountValue,
        maxDiscount: dto.maxDiscount || null,
        minOrderAmount: dto.minOrderAmount || null,
        usageLimit: dto.usageLimit || null,
        perUserLimit: dto.perUserLimit ?? 1,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
      },
    });

    return this.formatCoupon(coupon);
  }

  async getCouponById(id: string) {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new NotFoundException('Coupon không tồn tại');
    return this.formatCoupon(coupon);
  }

  async updateCoupon(id: string, dto: UpdateCouponDto) {
    const existing = await this.prisma.coupon.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Coupon không tồn tại');

    const coupon = await this.prisma.coupon.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.discountType !== undefined && { discountType: dto.discountType as any }),
        ...(dto.discountValue !== undefined && { discountValue: dto.discountValue }),
        ...(dto.maxDiscount !== undefined && { maxDiscount: dto.maxDiscount }),
        ...(dto.minOrderAmount !== undefined && { minOrderAmount: dto.minOrderAmount }),
        ...(dto.usageLimit !== undefined && { usageLimit: dto.usageLimit }),
        ...(dto.perUserLimit !== undefined && { perUserLimit: dto.perUserLimit }),
        ...(dto.startDate !== undefined && { startDate: new Date(dto.startDate) }),
        ...(dto.endDate !== undefined && { endDate: new Date(dto.endDate) }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });
    return this.formatCoupon(coupon);
  }

  async applyCoupon(userId: string, dto: ApplyCouponDto) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: dto.code.toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      throw new NotFoundException('Mã coupon không tồn tại hoặc đã hết hạn');
    }

    const now = new Date();
    if (now < coupon.startDate || now > coupon.endDate) {
      throw new BadRequestException('Mã coupon chưa đến hạn sử dụng hoặc đã hết hạn');
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestException('Mã coupon đã hết lượt sử dụng');
    }

    if (coupon.minOrderAmount && BigInt(dto.orderAmount) < coupon.minOrderAmount) {
      throw new BadRequestException(
        `Đơn hàng tối thiểu ${Number(coupon.minOrderAmount).toLocaleString()} VND`,
      );
    }

    let discountAmount: number;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = Math.floor(dto.orderAmount * Number(coupon.discountValue) / 100);
      if (coupon.maxDiscount) {
        discountAmount = Math.min(discountAmount, Number(coupon.maxDiscount));
      }
    } else {
      discountAmount = Number(coupon.discountValue);
    }

    discountAmount = Math.min(discountAmount, dto.orderAmount);

    return {
      couponCode: coupon.code,
      discountType: coupon.discountType,
      discountValue: Number(coupon.discountValue),
      discountAmount,
      orderAmount: dto.orderAmount,
      finalAmount: dto.orderAmount - discountAmount,
    };
  }

  async getCouponStats() {
    const now = new Date();
    const [total, active, totalUsed, topByUsage] = await Promise.all([
      this.prisma.coupon.count(),
      this.prisma.coupon.count({
        where: {
          isActive: true,
          startDate: { lte: now },
          endDate: { gte: now },
        },
      }),
      this.prisma.coupon.aggregate({
        _sum: { usedCount: true },
      }),
      this.prisma.coupon.findMany({
        where: { usedCount: { gt: 0 } },
        orderBy: { usedCount: 'desc' },
        take: 10,
        select: {
          id: true,
          code: true,
          title: true,
          discountType: true,
          discountValue: true,
          usedCount: true,
          usageLimit: true,
          startDate: true,
          endDate: true,
          isActive: true,
        },
      }),
    ]);

    return {
      totalCoupons: total,
      activeCoupons: active,
      totalRedemptions: Number(totalUsed._sum.usedCount ?? 0),
      topCouponsByUsage: topByUsage.map((c) => ({
        id: c.id,
        code: c.code,
        title: c.title,
        discountType: c.discountType,
        discountValue: Number(c.discountValue),
        usedCount: c.usedCount,
        usageLimit: c.usageLimit,
        isActive: c.isActive,
        startDate: c.startDate,
        endDate: c.endDate,
      })),
    };
  }

  async listCoupons(query: CouponQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = {};
    if (query.activeOnly) {
      where.isActive = true;
      where.endDate = { gte: new Date() };
      where.startDate = { lte: new Date() };
    }

    const [coupons, total] = await Promise.all([
      this.prisma.coupon.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.coupon.count({ where }),
    ]);

    return {
      data: coupons.map((c) => this.formatCoupon(c)),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  // ═══ REFERRAL SYSTEM ══════════════════════════════════════════════════════

  async getReferralInfo(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { referralCode: true },
    });
    if (!user) throw new NotFoundException('User not found');

    if (!user.referralCode) {
      const code = `LS${Date.now().toString(36).toUpperCase().slice(-6)}`;
      await this.prisma.user.update({
        where: { id: userId },
        data: { referralCode: code },
      });
      user.referralCode = code;
    }

    const [totalReferrals, completedReferrals, totalReward] = await Promise.all([
      this.prisma.referral.count({ where: { referrerId: userId } }),
      this.prisma.referral.count({ where: { referrerId: userId, status: 'COMPLETED' } }),
      this.prisma.referral.aggregate({
        where: { referrerId: userId, status: 'COMPLETED' },
        _sum: { referrerReward: true },
      }),
    ]);

    return {
      referralCode: user.referralCode,
      totalReferrals,
      completedReferrals,
      totalReward: Number(totalReward._sum.referrerReward || 0),
      rewardPerReferral: 50000,
      refereeReward: 30000,
    };
  }

  // ═══ XU ADMIN (Loyalty – Báo cáo ngân sách) ═══════════════════════════════

  async getXuAdminStats() {
    const [xuAgg, walletCount] = await Promise.all([
      this.prisma.wallet.aggregate({
        _sum: { xu_earned_total: true, xu_spent_total: true, xu_balance: true },
        _count: true,
      }),
      this.prisma.wallet.count({ where: { xu_balance: { gt: 0 } } }),
    ]);

    const totalEarned = Number(xuAgg._sum.xu_earned_total ?? 0);
    const totalSpent = Number(xuAgg._sum.xu_spent_total ?? 0);
    const currentBalance = Number(xuAgg._sum.xu_balance ?? 0);

    return {
      totalXuEarned: totalEarned,
      totalXuSpent: totalSpent,
      currentXuBalance: currentBalance,
      walletCountWithXu: walletCount,
      totalWallets: xuAgg._count,
      estimatedBudgetImpactVnd: Math.floor(totalEarned * 10),
    };
  }

  // ═══ REFERRAL ADMIN (Affiliate) ═══════════════════════════════════════════

  async getReferralAdminStats() {
    const [totalReferrals, completedReferrals, budgetSpent] = await Promise.all([
      this.prisma.referral.count(),
      this.prisma.referral.count({ where: { status: 'COMPLETED' } }),
      this.prisma.referral.aggregate({
        where: { status: 'COMPLETED' },
        _sum: {
          referrerReward: true,
          refereeReward: true,
        },
      }),
    ]);

    const referrerTotal = Number(budgetSpent._sum.referrerReward || 0);
    const refereeTotal = Number(budgetSpent._sum.refereeReward || 0);

    return {
      totalReferrals,
      completedReferrals,
      pendingReferrals: totalReferrals - completedReferrals,
      budgetSpentReferrer: referrerTotal,
      budgetSpentReferee: refereeTotal,
      budgetSpentTotal: referrerTotal + refereeTotal,
    };
  }

  async listReferralsAdmin(query: {
    page?: number;
    limit?: number;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const where: {
      status?: string;
      createdAt?: { gte?: Date; lte?: Date };
    } = {};
    if (query.status) where.status = query.status;
    if (query.dateFrom || query.dateTo) {
      where.createdAt = {};
      if (query.dateFrom) where.createdAt.gte = new Date(query.dateFrom);
      if (query.dateTo) {
        const d = new Date(query.dateTo);
        d.setHours(23, 59, 59, 999);
        where.createdAt.lte = d;
      }
    }

    const [referrals, total] = await Promise.all([
      this.prisma.referral.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          referrer: { select: { id: true, displayName: true, phoneNumber: true, referralCode: true } },
          referee: { select: { id: true, displayName: true, phoneNumber: true } },
        },
      }),
      this.prisma.referral.count({ where }),
    ]);

    return {
      data: referrals.map((r) => {
        const ref = r as { referrer?: { displayName?: string; phoneNumber?: string; referralCode?: string }; referee?: { displayName?: string; phoneNumber?: string } };
        return {
          id: r.id,
          referrerId: r.referrerId,
          referrerName: ref.referrer?.displayName,
          referrerPhone: ref.referrer?.phoneNumber,
          referrerCode: ref.referrer?.referralCode,
          refereeId: r.refereeId,
          refereeName: ref.referee?.displayName,
          refereePhone: ref.referee?.phoneNumber,
          status: r.status,
          referrerReward: Number(r.referrerReward),
          refereeReward: Number(r.refereeReward),
          completedAt: r.completedAt,
          createdAt: r.createdAt,
        };
      }),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getMyReferrals(userId: string, query: ReferralQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const [referrals, total] = await Promise.all([
      this.prisma.referral.findMany({
        where: { referrerId: userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.referral.count({ where: { referrerId: userId } }),
    ]);

    return {
      data: referrals.map((r) => ({
        id: r.id,
        refereeId: r.refereeId,
        status: r.status,
        referrerReward: Number(r.referrerReward),
        refereeReward: Number(r.refereeReward),
        completedAt: r.completedAt,
        createdAt: r.createdAt,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  private formatCoupon(c: any) {
    return {
      id: c.id,
      code: c.code,
      title: c.title,
      description: c.description,
      discountType: c.discountType,
      discountValue: Number(c.discountValue),
      maxDiscount: c.maxDiscount ? Number(c.maxDiscount) : null,
      minOrderAmount: c.minOrderAmount ? Number(c.minOrderAmount) : null,
      usageLimit: c.usageLimit,
      usedCount: c.usedCount,
      perUserLimit: c.perUserLimit,
      startDate: c.startDate,
      endDate: c.endDate,
      isActive: c.isActive,
    };
  }
}
