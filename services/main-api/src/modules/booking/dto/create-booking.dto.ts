import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsOptional,
  IsEnum,
  Min,
  Max,
} from 'class-validator';

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

  @ApiProperty({ example: 10.762, description: 'Vĩ độ điểm đến' })
  @IsNumber()
  @Min(-90)
  @Max(90)
  dropoffLat: number;

  @ApiProperty({ example: 106.66, description: 'Kinh độ điểm đến' })
  @IsNumber()
  @Min(-180)
  @Max(180)
  dropoffLng: number;

  @ApiProperty({ example: '1 Võ Văn Ngân, Thủ Đức, TP.HCM' })
  @IsString()
  dropoffAddress: string;

  @ApiProperty({
    enum: VehicleTypeRequest,
    example: VehicleTypeRequest.BIKE,
    description: 'Loại xe yêu cầu',
  })
  @IsEnum(VehicleTypeRequest)
  vehicleType: VehicleTypeRequest;

  @ApiPropertyOptional({ example: 'Tôi đứng trước cổng chính' })
  @IsOptional()
  @IsString()
  note?: string;
}

export class FindDriversDto {
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

  @ApiPropertyOptional({ example: 3, description: 'Bán kính tìm kiếm (km)' })
  @IsOptional()
  @IsNumber()
  @Min(0.5)
  @Max(50)
  radiusKm?: number;

  @ApiPropertyOptional({ enum: VehicleTypeRequest })
  @IsOptional()
  @IsEnum(VehicleTypeRequest)
  vehicleType?: VehicleTypeRequest;
}
