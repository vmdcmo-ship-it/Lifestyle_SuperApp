import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthSyncDto {
  @ApiPropertyOptional({ description: 'UID từ Super App khi đã đăng nhập' })
  @IsOptional()
  @IsString()
  @MaxLength(128)
  superappUid?: string;

  @ApiProperty({ example: '0912345678' })
  @IsString()
  @Matches(/^[0-9+\s]{8,20}$/)
  phone!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  fullName?: string;
}
