import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsArray,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum PricingServiceType {
  TRANSPORT = 'TRANSPORT',
  DELIVERY = 'DELIVERY',
}

export class CreatePricingTableDto {
  @ApiProperty({ example: 'PT-HN-001' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'Bảng giá Hà Nội - Gọi xe' })
  @IsString()
  name: string;

  @ApiProperty({ enum: PricingServiceType })
  @IsEnum(PricingServiceType)
  serviceType: PricingServiceType;

  @ApiPropertyOptional()
  @IsOptional()
  effectiveFrom?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  effectiveTo?: Date;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @ApiProperty({ type: [String], description: 'Danh sách region IDs' })
  @IsArray()
  @IsUUID('4', { each: true })
  regionIds: string[];
}

export class UpdatePricingTableDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  effectiveFrom?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  effectiveTo?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  regionIds?: string[];
}

export class CreatePricingParamDto {
  @ApiProperty({ example: 'BIKE' })
  @IsString()
  vehicleType: string;

  @ApiProperty({ example: 12000 })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  baseFare: number;

  @ApiProperty({ example: 4200 })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  perKm: number;

  @ApiProperty({ example: 300 })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  perMin: number;

  @ApiProperty({ example: 12000 })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  minFare: number;

  @ApiPropertyOptional({
    description:
      'Hệ số: surgeEnabled, surgeMax, weatherEnabled, weatherMultiplier, trafficEnabled, trafficMultiplier',
    example: {
      surgeEnabled: true,
      surgeMax: 2.0,
      weatherEnabled: false,
      weatherMultiplier: 1.1,
      trafficEnabled: true,
      trafficMultiplier: 1.15,
    },
  })
  @IsOptional()
  factors?: Record<string, unknown>;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;
}

export class UpdatePricingParamDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  baseFare?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  perKm?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  perMin?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  minFare?: number;

  @ApiPropertyOptional()
  @IsOptional()
  factors?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;
}

/** Chỉ cập nhật công tắc (ops manager - không thấy công thức) */
export class UpdatePricingParamTogglesDto {
  @ApiPropertyOptional({ description: 'Bật/tắt surge pricing' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  surgeEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Bật/tắt hệ số thời tiết' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  weatherEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Bật/tắt hệ số giao thông' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  trafficEnabled?: boolean;
}

// ─── Giao hàng: Size S/M/L/XL/BULKY, kg, CBM ────────────────────────────────────

export enum DeliverySizeTier {
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  BULKY = 'BULKY',
}

export class CreateDeliveryParamDto {
  @ApiProperty({ enum: DeliverySizeTier, description: 'S, M, L, XL, Hàng cồng kềnh' })
  @IsEnum(DeliverySizeTier)
  sizeTier: DeliverySizeTier;

  @ApiProperty({ example: 15000, description: 'Phí cơ bản (đ)' })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  baseFee: number;

  @ApiProperty({ example: 5000, description: 'Đơn giá / kg (đ)' })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  perKg: number;

  @ApiPropertyOptional({ default: 6000, description: 'Công thức CBM: (D×R×C)/cbm_divisor' })
  @IsOptional()
  @IsInt()
  @Min(100)
  @Type(() => Number)
  cbmDivisor?: number;

  @ApiPropertyOptional()
  @IsOptional()
  factors?: Record<string, unknown>;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;
}

export class UpdateDeliveryParamDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  baseFee?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  perKg?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(100)
  @Type(() => Number)
  cbmDivisor?: number;

  @ApiPropertyOptional()
  @IsOptional()
  factors?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;
}

export class UpdateDeliveryParamTogglesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  surgeEnabled?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  weatherEnabled?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  trafficEnabled?: boolean;
}
