import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCampaignDto, UpdateCampaignDto } from './dto/campaign.dto';

@Injectable()
export class MarketingService {
  constructor(private readonly prisma: PrismaService) {}

  async getCampaignStats() {
    const [total, draft, active, paused, ended] = await Promise.all([
      this.prisma.campaign.count(),
      this.prisma.campaign.count({ where: { status: 'DRAFT' } }),
      this.prisma.campaign.count({ where: { status: 'ACTIVE' } }),
      this.prisma.campaign.count({ where: { status: 'PAUSED' } }),
      this.prisma.campaign.count({ where: { status: 'ENDED' } }),
    ]);
    return { total, draft, active, paused, ended };
  }

  async listCampaigns(status?: string) {
    const where = status ? { status: status as any } : {};
    const campaigns = await this.prisma.campaign.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return campaigns.map((c) => this.formatCampaign(c));
  }

  async getCampaignById(id: string) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id } });
    if (!campaign) throw new NotFoundException('Chiến dịch không tồn tại');
    return this.formatCampaign(campaign);
  }

  async createCampaign(dto: CreateCampaignDto) {
    const campaign = await this.prisma.campaign.create({
      data: {
        name: dto.name,
        description: dto.description ?? null,
        status: (dto.status ?? 'DRAFT') as any,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        budget: dto.budget != null ? BigInt(dto.budget) : null,
      },
    });
    return this.formatCampaign(campaign);
  }

  async updateCampaign(id: string, dto: UpdateCampaignDto) {
    const existing = await this.prisma.campaign.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Chiến dịch không tồn tại');

    const campaign = await this.prisma.campaign.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.status !== undefined && { status: dto.status as any }),
        ...(dto.startDate !== undefined && { startDate: new Date(dto.startDate) }),
        ...(dto.endDate !== undefined && { endDate: new Date(dto.endDate) }),
        ...(dto.budget !== undefined && { budget: dto.budget != null ? BigInt(dto.budget) : null }),
      },
    });
    return this.formatCampaign(campaign);
  }

  private formatCampaign(c: {
    id: string;
    name: string;
    description: string | null;
    status: string;
    startDate: Date;
    endDate: Date;
    budget: bigint | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: c.id,
      name: c.name,
      description: c.description,
      status: c.status,
      startDate: c.startDate,
      endDate: c.endDate,
      budget: c.budget != null ? Number(c.budget) : null,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    };
  }
}
