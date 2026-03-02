import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  IsInt,
  Min,
  Max,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum OrderType {
  FOOD_DELIVERY = 'FOOD_DELIVERY',
  SHOPPING = 'SHOPPING',
  PICKUP = 'PICKUP',
}

export class OrderItemDto {
  @ApiProperty({ description: 'Product ID (UUID)' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({ example: { size: 'L', topping: 'Thêm hành' } })
  @IsOptional()
  options?: Record<string, any>;

  @ApiPropertyOptional({ example: 'Ít cay' })
  @IsOptional()
  @IsString()
  note?: string;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'Merchant ID (UUID)' })
  @IsString()
  merchantId: string;

  @ApiProperty({ enum: OrderType, example: 'FOOD_DELIVERY' })
  @IsEnum(OrderType)
  type: OrderType;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiPropertyOptional({ example: 'WALLET', enum: ['WALLET', 'VNPAY', 'MOMO', 'ZALOPAY', 'COD'] })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiPropertyOptional({ example: '123 Nguyễn Huệ, Q.1, TP.HCM' })
  @IsOptional()
  @IsString()
  deliveryAddress?: string;

  @ApiPropertyOptional({ example: 10.7769 })
  @IsOptional()
  @IsNumber()
  deliveryLat?: number;

  @ApiPropertyOptional({ example: 106.7009 })
  @IsOptional()
  @IsNumber()
  deliveryLng?: number;

  @ApiPropertyOptional({ example: 'Giao tầng 5, gọi trước khi giao' })
  @IsOptional()
  @IsString()
  deliveryNote?: string;

  @ApiPropertyOptional({ example: 'COUPON2026' })
  @IsOptional()
  @IsString()
  couponCode?: string;

  @ApiPropertyOptional({ example: 'Không hành' })
  @IsOptional()
  @IsString()
  note?: string;
}

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: ['CONFIRMED', 'PREPARING', 'READY', 'PICKED_UP', 'DELIVERING', 'DELIVERED', 'COMPLETED'],
  })
  @IsString()
  status: string;
}

export class RateOrderDto {
  @ApiProperty({ example: 4.5, minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ example: 'Đồ ăn ngon, giao nhanh' })
  @IsOptional()
  @IsString()
  comment?: string;
}

export class OrderListQueryDto {
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

  @ApiPropertyOptional({ enum: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERING', 'DELIVERED', 'COMPLETED', 'CANCELLED'] })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ enum: OrderType })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ description: 'Tìm theo mã đơn hoặc tên cửa hàng' })
  @IsOptional()
  @IsString()
  search?: string;
}
