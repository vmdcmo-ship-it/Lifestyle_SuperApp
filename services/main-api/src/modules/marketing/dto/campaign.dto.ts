import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsNumber, IsEnum } from 'class-validator';

export type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ENDED';

export class CreateCampaignDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: ['DRAFT', 'ACTIVE', 'PAUSED', 'ENDED'] })
  @IsEnum(['DRAFT', 'ACTIVE', 'PAUSED', 'ENDED'])
  @IsOptional()
  status?: CampaignStatus;

  @ApiProperty({ example: '2025-01-01T00:00:00Z' })
  @IsDateString()
  startDate!: string;

  @ApiProperty({ example: '2025-12-31T23:59:59Z' })
  @IsDateString()
  endDate!: string;

  @ApiPropertyOptional({ description: 'Budget VND' })
  @IsNumber()
  @IsOptional()
  budget?: number;
}

export class UpdateCampaignDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: ['DRAFT', 'ACTIVE', 'PAUSED', 'ENDED'] })
  @IsEnum(['DRAFT', 'ACTIVE', 'PAUSED', 'ENDED'])
  @IsOptional()
  status?: CampaignStatus;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  budget?: number;
}
