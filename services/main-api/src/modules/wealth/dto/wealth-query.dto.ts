import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class WealthLeadsQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Lọc theo status (PENDING, CONTACTED, DONE)' })
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ description: 'Lọc từ ngày (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({ description: 'Lọc đến ngày (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  dateTo?: string;
}
