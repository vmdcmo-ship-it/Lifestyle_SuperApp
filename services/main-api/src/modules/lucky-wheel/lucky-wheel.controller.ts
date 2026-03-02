import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LuckyWheelService } from './lucky-wheel.service';
import {
  CreateLuckyWheelCampaignDto,
  UpdateLuckyWheelCampaignDto,
  CreateLuckyWheelPrizeDto,
  UpdateLuckyWheelPrizeDto,
  LuckyWheelSpinQueryDto,
} from './dto/lucky-wheel.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Lucky Wheel')
@ApiBearerAuth('access-token')
@Controller('lucky-wheel')
export class LuckyWheelController {
  constructor(private readonly luckyWheelService: LuckyWheelService) {}

  @Get('stats')
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiOperation({ summary: '[Admin] Thống kê Lucky Wheel' })
  async getStats() {
    return this.luckyWheelService.getStats();
  }

  @Get('campaigns')
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiOperation({ summary: '[Admin] Danh sách campaign' })
  async listCampaigns(@Query('status') status?: string) {
    return this.luckyWheelService.listCampaigns(status);
  }

  @Get('campaigns/:id')
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiOperation({ summary: '[Admin] Chi tiết campaign' })
  async getCampaignById(@Param('id', ParseUUIDPipe) id: string) {
    return this.luckyWheelService.getCampaignById(id);
  }

  @Get('campaigns/:id/stats')
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiOperation({ summary: '[Admin] Thống kê campaign' })
  async getCampaignStats(@Param('id', ParseUUIDPipe) id: string) {
    return this.luckyWheelService.getCampaignStats(id);
  }

  @Post('campaigns')
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiOperation({ summary: '[Admin] Tạo campaign mới' })
  async createCampaign(@Body() dto: CreateLuckyWheelCampaignDto) {
    return this.luckyWheelService.createCampaign(dto);
  }

  @Patch('campaigns/:id')
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiOperation({ summary: '[Admin] Cập nhật campaign' })
  async updateCampaign(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLuckyWheelCampaignDto,
  ) {
    return this.luckyWheelService.updateCampaign(id, dto);
  }

  @Post('campaigns/:id/prizes')
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiOperation({ summary: '[Admin] Thêm giải thưởng' })
  async addPrize(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateLuckyWheelPrizeDto,
  ) {
    return this.luckyWheelService.addPrize(id, dto);
  }

  @Patch('campaigns/:campaignId/prizes/:prizeId')
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiOperation({ summary: '[Admin] Cập nhật giải thưởng' })
  async updatePrize(
    @Param('campaignId', ParseUUIDPipe) campaignId: string,
    @Param('prizeId', ParseUUIDPipe) prizeId: string,
    @Body() dto: UpdateLuckyWheelPrizeDto,
  ) {
    return this.luckyWheelService.updatePrize(campaignId, prizeId, dto);
  }

  @Delete('campaigns/:campaignId/prizes/:prizeId')
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiOperation({ summary: '[Admin] Xóa giải thưởng' })
  async deletePrize(
    @Param('campaignId', ParseUUIDPipe) campaignId: string,
    @Param('prizeId', ParseUUIDPipe) prizeId: string,
  ) {
    return this.luckyWheelService.deletePrize(campaignId, prizeId);
  }

  @Get('spins')
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiOperation({ summary: '[Admin] Lịch sử quay' })
  async listSpins(@Query() query: LuckyWheelSpinQueryDto) {
    return this.luckyWheelService.listSpins(query);
  }
}
