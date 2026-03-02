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
import { TrainingService } from './training.service';
import {
  CreateTrainingCategoryDto,
  UpdateTrainingCategoryDto,
  CreateTrainingMaterialDto,
  UpdateTrainingMaterialDto,
  TrainingMaterialListQueryDto,
  TrainingLinksQueryDto,
} from './dto/training.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Training')
@Controller('training')
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @Get('categories')
  @Roles('ADMIN', 'ADMIN_TRANSPORT', 'ADMIN_MARKETING')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '[Admin] Danh sách danh mục đào tạo' })
  async listCategories(@Query('isActive') isActive?: string) {
    const active =
      isActive === 'true' ? true : isActive === 'false' ? false : undefined;
    return this.trainingService.listCategories(active);
  }

  @Post('categories')
  @Roles('ADMIN', 'ADMIN_TRANSPORT', 'ADMIN_MARKETING')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '[Admin] Tạo danh mục đào tạo' })
  async createCategory(@Body() dto: CreateTrainingCategoryDto) {
    return this.trainingService.createCategory(dto);
  }

  @Get('categories/:id')
  @Roles('ADMIN', 'ADMIN_TRANSPORT', 'ADMIN_MARKETING')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '[Admin] Chi tiết danh mục' })
  async getCategoryById(@Param('id', ParseUUIDPipe) id: string) {
    return this.trainingService.getCategoryById(id);
  }

  @Patch('categories/:id')
  @Roles('ADMIN', 'ADMIN_TRANSPORT', 'ADMIN_MARKETING')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '[Admin] Cập nhật danh mục' })
  async updateCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTrainingCategoryDto
  ) {
    return this.trainingService.updateCategory(id, dto);
  }

  @Get('materials')
  @Roles('ADMIN', 'ADMIN_TRANSPORT', 'ADMIN_MARKETING')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '[Admin] Danh sách tài liệu đào tạo' })
  async listMaterials(@Query() query: TrainingMaterialListQueryDto) {
    return this.trainingService.listMaterials(query);
  }

  @Post('materials')
  @Roles('ADMIN', 'ADMIN_TRANSPORT', 'ADMIN_MARKETING')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '[Admin] Tạo tài liệu đào tạo' })
  async createMaterial(@Body() dto: CreateTrainingMaterialDto) {
    return this.trainingService.createMaterial(dto);
  }

  @Get('materials/:id')
  @Roles('ADMIN', 'ADMIN_TRANSPORT', 'ADMIN_MARKETING')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '[Admin] Chi tiết tài liệu' })
  async getMaterialById(@Param('id', ParseUUIDPipe) id: string) {
    return this.trainingService.getMaterialById(id);
  }

  @Patch('materials/:id')
  @Roles('ADMIN', 'ADMIN_TRANSPORT', 'ADMIN_MARKETING')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '[Admin] Cập nhật tài liệu' })
  async updateMaterial(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTrainingMaterialDto
  ) {
    return this.trainingService.updateMaterial(id, dto);
  }

  // Lưu ý: public/links phải khai báo trước public/:slug (route cụ thể trước route tham số)
  @Get('public/links')
  @Public()
  @ApiOperation({
    summary: 'Danh sách link đào tạo theo đối tượng (public)',
    description: 'App User/Driver/Merchant gọi với audience để lấy link. Mở URL trong WebView.',
  })
  async getPublicLinks(@Query() query: TrainingLinksQueryDto) {
    return this.trainingService.getPublicLinks(query);
  }

  @Get('public/:slug')
  @Public()
  @ApiOperation({ summary: 'Lấy nội dung tài liệu theo slug (public)' })
  async getBySlug(
    @Param('slug') slug: string,
    @Query('locale') locale?: string
  ) {
    return this.trainingService.getMaterialBySlug(slug, locale ?? 'vi');
  }
}
