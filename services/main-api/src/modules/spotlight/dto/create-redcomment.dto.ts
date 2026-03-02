import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  MaxLength,
  IsArray,
} from 'class-validator';

export enum RedcommentFormatDto {
  VIDEO_REEL = 'VIDEO_REEL',
  ARTICLE = 'ARTICLE',
  PHOTO_ESSAY = 'PHOTO_ESSAY',
  COMPARISON = 'COMPARISON',
}

export enum TargetTypeDto {
  PRODUCT = 'PRODUCT',
  RESTAURANT = 'RESTAURANT',
  CAFE = 'CAFE',
  HOTEL = 'HOTEL',
  TRAVEL = 'TRAVEL',
  INSURANCE = 'INSURANCE',
  EVENT = 'EVENT',
  EXPERIENCE = 'EXPERIENCE',
}

export class CreateRedcommentDto {
  @ApiProperty({ example: 'Review Phở Thìn Bờ Hồ - Huyền thoại Hà Nội' })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({ enum: RedcommentFormatDto, example: 'VIDEO_REEL' })
  @IsEnum(RedcommentFormatDto)
  format: RedcommentFormatDto;

  @ApiProperty({ enum: TargetTypeDto, example: 'RESTAURANT' })
  @IsEnum(TargetTypeDto)
  targetType: TargetTypeDto;

  @ApiPropertyOptional({
    example:
      'Phở Thìn Bờ Hồ là quán phở huyền thoại ở Hà Nội. Nước dùng đậm đà...',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ example: 'Phở ngon nhất Hà Nội, giá chỉ 50K' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  summary?: string;

  @ApiPropertyOptional({ example: ['phở', 'hà nội', 'ẩm thực'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ example: 120, description: 'Thời lượng video (giây)' })
  @IsOptional()
  videoDuration?: number;
}

export class UpdateRedcommentDto {
  @ApiPropertyOptional({ example: 'Tiêu đề mới' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  summary?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
