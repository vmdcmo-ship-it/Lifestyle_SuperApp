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
  ApiQuery,
} from '@nestjs/swagger';
import { MarketingService } from './marketing.service';
import { CreateCampaignDto, UpdateCampaignDto } from './dto/campaign.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Marketing')
@ApiBearerAuth('access-token')
@Controller('marketing')
export class MarketingController {
  constructor(private readonly marketingService: MarketingService) {}

  @Get('stats')
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiOperation({ summary: '[Admin] Thống kê chiến dịch' })
  @ApiResponse({ status: 200 })
  async getStats() {
    return this.marketingService.getCampaignStats();
  }

  @Get('campaigns')
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiOperation({ summary: '[Admin] Danh sách chiến dịch' })
  @ApiQuery({ name: 'status', required: false, enum: ['DRAFT', 'ACTIVE', 'PAUSED', 'ENDED'] })
  @ApiResponse({ status: 200 })
  async listCampaigns(@Query('status') status?: string) {
    return this.marketingService.listCampaigns(status);
  }

  @Get('campaigns/:id')
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiOperation({ summary: '[Admin] Chi tiết chiến dịch' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  async getCampaignById(@Param('id', ParseUUIDPipe) id: string) {
    return this.marketingService.getCampaignById(id);
  }

  @Post('campaigns')
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiOperation({ summary: '[Admin] Tạo chiến dịch mới' })
  @ApiResponse({ status: 201 })
  async createCampaign(@Body() dto: CreateCampaignDto) {
    return this.marketingService.createCampaign(dto);
  }

  @Patch('campaigns/:id')
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiOperation({ summary: '[Admin] Cập nhật chiến dịch' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  async updateCampaign(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCampaignDto,
  ) {
    return this.marketingService.updateCampaign(id, dto);
  }
}
