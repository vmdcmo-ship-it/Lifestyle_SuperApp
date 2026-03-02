import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { pricing_service_type } from '@prisma/client';
import {
  CreatePricingTableDto,
  UpdatePricingTableDto,
  CreatePricingParamDto,
  UpdatePricingParamDto,
  UpdatePricingParamTogglesDto,
  CreateDeliveryParamDto,
  UpdateDeliveryParamDto,
  UpdateDeliveryParamTogglesDto,
} from './dto/pricing-tables.dto';
import { delivery_size_tier } from '@prisma/client';

@Injectable()
export class PricingTablesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(serviceType?: string) {
    const where: Record<string, unknown> = {};
    if (serviceType) where.service_type = serviceType;

    const tables = await this.prisma.pricingTable.findMany({
      where,
      include: {
        regions: { include: { region: true } },
        params: true,
        delivery_params: true,
      },
      orderBy: { name: 'asc' },
    });

    return tables.map((t) => this.formatTable(t as never));
  }

  async getById(id: string) {
    const table = await this.prisma.pricingTable.findUnique({
      where: { id },
      include: {
        regions: { include: { region: true } },
        params: true,
        delivery_params: true,
      },
    });
    if (!table) {
      throw new NotFoundException(`Bảng giá ${id} không tồn tại`);
    }
    return this.formatTable(table as never);
  }

  async create(dto: CreatePricingTableDto) {
    const existing = await this.prisma.pricingTable.findUnique({
      where: { code: dto.code },
    });
    if (existing) {
      throw new ConflictException(`Mã bảng giá ${dto.code} đã tồn tại`);
    }

    const effectiveFrom = dto.effectiveFrom ?? new Date();

    const table = await this.prisma.pricingTable.create({
      data: {
        code: dto.code,
        name: dto.name,
        service_type: dto.serviceType as pricing_service_type,
        effective_from: effectiveFrom,
        effective_to: dto.effectiveTo,
        is_active: dto.isActive ?? true,
        regions: {
          create: dto.regionIds.map((regionId) => ({ region_id: regionId })),
        },
      },
      include: {
        regions: { include: { region: true } },
        params: true,
        delivery_params: true,
      },
    });

    return this.formatTable(table as never);
  }

  async update(id: string, dto: UpdatePricingTableDto) {
    const existing = await this.prisma.pricingTable.findUnique({
      where: { id },
      include: { regions: true, params: true, delivery_params: true },
    });
    if (!existing) throw new NotFoundException(`Bảng giá ${id} không tồn tại`);

    const data: Record<string, unknown> = {};
    if (dto.code !== undefined) data.code = dto.code;
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.effectiveFrom !== undefined) data.effective_from = dto.effectiveFrom;
    if (dto.effectiveTo !== undefined) data.effective_to = dto.effectiveTo;
    if (dto.isActive !== undefined) data.is_active = dto.isActive;

    if (dto.regionIds !== undefined) {
      await this.prisma.pricingTableRegion.deleteMany({
        where: { pricing_table_id: id },
      });
      await this.prisma.pricingTableRegion.createMany({
        data: dto.regionIds.map((regionId) => ({
          pricing_table_id: id,
          region_id: regionId,
        })),
      });
    }

    const table = await this.prisma.pricingTable.update({
      where: { id },
      data: data as never,
      include: {
        regions: { include: { region: true } },
        params: true,
        delivery_params: true,
      },
    });

    return this.formatTable(table as never);
  }

  async addParam(tableId: string, dto: CreatePricingParamDto) {
    const table = await this.getById(tableId);
    if (table.serviceType === 'DELIVERY') {
      throw new ConflictException(
        'Bảng giá giao hàng dùng tham số delivery (size, kg, CBM). Gọi POST delivery-params.',
      );
    }

    const factors = dto.factors ?? {};
    const defaultFactors = {
      surgeEnabled: false,
      surgeMax: 2.0,
      weatherEnabled: false,
      weatherMultiplier: 1.0,
      trafficEnabled: false,
      trafficMultiplier: 1.0,
    };
    const mergedFactors = { ...defaultFactors, ...factors };

    const param = await this.prisma.pricingParam.create({
      data: {
        pricing_table_id: tableId,
        vehicle_type: dto.vehicleType,
        base_fare: BigInt(dto.baseFare),
        per_km: BigInt(dto.perKm),
        per_min: BigInt(dto.perMin),
        min_fare: BigInt(dto.minFare),
        factors: mergedFactors as never,
        is_active: dto.isActive ?? true,
      },
    });

    return {
      id: param.id,
      vehicleType: param.vehicle_type,
      baseFare: Number(param.base_fare),
      perKm: Number(param.per_km),
      perMin: Number(param.per_min),
      minFare: Number(param.min_fare),
      factors: param.factors as Record<string, unknown>,
      isActive: param.is_active,
    };
  }

  async updateParam(tableId: string, paramId: string, dto: UpdatePricingParamDto) {
    const param = await this.prisma.pricingParam.findFirst({
      where: { id: paramId, pricing_table_id: tableId },
    });
    if (!param) {
      throw new NotFoundException('Không tìm thấy tham số định giá');
    }

    const data: Record<string, unknown> = {};
    if (dto.baseFare !== undefined) data.base_fare = BigInt(dto.baseFare);
    if (dto.perKm !== undefined) data.per_km = BigInt(dto.perKm);
    if (dto.perMin !== undefined) data.per_min = BigInt(dto.perMin);
    if (dto.minFare !== undefined) data.min_fare = BigInt(dto.minFare);
    if (dto.factors !== undefined) {
      const current = (param.factors ?? {}) as Record<string, unknown>;
      data.factors = { ...current, ...dto.factors };
    }
    if (dto.isActive !== undefined) data.is_active = dto.isActive;

    const updated = await this.prisma.pricingParam.update({
      where: { id: paramId },
      data: data as never,
    });

    return {
      id: updated.id,
      vehicleType: updated.vehicle_type,
      baseFare: Number(updated.base_fare),
      perKm: Number(updated.per_km),
      perMin: Number(updated.per_min),
      minFare: Number(updated.min_fare),
      factors: updated.factors as Record<string, unknown>,
      isActive: updated.is_active,
    };
  }

  async updateParamToggles(
    tableId: string,
    paramId: string,
    dto: UpdatePricingParamTogglesDto,
  ) {
    const param = await this.prisma.pricingParam.findFirst({
      where: { id: paramId, pricing_table_id: tableId },
    });
    if (!param) {
      throw new NotFoundException('Không tìm thấy tham số định giá');
    }

    const current = (param.factors ?? {}) as Record<string, unknown>;
    const updates: Record<string, unknown> = {};
    if (dto.surgeEnabled !== undefined) updates.surgeEnabled = dto.surgeEnabled;
    if (dto.weatherEnabled !== undefined) updates.weatherEnabled = dto.weatherEnabled;
    if (dto.trafficEnabled !== undefined) updates.trafficEnabled = dto.trafficEnabled;

    const newFactors = { ...current, ...updates };

    const updated = await this.prisma.pricingParam.update({
      where: { id: paramId },
      data: { factors: newFactors as never },
    });

    return {
      id: updated.id,
      factors: updated.factors as Record<string, unknown>,
    };
  }

  // ─── Giao hàng: kg, CBM, Size S/M/L/XL/BULKY ──────────────────────────────────

  async addDeliveryParam(tableId: string, dto: CreateDeliveryParamDto) {
    const table = await this.getById(tableId);
    if (table.serviceType !== 'DELIVERY') {
      throw new ConflictException(
        'Chỉ bảng giá loại DELIVERY mới có tham số giao hàng.',
      );
    }

    const factors = dto.factors ?? {};
    const defaultFactors = {
      surgeEnabled: false,
      weatherEnabled: false,
      trafficEnabled: false,
    };
    const mergedFactors = { ...defaultFactors, ...factors };

    const param = await this.prisma.deliveryPricingParam.create({
      data: {
        pricing_table_id: tableId,
        size_tier: dto.sizeTier as delivery_size_tier,
        base_fee: BigInt(dto.baseFee),
        per_kg: BigInt(dto.perKg),
        cbm_divisor: dto.cbmDivisor ?? 6000,
        factors: mergedFactors as never,
        is_active: dto.isActive ?? true,
      },
    });

    return {
      id: param.id,
      sizeTier: param.size_tier,
      baseFee: Number(param.base_fee),
      perKg: Number(param.per_kg),
      cbmDivisor: param.cbm_divisor,
      factors: param.factors as Record<string, unknown>,
      isActive: param.is_active,
    };
  }

  async updateDeliveryParam(
    tableId: string,
    paramId: string,
    dto: UpdateDeliveryParamDto,
  ) {
    const param = await this.prisma.deliveryPricingParam.findFirst({
      where: { id: paramId, pricing_table_id: tableId },
    });
    if (!param) {
      throw new NotFoundException('Không tìm thấy tham số giao hàng');
    }

    const data: Record<string, unknown> = {};
    if (dto.baseFee !== undefined) data.base_fee = BigInt(dto.baseFee);
    if (dto.perKg !== undefined) data.per_kg = BigInt(dto.perKg);
    if (dto.cbmDivisor !== undefined) data.cbm_divisor = dto.cbmDivisor;
    if (dto.factors !== undefined) {
      const current = (param.factors ?? {}) as Record<string, unknown>;
      data.factors = { ...current, ...dto.factors };
    }
    if (dto.isActive !== undefined) data.is_active = dto.isActive;

    const updated = await this.prisma.deliveryPricingParam.update({
      where: { id: paramId },
      data: data as never,
    });

    return {
      id: updated.id,
      sizeTier: updated.size_tier,
      baseFee: Number(updated.base_fee),
      perKg: Number(updated.per_kg),
      cbmDivisor: updated.cbm_divisor,
      factors: updated.factors as Record<string, unknown>,
      isActive: updated.is_active,
    };
  }

  async updateDeliveryParamToggles(
    tableId: string,
    paramId: string,
    dto: UpdateDeliveryParamTogglesDto,
  ) {
    const param = await this.prisma.deliveryPricingParam.findFirst({
      where: { id: paramId, pricing_table_id: tableId },
    });
    if (!param) {
      throw new NotFoundException('Không tìm thấy tham số giao hàng');
    }

    const current = (param.factors ?? {}) as Record<string, unknown>;
    const updates: Record<string, unknown> = {};
    if (dto.surgeEnabled !== undefined) updates.surgeEnabled = dto.surgeEnabled;
    if (dto.weatherEnabled !== undefined) updates.weatherEnabled = dto.weatherEnabled;
    if (dto.trafficEnabled !== undefined) updates.trafficEnabled = dto.trafficEnabled;

    const updated = await this.prisma.deliveryPricingParam.update({
      where: { id: paramId },
      data: { factors: { ...current, ...updates } as never },
    });

    return {
      id: updated.id,
      factors: updated.factors as Record<string, unknown>,
    };
  }

  private formatTable(
    table: {
      id: string;
      code: string;
      name: string;
      service_type: string;
      effective_from: Date;
      effective_to: Date | null;
      is_active: boolean;
      created_at: Date;
      updated_at: Date;
      regions: Array<{ region: { id: string; code: string; name: string } }>;
      params: Array<{
        id: string;
        vehicle_type: string;
        base_fare: bigint;
        per_km: bigint;
        per_min: bigint;
        min_fare: bigint;
        factors: unknown;
        is_active: boolean;
      }>;
      delivery_params?: Array<{
        id: string;
        size_tier: string;
        base_fee: bigint;
        per_kg: bigint;
        cbm_divisor: number;
        factors: unknown;
        is_active: boolean;
      }>;
    },
  ) {
    const base = {
      id: table.id,
      code: table.code,
      name: table.name,
      serviceType: table.service_type,
      effectiveFrom: table.effective_from,
      effectiveTo: table.effective_to,
      isActive: table.is_active,
      regions: table.regions.map((r) => ({
        id: r.region.id,
        code: r.region.code,
        name: r.region.name,
      })),
      params: table.params.map((p) => ({
        id: p.id,
        vehicleType: p.vehicle_type,
        baseFare: Number(p.base_fare),
        perKm: Number(p.per_km),
        perMin: Number(p.per_min),
        minFare: Number(p.min_fare),
        factors: p.factors as Record<string, unknown>,
        isActive: p.is_active,
      })),
      deliveryParams:
        table.delivery_params?.map((d) => ({
          id: d.id,
          sizeTier: d.size_tier,
          baseFee: Number(d.base_fee),
          perKg: Number(d.per_kg),
          cbmDivisor: d.cbm_divisor,
          factors: d.factors as Record<string, unknown>,
          isActive: d.is_active,
        })) ?? [],
      createdAt: table.created_at,
      updatedAt: table.updated_at,
    };
    return base;
  }
}
