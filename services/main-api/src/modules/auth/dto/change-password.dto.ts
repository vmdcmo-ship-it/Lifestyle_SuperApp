import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ description: 'Mật khẩu hiện tại' })
  @IsString()
  @MinLength(1, { message: 'Mật khẩu hiện tại không được để trống' })
  currentPassword: string;

  @ApiProperty({ description: 'Mật khẩu mới', minLength: 8 })
  @IsString()
  @MinLength(8, { message: 'Mật khẩu mới phải có ít nhất 8 ký tự' })
  @MaxLength(128)
  newPassword: string;
}
