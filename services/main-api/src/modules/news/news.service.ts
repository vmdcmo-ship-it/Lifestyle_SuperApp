import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateNewsArticleDto,
  UpdateNewsArticleDto,
  NewsListQueryDto,
  NewsLinksQueryDto,
} from './dto/news.dto';

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  private matchesAudience(targetApps: string | null, audience: string): boolean {
    if (!targetApps || targetApps.toUpperCase() === 'ALL') return true;
    const apps = targetApps.split(',').map((a) => a.trim().toUpperCase());
    return apps.includes(audience.toUpperCase());
  }

  async list(query: NewsListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: { isPublished?: boolean } = {};
    if (query.isPublished !== undefined) where.isPublished = query.isPublished;

    const [data, total] = await Promise.all([
      this.prisma.news_article.findMany({
        where,
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.news_article.count({ where }),
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

  async create(dto: CreateNewsArticleDto) {
    const existing = await this.prisma.news_article.findUnique({
      where: { slug: dto.slug },
    });
    if (existing) {
      throw new ConflictException(`Slug "${dto.slug}" đã tồn tại`);
    }
    return this.prisma.news_article.create({
      data: {
        slug: dto.slug,
        title: dto.title,
        excerpt: dto.excerpt,
        content: dto.content,
        featuredImage: dto.featuredImage,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
        targetApps: dto.targetApps ?? null,
        isPublished: dto.isPublished ?? false,
        publishedAt: dto.isPublished ? new Date() : null,
        locale: dto.locale ?? 'vi',
        author: dto.author,
      },
    });
  }

  async getById(id: string) {
    const article = await this.prisma.news_article.findUnique({
      where: { id },
    });
    if (!article) throw new NotFoundException('Không tìm thấy bài viết');
    return article;
  }

  async getBySlug(slug: string, locale = 'vi') {
    const article = await this.prisma.news_article.findFirst({
      where: { slug, locale, isPublished: true },
    });
    if (!article) throw new NotFoundException('Không tìm thấy bài viết');
    return article;
  }

  async update(id: string, dto: UpdateNewsArticleDto) {
    const existing = await this.prisma.news_article.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Không tìm thấy bài viết');
    return this.prisma.news_article.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.excerpt !== undefined && { excerpt: dto.excerpt }),
        ...(dto.content !== undefined && { content: dto.content }),
        ...(dto.featuredImage !== undefined && { featuredImage: dto.featuredImage }),
        ...(dto.seoTitle !== undefined && { seoTitle: dto.seoTitle }),
        ...(dto.seoDescription !== undefined && { seoDescription: dto.seoDescription }),
        ...(dto.targetApps !== undefined && { targetApps: dto.targetApps }),
        ...(dto.isPublished !== undefined && {
          isPublished: dto.isPublished,
          publishedAt: dto.isPublished ? new Date() : existing.publishedAt,
        }),
        ...(dto.author !== undefined && { author: dto.author }),
      },
    });
  }

  async getPublicLinks(query: NewsLinksQueryDto) {
    const locale = query.locale ?? 'vi';
    const audience = query.audience?.toUpperCase() ?? '';
    const now = new Date();

    const articles = await this.prisma.news_article.findMany({
      where: {
        locale,
        isPublished: true,
        publishedAt: { lte: now },
      },
      orderBy: { publishedAt: 'desc' },
    });

    const webBaseUrl =
      process.env.WEB_APP_URL ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      'https://www.vmd.asia';

    const filtered = articles
      .filter((a) => this.matchesAudience(a.targetApps, audience))
      .map((a) => ({
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        publishedAt: a.publishedAt,
        url: `${webBaseUrl.replace(/\/$/, '')}/news/${a.slug}?locale=${locale}`,
      }));

    return { items: filtered };
  }
}
