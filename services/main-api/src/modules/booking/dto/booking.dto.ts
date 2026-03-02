import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  Min,
  Max,
  IsUUID,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum VehicleTypeRequest {
  BIKE = 'BIKE',
  CAR_4_SEATS = 'CAR_4_SEATS',
  CAR_7_SEATS = 'CAR_7_SEATS',
}

export class CreateBookingDto {
  @ApiProperty({ example: 10.7769, description: 'Vĩ độ điểm đón' })
  @IsNumber()
  @Min(-90)
  @Max(90)
  pickupLat: number;

  @ApiProperty({ example: 106.7009, description: 'Kinh độ điểm đón' })
  @IsNumber()
  @Min(-180)
  @Max(180)
  pickupLng: number;

  @ApiProperty({ example: '268 Lý Thường Kiệt, Q.10, TP.HCM' })
  @IsString()
  pickupAddress: string;

  @ApiProperty({ example: 10.8231, description: 'Vĩ độ điểm trả' })
  @IsNumber()
  @Min(-90)
  @Max(90)
  dropoffLat: number;

  @ApiProperty({ example: 106.6297, description: 'Kinh độ điểm trả' })
  @IsNumber()
  @Min(-180)
  @Max(180)
  dropoffLng: number;

  @ApiProperty({ example: 'Sân bay Tân Sơn Nhất' })
  @IsString()
  dropoffAddress: string;

  @ApiProperty({ enum: VehicleTypeRequest, example: 'BIKE' })
  @IsEnum(VehicleTypeRequest)
  vehicleType: VehicleTypeRequest;

  @ApiPropertyOptional({ example: 'Gọi trước khi đến nhé', description: 'Ghi chú người gửi (senderNotes)' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({ example: false, description: 'True = chợ đơn (tài xế tự nhận), False = auto-gán tài xế gần nhất' })
  @IsOptional()
  @IsBoolean()
  useMarketplace?: boolean;

  @ApiPropertyOptional({ example: 0, description: 'Tiền COD cần ứng (VND)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  codAmount?: number;
}

export class FindNearestDriversDto {
  @ApiProperty({ example: 10.7769, description: 'Vĩ độ' })
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @ApiProperty({ example: 106.7009, description: 'Kinh độ' })
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng: number;

  @ApiPropertyOptional({ example: 5, description: 'Bán kính tìm kiếm (km)' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  radiusKm?: number;

  @ApiPropertyOptional({ enum: VehicleTypeRequest })
  @IsOptional()
  @IsEnum(VehicleTypeRequest)
  vehicleType?: VehicleTypeRequest;
}

export class UpdateDriverLocationDto {
  @ApiPropertyOptional({ example: 10.7769 })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat?: number;

  @ApiPropertyOptional({ example: 106.7009 })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng?: number;

  @ApiPropertyOptional({ example: 10.7769, description: 'Alias for lat (driver app)' })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiPropertyOptional({ example: 106.7009, description: 'Alias for lng (driver app)' })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;
}

export class AcceptBookingDto {
  @ApiProperty({ description: 'ID của booking' })
  @IsUUID()
  bookingId: string;
}

export class CancelBookingDto {
  @ApiPropertyOptional({ example: 'Thay đổi kế hoạch', description: 'Lý do hủy' })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class RejectBookingDto {
  @ApiPropertyOptional({ example: 'Không thể nhận chuyến', description: 'Lý do từ chối' })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class UpdateDriverStatusDto {
  @ApiProperty({ enum: ['ONLINE', 'OFFLINE', 'BUSY'] })
  @IsEnum(['ONLINE', 'OFFLINE', 'BUSY'] as const)
  status: 'ONLINE' | 'OFFLINE' | 'BUSY';
}

export class RateBookingDto {
  @ApiProperty({ example: 5, description: 'Số sao đánh giá (1-5)' })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ example: 'Tài xế thân thiện', description: 'Nhận xét' })
  @IsOptional()
  @IsString()
  comment?: string;
}

export class BookingListQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Trang', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 10, description: 'Số bản ghi mỗi trang', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;

  @ApiPropertyOptional({
    enum: ['SEARCHING_DRIVER', 'DRIVER_ASSIGNED', 'DRIVER_ACCEPTED', 'DRIVER_ARRIVING', 'PICKED_UP', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_DRIVER_FOUND'],
    description: 'Lọc theo trạng thái',
  })
  @IsOptional()
  @IsString()
  status?: string;
}
