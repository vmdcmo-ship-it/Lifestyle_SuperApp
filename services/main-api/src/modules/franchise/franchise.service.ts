import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateFranchisePartnerDto,
  UpdateFranchisePartnerDto,
  AssignFranchiseRegionDto,
} from './dto/franchise.dto';
import { region_service_type } from '@prisma/client';

@Injectable()
export class FranchiseService {
  constructor(private readonly prisma: PrismaService) {}

  async listPartners(page = 1, limit = 20, status?: string) {
    const skip = (page - 1) * limit;
    const where =
      status && ['ACTIVE', 'INACTIVE', 'PENDING'].includes(status)
        ? { status: status as 'ACTIVE' | 'INACTIVE' | 'PENDING' }
        : {};
    const [items, total] = await Promise.all([
      this.prisma.franchisePartner.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          regions: { include: { region: true } },
        },
      }),
      this.prisma.franchisePartner.count({ where }),
    ]);
    return {
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getPartnerById(id: string) {
    const partner = await this.prisma.franchisePartner.findUnique({
      where: { id },
      include: {
        regions: { include: { region: true } },
      },
    });
    if (!partner) {
      throw new NotFoundException(`Franchise partner ${id} not found`);
    }
    return partner;
  }

  async createPartner(dto: CreateFranchisePartnerDto) {
    return this.prisma.franchisePartner.create({
      data: {
        code: dto.code,
        name: dto.name,
        contact_email: dto.contactEmail,
        contact_phone: dto.contactPhone,
        status: dto.status ?? 'PENDING',
        contract_signed_at: dto.contractSignedAt,
        contract_expires_at: dto.contractExpiresAt,
      },
    });
  }

  async updatePartner(id: string, dto: UpdateFranchisePartnerDto) {
    await this.getPartnerById(id);
    return this.prisma.franchisePartner.update({
      where: { id },
      data: {
        ...(dto.code !== undefined && { code: dto.code }),
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.contactEmail !== undefined && { contact_email: dto.contactEmail }),
        ...(dto.contactPhone !== undefined && { contact_phone: dto.contactPhone }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.contractSignedAt !== undefined && { contract_signed_at: dto.contractSignedAt }),
        ...(dto.contractExpiresAt !== undefined && { contract_expires_at: dto.contractExpiresAt }),
      },
    });
  }

  async getPartnerRegions(partnerId: string) {
    await this.getPartnerById(partnerId);
    return this.prisma.franchiseRegion.findMany({
      where: { franchise_partner_id: partnerId },
      include: { region: true },
    });
  }

  async assignRegion(partnerId: string, dto: AssignFranchiseRegionDto) {
    await this.getPartnerById(partnerId);
    const existing = await this.prisma.region.findUnique({
      where: { id: dto.regionId },
    });
    if (!existing) {
      throw new NotFoundException(`Region ${dto.regionId} not found`);
    }
    return this.prisma.franchiseRegion.upsert({
      where: {
        franchise_partner_id_region_id_service_type: {
          franchise_partner_id: partnerId,
          region_id: dto.regionId,
          service_type: dto.serviceType as region_service_type,
        },
      },
      create: {
        franchise_partner_id: partnerId,
        region_id: dto.regionId,
        service_type: dto.serviceType as region_service_type,
        is_active: dto.isActive ?? true,
      },
      update: { is_active: dto.isActive ?? true },
    });
  }
}
