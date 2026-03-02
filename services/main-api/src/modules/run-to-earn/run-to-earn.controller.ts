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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RunToEarnService } from './run-to-earn.service';
import {
  CreateRunToEarnCampaignDto,
  UpdateRunToEarnCampaignDto,
  CreateRunToEarnPrizeDto,
} from './dto/run-to-earn.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Run to Earn')
@ApiBearerAuth('access-token')
@Controller('run-to-earn')
export class RunToEarnController {
  constructor(private readonly runToEarnService: RunToEarnService) {}

  @Get('stats')
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiOperation({ summary: '[Admin] Thống kê Run to Earn' })
  async getStats() {
    return this.runToEarnService.getStats();
  }

  @Get('campaigns')
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiOperation({ summary: '[Admin] Danh sách campaign' })
  async listCampaigns(@Query('status') status?: string) {
    return this.runToEarnService.listCampaigns(status);
  }

  @Get('campaigns/:id')
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiOperation({ summary: '[Admin] Chi tiết campaign' })
  async getCampaignById(@Param('id', ParseUUIDPipe) id: string) {
    return this.runToEarnService.getCampaignById(id);
  }

  @Post('campaigns')
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiOperation({ summary: '[Admin] Tạo campaign' })
  async createCampaign(@Body() dto: CreateRunToEarnCampaignDto) {
    return this.runToEarnService.createCampaign(dto);
  }

  @Patch('campaigns/:id')
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiOperation({ summary: '[Admin] Cập nhật campaign' })
  async updateCampaign(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRunToEarnCampaignDto,
  ) {
    return this.runToEarnService.updateCampaign(id, dto);
  }

  @Post('campaigns/:id/prizes')
  @Roles('ADMIN', 'ADMIN_MARKETING')
  @ApiOperation({ summary: '[Admin] Thêm giải thưởng' })
  async addPrize(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateRunToEarnPrizeDto,
  ) {
    return this.runToEarnService.addPrize(id, dto);
  }
}
