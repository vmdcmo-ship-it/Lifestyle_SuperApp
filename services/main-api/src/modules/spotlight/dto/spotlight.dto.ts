import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsEnum,
  MaxLength,
  IsArray,
  IsInt,
  Min,
  Max,
  IsUUID,
  IsUrl,
  Matches,
  ValidateNested,
  ArrayMaxSize,
  IsIn,
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
  @ApiProperty({ example: 'Top 5 quán cà phê đẹp nhất Sài Gòn 2026' })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({ enum: RedcommentFormatDto, example: 'PHOTO_ESSAY' })
  @IsEnum(RedcommentFormatDto)
  format: RedcommentFormatDto;

  @ApiProperty({ enum: TargetTypeDto, example: 'CAFE' })
  @IsEnum(TargetTypeDto)
  targetType: TargetTypeDto;

  @ApiPropertyOptional({
    example: 'Khám phá 5 quán cà phê aesthetic nhất Sài Gòn...',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ example: 'Review 5 quán cà phê hot nhất' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  summary?: string;

  @ApiPropertyOptional({ example: ['cafe', 'saigon', 'review', 'aesthetic'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ example: 120, description: 'Video duration in seconds' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(600)
  videoDuration?: number;
}

export class UpdateRedcommentDto {
  @ApiPropertyOptional({ example: 'Updated title' })
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

  @ApiPropertyOptional({
    enum: ['DRAFT', 'PENDING_REVIEW'],
    description: 'Chuyển từ DRAFT sang PENDING_REVIEW để gửi duyệt',
  })
  @IsOptional()
  @IsString()
  status?: string;
}

export class CreateReviewDto {
  @ApiProperty({ enum: TargetTypeDto, example: 'RESTAURANT' })
  @IsEnum(TargetTypeDto)
  targetType: TargetTypeDto;

  @ApiProperty({
    description: 'ID của đối tượng review (merchant, product...)',
  })
  @IsUUID()
  targetId: string;

  @ApiProperty({ example: 5, description: 'Điểm đánh giá (1-5)' })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ example: 'Quán rất đẹp!' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({
    example: 'Không gian thoáng mát, cà phê ngon, nhân viên thân thiện.',
  })
  @IsOptional()
  @IsString()
  content?: string;
}

export class CreateCommentDto {
  @ApiProperty({ example: 'Bài viết hay quá!' })
  @IsString()
  @MaxLength(1000)
  content: string;

  @ApiPropertyOptional({ description: 'ID comment cha (nếu reply)' })
  @IsOptional()
  @IsUUID()
  parentId?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// SPOTLIGHT PHASE 1 - Video Embed Post
// ═══════════════════════════════════════════════════════════════════════════

export class CtaLinkDto {
  @ApiProperty({ example: 'Đặt phòng từ 1.290.000đ' })
  @IsString()
  @MaxLength(100)
  text: string;

  @ApiProperty({ example: 'https://lifestyle.app/voucher/xxx' })
  @IsUrl()
  url: string;

  @ApiPropertyOptional({ enum: ['INTERNAL', 'AFFILIATE'] })
  @IsOptional()
  @IsIn(['INTERNAL', 'AFFILIATE'])
  linkType?: 'INTERNAL' | 'AFFILIATE';

  @ApiPropertyOptional({ example: '1.290.000đ' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  priceDisplay?: string;

  @ApiPropertyOptional({ description: 'ID sản phẩm/voucher nội bộ' })
  @IsOptional()
  @IsUUID()
  internalProductId?: string;
}

const VIDEO_URL_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|facebook\.com|fb\.watch|fb\.reel|fb\.com)\/.+/;

export class CreateSpotlightPostDto {
  @ApiProperty({ example: 'Top 5 quán café view đẹp Đà Lạt' })
  @IsString()
  @MaxLength(300)
  title: string;

  @ApiPropertyOptional({ example: 'Khám phá 5 quán café...' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({
    example: 'https://www.youtube.com/watch?v=VIDEO_ID',
    description: 'URL YouTube hoặc Facebook video',
  })
  @IsUrl()
  @Matches(VIDEO_URL_REGEX, {
    message: 'URL phải là YouTube (youtube.com, youtu.be) hoặc Facebook (facebook.com, fb.watch, fb.reel)',
  })
  videoUrl: string;

  @ApiProperty({ enum: ['VIDEO_REEL'], description: 'Phase 1 chỉ hỗ trợ VIDEO_REEL' })
  @IsIn(['VIDEO_REEL'])
  format: 'VIDEO_REEL';

  @ApiProperty({ enum: TargetTypeDto, example: 'CAFE' })
  @IsEnum(TargetTypeDto)
  targetType: TargetTypeDto;

  @ApiPropertyOptional({ example: 'travel' })
  @IsOptional()
  @IsString()
  categorySlug?: string;

  @ApiPropertyOptional({ example: ['uuid-1', 'uuid-2'], description: 'Tối đa 5 địa điểm' })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMaxSize(5)
  regionIds?: string[];

  @ApiPropertyOptional({ example: ['cafe', 'dalat', 'review'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ example: 120, description: 'Thời lượng video (giây), 1-600' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(600)
  videoDuration?: number;

  @ApiPropertyOptional({
    type: [CtaLinkDto],
    description: 'Tối đa 5 link CTA',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CtaLinkDto)
  @ArrayMaxSize(5)
  ctaLinks?: CtaLinkDto[];
}

export class LinkClickDto {
  @ApiProperty({ description: 'ID của CTA button' })
  @IsUUID()
  ctaButtonId: string;
}
