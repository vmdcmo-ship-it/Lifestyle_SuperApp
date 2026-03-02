import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'nguyen.van.a@gmail.com' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiProperty({ example: 'SecurePass@123' })
  @IsString()
  @MinLength(1, { message: 'Vui lòng nhập mật khẩu' })
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token hiện tại' })
  @IsString()
  refreshToken: string;
}
