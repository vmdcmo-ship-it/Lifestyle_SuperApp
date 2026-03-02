import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Dashboard')
@ApiBearerAuth('access-token')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('quick-stats')
  @Roles('ADMIN', 'ADMIN_TRANSPORT', 'ADMIN_MARKETING', 'SUPERVISOR', 'CSKH', 'ACCOUNTANT')
  @ApiOperation({ summary: '[Admin] Thống kê nhanh', description: 'Tổng cửa hàng, đơn hàng, đơn đang chờ' })
  @ApiResponse({ status: 200 })
  async getQuickStats() {
    return this.dashboardService.getQuickStats();
  }

  @Get('chart-stats')
  @Roles('ADMIN', 'ADMIN_TRANSPORT', 'ADMIN_MARKETING', 'SUPERVISOR', 'CSKH', 'ACCOUNTANT')
  @ApiOperation({
    summary: '[Admin] Thống kê biểu đồ',
    description: 'Đơn đặt xe và đơn hàng theo ngày (7–30 ngày gần nhất)',
  })
  @ApiQuery({ name: 'days', required: false, type: Number, example: 7 })
  @ApiResponse({ status: 200 })
  async getChartStats(@Query('days') days?: string) {
    const n = days ? parseInt(days, 10) : 7;
    return this.dashboardService.getChartStats(Number.isNaN(n) ? 7 : n);
  }

  @Get('region-stats')
  @Roles('ADMIN', 'ADMIN_TRANSPORT', 'ADMIN_MARKETING', 'SUPERVISOR', 'CSKH', 'ACCOUNTANT')
  @ApiOperation({
    summary: '[Admin] Báo cáo theo vùng (thành phố)',
    description: 'Đơn hàng và doanh thu theo thành phố của merchant',
  })
  @ApiQuery({ name: 'days', required: false, type: Number, example: 30 })
  @ApiResponse({ status: 200 })
  async getRegionStats(@Query('days') days?: string) {
    const n = days ? parseInt(days, 10) : 30;
    return this.dashboardService.getRegionStats(Number.isNaN(n) ? 30 : n);
  }
}
