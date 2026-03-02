import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface MissionConfig {
  id: string;
  title: string;
  reward: number;
  target: number;
  unit: string;
  type: 'TRIPS_DAILY' | 'TRIPS_WEEKLY' | 'ORDERS_DAILY';
}

const MISSION_TEMPLATES: MissionConfig[] = [
  { id: 'trips-daily-5', title: 'Hoàn thành 5 chuyến trong ngày', reward: 50000, target: 5, unit: 'chuyến', type: 'TRIPS_DAILY' },
  { id: 'trips-daily-10', title: 'Hoàn thành 10 chuyến trong ngày', reward: 120000, target: 10, unit: 'chuyến', type: 'TRIPS_DAILY' },
  { id: 'trips-weekly-20', title: 'Tuần chạy 20 chuyến', reward: 200000, target: 20, unit: 'chuyến', type: 'TRIPS_WEEKLY' },
  { id: 'trips-weekly-50', title: 'Tuần chạy 50 chuyến', reward: 500000, target: 50, unit: 'chuyến', type: 'TRIPS_WEEKLY' },
];

@Injectable()
export class MissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async listMissions(driverUserId: string) {
    const driver = await this.prisma.driver.findFirst({
      where: { userId: driverUserId, deletedAt: null },
    });
    if (!driver) return { data: [] };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const [todayCompleted, weekCompleted] = await Promise.all([
      this.prisma.booking.count({
        where: {
          driverId: driver.id,
          status: 'COMPLETED',
          completedAt: { gte: today },
        },
      }),
      this.prisma.booking.count({
        where: {
          driverId: driver.id,
          status: 'COMPLETED',
          completedAt: { gte: weekStart },
        },
      }),
    ]);

    const data = MISSION_TEMPLATES.map((m) => {
      let progress = 0;
      if (m.type === 'TRIPS_DAILY') progress = todayCompleted;
      else if (m.type === 'TRIPS_WEEKLY' || m.type === 'ORDERS_DAILY') progress = weekCompleted;
      if (m.type === 'ORDERS_DAILY') progress = Math.min(progress, m.target);

      const pct = Math.min(100, (progress / m.target) * 100);
      return {
        id: m.id,
        title: m.title,
        reward: m.reward,
        progress,
        target: m.target,
        unit: m.unit,
        completed: pct >= 100,
      };
    });

    return { data };
  }

  async claimReward(missionId: string, driverUserId: string) {
    const mission = MISSION_TEMPLATES.find((m) => m.id === missionId);
    if (!mission) throw new NotFoundException('Không tìm thấy nhiệm vụ');

    const driver = await this.prisma.driver.findFirst({
      where: { userId: driverUserId, deletedAt: null },
    });
    if (!driver) throw new NotFoundException('Chưa đăng ký tài xế');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    let progress = 0;
    if (mission.type === 'TRIPS_DAILY') {
      progress = await this.prisma.booking.count({
        where: {
          driverId: driver.id,
          status: 'COMPLETED',
          completedAt: { gte: today },
        },
      });
    } else {
      progress = await this.prisma.booking.count({
        where: {
          driverId: driver.id,
          status: 'COMPLETED',
          completedAt: { gte: weekStart },
        },
      });
    }

    if (progress < mission.target) {
      throw new NotFoundException(`Chưa hoàn thành nhiệm vụ (${progress}/${mission.target})`);
    }

    const wallet = await this.prisma.wallet.findUnique({
      where: { userId: driverUserId },
    });
    if (!wallet) throw new NotFoundException('Chưa có ví');

    await this.prisma.$transaction([
      this.prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: { increment: mission.reward },
          total_earned: { increment: mission.reward },
        },
      }),
    ]);

    return {
      message: `Đã nhận thưởng ${mission.reward.toLocaleString()} VND`,
      reward: mission.reward,
      newBalance: Number(wallet.balance) + mission.reward,
    };
  }
}
