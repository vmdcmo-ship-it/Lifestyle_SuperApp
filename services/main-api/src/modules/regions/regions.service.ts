import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateRegionDto,
  UpdateRegionDto,
  RegionListQueryDto,
  AssignRegionServiceDto,
} from './dto/region.dto';
import { region_service_type } from '@prisma/client';

@Injectable()
export class RegionsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: RegionListQueryDto) {
    const { level, parentId, isActive, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (level) where.level = level;
    if (parentId !== undefined) where.parent_id = parentId ?? null;
    if (isActive !== undefined) where.is_active = isActive;

    const [items, total] = await Promise.all([
      this.prisma.region.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          services: { where: { is_active: true } },
        },
      }),
      this.prisma.region.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string) {
    const region = await this.prisma.region.findUnique({
      where: { id },
      include: {
        parent: true,
        services: true,
      },
    });
    if (!region) {
      throw new NotFoundException(`Region ${id} not found`);
    }
    return region;
  }

  async create(dto: CreateRegionDto) {
    return this.prisma.region.create({
      data: {
        code: dto.code,
        name: dto.name,
        level: dto.level,
        parent_id: dto.parentId,
        province: dto.province,
        city: dto.city,
        district: dto.district,
        is_active: dto.isActive ?? true,
      },
    });
  }

  async update(id: string, dto: UpdateRegionDto) {
    await this.getById(id);
    return this.prisma.region.update({
      where: { id },
      data: {
        ...(dto.code !== undefined && { code: dto.code }),
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.level !== undefined && { level: dto.level }),
        ...(dto.parentId !== undefined && { parent_id: dto.parentId }),
        ...(dto.province !== undefined && { province: dto.province }),
        ...(dto.city !== undefined && { city: dto.city }),
        ...(dto.district !== undefined && { district: dto.district }),
        ...(dto.isActive !== undefined && { is_active: dto.isActive }),
      },
    });
  }

  async getServices(regionId: string) {
    await this.getById(regionId);
    return this.prisma.regionServiceConfig.findMany({
      where: { region_id: regionId },
      orderBy: { service_type: 'asc' },
    });
  }

  async assignService(regionId: string, dto: AssignRegionServiceDto) {
    await this.getById(regionId);
    const effectiveFrom = dto.effectiveFrom ?? new Date();
    return this.prisma.regionServiceConfig.upsert({
      where: {
        region_id_service_type: {
          region_id: regionId,
          service_type: dto.serviceType as region_service_type,
        },
      },
      create: {
        region_id: regionId,
        service_type: dto.serviceType as region_service_type,
        is_active: dto.isActive ?? true,
        effective_from: effectiveFrom,
        effective_to: dto.effectiveTo,
      },
      update: {
        is_active: dto.isActive ?? true,
        effective_from: effectiveFrom,
        effective_to: dto.effectiveTo,
      },
    });
  }
}
