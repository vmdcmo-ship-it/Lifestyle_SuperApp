import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InsuranceService } from './insurance.service';
import {
  PurchasePolicyDto,
  FileClaimDto,
  InsuranceProductQueryDto,
  PolicyQueryDto,
} from './dto/insurance.dto';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Insurance (Bảo hiểm)')
@ApiBearerAuth('access-token')
@Controller('insurance')
export class InsuranceController {
  constructor(private readonly insuranceService: InsuranceService) {}

  // ─── Products ─────────────────────────────────────────────────────────

  @Public()
  @Get('products')
  @ApiOperation({ summary: 'Danh sách sản phẩm bảo hiểm', description: 'Public - xem gói bảo hiểm' })
  async listProducts(@Query() query: InsuranceProductQueryDto) {
    return this.insuranceService.listProducts(query);
  }

  @Public()
  @Get('products/:id')
  @ApiOperation({ summary: 'Chi tiết sản phẩm bảo hiểm' })
  async getProduct(@Param('id', ParseUUIDPipe) id: string) {
    return this.insuranceService.getProduct(id);
  }

  // ─── Policies ─────────────────────────────────────────────────────────

  @Post('policies')
  @ApiOperation({ summary: 'Mua bảo hiểm', description: 'Đăng ký hợp đồng bảo hiểm mới' })
  @ApiResponse({ status: 201, description: 'Hợp đồng đã tạo' })
  async purchasePolicy(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: PurchasePolicyDto,
  ) {
    return this.insuranceService.purchasePolicy(user.id, dto);
  }

  @Get('policies')
  @ApiOperation({ summary: 'Hợp đồng bảo hiểm của tôi' })
  async getMyPolicies(
    @CurrentUser() user: CurrentUserData,
    @Query() query: PolicyQueryDto,
  ) {
    return this.insuranceService.getMyPolicies(user.id, query);
  }

  @Get('policies/:id')
  @ApiOperation({ summary: 'Chi tiết hợp đồng bảo hiểm' })
  async getPolicyDetail(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.insuranceService.getPolicyDetail(id, user.id);
  }

  // ─── Claims ───────────────────────────────────────────────────────────

  @Post('claims')
  @ApiOperation({ summary: 'Yêu cầu bồi thường', description: 'Nộp claim cho hợp đồng' })
  @ApiResponse({ status: 201, description: 'Claim đã nộp' })
  async fileClaim(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: FileClaimDto,
  ) {
    return this.insuranceService.fileClaim(user.id, dto);
  }

  @Get('claims')
  @ApiOperation({ summary: 'Lịch sử claim' })
  async getMyClaims(@CurrentUser() user: CurrentUserData) {
    return this.insuranceService.getMyClaims(user.id);
  }
}
