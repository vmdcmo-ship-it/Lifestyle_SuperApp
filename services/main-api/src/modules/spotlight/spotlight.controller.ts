import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { SpotlightService } from './spotlight.service';
import {
  CreateRedcommentDto,
  UpdateRedcommentDto,
  CreateReviewDto,
  CreateCommentDto,
  CreateSpotlightPostDto,
  LinkClickDto,
} from './dto/spotlight.dto';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { mixedUploadConfig } from './upload.config';

@ApiTags('Spotlight')
@Controller('spotlight')
export class SpotlightController {
  constructor(private readonly spotlightService: SpotlightService) {}

  // ═══════════════════════════════════════════════════════════════════════════
  // PUBLIC ENDPOINTS
  // ═══════════════════════════════════════════════════════════════════════════

  // ─── GET /spotlight/feed/following (Phase 2.2 - Đang theo dõi) ───────
  // Phải đặt trước Get('feed') để match chính xác

  @Get('feed/following')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Feed video từ Creator đang theo dõi' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getFeedFollowing(
    @CurrentUser() user: CurrentUserData,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const creatorIds = await this.spotlightService.getFollowingCreatorIds(user.id);
    return this.spotlightService.findAllRedcomments(
      page || 1,
      limit || 20,
      'VIDEO_REEL',
      undefined,
      undefined,
      undefined,
      'latest',
      creatorIds,
    );
  }

  // ─── GET /spotlight/feed ─────────────────────────────────────────────

  @Public()
  @Get('feed')
  @ApiOperation({
    summary: 'Feed Redcomments (public)',
    description: 'Lấy danh sách bài viết đã duyệt, phân trang',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'format', required: false, enum: ['VIDEO_REEL', 'ARTICLE', 'PHOTO_ESSAY', 'COMPARISON'] })
  @ApiQuery({ name: 'targetType', required: false })
  @ApiQuery({ name: 'category', required: false, description: 'Slug thể loại (travel, food...)' })
  @ApiQuery({ name: 'regionId', required: false, description: 'UUID Region tỉnh/thành' })
  @ApiQuery({ name: 'sort', required: false, enum: ['latest', 'popular', 'trending'] })
  @ApiQuery({ name: 'tag', required: false, description: 'Hashtag/tag để filter (Phase 2.3)' })
  @ApiResponse({ status: 200, description: 'Danh sách redcomments' })
  async getFeed(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('format') format?: string,
    @Query('targetType') targetType?: string,
    @Query('category') category?: string,
    @Query('regionId') regionId?: string,
    @Query('sort') sort?: 'latest' | 'popular' | 'trending',
    @Query('tag') tag?: string,
  ) {
    return this.spotlightService.findAllRedcomments(
      page || 1,
      limit || 20,
      format,
      targetType,
      category,
      regionId,
      sort || 'latest',
      undefined,
      tag,
    );
  }

  // ─── GET /spotlight/reels ────────────────────────────────────────────

  @Public()
  @Get('reels')
  @ApiOperation({
    summary: 'Reels feed (VIDEO_REEL only)',
    description: 'Feed video ngắn kiểu TikTok/Reels, sorted by views',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getReels(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.spotlightService.getReelsFeed(page || 1, limit || 10);
  }

  @Public()
  @Get('locations')
  @ApiOperation({ summary: 'Danh sách địa điểm (tỉnh/thành) cho Spotlight' })
  @ApiQuery({ name: 'level', required: false, example: 'PROVINCE' })
  @ApiQuery({ name: 'parentId', required: false })
  async getLocations(
    @Query('level') level?: string,
    @Query('parentId') parentId?: string,
  ) {
    return this.spotlightService.getSpotlightLocations(
      level || 'PROVINCE',
      parentId,
    );
  }

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Danh sách thể loại Spotlight' })
  async getCategories() {
    return this.spotlightService.getSpotlightCategories();
  }

  // ─── GET /spotlight/creator/:id (Phase 2.2 - Trang Creator) ───────────
  // Phải đặt trước Get(':id') để /spotlight/creator/xxx không bị nhầm

  @Public()
  @Get('creator/:creatorId')
  @ApiOperation({ summary: 'Trang Creator - profile + danh sách video' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getCreatorProfile(
    @Param('creatorId', ParseUUIDPipe) creatorId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.spotlightService.getCreatorProfile(
      creatorId,
      page || 1,
      limit || 20,
    );
  }

  @Get('creator/:creatorId/followed')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Kiểm tra đã theo dõi Creator chưa' })
  async checkCreatorFollowed(
    @Param('creatorId', ParseUUIDPipe) creatorId: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    const followed = await this.spotlightService.checkFollowed(creatorId, user.id);
    return { followed };
  }

  // ─── GET /spotlight/saved (Phase 2 - Video đã lưu) ─────────────────────
  // Phải đặt trước Get(':id') để /spotlight/saved không bị nhầm với :id

  @Get('saved')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Danh sách video đã lưu' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getSaved(
    @CurrentUser() user: CurrentUserData,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.spotlightService.getSavedVideos(
      user.id,
      page || 1,
      limit || 20,
    );
  }

  // ─── GET /spotlight/:id/comments ──────────────────────────────────────

  @Public()
  @Get(':id/comments')
  @ApiOperation({ summary: 'Danh sách comment (phân trang)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Danh sách comments + pagination' })
  async getComments(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.spotlightService.getComments(id, page || 1, limit || 20);
  }

  // ─── GET /spotlight/:id/related (Phase 2.3 - Video liên quan) ────────

  @Public()
  @Get(':id/related')
  @ApiOperation({ summary: 'Video liên quan (cùng category/region)' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getRelated(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('limit') limit?: number,
  ) {
    return this.spotlightService.getRelatedVideos(id, limit ? Number(limit) : 12);
  }

  // ─── GET /spotlight/:id ──────────────────────────────────────────────

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết Redcomment' })
  @ApiResponse({ status: 200, description: 'Thông tin redcomment + comments' })
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.spotlightService.findRedcommentById(id);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // AUTHENTICATED ENDPOINTS
  // ═══════════════════════════════════════════════════════════════════════════

  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Tạo post Spotlight (video embed)',
    description: 'Đăng video từ URL YouTube/Facebook, hiển thị ngay',
  })
  @ApiResponse({ status: 201, description: 'Đã tạo post' })
  async createSpotlightPost(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: CreateSpotlightPostDto,
  ) {
    return this.spotlightService.createSpotlightPost(user.id, dto);
  }

  // ─── POST /spotlight/redcomments ─────────────────────────────────────

  @Post('redcomments')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Tạo Redcomment mới',
    description: 'Tạo bài viết/review chuyên sâu (KOC/KOL)',
  })
  @ApiResponse({ status: 201, description: 'Đã tạo redcomment' })
  async createRedcomment(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: CreateRedcommentDto,
  ) {
    return this.spotlightService.createRedcomment(user.id, dto);
  }

  // ─── POST /spotlight/redcomments/:id/upload ──────────────────────────

  @Post('redcomments/:id/upload')
  @ApiBearerAuth('access-token')
  @UseInterceptors(FilesInterceptor('files', 10, mixedUploadConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload ảnh/video cho Redcomment',
    description:
      'Upload tối đa 10 files (ảnh JPEG/PNG/WebP, video MP4/WebM). Lưu vào ổ cứng local, sẽ migrate sang Cloud Storage sau.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Ảnh hoặc video files',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Upload thành công' })
  async uploadMedia(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserData,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      return { error: 'Vui lòng chọn ít nhất 1 file' };
    }
    return this.spotlightService.attachMedia(id, user.id, files);
  }

  // ─── GET /spotlight/my/redcomments ───────────────────────────────────

  @Get('my/redcomments')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Redcomments của tôi (Creator dashboard)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getMyRedcomments(
    @CurrentUser() user: CurrentUserData,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.spotlightService.getMyRedcomments(
      user.id,
      page || 1,
      limit || 20,
    );
  }

  // ─── PUT /spotlight/redcomments/:id ──────────────────────────────────

  @Put('redcomments/:id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Cập nhật Redcomment' })
  async updateRedcomment(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserData,
    @Body() dto: UpdateRedcommentDto,
  ) {
    return this.spotlightService.updateRedcomment(id, user.id, dto);
  }

  // ─── DELETE /spotlight/redcomments/:id ───────────────────────────────

  @Delete('redcomments/:id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Xóa Redcomment (soft delete)' })
  async deleteRedcomment(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.spotlightService.deleteRedcomment(id, user.id);
  }

  // ─── POST /spotlight/creator/:id/follow (Phase 2.2) ────────────────────

  @Post('creator/:creatorId/follow')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Theo dõi Creator' })
  async followCreator(
    @Param('creatorId', ParseUUIDPipe) creatorId: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.spotlightService.followCreator(creatorId, user.id);
  }

  // ─── DELETE /spotlight/creator/:id/follow ──────────────────────────────

  @Delete('creator/:creatorId/follow')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Bỏ theo dõi Creator' })
  async unfollowCreator(
    @Param('creatorId', ParseUUIDPipe) creatorId: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.spotlightService.unfollowCreator(creatorId, user.id);
  }

  // ─── POST /spotlight/:id/like ────────────────────────────────────────

  @Post(':id/like')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Like Redcomment' })
  async likeRedcomment(@Param('id', ParseUUIDPipe) id: string) {
    return this.spotlightService.likeRedcomment(id);
  }

  // ─── GET /spotlight/:id/saved-status (Phase 2) ─────────────────────────

  @Get(':id/saved-status')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Kiểm tra đã lưu video chưa' })
  async getSavedStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    const saved = await this.spotlightService.checkSaved(id, user.id);
    return { saved };
  }

  // ─── POST /spotlight/:id/save (Phase 2) ────────────────────────────────

  @Post(':id/save')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Lưu video' })
  async saveVideo(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.spotlightService.saveVideo(id, user.id);
  }

  // ─── DELETE /spotlight/:id/save (Phase 2) ──────────────────────────────

  @Delete(':id/save')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Bỏ lưu video' })
  async unsaveVideo(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.spotlightService.unsaveVideo(id, user.id);
  }

  // ─── POST /spotlight/:id/link-click ──────────────────────────────────

  @Public()
  @Post(':id/link-click')
  @ApiOperation({ summary: 'Tracking click CTA link' })
  @ApiResponse({ status: 200, description: 'Đã ghi nhận click' })
  async recordLinkClick(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: LinkClickDto,
  ) {
    return this.spotlightService.recordLinkClick(id, dto.ctaButtonId);
  }

  // ─── POST /spotlight/:id/comments ────────────────────────────────────

  @Post(':id/comments')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Bình luận trên Redcomment' })
  async createComment(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserData,
    @Body() dto: CreateCommentDto,
  ) {
    return this.spotlightService.createComment(id, user.id, dto);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // REVIEWS
  // ═══════════════════════════════════════════════════════════════════════════

  @Post('reviews')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Tạo Review nhanh',
    description: 'Đánh giá merchant/sản phẩm (1-5 sao)',
  })
  async createReview(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: CreateReviewDto,
  ) {
    return this.spotlightService.createReview(user.id, dto);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ADMIN - MODERATION
  // ═══════════════════════════════════════════════════════════════════════════

  @Get('admin/pending')
  @Roles('ADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '[Admin] Danh sách chờ duyệt' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getPendingReviews(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.spotlightService.getPendingReviews(page || 1, limit || 20);
  }

  @Put('admin/moderate/:id')
  @Roles('ADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '[Admin] Duyệt/Từ chối Redcomment' })
  @ApiQuery({ name: 'action', enum: ['APPROVED', 'REJECTED'] })
  async moderate(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('action') action: 'APPROVED' | 'REJECTED',
  ) {
    return this.spotlightService.moderateRedcomment(id, action);
  }
}
