import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { contentImagesUploadConfig } from '../spotlight/upload.config';
import { NewsService } from './news.service';
import {
  CreateNewsArticleDto,
  UpdateNewsArticleDto,
  NewsListQueryDto,
  NewsLinksQueryDto,
} from './dto/news.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  // Lưu ý: public/links và public/:slug phải khai báo trước :id (route cụ thể trước route tham số)
  @Get('public/links')
  @Public()
  @ApiOperation({
    summary: 'Danh sách link tin tức theo đối tượng (public)',
    description: 'App gọi với audience để lấy link. Mở URL trong WebView.',
  })
  async getPublicLinks(@Query() query: NewsLinksQueryDto) {
    return this.newsService.getPublicLinks(query);
  }

  @Get('public/:slug')
  @Public()
  @ApiOperation({ summary: 'Lấy bài viết theo slug (public)' })
  async getBySlug(
    @Param('slug') slug: string,
    @Query('locale') locale?: string
  ) {
    return this.newsService.getBySlug(slug, locale ?? 'vi');
  }

  @Get()
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '[Admin] Danh sách tin tức' })
  async list(@Query() query: NewsListQueryDto) {
    return this.newsService.list(query);
  }

  @Post()
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '[Admin] Tạo bài viết tin tức' })
  async create(@Body() dto: CreateNewsArticleDto) {
    return this.newsService.create(dto);
  }

  @Post('upload')
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiBearerAuth('access-token')
  @UseInterceptors(FileInterceptor('file', contentImagesUploadConfig))
  @ApiOperation({ summary: '[Admin] Upload ảnh cho bài viết (news, training)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { type: 'string', format: 'binary', description: 'Ảnh JPEG, PNG, WebP, GIF. Max 5MB' },
      },
    },
  })
  @ApiResponse({ status: 200, description: '{ url: string }' })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Vui lòng chọn file ảnh');
    const baseUrl =
      process.env.API_BASE_URL ||
      (process.env.API_DOMAIN ? `https://${process.env.API_DOMAIN}` : `http://localhost:${process.env.PORT || 3000}`);
    return { url: `${baseUrl}/uploads/content-images/${file.filename}` };
  }

  @Get(':id')
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '[Admin] Chi tiết bài viết' })
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.newsService.getById(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '[Admin] Cập nhật bài viết' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateNewsArticleDto
  ) {
    return this.newsService.update(id, dto);
  }
}
