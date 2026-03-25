import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { DashboardJwtAuthGuard, type DashboardJwtPayload } from './guards/dashboard-jwt.guard';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly users: UserService) {}

  @Get('dashboard')
  @UseGuards(DashboardJwtAuthGuard)
  @ApiBearerAuth('dashboard-jwt')
  @ApiOperation({ summary: 'Dashboard sau quiz — Bearer JWT từ eligibility-check' })
  dashboard(@Req() req: Request & { dashboard: DashboardJwtPayload }) {
    return this.users.getDashboard(req.dashboard);
  }
}
