import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateContentDto,
  UpdateContentDto,
  ContentListQueryDto,
  ContentLinksQueryDto,
} from './dto/content.dto';

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  private matchesAudience(targetApps: string | null, audience: string): boolean {
    if (!targetApps || targetApps.toUpperCase() === 'ALL') return true;
    const apps = targetApps.split(',').map((a) => a.trim().toUpperCase());
    return apps.includes(audience.toUpperCase());
  }

  async getPublicLinks(query: ContentLinksQueryDto) {
    const locale = query.locale ?? 'vi';
    const audience = query.audience?.toUpperCase() ?? '';
    const now = new Date();

    const docs = await this.prisma.legal_documents.findMany({
      where: {
        locale,
        isActive: true,
        effectiveFrom: { lte: now },
        OR: [{ effectiveTo: null }, { effectiveTo: { gte: now } }],
      },
      orderBy: { slug: 'asc' },
      select: { slug: true, title: true, targetApps: true },
    });

    const webBaseUrl =
      process.env.WEB_APP_URL ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      'https://lifestyle-app.com';

    const filtered = docs
      .filter((d) => this.matchesAudience(d.targetApps, audience))
      .map((d) => ({
        slug: d.slug,
        title: d.title,
        url: `${webBaseUrl.replace(/\/$/, '')}/content/${d.slug}?locale=${locale}`,
      }));

    return { items: filtered };
  }

  async getBySlug(slug: string, locale = 'vi') {
    const now = new Date();
    const doc = await this.prisma.legal_documents.findFirst({
      where: {
        slug,
        locale,
        isActive: true,
        effectiveFrom: { lte: now },
        OR: [
          { effectiveTo: null },
          { effectiveTo: { gte: now } },
        ],
      },
      orderBy: { effectiveFrom: 'desc' },
    });
    if (!doc) throw new NotFoundException('Không tìm thấy văn bản');
    return {
      id: doc.id,
      slug: doc.slug,
      locale: doc.locale,
      title: doc.title,
      content: doc.content,
      version: doc.version,
      effectiveFrom: doc.effectiveFrom,
      effectiveTo: doc.effectiveTo,
    };
  }

  async list(query: ContentListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: Record<string, unknown> = {};
    if (query.slug) where.slug = query.slug;
    if (query.locale) where.locale = query.locale;

    const [data, total] = await Promise.all([
      this.prisma.legal_documents.findMany({
        where,
        orderBy: [{ slug: 'asc' }, { effectiveFrom: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.legal_documents.count({ where }),
    ]);

    return {
      data: data.map((d) => ({
        id: d.id,
        slug: d.slug,
        locale: d.locale,
        title: d.title,
        version: d.version,
        effectiveFrom: d.effectiveFrom,
        effectiveTo: d.effectiveTo,
        isActive: d.isActive,
        targetApps: (d as { targetApps?: string | null }).targetApps ?? null,
        createdAt: d.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(dto: CreateContentDto) {
    const existing = await this.prisma.legal_documents.findFirst({
      where: {
        slug: dto.slug,
        locale: dto.locale ?? 'vi',
      },
    });
    if (existing) {
      throw new ConflictException(
        `Slug "${dto.slug}" + locale "${dto.locale ?? 'vi'}" đã tồn tại`
      );
    }

    const maxVersion = await this.prisma.legal_documents.aggregate({
      where: { slug: dto.slug, locale: dto.locale ?? 'vi' },
      _max: { version: true },
    });
    const version = (maxVersion._max.version ?? 0) + 1;

    const doc = await this.prisma.legal_documents.create({
      data: {
        slug: dto.slug,
        locale: dto.locale ?? 'vi',
        title: dto.title,
        content: dto.content,
        version,
        effectiveFrom: new Date(dto.effectiveFrom),
        effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : null,
        isActive: dto.isActive ?? true,
        targetApps: dto.targetApps ?? null,
      },
    });

    return this.formatDoc(doc);
  }

  async getById(id: string) {
    const doc = await this.prisma.legal_documents.findUnique({
      where: { id },
    });
    if (!doc) throw new NotFoundException('Không tìm thấy văn bản');
    return this.formatDoc(doc);
  }

  async update(id: string, dto: UpdateContentDto) {
    const existing = await this.prisma.legal_documents.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Không tìm thấy văn bản');

    const doc = await this.prisma.legal_documents.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.content !== undefined && { content: dto.content }),
        ...(dto.effectiveFrom !== undefined && {
          effectiveFrom: new Date(dto.effectiveFrom),
        }),
        ...(dto.effectiveTo !== undefined && {
          effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : null,
        }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
        ...(dto.targetApps !== undefined && { targetApps: dto.targetApps }),
      },
    });

    return this.formatDoc(doc);
  }

  private formatDoc(d: {
    id: string;
    slug: string;
    locale: string;
    title: string;
    content: string;
    version: number;
    effectiveFrom: Date;
    effectiveTo: Date | null;
    isActive: boolean;
    targetApps?: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: d.id,
      slug: d.slug,
      locale: d.locale,
      title: d.title,
      content: d.content,
      version: d.version,
      effectiveFrom: d.effectiveFrom,
      effectiveTo: d.effectiveTo,
      isActive: d.isActive,
      targetApps: d.targetApps ?? null,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    };
  }
}
