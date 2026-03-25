import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProjectKind } from '../../entities/housing-project.entity';
import { ProjectsService } from './projects.service';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Get()
  @ApiQuery({ name: 'province', required: false })
  @ApiQuery({ name: 'district', required: false })
  @ApiQuery({ name: 'kind', enum: ProjectKind, required: false })
  findAll(
    @Query('province') province?: string,
    @Query('district') district?: string,
    @Query('kind') kind?: ProjectKind,
  ) {
    return this.projects.findAll({ province, district, kind });
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.projects.findBySlug(slug);
  }
}
