import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsArray,
  Min,
  Max,
  IsDateString,
} from 'class-validator';

export enum InsuranceType {
  HEALTH = 'HEALTH',
  LIFE = 'LIFE',
  VEHICLE = 'VEHICLE',
  TRAVEL = 'TRAVEL',
  HOME = 'HOME',
  ACCIDENT = 'ACCIDENT',
  SOCIAL = 'SOCIAL',
}

export class PurchasePolicyDto {
  @ApiProperty({ description: 'Insurance Product ID (UUID)' })
  @IsString()
  productId: string;

  @ApiProperty({ example: '2026-03-01', description: 'Ngày bắt đầu' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: 'monthly', enum: ['monthly', 'yearly'] })
  @IsString()
  paymentPeriod: string;

  @ApiPropertyOptional({ example: 'Nguyễn Văn A' })
  @IsOptional()
  @IsString()
  beneficiaryName?: string;

  @ApiPropertyOptional({ example: '0901234567' })
  @IsOptional()
  @IsString()
  beneficiaryPhone?: string;
}

export class FileClaimDto {
  @ApiProperty({ description: 'Policy ID (UUID)' })
  @IsString()
  policyId: string;

  @ApiProperty({ example: 500000000, description: 'Số tiền yêu cầu bồi thường' })
  @IsInt()
  @Min(1)
  claimAmount: number;

  @ApiProperty({ example: 'Tai nạn giao thông ngày 15/02/2026' })
  @IsString()
  reason: string;

  @ApiPropertyOptional({ example: 'Chi tiết về sự kiện...' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: ['https://storage.example.com/doc1.pdf'] })
  @IsOptional()
  @IsArray()
  documents?: string[];
}

export class InsuranceProductQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;

  @ApiPropertyOptional({ enum: InsuranceType })
  @IsOptional()
  @IsString()
  type?: string;
}

export class PolicyQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;

  @ApiPropertyOptional({ enum: ['PENDING', 'ACTIVE', 'EXPIRED', 'CANCELLED'] })
  @IsOptional()
  @IsString()
  status?: string;
}
