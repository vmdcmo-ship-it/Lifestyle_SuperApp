import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFareConfigDto, UpdateFareConfigDto } from './dto/pricing.dto';

@Injectable()
export class PricingService {
  constructor(private readonly prisma: PrismaService) {}

  async list(includeInactive = false) {
    const where = includeInactive ? {} : { isActive: true };
    const configs = await this.prisma.fareConfig.findMany({
      where,
      orderBy: { vehicleType: 'asc' },
    });
    return configs.map((c) => ({
      id: c.id,
      vehicleType: c.vehicleType,
      baseFare: Number(c.baseFare),
      perKm: Number(c.perKm),
      perMin: Number(c.perMin),
      minFare: Number(c.minFare),
      isActive: c.isActive,
      effectiveFrom: c.effectiveFrom,
      createdAt: c.createdAt,
    }));
  }

  async getByVehicleType(vehicleType: string): Promise<{
    baseFare: number;
    perKm: number;
    perMin: number;
    minFare: number;
  } | null> {
    const config = await this.prisma.fareConfig.findUnique({
      where: { vehicleType },
    });
    if (!config || !config.isActive) return null;
    return {
      baseFare: Number(config.baseFare),
      perKm: Number(config.perKm),
      perMin: Number(config.perMin),
      minFare: Number(config.minFare),
    };
  }

  async create(dto: CreateFareConfigDto) {
    const existing = await this.prisma.fareConfig.findUnique({
      where: { vehicleType: dto.vehicleType },
    });
    if (existing) {
      throw new ConflictException(
        `Bảng giá cho ${dto.vehicleType} đã tồn tại. Dùng PATCH để cập nhật.`,
      );
    }

    const config = await this.prisma.fareConfig.create({
      data: {
        vehicleType: dto.vehicleType,
        baseFare: dto.baseFare,
        perKm: dto.perKm,
        perMin: dto.perMin,
        minFare: dto.minFare,
        isActive: dto.isActive ?? true,
      },
    });

    return this.formatConfig(config);
  }

  async update(vehicleType: string, dto: UpdateFareConfigDto) {
    const existing = await this.prisma.fareConfig.findUnique({
      where: { vehicleType },
    });
    if (!existing) {
      throw new NotFoundException(`Không tìm thấy bảng giá cho ${vehicleType}`);
    }

    const config = await this.prisma.fareConfig.update({
      where: { vehicleType },
      data: {
        ...(dto.baseFare !== undefined && { baseFare: dto.baseFare }),
        ...(dto.perKm !== undefined && { perKm: dto.perKm }),
        ...(dto.perMin !== undefined && { perMin: dto.perMin }),
        ...(dto.minFare !== undefined && { minFare: dto.minFare }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });

    return this.formatConfig(config);
  }

  private formatConfig(c: {
    id: string;
    vehicleType: string;
    baseFare: bigint;
    perKm: bigint;
    perMin: bigint;
    minFare: bigint;
    isActive: boolean;
    effectiveFrom: Date;
    createdAt: Date;
  }) {
    return {
      id: c.id,
      vehicleType: c.vehicleType,
      baseFare: Number(c.baseFare),
      perKm: Number(c.perKm),
      perMin: Number(c.perMin),
      minFare: Number(c.minFare),
      isActive: c.isActive,
      effectiveFrom: c.effectiveFrom,
      createdAt: c.createdAt,
    };
  }
}
