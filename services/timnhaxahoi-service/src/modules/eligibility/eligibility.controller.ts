import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { EligibilityCheckResponseDto } from './dto/eligibility-check-response.dto';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { EligibilityService } from './eligibility.service';

@ApiTags('ai')
@Controller('ai')
@UseGuards(ThrottlerGuard)
@Throttle({ 'eligibility-check': {} })
export class EligibilityController {
  constructor(private readonly eligibility: EligibilityService) {}

  @Post('eligibility-check')
  @ApiOperation({ summary: 'Chấm điểm quiz, lưu DB, optional Lark; trả dashboardToken' })
  @ApiOkResponse({ type: EligibilityCheckResponseDto })
  check(@Body() dto: SubmitQuizDto) {
    return this.eligibility.submit(dto);
  }
}
