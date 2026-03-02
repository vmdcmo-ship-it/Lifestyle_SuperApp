import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { region_level, region_service_type } from '@prisma/client';

export enum RegionLevel {
  PROVINCE = 'PROVINCE',
  DISTRICT = 'DISTRICT',
  AREA = 'AREA',
}

export enum RegionServiceType {
  TRANSPORT = 'TRANSPORT',
  FOOD = 'FOOD',
  GROCERY = 'GROCERY',
}

export class CreateRegionDto {
  @ApiProperty({ example: 'HN' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  code: string;

  @ApiProperty({ example: 'Ha Noi' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name: string;

  @ApiProperty({ enum: RegionLevel, example: RegionLevel.PROVINCE })
  @IsEnum(RegionLevel)
  level: region_level;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @ApiPropertyOptional({ example: 'Ha Noi' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  province?: string;

  @ApiPropertyOptional({ example: 'Ha Noi' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({ example: 'Ba Dinh' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  district?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateRegionDto {
  @ApiPropertyOptional({ example: 'HN' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  code?: string;

  @ApiPropertyOptional({ example: 'Ha Noi' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional({ enum: RegionLevel })
  @IsOptional()
  @IsEnum(RegionLevel)
  level?: region_level;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  province?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  district?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class RegionListQueryDto {
  @ApiPropertyOptional({ enum: RegionLevel })
  @IsOptional()
  @IsEnum(RegionLevel)
  level?: region_level;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  limit?: number = 20;
}

export class AssignRegionServiceDto {
  @ApiProperty({ enum: RegionServiceType, example: RegionServiceType.TRANSPORT })
  @IsEnum(RegionServiceType)
  serviceType: region_service_type;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Effective from date' })
  @IsOptional()
  effectiveFrom?: Date;

  @ApiPropertyOptional({ description: 'Effective to date' })
  @IsOptional()
  effectiveTo?: Date;
}
