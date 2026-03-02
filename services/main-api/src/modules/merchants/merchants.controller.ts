import {
  Controller,
  Post,
  Get,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MerchantsService } from './merchants.service';
import {
  CreateMerchantDto,
  UpdateMerchantDto,
  VerifyMerchantDto,
  CreateCategoryDto,
  CreateProductDto,
  UpdateProductDto,
  MerchantListQueryDto,
  ProductListQueryDto,
} from './dto/merchant.dto';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Merchants')
@ApiBearerAuth('access-token')
@Controller('merchants')
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}

  @Get('admin/list')
  @Roles('ADMIN', 'ADMIN_TRANSPORT', 'SUPERVISOR', 'CSKH', 'ACCOUNTANT')
  @ApiOperation({ summary: '[Admin] Danh sách tất cả cửa hàng' })
  async adminList(@Query() query: MerchantListQueryDto) {
    return this.merchantsService.adminList(query);
  }

  @Patch('admin/:id/verify')
  @Roles('ADMIN', 'ADMIN_TRANSPORT', 'SUPERVISOR', 'CSKH', 'ACCOUNTANT')
  @ApiOperation({ summary: '[Admin] Duyệt/Từ chối cửa hàng' })
  @ApiResponse({ status: 200, description: 'Đã cập nhật trạng thái' })
  async adminVerify(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() admin: CurrentUserData,
    @Body() dto: VerifyMerchantDto,
  ) {
    return this.merchantsService.adminVerify(id, admin.id, dto);
  }

  @Get('admin/:id')
  @Roles('ADMIN', 'ADMIN_TRANSPORT', 'SUPERVISOR', 'CSKH', 'ACCOUNTANT')
  @ApiOperation({ summary: '[Admin] Chi tiết cửa hàng' })
  async adminGetById(@Param('id', ParseUUIDPipe) id: string) {
    return this.merchantsService.adminGetById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Đăng ký cửa hàng', description: 'Tạo merchant mới cho user' })
  @ApiResponse({ status: 201, description: 'Cửa hàng đã tạo' })
  async create(@CurrentUser() user: CurrentUserData, @Body() dto: CreateMerchantDto) {
    return this.merchantsService.create(user.id, dto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Danh sách cửa hàng', description: 'Public - tìm kiếm + phân trang' })
  async findAll(@Query() query: MerchantListQueryDto) {
    return this.merchantsService.findAll(query);
  }

  @Get('my')
  @ApiOperation({ summary: 'Cửa hàng của tôi' })
  async findMy(@CurrentUser() user: CurrentUserData) {
    return this.merchantsService.findMyMerchants(user.id);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết cửa hàng' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.merchantsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật cửa hàng' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserData,
    @Body() dto: UpdateMerchantDto,
  ) {
    return this.merchantsService.update(id, user.id, dto);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Thống kê cửa hàng' })
  async getStats(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.merchantsService.getMerchantStats(id, user.id);
  }

  // ─── Categories ───────────────────────────────────────────────────────

  @Post(':id/categories')
  @ApiOperation({ summary: 'Tạo danh mục sản phẩm' })
  async createCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserData,
    @Body() dto: CreateCategoryDto,
  ) {
    return this.merchantsService.createCategory(id, user.id, dto);
  }

  @Public()
  @Get(':id/categories')
  @ApiOperation({ summary: 'Danh mục sản phẩm của cửa hàng' })
  async getCategories(@Param('id', ParseUUIDPipe) id: string) {
    return this.merchantsService.getCategories(id);
  }

  // ─── Products ─────────────────────────────────────────────────────────

  @Post(':id/products')
  @ApiOperation({ summary: 'Thêm sản phẩm' })
  @ApiResponse({ status: 201, description: 'Sản phẩm đã tạo' })
  async createProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserData,
    @Body() dto: CreateProductDto,
  ) {
    return this.merchantsService.createProduct(id, user.id, dto);
  }

  @Public()
  @Get(':id/products')
  @ApiOperation({ summary: 'Danh sách sản phẩm', description: 'Public - tìm kiếm + lọc + phân trang' })
  async getProducts(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: ProductListQueryDto,
  ) {
    return this.merchantsService.getProducts(id, query);
  }

  @Public()
  @Get('products/:productId')
  @ApiOperation({ summary: 'Chi tiết sản phẩm' })
  async getProduct(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.merchantsService.getProduct(productId);
  }

  @Put('products/:productId')
  @ApiOperation({ summary: 'Cập nhật sản phẩm' })
  async updateProduct(
    @Param('productId', ParseUUIDPipe) productId: string,
    @CurrentUser() user: CurrentUserData,
    @Body() dto: UpdateProductDto,
  ) {
    return this.merchantsService.updateProduct(productId, user.id, dto);
  }

  @Delete('products/:productId')
  @ApiOperation({ summary: 'Xóa sản phẩm' })
  async deleteProduct(
    @Param('productId', ParseUUIDPipe) productId: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.merchantsService.deleteProduct(productId, user.id);
  }
}
