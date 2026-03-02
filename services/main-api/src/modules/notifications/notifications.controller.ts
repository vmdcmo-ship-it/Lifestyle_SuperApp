import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import {
  CreateNotificationDto,
  SendBulkNotificationDto,
  NotificationQueryDto,
} from './dto/notification.dto';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Notifications')
@ApiBearerAuth('access-token')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách thông báo', description: 'Phân trang + lọc' })
  async findMy(@CurrentUser() user: CurrentUserData, @Query() query: NotificationQueryDto) {
    return this.notificationsService.findMyNotifications(user.id, query);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Số thông báo chưa đọc' })
  async getUnreadCount(@CurrentUser() user: CurrentUserData) {
    return this.notificationsService.getUnreadCount(user.id);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Đánh dấu đã đọc' })
  async markAsRead(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.notificationsService.markAsRead(id, user.id);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Đánh dấu tất cả đã đọc' })
  async markAllAsRead(@CurrentUser() user: CurrentUserData) {
    return this.notificationsService.markAllAsRead(user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa thông báo' })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.notificationsService.delete(id, user.id);
  }

  @Post('send')
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Gửi thông báo cho user' })
  async send(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.create(dto);
  }

  @Post('send-bulk')
  @Roles('ADMIN')
  @ApiOperation({ summary: '[Admin] Gửi thông báo hàng loạt' })
  async sendBulk(@Body() dto: SendBulkNotificationDto) {
    return this.notificationsService.sendBulk(dto);
  }
}
