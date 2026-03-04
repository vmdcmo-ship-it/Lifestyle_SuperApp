import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateMerchantDto,
  CreateSellerLeadDto,
  SellerLeadQueryDto,
  UpdateSellerLeadStatusDto,
  UpdateMerchantDto,
  VerifyMerchantDto,
  CreateCategoryDto,
  CreateProductDto,
  UpdateProductDto,
  MerchantListQueryDto,
  ProductListQueryDto,
} from './dto/merchant.dto';

@Injectable()
export class MerchantsService {
  constructor(private readonly prisma: PrismaService) {}

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private async generateMerchantNumber(): Promise<string> {
    const count = await this.prisma.merchants.count();
    return `LS-MC-${String(count + 1).padStart(6, '0')}`;
  }

  private generateSku(merchantNumber: string, count: number): string {
    return `${merchantNumber}-P${String(count).padStart(4, '0')}`;
  }

  // ═══ MERCHANT CRUD ═══════════════════════════════════════════════════════

  async createSellerLead(dto: CreateSellerLeadDto) {
    const lead = await this.prisma.merchantSellerLead.create({
      data: {
        storeName: dto.storeName.trim(),
        contactName: dto.contactName.trim(),
        email: dto.email.trim(),
        phone: dto.phone.trim(),
        businessGroup: dto.businessGroup,
        subCategory: dto.subCategory.trim(),
        category: dto.subCategory.trim(),
        message: dto.message?.trim() || null,
        source: dto.source || 'partner_web',
      },
    });
    return { id: lead.id, message: 'Đăng ký đã được gửi thành công' };
  }

