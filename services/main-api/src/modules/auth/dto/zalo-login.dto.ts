import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MinLength, IsOptional } from 'class-validator';

/**
 * DTO cho đăng nhập Zalo OAuth (Mini App / Web).
 * Frontend gọi User.getOauthV1Code() lấy code, gửi kèm codeVerifier nếu dùng PKCE.
 */
export class ZaloLoginDto {
  @ApiProperty({
    description: 'Authorization code từ Zalo OAuth (User.getOauthV1Code)',
    example: 'ABC123xyz...',
  })
  @IsString()
  @MinLength(1, { message: 'Authorization code không được trống' })
  code: string;

  @ApiPropertyOptional({
    description: 'Code verifier dùng cho PKCE (bắt buộc nếu Mini App dùng PKCE)',
  })
  @IsOptional()
  @IsString()
  codeVerifier?: string;
}
