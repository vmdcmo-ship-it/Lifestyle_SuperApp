import { ApiProperty } from '@nestjs/swagger';
import { LeadSegment } from '../../../entities/lead-segment.enum';

export class EligibilityCheckResponseDto {
  @ApiProperty({ enum: LeadSegment })
  segment!: LeadSegment;

  @ApiProperty({ example: 82 })
  score!: number;

  @ApiProperty()
  userMessage!: string;

  @ApiProperty({ type: [String] })
  recommendedProjectIds!: string[];

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  quizId!: string;

  @ApiProperty({
    description: 'Bearer JWT cho GET /user/dashboard và POST /leads/convert',
  })
  dashboardToken!: string;
}
