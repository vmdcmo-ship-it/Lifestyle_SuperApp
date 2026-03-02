import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PricingService } from './pricing.service';
import { PricingTablesService } from './pricing-tables.service';
import { CreateFareConfigDto, UpdateFareConfigDto } from './dto/pricing.dto';
import {
  CreatePricingTableDto,
  UpdatePricingTableDto,
  CreatePricingParamDto,
  UpdatePricingParamDto,
  UpdatePricingParamTogglesDto,
  CreateDeliveryParamDto,
  UpdateDeliveryParamDto,
  UpdateDeliveryParamTogglesDto,
} from './dto/pricing-tables.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Pricing')
@Controller('pricing')
export class PricingController {
  constructor(
    private readonly pricingService: PricingService,
    private readonly pricingTablesService: PricingTablesService,
  ) {}

  @Get('fare-config')
  @Roles('ADMIN', 'ADMIN_TRANSPORT', 'ACCOUNTANT')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '[Admin] Danh sách bảng giá đặt xe' })
  @ApiResponse({ status: 200 })
  async list() {
    return this.pricingService.list(true);
  }

  @Post('fare-config')
  @Roles('ADMIN', 'ADMIN_TRANSPORT', 'ACCOUNTANT')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '[Admin] Tạo bảng giá mới' })
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 409 })
  async create(@Body() dto: CreateFareConfigDto) {
    return this.pricingService.create(dto);
  }

  @Patch('fare-config/:vehicleType')
  @Roles('ADMIN', 'ADMIN_TRANSPORT', 'ACCOUNTANT')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '[Admin] Cập nhật bảng giá theo loại xe' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  async update(
    @Param('vehicleType') vehicleType: string,
    @Body() dto: UpdateFareConfigDto,
  ) {
    return this.pricingService.update(vehicleType, dto);
  }

  // ─── Bảng giá đa vùng (CEO + Ops) ────────────────────────────────────────

  @Get('tables')
  @Roles('ADMIN', 'ADMIN_TRANSPORT', 'ACCOUNTANT')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '[Admin] Danh sách bảng giá theo vùng' })
  async listTables(@Query('serviceType') serviceType?: string) {
    return this.pricingTablesService.list(serviceType);
  }

  @Get('tables/:id')
  @Roles('ADMIN', 'ADMIN_TRANSPORT', 'ACCOUNTANT')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '[Admin] Chi tiết bảng giá' })
  async getTableById(@Param('id') id: string) {
    return this.pricingTablesService.getById(id);
  }

  @Post('tables')
  @Roles('ADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '[CEO] Tạo bảng giá mới' })
  @ApiResponse({ status: 201 })
  async createTable(@Body() dto: CreatePricingTableDto) {
    return this.pricingTablesService.create(dto);
  }

  @Patch('tables/:id')
  @Roles('ADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '[CEO] Cập nhật bảng giá' })
  async updateTable(
    @Param('id') id: string,
    @Body() dto: UpdatePricingTableDto,
  ) {
    return this.pricingTablesService.update(id, dto);
  }

  @Post('tables/:id/params')
  @Roles('ADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '[CEO] Thêm tham số định giá' })
  async addParam(
    @Param('id') id: string,
    @Body() dto: CreatePricingParamDto,
  ) {
    return this.pricingTablesService.addParam(id, dto);
  }

  @Patch('tables/:tableId/params/:paramId')
  @Roles('ADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '[CEO] Cập nhật tham số định giá (công thức)' })
  async updateParam(
    @Param('tableId') tableId: string,
    @Param('paramId') paramId: string,
    @Body() dto: UpdatePricingParamDto,
  ) {
    return this.pricingTablesService.updateParam(tableId, paramId, dto);
  }

  @Patch('tables/:tableId/params/:paramId/toggles')
  @Roles('ADMIN', 'ADMIN_TRANSPORT', 'ACCOUNTANT')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '[Ops] Bật/tắt công tắc: surge, thời tiết, giao thông',
  })
  async updateParamToggles(
    @Param('tableId') tableId: string,
    @Param('paramId') paramId: string,
    @Body() dto: UpdatePricingParamTogglesDto,
  ) {
    return this.pricingTablesService.updateParamToggles(tableId, paramId, dto);
  }

  // ─── Giao hàng: kg, CBM, Size S/M/L/XL/BULKY ──────────────────────────────────

  @Post('tables/:id/delivery-params')
  @Roles('ADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '[CEO] Thêm tham số giao hàng (size, kg, CBM)' })
  async addDeliveryParam(
    @Param('id') id: string,
    @Body() dto: CreateDeliveryParamDto,
  ) {
    return this.pricingTablesService.addDeliveryParam(id, dto);
  }

  @Patch('tables/:tableId/delivery-params/:paramId')
  @Roles('ADMIN')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '[CEO] Cập nhật tham số giao hàng' })
  async updateDeliveryParam(
    @Param('tableId') tableId: string,
    @Param('paramId') paramId: string,
    @Body() dto: UpdateDeliveryParamDto,
  ) {
    return this.pricingTablesService.updateDeliveryParam(tableId, paramId, dto);
  }

  @Patch('tables/:tableId/delivery-params/:paramId/toggles')
  @Roles('ADMIN', 'ADMIN_TRANSPORT', 'ACCOUNTANT')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '[Ops] Bật/tắt công tắc tham số giao hàng' })
  async updateDeliveryParamToggles(
    @Param('tableId') tableId: string,
    @Param('paramId') paramId: string,
    @Body() dto: UpdateDeliveryParamTogglesDto,
  ) {
    return this.pricingTablesService.updateDeliveryParamToggles(
      tableId,
      paramId,
      dto,
    );
  }
}
