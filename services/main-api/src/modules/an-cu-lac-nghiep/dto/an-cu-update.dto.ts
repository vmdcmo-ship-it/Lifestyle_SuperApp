import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

const STATUSES = ['PENDING', 'CONTACTED', 'DONE'] as const;

export class UpdateLeadStatusDto {
  @ApiProperty({ enum: STATUSES, description: 'Trạng thái lead' })
  @IsIn(STATUSES)
  status: (typeof STATUSES)[number];
}
