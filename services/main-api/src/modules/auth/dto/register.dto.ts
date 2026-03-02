import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  Matches,
  IsEnum,
} from 'class-validator';

export enum RegisterRole {
  CUSTOMER = 'CUSTOMER',
  DRIVER = 'DRIVER',
  RESTAURANT_OWNER = 'RESTAURANT_OWNER',
}

export class RegisterDto {
  @ApiProperty({ example: 'nguyen.van.a@gmail.com' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiProperty({ example: 'SecurePass@123' })
  @IsString()
  @MinLength(8, { message: 'Mật khẩu tối thiểu 8 ký tự' })
  @MaxLength(50)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message:
      'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt',
  })
  password: string;

  @ApiProperty({ example: 'Nguyễn' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ example: 'Văn A' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  lastName: string;

  @ApiPropertyOptional({ example: '0901234567' })
  @IsOptional()
  @IsString()
  @Matches(/^(0|\+84)(3|5|7|8|9)\d{8}$/, {
    message: 'Số điện thoại Việt Nam không hợp lệ',
  })
  phoneNumber?: string;

  @ApiPropertyOptional({
    enum: RegisterRole,
    default: RegisterRole.CUSTOMER,
    description: 'Vai trò đăng ký: CUSTOMER, DRIVER, RESTAURANT_OWNER',
  })
  @IsOptional()
  @IsEnum(RegisterRole)
  role?: RegisterRole;
}
