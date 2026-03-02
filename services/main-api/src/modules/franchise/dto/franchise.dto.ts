import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { franchise_status, region_service_type } from '@prisma/client';

export class CreateFranchisePartnerDto {
  @ApiProperty({ example: 'FP001' })
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  code: string;

  @ApiProperty({ example: 'Partner A' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  contactPhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(franchise_status)
  status?: franchise_status;

  @ApiPropertyOptional()
  @IsOptional()
  contractSignedAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  contractExpiresAt?: Date;
}

export class UpdateFranchisePartnerDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  code?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  contactPhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(franchise_status)
  status?: franchise_status;

  @ApiPropertyOptional()
  @IsOptional()
  contractSignedAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  contractExpiresAt?: Date;
}

export class AssignFranchiseRegionDto {
  @ApiProperty()
  @IsUUID()
  regionId: string;

  @ApiProperty({ enum: region_service_type })
  @IsEnum(region_service_type)
  serviceType: region_service_type;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
