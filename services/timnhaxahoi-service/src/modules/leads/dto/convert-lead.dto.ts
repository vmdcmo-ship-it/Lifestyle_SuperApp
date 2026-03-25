import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ConvertLeadDto {
  @ApiPropertyOptional({ description: 'Ghi chú nhu cầu tư vấn sâu' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  note?: string;
}
