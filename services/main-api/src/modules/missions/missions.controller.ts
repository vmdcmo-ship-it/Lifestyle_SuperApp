import { Controller, Get, Post, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { MissionsService } from './missions.service';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Missions (Nhiệm vụ)')
@ApiBearerAuth('access-token')
@Controller('missions')
@Roles('DRIVER')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @Get()
  @ApiOperation({
    summary: '[Driver] Danh sách nhiệm vụ',
    description: 'Thử thách: hoàn thành X chuyến để nhận thưởng',
  })
  @ApiResponse({ status: 200, description: 'Danh sách nhiệm vụ và tiến độ' })
  async listMissions(@CurrentUser() user: CurrentUserData) {
    return this.missionsService.listMissions(user.id);
  }

  @Post(':id/claim')
  @ApiOperation({
    summary: '[Driver] Nhận thưởng nhiệm vụ',
    description: 'Claim khi đã hoàn thành 100%',
  })
  @ApiParam({ name: 'id', description: 'Mission ID' })
  @ApiResponse({ status: 200, description: 'Đã nhận thưởng vào ví' })
  async claimReward(
    @Param('id') missionId: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.missionsService.claimReward(missionId, user.id);
  }
}
