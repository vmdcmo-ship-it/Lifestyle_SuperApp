import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Query,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WealthService } from './wealth.service';
import { CreateConsultingLeadDto } from './dto/wealth.dto';
import { WealthLeadsQueryDto } from './dto/wealth-query.dto';
import { UpdateLeadStatusDto } from './dto/wealth-update.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Wealth (KODO Wealth)')
@Controller('wealth')
export class WealthController {
  constructor(private readonly wealthService: WealthService) {}

  @Roles('ADMIN', 'ADMIN_MARKETING', 'ADMIN_INSURANCE')
  @ApiBearerAuth('access-token')
  @Get('consulting')
  @ApiOperation({ summary: '[Admin] Danh sách leads tư vấn' })
  async listLeads(@Query() query: WealthLeadsQueryDto) {
    return this.wealthService.listLeads(query);
  }

  @Roles('ADMIN', 'ADMIN_MARKETING', 'ADMIN_INSURANCE')
  @ApiBearerAuth('access-token')
  @Get('consulting/:id')
  @ApiOperation({ summary: '[Admin] Chi tiết lead' })
  async getLeadById(@Param('id', ParseUUIDPipe) id: string) {
    return this.wealthService.getLeadById(id);
  }

  @Roles('ADMIN', 'ADMIN_MARKETING', 'ADMIN_INSURANCE')
  @ApiBearerAuth('access-token')
  @Patch('consulting/:id')
  @ApiOperation({ summary: '[Admin] Cập nhật trạng thái lead' })
  async updateLeadStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLeadStatusDto,
  ) {
    return this.wealthService.updateLeadStatus(id, dto);
  }

  @Public()
  @Post('consulting')
  @ApiOperation({ summary: 'Đăng ký tư vấn 1-1', description: 'Thu thập lead từ form KODO Wealth' })
  @ApiResponse({ status: 201, description: 'Đã gửi thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  async createConsultingLead(@Body() dto: CreateConsultingLeadDto) {
    return this.wealthService.createConsultingLead(dto);
  }
}
