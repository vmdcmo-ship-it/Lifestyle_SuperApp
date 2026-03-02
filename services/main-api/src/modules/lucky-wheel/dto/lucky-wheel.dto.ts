import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsOptional,
  IsEnum,
  IsDateString,
  Min,
  Max,
  IsUUID,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum LuckyWheelCampaignStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  ENDED = 'ENDED',
}

export enum LuckyWheelPrizeType {
  VOUCHER = 'VOUCHER',
  WALLET_CREDIT = 'WALLET_CREDIT',
  PHYSICAL_GOODS = 'PHYSICAL_GOODS',
  NO_PRIZE = 'NO_PRIZE',
}

export class CreateLuckyWheelCampaignDto {
  @ApiProperty({ example: 'Vòng quay Tết 2026' })
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2026-02-01T00:00:00Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-02-28T23:59:59Z' })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ example: 100000000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  budget?: number;

  @ApiPropertyOptional({ example: 100000 })
  @IsOptional()
  @IsInt()
  @Min(10000)
  @Type(() => Number)
  driverRevenuePerSpin?: number;

  @ApiPropertyOptional({ example: 500000 })
  @IsOptional()
  @IsInt()
  @Min(10000)
  @Type(() => Number)
  userTopUpPerSpin?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  userOrderPerSpin?: number;
}

export class UpdateLuckyWheelCampaignDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  budget?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(LuckyWheelCampaignStatus)
  status?: LuckyWheelCampaignStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(10000)
  @Type(() => Number)
  driverRevenuePerSpin?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(10000)
  @Type(() => Number)
  userTopUpPerSpin?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  userOrderPerSpin?: number;
}

export class CreateLuckyWheelPrizeDto {
  @ApiProperty({ example: 'Giảm 20% đơn hàng' })
  @IsString()
  name: string;

  @ApiProperty({ enum: LuckyWheelPrizeType })
  @IsEnum(LuckyWheelPrizeType)
  type: LuckyWheelPrizeType;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  weight: number;

  @ApiPropertyOptional({ example: 1000 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  valueJson?: Record<string, unknown>;
}

export class UpdateLuckyWheelPrizeDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(LuckyWheelPrizeType)
  type?: LuckyWheelPrizeType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  weight?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  quantity?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  valueJson?: Record<string, unknown>;
}

export class LuckyWheelSpinQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  campaignId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({ enum: ['USER', 'DRIVER'] })
  @IsOptional()
  participantType?: 'USER' | 'DRIVER';
}
