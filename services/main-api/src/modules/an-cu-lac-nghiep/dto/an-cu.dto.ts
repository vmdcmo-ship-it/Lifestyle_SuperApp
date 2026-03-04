import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateConsultingLeadDto {
  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString()
  @MinLength(2, { message: 'Họ tên phải có ít nhất 2 ký tự' })
  @MaxLength(200)
  fullName!: string;

  @ApiProperty({ example: '0901234567' })
  @IsString()
  @MinLength(8, { message: 'Số điện thoại phải có ít nhất 8 ký tự' })
  @MaxLength(20)
  phone!: string;

  @ApiProperty({ example: 'email@example.com' })
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  email!: string;

  @ApiPropertyOptional({ example: 'Tư vấn mua nhà ở xã hội TP.HCM' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;

  @ApiPropertyOptional({ example: 'an_cu_consulting' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  source?: string;
}
