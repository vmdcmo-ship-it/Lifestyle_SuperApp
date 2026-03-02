import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, Min, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFareConfigDto {
  @ApiProperty({ example: 'BIKE' })
  @IsString()
  vehicleType: string;

  @ApiProperty({ example: 12000 })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  baseFare: number;

  @ApiProperty({ example: 4200 })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  perKm: number;

  @ApiProperty({ example: 300 })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  perMin: number;

  @ApiProperty({ example: 12000 })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  minFare: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;
}

export class UpdateFareConfigDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  baseFare?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  perKm?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  perMin?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  minFare?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;
}
