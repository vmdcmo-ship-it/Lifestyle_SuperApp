import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { AuditLogListQueryDto } from './dto/audit.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: AuditLogListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where: Prisma.AuditLogWhereInput = {};

    if (query.userId) where.userId = query.userId;
    if (query.action) where.action = query.action;
    if (query.resource) where.resource = query.resource;
    if (query.fromDate || query.toDate) {
      where.createdAt = {};
      if (query.fromDate) {
        where.createdAt.gte = new Date(query.fromDate);
      }
      if (query.toDate) {
        const to = new Date(query.toDate);
        to.setHours(23, 59, 59, 999);
        where.createdAt.lte = to;
      }
    }

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data: logs.map((l) => ({
        id: l.id,
        userId: l.userId,
        userEmail: l.userEmail,
        action: l.action,
        resource: l.resource,
        resourceId: l.resourceId,
        details: l.details,
        ipAddress: l.ipAddress,
        userAgent: l.userAgent,
        createdAt: l.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(data: {
    userId: string;
    userEmail: string;
    action: string;
    resource: string;
    resourceId?: string;
    details?: object;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return this.prisma.auditLog.create({
      data: {
        userId: data.userId,
        userEmail: data.userEmail,
        action: data.action,
        resource: data.resource,
        resourceId: data.resourceId ?? null,
        details: data.details ?? Prisma.JsonNull,
        ipAddress: data.ipAddress ?? null,
        userAgent: data.userAgent ?? null,
      },
    });
  }
}
