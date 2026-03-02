import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class MfaVerifyDto {
  @ApiProperty({ description: 'Mã OTP 6 chữ số từ ứng dụng Authenticator' })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  code: string;
}

export class MfaDisableDto {
  @ApiProperty({ description: 'Mật khẩu hiện tại' })
  @IsString()
  @MinLength(1)
  password: string;

  @ApiProperty({ description: 'Mã OTP 6 chữ số' })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  code: string;
}

export class MfaCompleteLoginDto {
  @ApiProperty({ description: 'MFA token tạm thời (nhận từ login khi requiresMfa)' })
  @IsString()
  mfaToken: string;

  @ApiProperty({ description: 'Mã OTP 6 chữ số' })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  code: string;
}
