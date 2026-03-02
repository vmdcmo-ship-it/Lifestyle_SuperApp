import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ContentService } from './content.service';
import {
  CreateContentDto,
  UpdateContentDto,
  ContentListQueryDto,
  ContentLinksQueryDto,
} from './dto/content.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '[Admin] Danh sách văn bản' })
  @ApiResponse({ status: 200, description: 'Danh sách với phân trang' })
  async list(@Query() query: ContentListQueryDto) {
    return this.contentService.list(query);
  }

  @Post()
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '[Admin] Tạo văn bản mới' })
  @ApiResponse({ status: 201, description: 'Đã tạo' })
  @ApiResponse({ status: 409, description: 'Slug + locale đã tồn tại' })
  async create(@Body() dto: CreateContentDto) {
    return this.contentService.create(dto);
  }

  @Get('public/links')
  @Public()
  @ApiOperation({
    summary: 'Danh sách link nội dung theo đối tượng (public)',
    description:
      'App User/Driver/Merchant gọi với audience=USER|DRIVER|MERCHANT để lấy danh sách link phù hợp. Mở URL trong WebView.',
  })
  @ApiResponse({
    status: 200,
    description: 'items: [{ slug, title, url }]',
  })
  async getPublicLinks(@Query() query: ContentLinksQueryDto) {
    return this.contentService.getPublicLinks(query);
  }

  @Get('detail/:id')
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '[Admin] Chi tiết văn bản theo ID' })
  @ApiResponse({ status: 200, description: 'Chi tiết' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy' })
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.contentService.getById(id);
  }

  @Get(':slug')
  @Public()
  @ApiOperation({
    summary: 'Lấy văn bản theo slug (public)',
    description:
      'Dùng cho User/Driver/Merchant app hiển thị Điều khoản, Chính sách...',
  })
  @ApiResponse({ status: 200, description: 'Văn bản hợp lệ theo ngày hiệu lực' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy' })
  async getBySlug(
    @Param('slug') slug: string,
    @Query('locale') locale?: string,
  ) {
    return this.contentService.getBySlug(slug, locale);
  }

  @Patch(':id')
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '[Admin] Cập nhật văn bản' })
  @ApiResponse({ status: 200, description: 'Đã cập nhật' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateContentDto,
  ) {
    return this.contentService.update(id, dto);
  }
}
