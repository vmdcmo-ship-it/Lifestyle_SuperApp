import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Tìm kiếm',
    description: 'Full-text search cho merchants, products',
  })
  @ApiQuery({ name: 'q', type: String, description: 'Từ khóa tìm kiếm' })
  @ApiQuery({ name: 'type', required: false, enum: ['all', 'merchants', 'products'] })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'lat', required: false, type: Number })
  @ApiQuery({ name: 'lng', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async search(
    @Query('q') q: string,
    @Query('type') type?: string,
    @Query('city') city?: string,
    @Query('lat') lat?: number,
    @Query('lng') lng?: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.searchService.search({
      q,
      type: type as any,
      city,
      lat: lat ? Number(lat) : undefined,
      lng: lng ? Number(lng) : undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Public()
  @Get('nearby')
  @ApiOperation({
    summary: 'Tìm gần đây',
    description: 'Tìm cửa hàng trong bán kính (km)',
  })
  @ApiQuery({ name: 'lat', type: Number, example: 10.7769 })
  @ApiQuery({ name: 'lng', type: Number, example: 106.7009 })
  @ApiQuery({ name: 'radius', required: false, type: Number, example: 5 })
  @ApiQuery({ name: 'type', required: false, enum: ['RESTAURANT', 'CAFE', 'SUPERMARKET', 'PHARMACY'] })
  async nearby(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('radius') radius?: number,
    @Query('type') type?: string,
  ) {
    return this.searchService.nearby(
      Number(lat),
      Number(lng),
      radius ? Number(radius) : 5,
      type,
    );
  }
}
