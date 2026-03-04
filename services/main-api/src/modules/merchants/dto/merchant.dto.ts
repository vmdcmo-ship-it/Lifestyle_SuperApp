import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsIn,
  IsNumber,
  IsArray,
  IsBoolean,
  IsInt,
  Min,
  Max,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum MerchantType {
  RESTAURANT = 'RESTAURANT',
  CAFE = 'CAFE',
  FOOD_STALL = 'FOOD_STALL',
  SUPERMARKET = 'SUPERMARKET',
  CONVENIENCE_STORE = 'CONVENIENCE_STORE',
  GROCERY = 'GROCERY',
  BAKERY = 'BAKERY',
  PHARMACY = 'PHARMACY',
  FASHION = 'FASHION',
  ELECTRONICS = 'ELECTRONICS',
  BEAUTY = 'BEAUTY',
  HOME_GARDEN = 'HOME_GARDEN',
  BOOKS = 'BOOKS',
  TOYS = 'TOYS',
  SPORTS = 'SPORTS',
  OTHER = 'OTHER',
}

export class CreateMerchantDto {
  @ApiProperty({ example: 'Phở Hà Nội 36' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ enum: MerchantType, example: 'RESTAURANT' })
  @IsEnum(MerchantType)
  type: MerchantType;

  @ApiPropertyOptional({ example: 'Phở truyền thống Hà Nội chính gốc' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '0901234567' })
  @IsString()
  phone: string;

  @ApiPropertyOptional({ example: 'contact@pho36.vn' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: '36 Lê Lợi' })
  @IsString()
  street: string;

  @ApiPropertyOptional({ example: 'Phường Bến Nghé' })
  @IsOptional()
  @IsString()
  ward?: string;

  @ApiProperty({ example: 'Quận 1' })
  @IsString()
  district: string;

  @ApiProperty({ example: 'TP. Hồ Chí Minh' })
  @IsString()
  city: string;

  @ApiProperty({ example: 10.7769 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 106.7009 })
  @IsNumber()
  longitude: number;

  @ApiProperty({ example: '36 Lê Lợi, P. Bến Nghé, Q.1, TP.HCM' })
  @IsString()
  fullAddress: string;
}

export class UpdateMerchantDto extends PartialType(CreateMerchantDto) {
  @ApiPropertyOptional({ example: 'https://storage.example.com/logo.png' })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional({ example: ['https://storage.example.com/cover1.jpg'] })
  @IsOptional()
  @IsArray()
  coverImages?: string[];

  @ApiPropertyOptional({ example: '#FF5733' })
  @IsOptional()
  @IsString()
  brandColor?: string;
}

export class CreateCategoryDto {
  @ApiProperty({ example: 'Món chính' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiPropertyOptional({ example: 'Các món ăn chính' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://storage.example.com/cat.jpg' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class CreateProductDto {
  @ApiPropertyOptional({ description: 'Category ID (UUID)' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ example: 'Phở bò tái' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional({ example: 'Phở bò với thịt tái thơm ngon' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 55000, description: 'Giá (VND)' })
  @IsInt()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 65000, description: 'Giá gốc (nếu đang khuyến mãi)' })
  @IsOptional()
  @IsInt()
  comparePrice?: number;

  @ApiPropertyOptional({ example: ['https://storage.example.com/pho.jpg'] })
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @IsInt()
  stock?: number;

  @ApiPropertyOptional({ example: 15, description: 'Thời gian chuẩn bị (phút)' })
  @IsOptional()
  @IsInt()
  preparationTimeMin?: number;

  @ApiPropertyOptional({ example: ['phở', 'bò', 'Hà Nội'] })
  @IsOptional()
  @IsArray()
  tags?: string[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}

export class MerchantListQueryDto {
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

  @ApiPropertyOptional({ enum: MerchantType })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: 'TP. Hồ Chí Minh' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'phở' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ['PENDING', 'ACTIVE', 'INACTIVE', 'SUSPENDED', 'REJECTED'], description: 'Admin: lọc theo trạng thái' })
  @IsOptional()
  @IsString()
  status?: string;
}

/** Nhóm kinh doanh - đối tác (không bao gồm tài xế) */
export const BUSINESS_GROUPS = [
  'FOOD_DELIVERY',
  'GROCERY',
  'LOCAL_SERVICE',
  'SHOPPING_MALL',
] as const;

export type BusinessGroup = (typeof BUSINESS_GROUPS)[number];

export class CreateSellerLeadDto {
  @ApiProperty({ example: 'Luxe Fashion Store' })
  @IsString()
  @MinLength(2)
  storeName!: string;

  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString()
  @MinLength(2)
  contactName!: string;

  @ApiProperty({ example: 'email@example.com' })
  @IsString()
  @MinLength(5)
  email!: string;

  @ApiProperty({ example: '0901234567' })
  @IsString()
  @MinLength(8)
  phone!: string;

  @ApiProperty({
    example: 'SHOPPING_MALL',
    description: 'FOOD_DELIVERY|GROCERY|LOCAL_SERVICE|SHOPPING_MALL',
    enum: BUSINESS_GROUPS,
  })
  @IsString()
  @IsIn(BUSINESS_GROUPS)
  businessGroup!: BusinessGroup;

  @ApiProperty({
    example: 'fashion',
    description: 'restaurant|cafe|spa|fashion|... tùy businessGroup',
  })
  @IsString()
  @MinLength(1)
  subCategory!: string;

  @ApiPropertyOptional({ example: 'Giới thiệu về cửa hàng...' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({ example: 'partner_web' })
  @IsOptional()
  @IsString()
  source?: string;
}

export class SellerLeadQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'PENDING | CONTACTED | DONE | REJECTED' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateSellerLeadStatusDto {
  @ApiProperty({ enum: ['CONTACTED', 'DONE', 'REJECTED'], example: 'CONTACTED' })
  @IsIn(['CONTACTED', 'DONE', 'REJECTED'])
  status!: 'CONTACTED' | 'DONE' | 'REJECTED';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;
}

export class VerifyMerchantDto {
  @ApiProperty({ enum: ['APPROVED', 'REJECTED'], example: 'APPROVED' })
  @IsIn(['APPROVED', 'REJECTED'])
  action: 'APPROVED' | 'REJECTED';

  @ApiPropertyOptional({ example: 'Thiếu giấy phép kinh doanh' })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}

export class ProductListQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;

  @ApiPropertyOptional({ description: 'Category ID' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'phở' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'price_asc', enum: ['price_asc', 'price_desc', 'rating', 'popular', 'newest'] })
  @IsOptional()
  @IsString()
  sortBy?: string;
}
