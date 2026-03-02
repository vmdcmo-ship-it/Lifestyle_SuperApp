import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, run_to_earn_status } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateRunToEarnCampaignDto,
  UpdateRunToEarnCampaignDto,
  CreateRunToEarnPrizeDto,
} from './dto/run-to-earn.dto';

@Injectable()
export class RunToEarnService {
  constructor(private readonly prisma: PrismaService) {}

  async listCampaigns(status?: string) {
    const where: Prisma.RunToEarnCampaignWhereInput = {};
    if (status) where.status = status as run_to_earn_status;

    const campaigns = await this.prisma.runToEarnCampaign.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { prizes: true, participations: true } },
      },
    });

    return campaigns.map((c) => this.formatCampaign(c));
  }

  async getCampaignById(id: string) {
    const c = await this.prisma.runToEarnCampaign.findUnique({
      where: { id },
      include: { prizes: true },
    });
    if (!c) throw new NotFoundException('Campaign không tồn tại');
    return this.formatCampaignDetail(c);
  }

  async createCampaign(dto: CreateRunToEarnCampaignDto) {
    const campaign = await this.prisma.runToEarnCampaign.create({
      data: {
        name: dto.name,
        description: dto.description ?? null,
        status: 'DRAFT',
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        stepsPerXu: dto.stepsPerXu ?? 1000,
        budget: BigInt(dto.budget ?? 0),
      },
    });
    return this.formatCampaign(campaign);
  }

  async updateCampaign(id: string, dto: UpdateRunToEarnCampaignDto) {
    const existing = await this.prisma.runToEarnCampaign.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Campaign không tồn tại');

    const data: Record<string, unknown> = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.startDate !== undefined) data.startDate = new Date(dto.startDate);
    if (dto.endDate !== undefined) data.endDate = new Date(dto.endDate);
    if (dto.stepsPerXu !== undefined) data.stepsPerXu = dto.stepsPerXu;
    if (dto.budget !== undefined) data.budget = BigInt(dto.budget);
    if (dto.status !== undefined) data.status = dto.status;

    const campaign = await this.prisma.runToEarnCampaign.update({
      where: { id },
      data: data as never,
    });
    return this.formatCampaign(campaign);
  }

  async addPrize(campaignId: string, dto: CreateRunToEarnPrizeDto) {
    const campaign = await this.prisma.runToEarnCampaign.findUnique({
      where: { id: campaignId },
    });
    if (!campaign) throw new NotFoundException('Campaign không tồn tại');

    const prize = await this.prisma.runToEarnPrize.create({
      data: {
        campaignId,
        name: dto.name,
        type: dto.type as never,
        rankFrom: dto.rankFrom,
        rankTo: dto.rankTo,
        xuAmount: dto.xuAmount ?? null,
        couponId: dto.couponId ?? null,
        valueJson: (dto.valueJson ?? {}) as Prisma.InputJsonValue,
        quantity: dto.quantity ?? 1,
      },
    });
    return this.formatPrize(prize);
  }

  async getStats() {
    const [totalCampaigns, activeCampaigns, participations, budgetUsed] =
      await Promise.all([
        this.prisma.runToEarnCampaign.count(),
        this.prisma.runToEarnCampaign.count({
          where: { status: 'ACTIVE' },
        }),
        this.prisma.runToEarnParticipation.count(),
        this.prisma.runToEarnCampaign.aggregate({
          _sum: { budgetUsed: true },
        }),
      ]);

    return {
      totalCampaigns,
      activeCampaigns,
      totalParticipations: participations,
      budgetUsedTotal: Number(budgetUsed._sum.budgetUsed ?? 0),
    };
  }

  private formatCampaign(c: {
    id: string;
    name: string;
    description: string | null;
    status: string;
    startDate: Date;
    endDate: Date;
    stepsPerXu: number;
    budget: bigint;
    budgetUsed: bigint;
    createdAt: Date;
    updatedAt: Date;
    _count?: { prizes?: number; participations?: number };
    prizes?: unknown[];
  }) {
    return {
      id: c.id,
      name: c.name,
      description: c.description,
      status: c.status,
      startDate: c.startDate,
      endDate: c.endDate,
      stepsPerXu: c.stepsPerXu,
      budget: Number(c.budget),
      budgetUsed: Number(c.budgetUsed),
      prizeCount: c._count?.prizes ?? c.prizes?.length ?? 0,
      participationCount: c._count?.participations ?? 0,
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
    stepsPerXu: number;
    budget: bigint;
    budgetUsed: bigint;
    createdAt: Date;
    updatedAt: Date;
    prizes: Array<{
      id: string;
      name: string;
      type: string;
      rankFrom: number;
      rankTo: number;
      xuAmount: number | null;
      couponId: string | null;
      valueJson: unknown;
      quantity: number;
      quantityGiven: number;
    }>;
  }) {
    return {
      ...this.formatCampaign(c),
      prizes: c.prizes.map((p) => this.formatPrize(p)),
    };
  }

  private formatPrize(p: {
    id: string;
    name: string;
    type: string;
    rankFrom: number;
    rankTo: number;
    xuAmount: number | null;
    couponId: string | null;
    valueJson: unknown;
    quantity: number;
    quantityGiven: number;
  }) {
    return {
      id: p.id,
      name: p.name,
      type: p.type,
      rankFrom: p.rankFrom,
      rankTo: p.rankTo,
      xuAmount: p.xuAmount,
      couponId: p.couponId,
      valueJson: p.valueJson as Record<string, unknown>,
      quantity: p.quantity,
      quantityGiven: p.quantityGiven,
    };
  }
}
