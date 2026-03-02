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
import { FranchiseService } from './franchise.service';
import {
  CreateFranchisePartnerDto,
  UpdateFranchisePartnerDto,
  AssignFranchiseRegionDto,
} from './dto/franchise.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Franchise')
@ApiBearerAuth('access-token')
@Controller('franchise')
export class FranchiseController {
  constructor(private readonly franchiseService: FranchiseService) {}

  @Get('partners')
  @Roles('ADMIN', 'ADMIN_TRANSPORT')
  @ApiOperation({ summary: '[Admin] Danh sách đối tác nhượng quyền' })
  async listPartners(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return this.franchiseService.listPartners(page ?? 1, limit ?? 20, status);
  }

  @Get('partners/:id')
  @Roles('ADMIN', 'ADMIN_TRANSPORT')
  @ApiOperation({ summary: '[Admin] Chi tiết đối tác nhượng quyền' })
  async getPartnerById(@Param('id', ParseUUIDPipe) id: string) {
    return this.franchiseService.getPartnerById(id);
  }

  @Post('partners')
  @Roles('ADMIN', 'ADMIN_TRANSPORT')
  @ApiOperation({ summary: '[Admin] Tạo đối tác nhượng quyền mới' })
  async createPartner(@Body() dto: CreateFranchisePartnerDto) {
    return this.franchiseService.createPartner(dto);
  }

  @Patch('partners/:id')
  @Roles('ADMIN', 'ADMIN_TRANSPORT')
  @ApiOperation({ summary: '[Admin] Cập nhật đối tác nhượng quyền' })
  async updatePartner(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFranchisePartnerDto,
  ) {
    return this.franchiseService.updatePartner(id, dto);
  }

  @Get('partners/:id/regions')
  @Roles('ADMIN', 'ADMIN_TRANSPORT')
  @ApiOperation({ summary: '[Admin] Danh sách vùng của đối tác' })
  async getPartnerRegions(@Param('id', ParseUUIDPipe) id: string) {
    return this.franchiseService.getPartnerRegions(id);
  }

  @Post('partners/:id/regions')
  @Roles('ADMIN', 'ADMIN_TRANSPORT')
  @ApiOperation({ summary: '[Admin] Gán vùng cho đối tác' })
  async assignRegion(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignFranchiseRegionDto,
  ) {
    return this.franchiseService.assignRegion(id, dto);
  }
}
