import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateConsultingLeadDto } from './dto/wealth.dto';
import { WealthLeadsQueryDto } from './dto/wealth-query.dto';
import { UpdateLeadStatusDto } from './dto/wealth-update.dto';
import { WealthLeadNotifier } from './wealth-lead.notifier';

@Injectable()
export class WealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifier: WealthLeadNotifier,
  ) {}

  async createConsultingLead(dto: CreateConsultingLeadDto) {
    const lead = await this.prisma.wealthConsultingLead.create({
      data: {
        fullName: dto.fullName.trim(),
        phone: dto.phone.trim(),
        email: dto.email.trim(),
        note: dto.note?.trim() || null,
        source: dto.source ?? 'wealth_consulting',
      },
    });
    await this.notifier.notifyNewLead(lead);
    return lead;
  }

  async listLeads(query: WealthLeadsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where: Prisma.WealthConsultingLeadWhereInput = {};
    if (query.status) where.status = query.status;
    if (query.dateFrom || query.dateTo) {
      where.createdAt = {};
      if (query.dateFrom) {
        (where.createdAt as Prisma.DateTimeFilter).gte = new Date(
          query.dateFrom + 'T00:00:00.000Z',
        );
      }
      if (query.dateTo) {
        (where.createdAt as Prisma.DateTimeFilter).lte = new Date(
          query.dateTo + 'T23:59:59.999Z',
        );
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.wealthConsultingLead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.wealthConsultingLead.count({ where }),
    ]);

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getLeadById(id: string) {
    const lead = await this.prisma.wealthConsultingLead.findUnique({
      where: { id },
    });
    if (!lead) throw new NotFoundException('Lead không tồn tại');
    return lead;
  }

  async updateLeadStatus(id: string, dto: UpdateLeadStatusDto) {
    await this.getLeadById(id);
    return this.prisma.wealthConsultingLead.update({
      where: { id },
      data: { status: dto.status },
    });
  }
}
