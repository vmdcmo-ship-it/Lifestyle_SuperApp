import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateConsultingLeadDto } from './dto/an-cu.dto';
import { AnCuLeadsQueryDto } from './dto/an-cu-query.dto';
import { AnCuArticlesQueryDto } from './dto/an-cu-article.dto';
import { UpdateLeadStatusDto } from './dto/an-cu-update.dto';
import { AnCuLeadNotifier } from './an-cu-lead.notifier';

@Injectable()
export class AnCuService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifier: AnCuLeadNotifier,
  ) {}

  async createConsultingLead(dto: CreateConsultingLeadDto) {
    const lead = await this.prisma.anCuConsultingLead.create({
      data: {
        fullName: dto.fullName.trim(),
        phone: dto.phone.trim(),
        email: dto.email.trim(),
        note: dto.note?.trim() || null,
        source: dto.source ?? 'an_cu_consulting',
      },
    });
    await this.notifier.notifyNewLead(lead);
    return lead;
  }

  async listLeads(query: AnCuLeadsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where: Prisma.AnCuConsultingLeadWhereInput = {};
    if (query.status) where.status = query.status;
    if (query.dateFrom || query.dateTo) {
      where.createdAt = {};
      if (query.dateFrom) {
        (where.createdAt as Prisma.DateTimeFilter).gte = new Date(query.dateFrom + 'T00:00:00.000Z');
      }
      if (query.dateTo) {
        (where.createdAt as Prisma.DateTimeFilter).lte = new Date(query.dateTo + 'T23:59:59.999Z');
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.anCuConsultingLead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.anCuConsultingLead.count({ where }),
    ]);

    return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getLeadById(id: string) {
    const lead = await this.prisma.anCuConsultingLead.findUnique({ where: { id } });
    if (!lead) throw new NotFoundException('Lead không tồn tại');
    return lead;
  }

  async updateLeadStatus(id: string, dto: UpdateLeadStatusDto) {
    await this.getLeadById(id);
    return this.prisma.anCuConsultingLead.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  /** Danh sách bài viết An Cư (chỉ published, public) */
  async listArticles(query: AnCuArticlesQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const now = new Date();
    const where: Prisma.AnCuArticleWhereInput = {
      isPublished: true,
      publishedAt: { lte: now, not: null },
    };

    const [data, total] = await Promise.all([
      this.prisma.anCuArticle.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { publishedAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          featuredImage: true,
          publishedAt: true,
        },
      }),
      this.prisma.anCuArticle.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /** Lấy bài viết theo slug (public) */
  async getArticleBySlug(slug: string) {
    const now = new Date();
    const article = await this.prisma.anCuArticle.findFirst({
      where: {
        slug,
        isPublished: true,
        publishedAt: { lte: now, not: null },
      },
    });
    if (!article) throw new NotFoundException('Không tìm thấy bài viết');
    return article;
  }
}
