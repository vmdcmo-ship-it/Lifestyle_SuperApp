import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsBoolean,
  Min,
  Max,
  IsDateString,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RedeemXuDto {
  @ApiProperty({ example: 1000, description: 'Số Xu muốn dùng' })
  @IsInt()
  @Min(100)
  amount: number;

  @ApiProperty({ example: 'ORDER_DISCOUNT', description: 'Mục đích sử dụng' })
  @IsString()
  purpose: string;

  @ApiPropertyOptional({ description: 'Order ID nếu dùng cho đơn hàng' })
  @IsOptional()
  @IsString()
  orderId?: string;
}

export class CreateCouponDto {
  @ApiProperty({ example: 'WELCOME2026' })
  @IsString()
  @MinLength(3)
  code: string;

  @ApiProperty({ example: 'Giảm 50K cho đơn đầu tiên' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Áp dụng cho khách hàng mới' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'FIXED_AMOUNT', enum: ['PERCENTAGE', 'FIXED_AMOUNT'] })
  @IsString()
  discountType: string;

  @ApiProperty({ example: 50000, description: 'Giá trị giảm (VND hoặc %)' })
  @IsInt()
  @Min(1)
  discountValue: number;

  @ApiPropertyOptional({ example: 100000, description: 'Giảm tối đa (cho PERCENTAGE)' })
  @IsOptional()
  @IsInt()
  maxDiscount?: number;

  @ApiPropertyOptional({ example: 100000, description: 'Đơn hàng tối thiểu' })
  @IsOptional()
  @IsInt()
  minOrderAmount?: number;

  @ApiPropertyOptional({ example: 1000 })
  @IsOptional()
  @IsInt()
  usageLimit?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  perUserLimit?: number;

  @ApiProperty({ example: '2026-02-01T00:00:00Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-12-31T23:59:59Z' })
  @IsDateString()
  endDate: string;
}

export class UpdateCouponDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: ['PERCENTAGE', 'FIXED_AMOUNT'] })
  @IsOptional()
  @IsString()
  discountType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  discountValue?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  maxDiscount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  minOrderAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  usageLimit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  perUserLimit?: number;

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
  @Type(() => Boolean)
  isActive?: boolean;
}

export class ApplyCouponDto {
  @ApiProperty({ example: 'WELCOME2026' })
  @IsString()
  code: string;

  @ApiProperty({ example: 150000, description: 'Giá trị đơn hàng' })
  @IsInt()
  @Min(0)
  orderAmount: number;
}

export class ReferralQueryDto {
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
}

export class CouponQueryDto {
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

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  activeOnly?: boolean;
}

/** [Admin] Query cho danh sách referral */
export class ReferralAdminQueryDto extends ReferralQueryDto {
  @ApiPropertyOptional({ description: 'Lọc theo trạng thái: PENDING, COMPLETED' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Từ ngày (ISO)' })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({ description: 'Đến ngày (ISO)' })
  @IsOptional()
  @IsDateString()
  dateTo?: string;
}
