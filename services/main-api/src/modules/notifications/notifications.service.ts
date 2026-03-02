import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateNotificationDto,
  SendBulkNotificationDto,
  NotificationQueryDto,
} from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateNotificationDto) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: dto.userId,
        type: dto.type as any,
        title: dto.title,
        body: dto.body,
        imageUrl: dto.imageUrl || null,
        data: dto.data || {},
      },
    });
    return notification;
  }

  async sendBulk(dto: SendBulkNotificationDto) {
    const notifications = await this.prisma.notification.createMany({
      data: dto.userIds.map((userId) => ({
        userId,
        type: dto.type as any,
        title: dto.title,
        body: dto.body,
        imageUrl: dto.imageUrl || null,
        data: dto.data || {},
      })),
    });
    return { sent: notifications.count, message: `Đã gửi ${notifications.count} thông báo` };
  }

  async findMyNotifications(userId: string, query: NotificationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where: any = { userId };
    if (query.type) where.type = query.type;
    if (query.unreadOnly) where.isRead = false;

    const [notifications, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.notification.count({ where }),
      this.prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    return {
      data: notifications,
      unreadCount,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });
    if (!notification || notification.userId !== userId) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }

    const updated = await this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true, readAt: new Date() },
    });
    return updated;
  }

  async markAllAsRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
    return { updated: result.count, message: `Đã đọc ${result.count} thông báo` };
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });
    return { unreadCount: count };
  }

  async delete(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });
    if (!notification || notification.userId !== userId) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }

    await this.prisma.notification.delete({ where: { id: notificationId } });
    return { message: 'Đã xóa thông báo' };
  }
}
