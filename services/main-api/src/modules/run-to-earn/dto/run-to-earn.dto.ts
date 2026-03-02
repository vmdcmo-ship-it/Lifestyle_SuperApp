import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsOptional,
  IsEnum,
  IsDateString,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum RunToEarnStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  ENDED = 'ENDED',
}

export enum RunToEarnPrizeType {
  XU = 'XU',
  VOUCHER = 'VOUCHER',
  PHYSICAL_GOODS = 'PHYSICAL_GOODS',
}

export class CreateRunToEarnCampaignDto {
  @ApiProperty({ example: 'Chạy thử thách tháng 3' })
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ example: 1000, description: 'Số bước = 1 Xu' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  stepsPerXu?: number;

  @ApiPropertyOptional({ example: 5000000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  budget?: number;
}

export class UpdateRunToEarnCampaignDto {
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
  @Min(1)
  @Type(() => Number)
  stepsPerXu?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  budget?: number;

  @ApiPropertyOptional({ enum: RunToEarnStatus })
  @IsOptional()
  @IsEnum(RunToEarnStatus)
  status?: RunToEarnStatus;
}

export class CreateRunToEarnPrizeDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: RunToEarnPrizeType })
  @IsEnum(RunToEarnPrizeType)
  type: RunToEarnPrizeType;

  @ApiProperty({ example: 1, description: 'Hạng từ' })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  rankFrom: number;

  @ApiProperty({ example: 1, description: 'Hạng đến' })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  rankTo: number;

  @ApiPropertyOptional({ description: 'Số Xu (khi type=XU)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  xuAmount?: number;

  @ApiPropertyOptional({ description: 'Coupon ID (khi type=VOUCHER)' })
  @IsOptional()
  @IsUUID()
  couponId?: string;

  @ApiPropertyOptional({ description: 'sponsorName, description... (khi type=PHYSICAL_GOODS)' })
  @IsOptional()
  valueJson?: Record<string, unknown>;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity?: number;
}
