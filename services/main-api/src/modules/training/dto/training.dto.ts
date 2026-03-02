import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsBoolean,
  IsUUID,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TrainingCategoryListQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  isActive?: boolean;
}

export class CreateTrainingCategoryDto {
  @ApiProperty({ example: 'driver-etiquette' })
  @IsString()
  slug!: string;

  @ApiProperty({ example: 'Đào tạo tài xế quy tắc ứng xử' })
  @IsString()
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateTrainingCategoryDto {
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
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class TrainingMaterialListQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ enum: ['ARTICLE', 'QUIZ', 'FAQ'] })
  @IsOptional()
  @IsIn(['ARTICLE', 'QUIZ', 'FAQ'])
  materialType?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}

export class CreateTrainingMaterialDto {
  @ApiProperty()
  @IsUUID()
  categoryId!: string;

  @ApiProperty({ example: 'quy-tac-ung-xu' })
  @IsString()
  slug!: string;

  @ApiProperty({ example: 'Quy tắc ứng xử khi lái xe' })
  @IsString()
  title!: string;

  @ApiProperty({ example: '<p>Nội dung bài viết...</p>' })
  @IsString()
  content!: string;

  @ApiProperty({ enum: ['ARTICLE', 'QUIZ', 'FAQ'] })
  @IsIn(['ARTICLE', 'QUIZ', 'FAQ'])
  materialType!: string;

  @ApiPropertyOptional({ example: 'ALL', description: 'ALL|USER|DRIVER|MERCHANT' })
  @IsOptional()
  @IsString()
  targetApps?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional({ default: 'vi' })
  @IsOptional()
  @IsString()
  locale?: string;
}

export class UpdateTrainingMaterialDto {
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
  @IsString()
  targetApps?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class TrainingLinksQueryDto {
  @ApiProperty({ enum: ['USER', 'DRIVER', 'MERCHANT'] })
  @IsString()
  audience!: string;

  @ApiPropertyOptional({ default: 'vi' })
  @IsOptional()
  @IsString()
  locale?: string;
}
