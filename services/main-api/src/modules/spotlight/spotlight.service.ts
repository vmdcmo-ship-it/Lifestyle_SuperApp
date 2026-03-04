import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import {
  CreateRedcommentDto,
  UpdateRedcommentDto,
  CreateReviewDto,
  CreateCommentDto,
  CreateSpotlightPostDto,
} from './dto/spotlight.dto';

@Injectable()
export class SpotlightService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  // ═══════════════════════════════════════════════════════════════════════════
  // REDCOMMENTS CRUD
  // ═══════════════════════════════════════════════════════════════════════════

  async createRedcomment(userId: string, dto: CreateRedcommentDto) {
    // 1. Check or create creator profile
    let creator = await this.prisma.creator.findUnique({
      where: { userId },
    });

    if (!creator) {
      const creatorCount = await this.prisma.creator.count();
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { firstName: true, lastName: true },
      });
      creator = await this.prisma.creator.create({
        data: {
          userId,
          creator_number: `LS-KOC-${String(creatorCount + 1).padStart(5, '0')}`,
          affiliate_id: `LS-AFF-${String(creatorCount + 1).padStart(5, '0')}`,
          display_name: user ? `${user.firstName} ${user.lastName}` : 'Creator',
          tier: 'NEWCOMER',
        },
      });
    }

    // 2. Generate redcomment number & slug
    const rcCount = await this.prisma.redcomment.count();
    const redcommentNumber = `LS-RC-${String(rcCount + 1).padStart(6, '0')}`;
    const slug = this.generateSlug(dto.title);

    // 3. Create redcomment
    const redcomment = await this.prisma.redcomment.create({
      data: {
        redcommentNumber,
        creatorId: creator.id,
        format: dto.format as any,
        targetType: dto.targetType as any,
        title: dto.title,
        seo_slug: slug,
        description: dto.content,
        target_name: dto.title, // Default target name
        overall_rating: 0,
        cover_image_url: '',
        target_tags: dto.tags || [],
        seo_keywords: dto.tags || [],
        videoDuration: dto.videoDuration,
        status: 'DRAFT',
      },
      include: {
        creator: {
          include: {
            user: {
              select: { firstName: true, lastName: true, avatar_url: true },
            },
          },
        },
      },
    });

    return redcomment;
  }

  // ─── CREATE SPOTLIGHT POST (Video Embed - Phase 1) ────────────────────

  async createSpotlightPost(userId: string, dto: CreateSpotlightPostDto) {
    const { video_source, thumbnailUrl, coverImageUrl } = this.parseVideoUrlAndThumbnail(dto.videoUrl);
    if (!video_source) {
      throw new BadRequestException('URL phải là YouTube hoặc Facebook');
    }

    let creator = await this.prisma.creator.findUnique({ where: { userId } });
    if (!creator) {
      const creatorCount = await this.prisma.creator.count();
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { firstName: true, lastName: true },
      });
      creator = await this.prisma.creator.create({
        data: {
          userId,
          creator_number: `LS-KOC-${String(creatorCount + 1).padStart(5, '0')}`,
          affiliate_id: `LS-AFF-${String(creatorCount + 1).padStart(5, '0')}`,
          display_name: user ? `${user.firstName} ${user.lastName}` : 'Creator',
          tier: 'NEWCOMER',
        },
      });
    }

    let spotlightCategoryId: string | null = null;
    if (dto.categorySlug) {
      const cat = await this.prisma.spotlightCategory.findUnique({
        where: { slug: dto.categorySlug },
      });
      if (cat) spotlightCategoryId = cat.id;
    }

    if (dto.regionIds && dto.regionIds.length > 0) {
      const regions = await this.prisma.region.findMany({
        where: { id: { in: dto.regionIds } },
        select: { id: true },
      });
      if (regions.length !== dto.regionIds.length) {
        throw new BadRequestException('Một hoặc nhiều địa điểm không tồn tại');
      }
    }

    const rcCount = await this.prisma.redcomment.count();
    const redcommentNumber = `LS-RC-${String(rcCount + 1).padStart(6, '0')}`;
    const slug = this.generateSlug(dto.title);
    const now = new Date();

    const redcomment = await this.prisma.redcomment.create({
      data: {
        redcommentNumber,
        creatorId: creator.id,
        format: 'VIDEO_REEL',
        targetType: dto.targetType as any,
        title: dto.title,
        description: dto.description ?? null,
        seo_slug: slug,
        target_name: dto.title,
        overall_rating: 0,
        cover_image_url: coverImageUrl,
        target_tags: dto.tags || [],
        seo_keywords: dto.tags || [],
        video_url: dto.videoUrl,
        video_source,
        thumbnailUrl: thumbnailUrl || coverImageUrl,
        videoDuration: dto.videoDuration ?? null,
        spotlight_category_id: spotlightCategoryId,
        status: 'APPROVED',
        publishedAt: now,
        redcomment_regions: dto.regionIds?.length
          ? { create: dto.regionIds.map((rid) => ({ region_id: rid })) }
          : undefined,
      },
      include: {
        redcomment_regions: { include: { region: true } },
        spotlight_category: true,
      },
    });

    if (dto.ctaLinks && dto.ctaLinks.length > 0) {
      await this.prisma.cta_buttons.createMany({
        data: dto.ctaLinks.map((link, idx) => ({
          redcomment_id: redcomment.id,
          text: link.text.substring(0, 50),
          action: 'EXTERNAL_LINK' as any,
          target_url: link.url,
          position: 'BOTTOM_RIGHT' as any,
          sort_order: idx,
          link_type: link.linkType || null,
          price_display: link.priceDisplay || null,
          internal_product_id: link.internalProductId || null,
        })),
      });
    }

    // Phase 2.4: Notify followers when creator posts new video
    this.notifyFollowersNewVideo(creator.id, redcomment, creator.display_name).catch(() => {});

    return {
      id: redcomment.id,
      redcommentNumber: redcomment.redcommentNumber,
      seoSlug: redcomment.seo_slug,
      status: redcomment.status,
      createdAt: redcomment.createdAt,
    };
  }

  private parseVideoUrlAndThumbnail(url: string): {
    video_source: 'YOUTUBE' | 'FACEBOOK' | null;
    thumbnailUrl: string | null;
    coverImageUrl: string;
  } {
    const u = url.toLowerCase();
    let videoId: string | null = null;
    let video_source: 'YOUTUBE' | 'FACEBOOK' | null = null;

    if (u.includes('youtube.com') || u.includes('youtu.be')) {
      video_source = 'YOUTUBE';
      const m1 = url.match(/[?&]v=([^&]+)/);
      const m2 = url.match(/youtu\.be\/([^?]+)/);
      const m3 = url.match(/youtube\.com\/embed\/([^?]+)/);
      videoId = m1?.[1] || m2?.[1] || m3?.[1] || null;
    } else if (u.includes('facebook.com') || u.includes('fb.watch') || u.includes('fb.com') || u.includes('fb.reel')) {
      video_source = 'FACEBOOK';
    }

    const placeholder = 'https://placehold.co/640x360/1a1a2e/eee?text=Video';
    if (video_source === 'YOUTUBE' && videoId) {
      // hqdefault.jpg luôn tồn tại; maxresdefault có thể 404 với video cũ/ngắn
      const thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      return { video_source, thumbnailUrl: thumb, coverImageUrl: thumb };
    }
    if (video_source === 'FACEBOOK') {
      return { video_source, thumbnailUrl: null, coverImageUrl: placeholder };
    }
    return { video_source: null, thumbnailUrl: null, coverImageUrl: placeholder };
  }

  // ─── ATTACH MEDIA FILES ──────────────────────────────────────────────

  async attachMedia(
    redcommentId: string,
    userId: string,
    files: Express.Multer.File[],
  ) {
    const redcomment = await this.prisma.redcomment.findUnique({
      where: { id: redcommentId },
      include: { creator: true },
    });

    if (!redcomment) throw new NotFoundException('Không tìm thấy redcomment');
    if (redcomment.creator.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa');
    }

    const baseUrl = `http://localhost:${process.env.PORT || 3000}/uploads`;
    const imageUrls: string[] = [];
    let videoUrl: string | null = null;
    let thumbnailUrl: string | null = null;

    for (const file of files) {
      if (file.mimetype.startsWith('video/')) {
        videoUrl = `${baseUrl}/videos/${file.filename}`;
      } else {
        const url = `${baseUrl}/images/${file.filename}`;
        imageUrls.push(url);
        if (!thumbnailUrl) thumbnailUrl = url;
      }
    }

    const updated = await this.prisma.redcomment.update({
      where: { id: redcommentId },
      data: {
        photo_urls: [...redcomment.photo_urls, ...imageUrls],
        ...(videoUrl && { video_url: videoUrl }),
        ...(thumbnailUrl && !redcomment.thumbnailUrl && { thumbnailUrl }),
        ...(thumbnailUrl && { cover_image_url: thumbnailUrl }),
      },
    });

    return {
      id: updated.id,
      photo_urls: updated.photo_urls,
      video_url: updated.video_url,
      thumbnailUrl: updated.thumbnailUrl,
      filesUploaded: files.map((f) => ({
        originalName: f.originalname,
        filename: f.filename,
        size: f.size,
        mimetype: f.mimetype,
      })),
    };
  }

  // ─── GET ALL REDCOMMENTS (Public Feed) ───────────────────────────────

  async findAllRedcomments(
    page = 1,
    limit = 20,
    format?: string,
    targetType?: string,
    category?: string,
    regionId?: string,
    sort: 'latest' | 'popular' | 'trending' = 'latest',
    followingCreatorIds?: string[],
    tag?: string,
    merchantId?: string,
  ) {
    const cappedLimit = Math.min(limit, 50);
    const skip = (page - 1) * cappedLimit;
    const where: any = { status: 'APPROVED', deletedAt: null };
    if (format) where.format = format;
    if (targetType) where.targetType = targetType;
    if (merchantId) where.merchant_id = merchantId;
    if (category) {
      const cat = await this.prisma.spotlightCategory.findUnique({
        where: { slug: category },
      });
      if (cat) where.spotlight_category_id = cat.id;
    }
    if (regionId) {
      where.redcomment_regions = {
        some: { region_id: regionId },
      };
    }
    if (tag && tag.trim()) {
      const tagLower = tag.trim().toLowerCase();
      where.OR = [
        { target_tags: { has: tagLower } },
        { target_tags: { has: tag.trim() } },
        { seo_keywords: { has: tagLower } },
        { seo_keywords: { has: tag.trim() } },
      ];
    }
    if (followingCreatorIds && followingCreatorIds.length > 0) {
      where.creatorId = { in: followingCreatorIds };
    } else if (followingCreatorIds && followingCreatorIds.length === 0) {
      return { data: [], pagination: { page: 1, limit: cappedLimit, total: 0, totalPages: 0 } };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'popular') orderBy = { views: 'desc' };
    if (sort === 'trending') orderBy = [{ likes: 'desc' }, { views: 'desc' }];

    const [redcomments, total] = await Promise.all([
      this.prisma.redcomment.findMany({
        where,
        include: {
          creator: {
            include: {
              user: {
                select: { firstName: true, lastName: true, avatar_url: true },
              },
            },
          },
          redcomment_regions: { include: { region: true } },
          spotlight_category: true,
          cta_buttons: { orderBy: { sort_order: 'asc' } },
        },
        skip,
        take: cappedLimit,
        orderBy,
      }),
      this.prisma.redcomment.count({ where }),
    ]);

    return {
      data: redcomments,
      pagination: {
        page,
        limit: cappedLimit,
        total,
        totalPages: Math.ceil(total / cappedLimit),
      },
    };
  }

  // ─── GET REELS FEED ──────────────────────────────────────────────────

  async getReelsFeed(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const where = { format: 'VIDEO_REEL' as any, status: 'APPROVED' as any, deletedAt: null };

    const [reels, total] = await Promise.all([
      this.prisma.redcomment.findMany({
        where,
        include: {
          creator: {
            include: {
              user: {
                select: { firstName: true, lastName: true, avatar_url: true },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: [{ views: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.redcomment.count({ where }),
    ]);

    return { data: reels, meta: { total, page, limit } };
  }

  // ─── GET SINGLE REDCOMMENT ────────────────────────────────────────────

  async findRedcommentById(id: string) {
    const redcomment = await this.prisma.redcomment.findUnique({
      where: { id },
      include: {
        creator: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, avatar_url: true },
            },
          },
        },
        redcomment_regions: { include: { region: true } },
        spotlight_category: true,
        cta_buttons: { orderBy: { sort_order: 'asc' } },
        comments: {
          where: { is_hidden: false },
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, avatar_url: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!redcomment || redcomment.deletedAt) {
      throw new NotFoundException('Không tìm thấy Redcomment');
    }

    // Increment view count
    await this.prisma.redcomment.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return redcomment;
  }

  // ─── GET RELATED VIDEOS (Phase 2.3) ────────────────────────────────────

  async getRelatedVideos(redcommentId: string, limit = 12) {
    const current = await this.prisma.redcomment.findUnique({
      where: { id: redcommentId },
      select: {
        deletedAt: true,
        spotlight_category_id: true,
        redcomment_regions: { select: { region_id: true } },
      },
    });
    if (!current || current.deletedAt) {
      return { data: [] };
    }

    const cappedLimit = Math.min(limit, 24);
    const regionIds = current.redcomment_regions.map((r) => r.region_id);

    const where: any = {
      id: { not: redcommentId },
      status: 'APPROVED',
      deletedAt: null,
      format: 'VIDEO_REEL',
    };

    if (current.spotlight_category_id || regionIds.length > 0) {
      where.OR = [];
      if (current.spotlight_category_id) {
        where.OR.push({ spotlight_category_id: current.spotlight_category_id });
      }
      if (regionIds.length > 0) {
        where.OR.push({
          redcomment_regions: { some: { region_id: { in: regionIds } } },
        });
      }
    }

    const related = await this.prisma.redcomment.findMany({
      where,
      include: {
        creator: {
          include: {
            user: {
              select: { firstName: true, lastName: true, avatar_url: true },
            },
          },
        },
        redcomment_regions: { include: { region: true } },
        spotlight_category: true,
      },
      orderBy: [{ views: 'desc' }, { createdAt: 'desc' }],
      take: cappedLimit,
    });

    return { data: related };
  }

  // ─── UPDATE REDCOMMENT ────────────────────────────────────────────────

  async updateRedcomment(id: string, userId: string, dto: UpdateRedcommentDto) {
    const redcomment = await this.prisma.redcomment.findUnique({
      where: { id },
      include: { creator: true },
    });

    if (!redcomment) throw new NotFoundException('Không tìm thấy Redcomment');
    if (redcomment.creator.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa');
    }

    if (dto.status === 'PENDING_REVIEW' && redcomment.status !== 'DRAFT') {
      throw new BadRequestException('Chỉ có thể gửi duyệt từ trạng thái DRAFT');
    }

    const updated = await this.prisma.redcomment.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title, seo_slug: this.generateSlug(dto.title) }),
        ...(dto.content !== undefined && { description: dto.content }),
        ...(dto.summary !== undefined && { seoDescription: dto.summary }),
        ...(dto.tags && { target_tags: dto.tags, seo_keywords: dto.tags }),
        ...(dto.status && { status: dto.status as any }),
      },
      include: {
        creator: {
          include: {
            user: {
              select: { firstName: true, lastName: true, avatar_url: true },
            },
          },
        },
      },
    });

    return updated;
  }

  // ─── DELETE REDCOMMENT ────────────────────────────────────────────────

  async deleteRedcomment(id: string, userId: string) {
    const redcomment = await this.prisma.redcomment.findUnique({
      where: { id },
      include: { creator: true },
    });

    if (!redcomment) throw new NotFoundException('Không tìm thấy Redcomment');
    if (redcomment.creator.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa');
    }

    await this.prisma.redcomment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Đã xóa Redcomment' };
  }

  // ─── MY REDCOMMENTS ───────────────────────────────────────────────────

  async getMyRedcomments(userId: string, page = 1, limit = 20) {
    const creator = await this.prisma.creator.findUnique({ where: { userId } });
    if (!creator) {
      return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
    }

    const skip = (page - 1) * limit;
    const [redcomments, total] = await Promise.all([
      this.prisma.redcomment.findMany({
        where: { creatorId: creator.id, deletedAt: null },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.redcomment.count({
        where: { creatorId: creator.id, deletedAt: null },
      }),
    ]);

    return {
      data: redcomments,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // REVIEWS
  // ═══════════════════════════════════════════════════════════════════════════

  async createReview(userId: string, dto: CreateReviewDto) {
    const rcCount = await this.prisma.review.count();
    const reviewNumber = `LS-RV-${String(rcCount + 1).padStart(6, '0')}`;

    const review = await this.prisma.review.create({
      data: {
        reviewNumber,
        userId,
        targetType: dto.targetType as any,
        targetId: dto.targetId,
        target_name: dto.title || 'Review',
        overall_rating: dto.rating,
        title: dto.title,
        body: dto.content || '',
        status: 'PENDING_REVIEW',
      },
      include: {
        user: {
          select: { firstName: true, lastName: true, avatar_url: true },
        },
      },
    });

    return review;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // COMMENTS
  // ═══════════════════════════════════════════════════════════════════════════

  async createComment(redcommentId: string, userId: string, dto: CreateCommentDto) {
    const redcomment = await this.prisma.redcomment.findUnique({
      where: { id: redcommentId },
      include: { creator: { select: { userId: true } } },
    });
    if (!redcomment || redcomment.deletedAt) {
      throw new NotFoundException('Không tìm thấy Redcomment');
    }

    const comment = await this.prisma.comment.create({
      data: {
        redcommentId,
        userId,
        body: dto.content,
        parentId: dto.parentId,
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, avatar_url: true },
        },
      },
    });

    // Update comment count
    await this.prisma.redcomment.update({
      where: { id: redcommentId },
      data: { comments_count: { increment: 1 } },
    });

    // Phase 2.4: Notify video creator when someone comments (don't notify self)
    if (redcomment.creator.userId !== userId) {
      this.notifyCommentOnVideo(
        redcomment.creator.userId,
        userId,
        comment.user?.firstName,
        comment.user?.lastName,
        dto.content,
        redcommentId,
        redcomment.title,
      ).catch(() => {});
    }

    return comment;
  }

  async getComments(redcommentId: string, page = 1, limit = 20) {
    const redcomment = await this.prisma.redcomment.findUnique({
      where: { id: redcommentId },
    });
    if (!redcomment || redcomment.deletedAt) {
      throw new NotFoundException('Không tìm thấy Redcomment');
    }

    const cappedLimit = Math.min(Math.max(1, limit), 50);
    const skip = (Math.max(1, page) - 1) * cappedLimit;
    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: { redcommentId, is_hidden: false },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, avatar_url: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: cappedLimit,
      }),
      this.prisma.comment.count({
        where: { redcommentId, is_hidden: false },
      }),
    ]);

    return {
      data: comments,
      pagination: {
        page: Math.max(1, page),
        limit: cappedLimit,
        total,
        totalPages: Math.ceil(total / cappedLimit),
      },
    };
  }

  // ─── LIKE REDCOMMENT ──────────────────────────────────────────────────

  async likeRedcomment(id: string) {
    const redcomment = await this.prisma.redcomment.findUnique({ where: { id } });
    if (!redcomment || redcomment.deletedAt) {
      throw new NotFoundException('Không tìm thấy Redcomment');
    }

    const updated = await this.prisma.redcomment.update({
      where: { id },
      data: { likes: { increment: 1 } },
    });

    return { likes: Number(updated.likes) };
  }

  async getSpotlightCategories() {
    const categories = await this.prisma.spotlightCategory.findMany({
      where: { is_active: true },
      orderBy: { order: 'asc' },
      select: { id: true, slug: true, name: true, order: true },
    });
    return { data: categories };
  }

  async getSpotlightLocations(level: string = 'PROVINCE', parentId?: string) {
    const where: any = { is_active: true };
    if (level) where.level = level;
    if (parentId) where.parent_id = parentId;
    else where.parent_id = null;

    const regions = await this.prisma.region.findMany({
      where,
      orderBy: { name: 'asc' },
      select: { id: true, code: true, name: true, level: true },
    });
    return { data: regions };
  }

  async recordLinkClick(redcommentId: string, ctaButtonId: string) {
    const cta = await this.prisma.cta_buttons.findFirst({
      where: { id: ctaButtonId, redcomment_id: redcommentId },
    });
    if (!cta) {
      throw new NotFoundException('Không tìm thấy CTA button');
    }
    await this.prisma.cta_buttons.update({
      where: { id: ctaButtonId },
      data: { clicks: { increment: 1 } },
    });
    return { ok: true };
  }

  // ─── SAVE / UNSAVE VIDEO (Phase 2) ────────────────────────────────────

  async saveVideo(redcommentId: string, userId: string) {
    const redcomment = await this.prisma.redcomment.findUnique({
      where: { id: redcommentId },
    });
    if (!redcomment || redcomment.deletedAt) {
      throw new NotFoundException('Không tìm thấy video');
    }
    const existing = await this.prisma.redcommentSave.findUnique({
      where: {
        user_id_redcomment_id: { user_id: userId, redcomment_id: redcommentId },
      },
    });
    if (existing) return { saved: true };
    await this.prisma.$transaction([
      this.prisma.redcommentSave.create({
        data: { user_id: userId, redcomment_id: redcommentId },
      }),
      this.prisma.redcomment.update({
        where: { id: redcommentId },
        data: { saves: { increment: 1 } },
      }),
    ]);
    return { saved: true };
  }

  async unsaveVideo(redcommentId: string, userId: string) {
    const deleted = await this.prisma.redcommentSave.deleteMany({
      where: { user_id: userId, redcomment_id: redcommentId },
    });
    if (deleted.count > 0) {
      await this.prisma.redcomment.update({
        where: { id: redcommentId },
        data: { saves: { decrement: 1 } },
      });
    }
    return { saved: false };
  }

  async getSavedVideos(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const cappedLimit = Math.min(limit, 50);
    const [saves, total] = await Promise.all([
      this.prisma.redcommentSave.findMany({
        where: {
          user_id: userId,
          redcomment: { deletedAt: null },
        },
        include: {
          redcomment: {
            include: {
              creator: {
                include: {
                  user: {
                    select: { firstName: true, lastName: true, avatar_url: true },
                  },
                },
              },
              redcomment_regions: { include: { region: true } },
              spotlight_category: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: cappedLimit,
      }),
      this.prisma.redcommentSave.count({
        where: {
          user_id: userId,
          redcomment: { deletedAt: null },
        },
      }),
    ]);
    const redcomments = saves
      .map((s) => s.redcomment)
      .filter((r): r is NonNullable<typeof r> => r != null);
    return {
      data: redcomments,
      pagination: {
        page,
        limit: cappedLimit,
        total,
        totalPages: Math.ceil(total / cappedLimit),
      },
    };
  }

  async checkSaved(redcommentId: string, userId: string): Promise<boolean> {
    const save = await this.prisma.redcommentSave.findUnique({
      where: {
        user_id_redcomment_id: { user_id: userId, redcomment_id: redcommentId },
      },
    });
    return !!save;
  }

  // ─── FOLLOW CREATOR (Phase 2.2) ────────────────────────────────────────

  async followCreator(creatorId: string, userId: string) {
    const creator = await this.prisma.creator.findUnique({
      where: { id: creatorId },
    });
    if (!creator) throw new NotFoundException('Không tìm thấy Creator');
    const existing = await this.prisma.creatorFollow.findUnique({
      where: {
        user_id_creator_id: { user_id: userId, creator_id: creatorId },
      },
    });
    if (existing) return { followed: true };
    await this.prisma.$transaction([
      this.prisma.creatorFollow.create({
        data: { user_id: userId, creator_id: creatorId },
      }),
      this.prisma.creator.update({
        where: { id: creatorId },
        data: { follower_count: { increment: 1 } },
      }),
    ]);
    return { followed: true };
  }

  async unfollowCreator(creatorId: string, userId: string) {
    const deleted = await this.prisma.creatorFollow.deleteMany({
      where: { user_id: userId, creator_id: creatorId },
    });
    if (deleted.count > 0) {
      await this.prisma.creator.update({
        where: { id: creatorId },
        data: { follower_count: { decrement: 1 } },
      });
    }
    return { followed: false };
  }

  async checkFollowed(creatorId: string, userId: string): Promise<boolean> {
    const follow = await this.prisma.creatorFollow.findUnique({
      where: {
        user_id_creator_id: { user_id: userId, creator_id: creatorId },
      },
    });
    return !!follow;
  }

  async getFollowingCreatorIds(userId: string): Promise<string[]> {
    const follows = await this.prisma.creatorFollow.findMany({
      where: { user_id: userId },
      select: { creator_id: true },
    });
    return follows.map((f) => f.creator_id);
  }

  async getCreatorProfile(creatorId: string, page = 1, limit = 20) {
    const creator = await this.prisma.creator.findUnique({
      where: { id: creatorId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar_url: true,
            displayName: true,
          },
        },
      },
    });
    if (!creator) throw new NotFoundException('Không tìm thấy Creator');

    const skip = (page - 1) * limit;
    const cappedLimit = Math.min(limit, 50);
    const [redcomments, total] = await Promise.all([
      this.prisma.redcomment.findMany({
        where: {
          creatorId,
          status: 'APPROVED',
          deletedAt: null,
          format: 'VIDEO_REEL',
        },
        include: {
          redcomment_regions: { include: { region: true } },
          spotlight_category: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: cappedLimit,
      }),
      this.prisma.redcomment.count({
        where: {
          creatorId,
          status: 'APPROVED',
          deletedAt: null,
          format: 'VIDEO_REEL',
        },
      }),
    ]);

    return {
      creator: {
        id: creator.id,
        display_name: creator.display_name,
        bio: creator.bio,
        avatar_url: creator.avatar_url || creator.user?.avatar_url,
        follower_count: creator.follower_count,
        total_redcomments: creator.total_redcomments,
        isVerified: creator.isVerified,
        user: creator.user,
      },
      videos: redcomments,
      pagination: {
        page,
        limit: cappedLimit,
        total,
        totalPages: Math.ceil(total / cappedLimit),
      },
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ADMIN - Content moderation
  // ═══════════════════════════════════════════════════════════════════════════

  async moderateRedcomment(id: string, action: 'APPROVED' | 'REJECTED') {
    const redcomment = await this.prisma.redcomment.findUnique({ where: { id } });
    if (!redcomment) throw new NotFoundException('Không tìm thấy Redcomment');

    const updated = await this.prisma.redcomment.update({
      where: { id },
      data: {
        status: action as any,
        ...(action === 'APPROVED' && { publishedAt: new Date() }),
      },
    });

    return {
      message: action === 'APPROVED'
        ? 'Đã duyệt và publish Redcomment'
        : 'Đã từ chối Redcomment',
      redcomment: updated,
    };
  }

  async getPendingReviews(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = { status: 'PENDING_REVIEW' as any, deletedAt: null };

    const [items, total] = await Promise.all([
      this.prisma.redcomment.findMany({
        where,
        include: {
          creator: {
            include: {
              user: { select: { firstName: true, lastName: true } },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.redcomment.count({ where }),
    ]);

    return {
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // HELPERS - Phase 2.4 Notifications
  // ═══════════════════════════════════════════════════════════════════════════

  private async notifyCommentOnVideo(
    creatorUserId: string,
    commenterUserId: string,
    commenterFirstName?: string,
    commenterLastName?: string,
    commentBody?: string,
    redcommentId?: string,
    videoTitle?: string,
  ) {
    const name = [commenterFirstName, commenterLastName].filter(Boolean).join(' ') || 'Ai đó';
    const body = commentBody && commentBody.length > 50 ? `${commentBody.slice(0, 50)}...` : commentBody || 'đã bình luận';
    await this.notificationsService.create({
      userId: creatorUserId,
      type: 'SPOTLIGHT_COMMENT' as any,
      title: `${name} đã bình luận video của bạn`,
      body,
      data: {
        redcommentId,
        actorId: commenterUserId,
        action: 'VIEW_VIDEO',
        url: redcommentId ? `/spotlight/${redcommentId}` : undefined,
      },
    });
  }

  private async notifyFollowersNewVideo(
    creatorId: string,
    redcomment: { id: string; title: string; thumbnailUrl?: string | null },
    creatorDisplayName: string,
  ) {
    const followers = await this.prisma.creatorFollow.findMany({
      where: { creator_id: creatorId },
      select: { user_id: true },
    });
    const userIds = followers.map((f) => f.user_id);
    if (userIds.length === 0) return;
    await this.notificationsService.sendBulk({
      userIds,
      type: 'SPOTLIGHT_NEW_VIDEO' as any,
      title: `${creatorDisplayName} vừa đăng video mới`,
      body: redcomment.title,
      imageUrl: redcomment.thumbnailUrl || undefined,
      data: {
        redcommentId: redcomment.id,
        action: 'VIEW_VIDEO',
        url: `/spotlight/${redcomment.id}`,
      },
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════════════════════════════════════════

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 200)
      + '-' + Date.now(); // Ensure unique slug
  }
}
