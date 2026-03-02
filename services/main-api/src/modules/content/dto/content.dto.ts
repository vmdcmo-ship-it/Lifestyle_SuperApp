import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ContentListQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;

  @ApiPropertyOptional({ example: 'privacy-policy' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: 'vi' })
  @IsOptional()
  @IsString()
  locale?: string;
}

export class CreateContentDto {
  @ApiProperty({ example: 'privacy-policy' })
  @IsString()
  slug: string;

  @ApiPropertyOptional({ example: 'vi', default: 'vi' })
  @IsOptional()
  @IsString()
  locale?: string;

  @ApiProperty({ example: 'Chính sách bảo mật' })
  @IsString()
  title: string;

  @ApiProperty({ example: '<p>Nội dung văn bản...</p>' })
  @IsString()
  content: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @IsDateString()
  effectiveFrom: string;

  @ApiPropertyOptional({ example: '2025-12-31T23:59:59.000Z' })
  @IsOptional()
  @IsDateString()
  effectiveTo?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: 'ALL',
    description:
      'ALL|USER|DRIVER|MERCHANT hoặc USER,DRIVER (phân cách bằng dấu phẩy). NULL = tất cả app.',
  })
  @IsOptional()
  @IsString()
  targetApps?: string;
}

export class ContentLinksQueryDto {
  @ApiProperty({ example: 'USER', enum: ['USER', 'DRIVER', 'MERCHANT'] })
  @IsString()
  audience!: string;

  @ApiPropertyOptional({ example: 'vi', default: 'vi' })
  @IsOptional()
  @IsString()
  locale?: string;
}

export class UpdateContentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  effectiveFrom?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  effectiveTo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 'USER,DRIVER' })
  @IsOptional()
  @IsString()
  targetApps?: string;
}
