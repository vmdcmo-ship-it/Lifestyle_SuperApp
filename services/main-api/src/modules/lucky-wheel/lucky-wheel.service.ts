import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateLuckyWheelCampaignDto,
  UpdateLuckyWheelCampaignDto,
  CreateLuckyWheelPrizeDto,
  UpdateLuckyWheelPrizeDto,
  LuckyWheelSpinQueryDto,
} from './dto/lucky-wheel.dto';
import { lucky_wheel_campaign_status } from '@prisma/client';

@Injectable()
export class LuckyWheelService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Campaigns ───────────────────────────────────────────────────────────

  async listCampaigns(status?: string) {
    const where: { status?: lucky_wheel_campaign_status } = {};
    if (status) {
      where.status = status as lucky_wheel_campaign_status;
    }

    const campaigns = await this.prisma.luckyWheelCampaign.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { prizes: true, spins: true },
        },
      },
    });

    return campaigns.map((c) => this.formatCampaign(c));
  }

  async getCampaignById(id: string) {
    const c = await this.prisma.luckyWheelCampaign.findUnique({
      where: { id },
      include: {
        prizes: true,
        _count: { select: { spins: true, creditGrants: true } },
      },
    });
    if (!c) throw new NotFoundException('Campaign không tồn tại');
    return this.formatCampaignDetail(c);
  }

  async createCampaign(dto: CreateLuckyWheelCampaignDto) {
    const campaign = await this.prisma.luckyWheelCampaign.create({
      data: {
        name: dto.name,
        description: dto.description ?? null,
        status: 'DRAFT',
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        budget: BigInt(dto.budget ?? 0),
        driverRevenuePerSpin: dto.driverRevenuePerSpin ?? 100000,
        userTopUpPerSpin: dto.userTopUpPerSpin ?? 500000,
        userOrderPerSpin: dto.userOrderPerSpin ?? 1,
      },
    });
    return this.formatCampaign(campaign);
  }

  async updateCampaign(id: string, dto: UpdateLuckyWheelCampaignDto) {
    const existing = await this.prisma.luckyWheelCampaign.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Campaign không tồn tại');

    const data: Record<string, unknown> = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.startDate !== undefined) data.startDate = new Date(dto.startDate);
    if (dto.endDate !== undefined) data.endDate = new Date(dto.endDate);
    if (dto.budget !== undefined) data.budget = BigInt(dto.budget);
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.driverRevenuePerSpin !== undefined)
      data.driverRevenuePerSpin = dto.driverRevenuePerSpin;
    if (dto.userTopUpPerSpin !== undefined)
      data.userTopUpPerSpin = dto.userTopUpPerSpin;
    if (dto.userOrderPerSpin !== undefined)
      data.userOrderPerSpin = dto.userOrderPerSpin;

    const campaign = await this.prisma.luckyWheelCampaign.update({
      where: { id },
      data: data as never,
    });
    return this.formatCampaign(campaign);
  }

  // ─── Prizes ──────────────────────────────────────────────────────────────

  async addPrize(campaignId: string, dto: CreateLuckyWheelPrizeDto) {
    const campaign = await this.prisma.luckyWheelCampaign.findUnique({
      where: { id: campaignId },
    });
    if (!campaign) throw new NotFoundException('Campaign không tồn tại');

    const prize = await this.prisma.luckyWheelPrize.create({
      data: {
        campaignId,
        name: dto.name,
        type: dto.type as never,
        weight: dto.weight,
        quantity: dto.quantity ?? null,
        valueJson: (dto.valueJson ?? {}) as Prisma.InputJsonValue,
      },
    });
    return this.formatPrize(prize);
  }

  async updatePrize(
    campaignId: string,
    prizeId: string,
    dto: UpdateLuckyWheelPrizeDto,
  ) {
    const existing = await this.prisma.luckyWheelPrize.findFirst({
      where: { id: prizeId, campaignId },
    });
    if (!existing) throw new NotFoundException('Giải thưởng không tồn tại');

    const data: Record<string, unknown> = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.type !== undefined) data.type = dto.type;
    if (dto.weight !== undefined) data.weight = dto.weight;
    if (dto.quantity !== undefined) data.quantity = dto.quantity;
    if (dto.valueJson !== undefined) data.valueJson = dto.valueJson;

    const prize = await this.prisma.luckyWheelPrize.update({
      where: { id: prizeId },
      data: data as never,
    });
    return this.formatPrize(prize);
  }

  async deletePrize(campaignId: string, prizeId: string) {
    const existing = await this.prisma.luckyWheelPrize.findFirst({
      where: { id: prizeId, campaignId },
    });
    if (!existing) throw new NotFoundException('Giải thưởng không tồn tại');
    await this.prisma.luckyWheelPrize.delete({ where: { id: prizeId } });
    return { success: true };
  }

  // ─── Stats & Tracking ────────────────────────────────────────────────────

  async getStats() {
    const [totalCampaigns, activeCampaigns, totalSpins, totalPrizesWon] =
      await Promise.all([
        this.prisma.luckyWheelCampaign.count(),
        this.prisma.luckyWheelCampaign.count({
          where: { status: 'ACTIVE' },
        }),
        this.prisma.luckyWheelSpin.count(),
        this.prisma.luckyWheelSpin.count({
          where: { prizeId: { not: null } },
        }),
      ]);

    const recentSpins = await this.prisma.luckyWheelSpin.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { prize: true, campaign: true },
    });

    return {
      totalCampaigns,
      activeCampaigns,
      totalSpins,
      totalPrizesWon,
      noPrizeCount: totalSpins - totalPrizesWon,
      recentSpins: recentSpins.map((s) => ({
        id: s.id,
        campaignName: s.campaign.name,
        userId: s.userId,
        participantType: s.participantType,
        prizeName: s.prize?.name ?? 'Chúc may mắn lần sau',
        prizeType: s.prize?.type ?? 'NO_PRIZE',
        createdAt: s.createdAt,
      })),
    };
  }

  async getCampaignStats(campaignId: string) {
    const campaign = await this.prisma.luckyWheelCampaign.findUnique({
      where: { id: campaignId },
      include: { prizes: true },
    });
    if (!campaign) throw new NotFoundException('Campaign không tồn tại');

    const [spinCount, prizesByType, creditGrantsCount] = await Promise.all([
      this.prisma.luckyWheelSpin.count({ where: { campaignId } }),
      this.prisma.luckyWheelSpin.groupBy({
        by: ['prizeId'],
        where: { campaignId, prizeId: { not: null } },
        _count: true,
      }),
      this.prisma.luckyWheelCreditGrant.count({ where: { campaignId } }),
    ]);

    const prizeStats = campaign.prizes.map((p) => ({
      id: p.id,
      name: p.name,
      type: p.type,
      quantity: p.quantity,
      quantityGiven: p.quantityGiven,
      weight: p.weight,
    }));

    return {
      campaign: this.formatCampaign(campaign),
      spinCount,
      creditGrantsCount,
      prizeStats,
    };
  }

  async listSpins(query: LuckyWheelSpinQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const where: { campaignId?: string; userId?: string; participantType?: 'USER' | 'DRIVER' } = {};
    if (query.campaignId) where.campaignId = query.campaignId;
    if (query.userId) where.userId = query.userId;
    if (query.participantType) where.participantType = query.participantType;

    const [spins, total] = await Promise.all([
      this.prisma.luckyWheelSpin.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { prize: true, campaign: true },
      }),
      this.prisma.luckyWheelSpin.count({ where }),
    ]);

    return {
      data: spins.map((s) => ({
        id: s.id,
        campaignId: s.campaignId,
        campaignName: s.campaign.name,
        userId: s.userId,
        participantType: s.participantType,
        prizeId: s.prizeId,
        prizeName: s.prize?.name ?? 'Chúc may mắn lần sau',
        prizeType: s.prize?.type ?? 'NO_PRIZE',
        createdAt: s.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ─── Formatters ──────────────────────────────────────────────────────────

  private formatCampaign(c: {
    id: string;
    name: string;
    description: string | null;
    status: string;
    startDate: Date;
    endDate: Date;
    budget: bigint;
    budgetUsed: bigint;
    driverRevenuePerSpin: number;
    userTopUpPerSpin: number;
    userOrderPerSpin: number;
    createdAt: Date;
    updatedAt: Date;
    _count?: { prizes?: number; spins?: number };
    prizes?: unknown[];
  }) {
    return {
      id: c.id,
      name: c.name,
      description: c.description,
      status: c.status,
      startDate: c.startDate,
      endDate: c.endDate,
      budget: Number(c.budget),
      budgetUsed: Number(c.budgetUsed),
      driverRevenuePerSpin: c.driverRevenuePerSpin,
      userTopUpPerSpin: c.userTopUpPerSpin,
      userOrderPerSpin: c.userOrderPerSpin,
      prizeCount: c._count?.prizes ?? c.prizes?.length ?? 0,
      spinCount: c._count?.spins ?? 0,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    };
  }

  private formatCampaignDetail(c: {
    id: string;
    name: string;
    description: string | null;
    status: string;
    startDate: Date;
    endDate: Date;
    budget: bigint;
    budgetUsed: bigint;
    driverRevenuePerSpin: number;
    userTopUpPerSpin: number;
    userOrderPerSpin: number;
    createdAt: Date;
    updatedAt: Date;
    prizes: Array<{
      id: string;
      name: string;
      type: string;
      weight: number;
      quantity: number | null;
      quantityGiven: number;
      valueJson: unknown;
    }>;
    _count?: { spins?: number; creditGrants?: number };
  }) {
    return {
      ...this.formatCampaign(c),
      spinCount: c._count?.spins ?? 0,
      creditGrantsCount: c._count?.creditGrants ?? 0,
      prizes: c.prizes.map((p) => this.formatPrize(p)),
    };
  }

  private formatPrize(p: {
    id: string;
    name: string;
    type: string;
    weight: number;
    quantity: number | null;
    quantityGiven: number;
    valueJson: unknown;
  }) {
    return {
      id: p.id,
      name: p.name,
      type: p.type,
      weight: p.weight,
      quantity: p.quantity,
      quantityGiven: p.quantityGiven,
      valueJson: p.valueJson as Record<string, unknown>,
    };
  }
}
