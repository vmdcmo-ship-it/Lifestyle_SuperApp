import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { HousingProject, ProjectKind } from '../../entities/housing-project.entity';

export interface ProjectFilterDto {
  province?: string;
  district?: string;
  kind?: ProjectKind;
}

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(HousingProject)
    private readonly repo: Repository<HousingProject>,
  ) {}

  async findAll(filter: ProjectFilterDto = {}): Promise<HousingProject[]> {
    const qb = this.repo.createQueryBuilder('p');
    if (filter.province) {
      qb.andWhere('p.province ILIKE :province', { province: `%${filter.province}%` });
    }
    if (filter.district) {
      qb.andWhere('p.district ILIKE :district', { district: `%${filter.district}%` });
    }
    if (filter.kind) {
      qb.andWhere('p.kind = :kind', { kind: filter.kind });
    }
    qb.orderBy('p.name', 'ASC');
    return qb.getMany();
  }

  async findBySlug(slug: string): Promise<HousingProject> {
    const p = await this.repo.findOne({ where: { slug } });
    if (!p) {
      throw new NotFoundException(`Project slug not found: ${slug}`);
    }
    return p;
  }

  async findByIds(ids: string[]): Promise<HousingProject[]> {
    if (ids.length === 0) {
      return [];
    }
    return this.repo.find({ where: { id: In(ids) } });
  }
}
