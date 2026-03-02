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
import { RegionsService } from './regions.service';
import {
  CreateRegionDto,
  UpdateRegionDto,
  RegionListQueryDto,
  AssignRegionServiceDto,
} from './dto/region.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Regions')
@ApiBearerAuth('access-token')
@Controller('regions')
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Get()
  @Roles('ADMIN', 'ADMIN_TRANSPORT')
  @ApiOperation({ summary: '[Admin] Danh sách khu vực địa lý' })
  async list(@Query() query: RegionListQueryDto) {
    return this.regionsService.list(query);
  }

  @Get(':id')
  @Roles('ADMIN', 'ADMIN_TRANSPORT')
  @ApiOperation({ summary: '[Admin] Chi tiết khu vực' })
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.regionsService.getById(id);
  }

  @Post()
  @Roles('ADMIN', 'ADMIN_TRANSPORT')
  @ApiOperation({ summary: '[Admin] Tạo khu vực mới' })
  async create(@Body() dto: CreateRegionDto) {
    return this.regionsService.create(dto);
  }

  @Patch(':id')
  @Roles('ADMIN', 'ADMIN_TRANSPORT')
  @ApiOperation({ summary: '[Admin] Cập nhật khu vực' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRegionDto,
  ) {
    return this.regionsService.update(id, dto);
  }

  @Get(':id/services')
  @Roles('ADMIN', 'ADMIN_TRANSPORT')
  @ApiOperation({ summary: '[Admin] Danh sách dịch vụ của vùng' })
  async getServices(@Param('id', ParseUUIDPipe) id: string) {
    return this.regionsService.getServices(id);
  }

  @Post(':id/services')
  @Roles('ADMIN', 'ADMIN_TRANSPORT')
  @ApiOperation({ summary: '[Admin] Gán dịch vụ cho vùng (TRANSPORT/FOOD/GROCERY)' })
  async assignService(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignRegionServiceDto,
  ) {
    return this.regionsService.assignService(id, dto);
  }
}
