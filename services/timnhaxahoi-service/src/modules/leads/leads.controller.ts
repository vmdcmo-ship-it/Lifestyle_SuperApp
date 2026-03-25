import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import type { Request } from 'express';
import {
  DashboardJwtAuthGuard,
  type DashboardJwtPayload,
} from '../user/guards/dashboard-jwt.guard';
import { ConvertLeadDto } from './dto/convert-lead.dto';
import { LeadsService } from './leads.service';

@ApiTags('leads')
@Controller('leads')
export class LeadsController {
  constructor(private readonly leads: LeadsService) {}

  @Post('convert')
  @UseGuards(DashboardJwtAuthGuard, ThrottlerGuard)
  @Throttle({ 'leads-convert': {} })
  @ApiBearerAuth('dashboard-jwt')
  @ApiOperation({ summary: 'Đánh dấu chuyển tư vấn sâu — ghi Lark Base nếu đã cấu hình' })
  convert(
    @Req() req: Request & { dashboard: DashboardJwtPayload },
    @Body() dto: ConvertLeadDto,
  ) {
    return this.leads.convert(req.dashboard, dto);
  }
}
