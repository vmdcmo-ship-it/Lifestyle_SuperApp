import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsInt,
  Min,
  Max,
  IsObject,
} from 'class-validator';

export enum NotificationType {
  SYSTEM = 'SYSTEM',
  BOOKING = 'BOOKING',
  ORDER = 'ORDER',
  PAYMENT = 'PAYMENT',
  PROMOTION = 'PROMOTION',
  CHAT = 'CHAT',
  REVIEW = 'REVIEW',
  SPOTLIGHT_COMMENT = 'SPOTLIGHT_COMMENT',
  SPOTLIGHT_NEW_VIDEO = 'SPOTLIGHT_NEW_VIDEO',
}

export class CreateNotificationDto {
  @ApiProperty({ description: 'Target user ID (UUID)' })
  @IsString()
  userId: string;

  @ApiProperty({ enum: NotificationType, example: 'ORDER' })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ example: 'Đơn hàng đã được xác nhận' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Đơn hàng #LS-ORD-000001 đang được chuẩn bị' })
  @IsString()
  body: string;

  @ApiPropertyOptional({ example: 'https://storage.example.com/icon.png' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ example: { orderId: 'uuid-here', action: 'VIEW_ORDER' } })
  @IsOptional()
  @IsObject()
  data?: Record<string, any>;
}

export class SendBulkNotificationDto {
  @ApiProperty({ description: 'List of user IDs', type: [String] })
  @IsString({ each: true })
  userIds: string[];

  @ApiProperty({ enum: NotificationType })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ example: 'Khuyến mãi đặc biệt!' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Giảm 50% cho đơn hàng đầu tiên' })
  @IsString()
  body: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  data?: Record<string, any>;
}

export class NotificationQueryDto {
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

  @ApiPropertyOptional({ enum: NotificationType })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  unreadOnly?: boolean;
}
