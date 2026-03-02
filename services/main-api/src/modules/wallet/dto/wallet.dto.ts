import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  Max,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum TopUpMethod {
  VNPAY = 'VNPAY',
  MOMO = 'MOMO',
  ZALOPAY = 'ZALOPAY',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export enum PaymentTarget {
  BOOKING = 'BOOKING',
  ORDER = 'ORDER',
  TRANSFER = 'TRANSFER',
}

export class TopUpDto {
  @ApiProperty({ example: 100000, description: 'So tien nap (VND)' })
  @IsInt()
  @Min(10000)
  @Max(50000000)
  amount: number;

  @ApiProperty({ enum: TopUpMethod, example: 'VNPAY' })
  @IsEnum(TopUpMethod)
  method: TopUpMethod;

  @ApiPropertyOptional({ example: 'Nap tien vao vi' })
  @IsOptional()
  @IsString()
  note?: string;
}

export class PaymentDto {
  @ApiProperty({ example: 50000, description: 'So tien thanh toan (VND)' })
  @IsInt()
  @Min(1000)
  amount: number;

  @ApiProperty({ enum: PaymentTarget, example: 'BOOKING' })
  @IsEnum(PaymentTarget)
  serviceType: PaymentTarget;

  @ApiPropertyOptional({ description: 'ID cua booking/order' })
  @IsOptional()
  @IsString()
  serviceId?: string;

  @ApiPropertyOptional({ example: 'Thanh toan cuoc xe' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class TransferDto {
  @ApiProperty({ description: 'ID nguoi nhan' })
  @IsUUID()
  recipientId: string;

  @ApiProperty({ example: 50000, description: 'So tien chuyen (VND)' })
  @IsInt()
  @Min(1000)
  @Max(50000000)
  amount: number;

  @ApiPropertyOptional({ example: 'Gui tien ban' })
  @IsOptional()
  @IsString()
  note?: string;
}

export class WithdrawDto {
  @ApiProperty({ example: 100000, description: 'So tien rut (VND)' })
  @IsInt()
  @Min(50000)
  @Max(50000000)
  amount: number;

  @ApiPropertyOptional({ description: 'ID tai khoan ngan hang' })
  @IsOptional()
  @IsUUID()
  bankAccountId?: string;

  @ApiPropertyOptional({ description: 'So tai khoan ngan hang hoac mo ta (driver app)' })
  @IsOptional()
  @IsString()
  bankAccount?: string;

  @ApiPropertyOptional({ example: 'Rut tien ve ngan hang' })
  @IsOptional()
  @IsString()
  note?: string;
}

export class TransactionQueryDto {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;

  @ApiPropertyOptional({
    enum: ['TOP_UP', 'PAYMENT', 'WITHDRAWAL', 'REFUND', 'TRANSFER', 'XU_EARN', 'XU_SPEND', 'BONUS'],
    description: 'Loc theo loai giao dich',
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED'],
    description: 'Loc theo trang thai',
  })
  @IsOptional()
  @IsString()
  status?: string;
}
