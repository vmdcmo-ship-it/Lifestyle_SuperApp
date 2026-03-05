import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Prisma, training_material_type } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateTrainingCategoryDto,
  UpdateTrainingCategoryDto,
  CreateTrainingMaterialDto,
  UpdateTrainingMaterialDto,
  TrainingMaterialListQueryDto,
  TrainingLinksQueryDto,
} from './dto/training.dto';

@Injectable()
export class TrainingService {
  constructor(private readonly prisma: PrismaService) {}

  private matchesAudience(targetApps: string | null, audience: string): boolean {
    if (!targetApps || targetApps.toUpperCase() === 'ALL') return true;
    const apps = targetApps.split(',').map((a) => a.trim().toUpperCase());
    return apps.includes(audience.toUpperCase());
  }

  async listCategories(isActive?: boolean) {
    const where: { isActive?: boolean } = {};
    if (isActive !== undefined) where.isActive = isActive;
    return this.prisma.training_category.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: { _count: { select: { materials: true } } },
    });
  }

  async createCategory(dto: CreateTrainingCategoryDto) {
    const existing = await this.prisma.training_category.findUnique({
      where: { slug: dto.slug },
    });
    if (existing) {
      throw new ConflictException(`Slug "${dto.slug}" đã tồn tại`);
    }
    return this.prisma.training_category.create({
      data: {
        slug: dto.slug,
        name: dto.name,
        description: dto.description,
        sortOrder: dto.sortOrder ?? 0,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async getCategoryById(id: string) {
    const cat = await this.prisma.training_category.findUnique({
      where: { id },
      include: { materials: { orderBy: { sortOrder: 'asc' } } },
    });
    if (!cat) throw new NotFoundException('Không tìm thấy danh mục');
    return cat;
  }

  async updateCategory(id: string, dto: UpdateTrainingCategoryDto) {
    const existing = await this.prisma.training_category.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Không tìm thấy danh mục');
    return this.prisma.training_category.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });
  }

  async listMaterials(query: TrainingMaterialListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: Prisma.training_materialWhereInput = {};
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.materialType) where.materialType = query.materialType as training_material_type;

    const [data, total] = await Promise.all([
      this.prisma.training_material.findMany({
        where,
        include: { category: { select: { id: true, slug: true, name: true } } },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.training_material.count({ where }),
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

  async createMaterial(dto: CreateTrainingMaterialDto) {
    const category = await this.prisma.training_category.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category) throw new NotFoundException('Không tìm thấy danh mục');

    const existing = await this.prisma.training_material.findFirst({
      where: {
        categoryId: dto.categoryId,
        slug: dto.slug,
        locale: dto.locale ?? 'vi',
      },
    });
    if (existing) {
      throw new ConflictException(
        `Slug "${dto.slug}" đã tồn tại trong danh mục này`
      );
    }

    return this.prisma.training_material.create({
      data: {
        categoryId: dto.categoryId,
        slug: dto.slug,
        title: dto.title,
        content: dto.content,
        materialType: dto.materialType as any,
        targetApps: dto.targetApps ?? null,
        sortOrder: dto.sortOrder ?? 0,
        isPublished: dto.isPublished ?? false,
        publishedAt: dto.isPublished ? new Date() : null,
        locale: dto.locale ?? 'vi',
      },
      include: { category: { select: { id: true, slug: true, name: true } } },
    });
  }

  async getMaterialById(id: string) {
    const m = await this.prisma.training_material.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!m) throw new NotFoundException('Không tìm thấy tài liệu');
    return m;
  }

  async getMaterialBySlug(slug: string, locale = 'vi') {
    const m = await this.prisma.training_material.findFirst({
      where: { slug, locale, isPublished: true },
      include: { category: { select: { id: true, slug: true, name: true } } },
    });
    if (!m) throw new NotFoundException('Không tìm thấy tài liệu');
    return m;
  }

  async updateMaterial(id: string, dto: UpdateTrainingMaterialDto) {
    const existing = await this.prisma.training_material.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Không tìm thấy tài liệu');
    return this.prisma.training_material.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.content !== undefined && { content: dto.content }),
        ...(dto.targetApps !== undefined && { targetApps: dto.targetApps }),
        ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
        ...(dto.isPublished !== undefined && {
          isPublished: dto.isPublished,
          publishedAt: dto.isPublished ? new Date() : existing.publishedAt,
        }),
      },
      include: { category: { select: { id: true, slug: true, name: true } } },
    });
  }

  async getPublicLinks(query: TrainingLinksQueryDto) {
    const locale = query.locale ?? 'vi';
    const audience = query.audience?.toUpperCase() ?? '';
    const now = new Date();

    const materials = await this.prisma.training_material.findMany({
      where: {
        locale,
        isPublished: true,
        publishedAt: { lte: now },
        category: { isActive: true },
      },
      include: {
        category: { select: { slug: true, name: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });

    const webBaseUrl =
      process.env.WEB_APP_URL ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      'https://www.vmd.asia';

    const filtered = materials
      .filter((m) => this.matchesAudience(m.targetApps, audience))
      .map((m) => ({
        slug: m.slug,
        title: m.title,
        categorySlug: m.category.slug,
        categoryName: m.category.name,
        materialType: m.materialType,
        url: `${webBaseUrl.replace(/\/$/, '')}/training/${m.slug}?locale=${locale}`,
      }));

    const byCategory = filtered.reduce(
      (acc, item) => {
        const key = item.categorySlug;
        if (!acc[key]) acc[key] = { categoryName: item.categoryName, items: [] };
        acc[key].items.push(item);
        return acc;
      },
      {} as Record<string, { categoryName: string; items: typeof filtered }>
    );

    return { items: filtered, byCategory };
  }
}
