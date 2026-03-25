import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  Matches,
} from 'class-validator';

export class SubmitQuizDto {
  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  @Max(5)
  priorityGroup!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  @Max(3)
  residenceStatus!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  @Max(3)
  incomeBracket!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  @Max(3)
  housingStatus!: number;

  @ApiProperty({ type: [String], maxItems: 3 })
  @IsArray()
  @ArrayMaxSize(3)
  @IsUUID('4', { each: true })
  priorityProjectIds!: string[];

  @ApiProperty({ example: 200 })
  @IsInt()
  @Min(0)
  ownCapitalMillion!: number;

  @ApiProperty({ example: 50 })
  @IsInt()
  @Min(0)
  borrowedCapitalMillion!: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  @Max(3)
  loanPreference!: number;

  @ApiProperty({ example: 8 })
  @IsInt()
  @Min(0)
  maxMonthlyPaymentMillion!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  @Max(3)
  consultationFocus!: number;

  @ApiProperty({ example: '0912345678' })
  @IsString()
  @Matches(/^[0-9+\s]{8,20}$/)
  phone!: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fullName?: string;

  /** Địa chỉ làm việc / thường xuyên (Maps Places — tuỳ chọn). */
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  workAddress?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(256)
  workPlaceId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 8 })
  @Min(-90)
  @Max(90)
  workLat?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 8 })
  @Min(-180)
  @Max(180)
  workLng?: number;
}
