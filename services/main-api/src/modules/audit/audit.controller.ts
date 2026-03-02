import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { AuditLogListQueryDto } from './dto/audit.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Audit')
@ApiBearerAuth('access-token')
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('logs')
  @Roles('ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: '[Admin] Danh sách audit log' })
  @ApiResponse({ status: 200 })
  async list(@Query() query: AuditLogListQueryDto) {
    return this.auditService.list(query);
  }
}
