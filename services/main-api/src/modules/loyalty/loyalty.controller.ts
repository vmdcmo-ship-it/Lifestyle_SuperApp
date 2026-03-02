import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LoyaltyService } from './loyalty.service';
import {
  RedeemXuDto,
  CreateCouponDto,
  UpdateCouponDto,
  ApplyCouponDto,
  ReferralQueryDto,
  ReferralAdminQueryDto,
  CouponQueryDto,
} from './dto/loyalty.dto';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Loyalty & Rewards')
@ApiBearerAuth('access-token')
@Controller('loyalty')
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  // ─── Xu ──────────────────────────────────────────────────────────────

  @Get('xu')
  @ApiOperation({ summary: 'Số dư Xu', description: 'Xu balance + conversion rate' })
  async getXuBalance(@CurrentUser() user: CurrentUserData) {
    return this.loyaltyService.getXuBalance(user.id);
  }

  @Post('xu/redeem')
  @ApiOperation({ summary: 'Đổi Xu', description: 'Quy đổi Xu thành VND hoặc áp dụng cho đơn hàng' })
  async redeemXu(@CurrentUser() user: CurrentUserData, @Body() dto: RedeemXuDto) {
    return this.loyaltyService.redeemXu(user.id, dto);
  }

  // ─── Coupons ─────────────────────────────────────────────────────────

  @Public()
  @Get('coupons')
  @ApiOperation({ summary: 'Danh sách coupon', description: 'Public - xem coupon khả dụng' })
  async listCoupons(@Query() query: CouponQueryDto) {
    return this.loyaltyService.listCoupons(query);
  }

  @Post('coupons/apply')
  @ApiOperation({ summary: 'Áp dụng coupon', description: 'Kiểm tra & tính discount' })
  async applyCoupon(@CurrentUser() user: CurrentUserData, @Body() dto: ApplyCouponDto) {
    return this.loyaltyService.applyCoupon(user.id, dto);
  }

  @Get('coupons/stats')
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiOperation({ summary: '[Admin] Thống kê coupon – Báo cáo hiệu quả marketing' })
  @ApiResponse({ status: 200 })
  async getCouponStats() {
    return this.loyaltyService.getCouponStats();
  }

  @Get('xu/admin/stats')
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiOperation({ summary: '[Admin] Thống kê Loyalty Xu – Báo cáo ngân sách khuyến mãi' })
  @ApiResponse({ status: 200 })
  async getXuAdminStats() {
    return this.loyaltyService.getXuAdminStats();
  }

  @Post('coupons')
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiOperation({ summary: '[Admin] Tạo coupon mới' })
  @ApiResponse({ status: 201 })
  async createCoupon(@Body() dto: CreateCouponDto) {
    return this.loyaltyService.createCoupon(dto);
  }

  @Get('coupons/detail/:id')
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiOperation({ summary: '[Admin] Chi tiết coupon' })
  async getCouponById(@Param('id', ParseUUIDPipe) id: string) {
    return this.loyaltyService.getCouponById(id);
  }

  @Patch('coupons/:id')
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiOperation({ summary: '[Admin] Cập nhật coupon' })
  async updateCoupon(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCouponDto,
  ) {
    return this.loyaltyService.updateCoupon(id, dto);
  }

  // ─── Referrals ───────────────────────────────────────────────────────

  @Get('referral')
  @ApiOperation({ summary: 'Thông tin giới thiệu', description: 'Referral code + stats' })
  async getReferralInfo(@CurrentUser() user: CurrentUserData) {
    return this.loyaltyService.getReferralInfo(user.id);
  }

  @Get('referrals')
  @ApiOperation({ summary: 'Lịch sử giới thiệu' })
  async getMyReferrals(
    @CurrentUser() user: CurrentUserData,
    @Query() query: ReferralQueryDto,
  ) {
    return this.loyaltyService.getMyReferrals(user.id, query);
  }

  // ─── Referrals Admin (Affiliate) ───────────────────────────────────────

  @Get('referrals/admin/stats')
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiOperation({ summary: '[Admin] Thống kê Affiliate – Ngân sách giới thiệu' })
  async getReferralAdminStats() {
    return this.loyaltyService.getReferralAdminStats();
  }

  @Get('referrals/admin')
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiOperation({ summary: '[Admin] Danh sách referral' })
  async listReferralsAdmin(@Query() query: ReferralAdminQueryDto) {
    return this.loyaltyService.listReferralsAdmin(query);
  }
}
