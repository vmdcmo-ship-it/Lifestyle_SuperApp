import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export class CreateAddressDto {
  @ApiPropertyOptional({ example: 'Home', description: 'Nhãn địa chỉ' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  label?: string;

  @ApiProperty({ example: '268 Lý Thường Kiệt', description: 'Số nhà, đường' })
  @IsString()
  @MaxLength(500)
  street: string;

  @ApiPropertyOptional({ example: 'Phường 14' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  ward?: string;

  @ApiPropertyOptional({ example: 'Quận 10' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  district?: string;

  @ApiProperty({ example: 'TP. Hồ Chí Minh' })
  @IsString()
  @MaxLength(200)
  city: string;

  @ApiPropertyOptional({ example: 'Vietnam', default: 'Vietnam' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @ApiPropertyOptional({ example: '700000' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  postalCode?: string;

  @ApiPropertyOptional({ example: 10.7769, description: 'Vĩ độ' })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiPropertyOptional({ example: 106.7009, description: 'Kinh độ' })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @ApiProperty({ example: '268 Lý Thường Kiệt, P.14, Q.10, TP.HCM' })
  @IsString()
  fullAddress: string;

  @ApiPropertyOptional({ example: false, description: 'Đặt làm địa chỉ mặc định' })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateAddressDto extends PartialType(CreateAddressDto) {}
