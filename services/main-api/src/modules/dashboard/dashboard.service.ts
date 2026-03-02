import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export interface DailyStat {
  date: string;
  count: number;
  revenue: number;
}

export interface DashboardStatsResponse {
  bookings: { daily: DailyStat[] };
  orders: { daily: DailyStat[] };
}

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getQuickStats() {
    const [totalMerchants, totalOrders, pendingOrders] = await Promise.all([
      this.prisma.merchants.count(),
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: 'PENDING' } }),
    ]);
    return { totalMerchants, totalOrders, pendingOrders };
  }

  async getChartStats(days = 7): Promise<DashboardStatsResponse> {
    const safeDays = Math.min(30, Math.max(1, days));
    const [bookings, orders] = await Promise.all([
      this.getBookingStats(safeDays),
      this.getOrderStats(safeDays),
    ]);

    return { bookings, orders };
  }

  private async getBookingStats(days: number): Promise<{ daily: DailyStat[] }> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const result = await this.prisma.$queryRaw<
      Array<{ day: Date; count: bigint; revenue: bigint }>
    >(
      Prisma.sql`
        SELECT 
          date_trunc('day', b.created_at AT TIME ZONE 'UTC')::date as day,
          count(*)::bigint as count,
          coalesce(sum(b.total_price), 0)::bigint as revenue
        FROM driver.bookings b
        WHERE b.status = 'COMPLETED'
          AND b.created_at >= ${startDate}
        GROUP BY 1
        ORDER BY 1
      `,
    );

    const daily = this.fillGaps(
      result.map((r) => ({
        date: (r.day as Date).toISOString().split('T')[0],
        count: Number(r.count),
        revenue: Number(r.revenue),
      })),
      days,
    );

    return { daily };
  }

  private async getOrderStats(days: number): Promise<{ daily: DailyStat[] }> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const result = await this.prisma.$queryRaw<
      Array<{ day: Date; count: bigint; revenue: bigint }>
    >(
      Prisma.sql`
        SELECT 
          date_trunc('day', o.created_at AT TIME ZONE 'UTC')::date as day,
          count(*)::bigint as count,
          coalesce(sum(o.total_amount), 0)::bigint as revenue
        FROM merchant.orders o
        WHERE o.status IN ('DELIVERED', 'COMPLETED')
          AND o.created_at >= ${startDate}
        GROUP BY 1
        ORDER BY 1
      `,
    );

    const daily = this.fillGaps(
      result.map((r) => ({
        date: (r.day as Date).toISOString().split('T')[0],
        count: Number(r.count),
        revenue: Number(r.revenue),
      })),
      days,
    );

    return { daily };
  }

  private fillGaps(data: DailyStat[], days: number): DailyStat[] {
    const map = new Map(data.map((d) => [d.date, d]));
    const result: DailyStat[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      result.push(map.get(dateStr) ?? { date: dateStr, count: 0, revenue: 0 });
    }

    return result;
  }

  async getRegionStats(days = 30): Promise<Array<{ region: string; orderCount: number; revenue: number }>> {
    const safeDays = Math.min(90, Math.max(1, days));
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - safeDays);
    startDate.setHours(0, 0, 0, 0);

    const result = await this.prisma.$queryRaw<
      Array<{ city: string | null; count: bigint; revenue: bigint }>
    >(
      Prisma.sql`
        SELECT 
          m.city,
          count(*)::bigint as count,
          coalesce(sum(o.total_amount), 0)::bigint as revenue
        FROM merchant.orders o
        JOIN merchant.merchants m ON o.merchant_id = m.id
        WHERE o.status IN ('DELIVERED', 'COMPLETED')
          AND o.created_at >= ${startDate}
        GROUP BY m.city
        ORDER BY revenue DESC
      `,
    );

    return result.map((r) => ({
      region: r.city ?? 'Không xác định',
      orderCount: Number(r.count),
      revenue: Number(r.revenue),
    }));
  }
}