  async listSellerLeads(query: SellerLeadQueryDto) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 20));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;

    const [data, total] = await Promise.all([
      this.prisma.merchantSellerLead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.merchantSellerLead.count({ where }),
    ]);

    return {
      data: data.map((l) => ({
        id: l.id,
        storeName: l.storeName,
        contactName: l.contactName,
        email: l.email,
        phone: l.phone,
        businessGroup: l.businessGroup,
        subCategory: l.subCategory,
        category: l.category,
        message: l.message,
        source: l.source,
        status: l.status,
        createdAt: l.createdAt.toISOString(),
      })),
      total,
      page,
      limit,
    };
  }

  async updateSellerLeadStatus(id: string, dto: UpdateSellerLeadStatusDto) {
    const lead = await this.prisma.merchantSellerLead.findUnique({ where: { id } });
    if (!lead) throw new NotFoundException('Lead không tồn tại');
    const updated = await this.prisma.merchantSellerLead.update({
      where: { id },
      data: { status: dto.status },
    });
    return { id: updated.id, status: updated.status };
  }

  async create(userId: string, dto: CreateMerchantDto) {
    const merchantNumber = await this.generateMerchantNumber();
    const slug = this.slugify(dto.name) + '-' + merchantNumber.toLowerCase();

    const merchant = await this.prisma.merchants.create({
      data: {
        owner_user_id: userId,
        merchant_number: merchantNumber,
        name: dto.name,
        slug,
        type: dto.type as any,
        description: dto.description || null,
        phone: dto.phone,
        email: dto.email || null,
        street: dto.street,
        ward: dto.ward || null,
        district: dto.district,
        city: dto.city,
        latitude: dto.latitude,
        longitude: dto.longitude,
        full_address: dto.fullAddress,
      },
    });

    return this.formatMerchant(merchant);
  }

  async findAll(query: MerchantListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = { deleted_at: null, status: 'ACTIVE' };
    if (query.type) where.type = query.type;
    if (query.city) where.city = { contains: query.city, mode: 'insensitive' };
    if (query.search) where.name = { contains: query.search, mode: 'insensitive' };

    const [merchants, total] = await Promise.all([
      this.prisma.merchants.findMany({
        where,
        orderBy: { rating_overall: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.merchants.count({ where }),
    ]);

    return {
      data: merchants.map((m) => this.formatMerchant(m)),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const merchant = await this.prisma.merchants.findUnique({
      where: { id },
      include: { categories: { orderBy: { sortOrder: 'asc' } } },
    });
    if (!merchant) throw new NotFoundException('Không tìm thấy cửa hàng');
    return this.formatMerchant(merchant);
  }

  async adminList(query: MerchantListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = { deleted_at: null };
    if (query.type) where.type = query.type;
    if (query.city) where.city = { contains: query.city, mode: 'insensitive' };
    if (query.search) where.name = { contains: query.search, mode: 'insensitive' };
    if (query.status) where.status = query.status as any;

    const [merchants, total] = await Promise.all([
      this.prisma.merchants.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.merchants.count({ where }),
    ]);

    return {
      data: merchants.map((m) => this.formatMerchant(m)),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async adminGetById(id: string) {
    const merchant = await this.prisma.merchants.findUnique({
      where: { id },
      include: { categories: { orderBy: { sortOrder: 'asc' } } },
    });
    if (!merchant) throw new NotFoundException('Không tìm thấy cửa hàng');
    return this.formatMerchant(merchant);
  }

  async adminVerify(id: string, adminId: string, dto: VerifyMerchantDto) {
    const merchant = await this.prisma.merchants.findUnique({
      where: { id },
    });
    if (!merchant) throw new NotFoundException('Không tìm thấy cửa hàng');
    if (merchant.status !== 'PENDING') {
      throw new BadRequestException(`Cửa hàng đang ở trạng thái ${merchant.status}`);
    }

    const updates: Record<string, unknown> = {
      verified_at: new Date(),
      verified_by: adminId,
    };

    if (dto.action === 'APPROVED') {
      updates.status = 'ACTIVE';
      updates.is_verified = true;
      updates.rejection_reason = null;
    } else {
      updates.status = 'REJECTED';
      updates.is_verified = false;
      updates.rejection_reason = dto.rejectionReason || 'Không đạt yêu cầu xét duyệt';
    }

    const updated = await this.prisma.merchants.update({
      where: { id },
      data: updates,
    });
    return this.formatMerchant(updated);
  }

  async findMyMerchants(userId: string) {
    const merchants = await this.prisma.merchants.findMany({
      where: { owner_user_id: userId, deleted_at: null },
      orderBy: { created_at: 'desc' },
    });
    return merchants.map((m) => this.formatMerchant(m));
  }

  async update(id: string, userId: string, dto: UpdateMerchantDto) {
    const merchant = await this.prisma.merchants.findUnique({ where: { id } });
    if (!merchant) throw new NotFoundException('Không tìm thấy cửa hàng');
    if (merchant.owner_user_id !== userId) {
      throw new BadRequestException('Bạn không có quyền cập nhật cửa hàng này');
    }

    const data: any = {};
    if (dto.name) { data.name = dto.name; data.slug = this.slugify(dto.name) + '-' + merchant.merchant_number.toLowerCase(); }
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.phone) data.phone = dto.phone;
    if (dto.email !== undefined) data.email = dto.email;
    if (dto.street) data.street = dto.street;
    if (dto.ward !== undefined) data.ward = dto.ward;
    if (dto.district) data.district = dto.district;
    if (dto.city) data.city = dto.city;
    if (dto.latitude) data.latitude = dto.latitude;
    if (dto.longitude) data.longitude = dto.longitude;
    if (dto.fullAddress) data.full_address = dto.fullAddress;
    if (dto.logoUrl) data.logo_url = dto.logoUrl;
    if (dto.coverImages) data.cover_images = dto.coverImages;
    if (dto.brandColor) data.brand_color = dto.brandColor;

    const updated = await this.prisma.merchants.update({ where: { id }, data });
    return this.formatMerchant(updated);
  }

  // ═══ CATEGORY CRUD ═══════════════════════════════════════════════════════

  async createCategory(merchantId: string, userId: string, dto: CreateCategoryDto) {
    await this.ensureOwnership(merchantId, userId);
    const slug = this.slugify(dto.name);

    const category = await this.prisma.category.create({
      data: {
        merchantId,
        name: dto.name,
        slug,
        description: dto.description || null,
        imageUrl: dto.imageUrl || null,
        sortOrder: dto.sortOrder ?? 0,
      },
    });

    return category;
  }

  async getCategories(merchantId: string) {
    return this.prisma.category.findMany({
      where: { merchantId, isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  // ═══ PRODUCT CRUD ══════════════════════════════════════════════════════════

  async createProduct(merchantId: string, userId: string, dto: CreateProductDto) {
    await this.ensureOwnership(merchantId, userId);

    const productCount = await this.prisma.product.count({ where: { merchantId } });
    const merchant = await this.prisma.merchants.findUnique({ where: { id: merchantId } });
    const sku = this.generateSku(merchant!.merchant_number, productCount + 1);
    const slug = this.slugify(dto.name);

    const product = await this.prisma.product.create({
      data: {
        merchantId,
        categoryId: dto.categoryId || null,
        sku,
        name: dto.name,
        slug,
        description: dto.description || null,
        price: dto.price,
        comparePrice: dto.comparePrice || null,
        images: dto.images || [],
        stock: dto.stock ?? 0,
        preparationTimeMin: dto.preparationTimeMin || null,
        tags: dto.tags || [],
      },
    });

    return this.formatProduct(product);
  }

  async getProducts(merchantId: string, query: ProductListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where: any = { merchantId, isActive: true, deletedAt: null };
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.search) where.name = { contains: query.search, mode: 'insensitive' };

    let orderBy: any = { createdAt: 'desc' };
    switch (query.sortBy) {
      case 'price_asc': orderBy = { price: 'asc' }; break;
      case 'price_desc': orderBy = { price: 'desc' }; break;
      case 'rating': orderBy = { rating: 'desc' }; break;
      case 'popular': orderBy = { totalSold: 'desc' }; break;
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: { category: { select: { id: true, name: true } } },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products.map((p) => this.formatProduct(p)),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getProduct(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { category: { select: { id: true, name: true } } },
    });
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');
    return this.formatProduct(product);
  }

  async updateProduct(productId: string, userId: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');
    await this.ensureOwnership(product.merchantId, userId);

    const data: any = {};
    if (dto.name) { data.name = dto.name; data.slug = this.slugify(dto.name); }
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.price !== undefined) data.price = dto.price;
    if (dto.comparePrice !== undefined) data.comparePrice = dto.comparePrice;
    if (dto.images) data.images = dto.images;
    if (dto.stock !== undefined) data.stock = dto.stock;
    if (dto.isAvailable !== undefined) data.isAvailable = dto.isAvailable;
    if (dto.categoryId !== undefined) data.categoryId = dto.categoryId;
    if (dto.preparationTimeMin !== undefined) data.preparationTimeMin = dto.preparationTimeMin;
    if (dto.tags) data.tags = dto.tags;

    const updated = await this.prisma.product.update({ where: { id: productId }, data });
    return this.formatProduct(updated);
  }

  async deleteProduct(productId: string, userId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');
    await this.ensureOwnership(product.merchantId, userId);

    await this.prisma.product.update({
      where: { id: productId },
      data: { isActive: false, deletedAt: new Date() },
    });
    return { message: 'Đã xóa sản phẩm' };
  }

  async getMerchantStats(merchantId: string, userId: string) {
    await this.ensureOwnership(merchantId, userId);

    const [totalProducts, totalOrders, merchant] = await Promise.all([
      this.prisma.product.count({ where: { merchantId, isActive: true, deletedAt: null } }),
      this.prisma.order.count({ where: { merchantId } }),
      this.prisma.merchants.findUnique({ where: { id: merchantId } }),
    ]);

    return {
      totalProducts,
      totalOrders,
      totalRevenue: Number(merchant?.total_revenue || 0),
      rating: Number(merchant?.rating_overall || 0),
      totalReviews: merchant?.total_reviews || 0,
      followerCount: merchant?.follower_count || 0,
    };
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private async ensureOwnership(merchantId: string, userId: string) {
    const merchant = await this.prisma.merchants.findUnique({ where: { id: merchantId } });
    if (!merchant) throw new NotFoundException('Không tìm thấy cửa hàng');
    if (merchant.owner_user_id !== userId) {
      throw new BadRequestException('Bạn không có quyền quản lý cửa hàng này');
    }
    return merchant;
  }

  private formatMerchant(m: any) {
    return {
      id: m.id,
      merchantNumber: m.merchant_number,
      name: m.name,
      slug: m.slug,
      type: m.type,
      description: m.description,
      logoUrl: m.logo_url,
      coverImages: m.cover_images,
      phone: m.phone,
      email: m.email,
      address: {
        street: m.street,
        ward: m.ward,
        district: m.district,
        city: m.city,
        fullAddress: m.full_address,
        latitude: Number(m.latitude),
        longitude: Number(m.longitude),
      },
      rating: {
        overall: Number(m.rating_overall),
        productQuality: Number(m.rating_product_quality),
        fulfillmentSpeed: Number(m.rating_fulfillment_speed),
        service: Number(m.rating_service),
        totalReviews: m.total_reviews,
      },
      stats: {
        totalOrders: m.total_orders,
        totalRevenue: Number(m.total_revenue),
        followerCount: m.follower_count,
      },
      status: m.status,
      isVerified: m.is_verified,
      isPremium: m.is_premium,
      categories: m.categories || undefined,
      createdAt: m.created_at,
    };
  }

  private formatProduct(p: any) {
    return {
      id: p.id,
      sku: p.sku,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: Number(p.price),
      comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
      currency: p.currency,
      images: p.images,
      thumbnailUrl: p.thumbnailUrl,
      stock: p.stock,
      isAvailable: p.isAvailable,
      rating: Number(p.rating),
      totalReviews: p.totalReviews,
      totalSold: p.totalSold,
      preparationTimeMin: p.preparationTimeMin,
      tags: p.tags,
      category: p.category || undefined,
      createdAt: p.createdAt,
    };
  }
}
