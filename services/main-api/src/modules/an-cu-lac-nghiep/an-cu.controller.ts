import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Query,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AnCuService } from './an-cu.service';
import { CreateConsultingLeadDto } from './dto/an-cu.dto';
import { AnCuLeadsQueryDto } from './dto/an-cu-query.dto';
import { AnCuArticlesQueryDto } from './dto/an-cu-article.dto';
import { UpdateLeadStatusDto } from './dto/an-cu-update.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('An Cư Lạc Nghiệp (Nhà ở xã hội)')
@Controller('an-cu-lac-nghiep')
export class AnCuController {
  constructor(private readonly anCuService: AnCuService) {}

  @Public()
  @Get('articles')
  @ApiOperation({ summary: 'Danh sách bài viết An Cư (public)' })
  async listArticles(@Query() query: AnCuArticlesQueryDto) {
    return this.anCuService.listArticles(query);
  }

  @Public()
  @Get('articles/:slug')
  @ApiOperation({ summary: 'Chi tiết bài viết An Cư theo slug (public)' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bài viết' })
  async getArticleBySlug(@Param('slug') slug: string) {
    return this.anCuService.getArticleBySlug(slug);
  }

  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiBearerAuth('access-token')
  @Get('consulting')
  @ApiOperation({ summary: '[Admin] Danh sách leads tư vấn nhà ở xã hội' })
  async listLeads(@Query() query: AnCuLeadsQueryDto) {
    return this.anCuService.listLeads(query);
  }

  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiBearerAuth('access-token')
  @Get('consulting/:id')
  @ApiOperation({ summary: '[Admin] Chi tiết lead' })
  async getLeadById(@Param('id', ParseUUIDPipe) id: string) {
    return this.anCuService.getLeadById(id);
  }

  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiBearerAuth('access-token')
  @Patch('consulting/:id')
  @ApiOperation({ summary: '[Admin] Cập nhật trạng thái lead' })
  async updateLeadStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLeadStatusDto,
  ) {
    return this.anCuService.updateLeadStatus(id, dto);
  }

  @Public()
  @Post('consulting')
  @ApiOperation({
    summary: 'Đăng ký tư vấn nhà ở xã hội',
    description: 'Thu thập lead từ form An Cư Lạc Nghiệp',
  })
  @ApiResponse({ status: 201, description: 'Đã gửi thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  async createConsultingLead(@Body() dto: CreateConsultingLeadDto) {
    return this.anCuService.createConsultingLead(dto);
  }
}
