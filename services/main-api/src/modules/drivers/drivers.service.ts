import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  RegisterDriverDto,
  AddVehicleDto,
  DriverListQueryDto,
  VerifyDriverDto,
  UpdateDriverProfileDto,
  OrderReceivingSettingsDto,
  DeclareCashDto,
  UpdateDriverIdentityDto,
  UpdateVehicleDocumentsDto,
} from './dto/driver.dto';

@Injectable()
export class DriversService {
  constructor(private readonly prisma: PrismaService) {}

  private async generateDriverNumber(): Promise<string> {
    const count = await this.prisma.driver.count();
    return `LS-DRV-${String(count + 1).padStart(6, '0')}`;
  }

  async register(userId: string, dto: RegisterDriverDto) {
    const existing = await this.prisma.driver.findUnique({ where: { userId } });
    if (existing) {
      throw new ConflictException('Bạn đã đăng ký làm tài xế');
    }

    const driverNumber = await this.generateDriverNumber();

    const driver = await this.prisma.driver.create({
      data: {
        userId,
        driverNumber,
        status: 'PENDING_VERIFICATION',
        onlineStatus: 'OFFLINE',
        driver_identities: {
          create: {
            citizen_id: dto.citizenId,
            citizen_id_issue_date: new Date(dto.citizenIdIssueDate),
            citizen_id_issue_place: dto.citizenIdIssuePlace,
            citizen_id_expiry: dto.citizenIdExpiry ? new Date(dto.citizenIdExpiry) : null,
            citizen_id_front_image: dto.citizenIdFrontImage,
            citizen_id_back_image: dto.citizenIdBackImage,
            face_image: dto.faceImage,
            driver_license_number: dto.driverLicenseNumber,
            driver_license_class: dto.driverLicenseClass as any,
            driver_license_issue_date: new Date(dto.driverLicenseIssueDate),
            driver_license_expiry: new Date(dto.driverLicenseExpiry),
            driver_license_image: dto.driverLicenseImage,
            criminal_record_number: dto.criminalRecordNumber,
            criminal_record_issue_date: new Date(dto.criminalRecordIssueDate),
            criminal_record_image: dto.criminalRecordImage,
          },
        },
      },
      include: { driver_identities: true },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { role: 'DRIVER' },
    });

    return this.formatDriver(driver);
  }

  async getProfile(userId: string) {
    const driver = await this.prisma.driver.findUnique({
      where: { userId },
      include: {
        user: { select: { firstName: true, lastName: true, email: true, avatar_url: true, phoneNumber: true } },
        vehicles: {
          where: { isActive: true },
          select: {
            id: true,
            vehicleType: true,
            licensePlate: true,
            is_primary: true,
            vehicle_class: true,
            brand: true,
            model: true,
            year: true,
            color: true,
            front_image: true,
            back_image: true,
            left_image: true,
            right_image: true,
            plate_closeup_image: true,
            registration_number: true,
            registration_issue_date: true,
            registration_expiry: true,
            registration_image: true,
            insurance_number: true,
            insurance_provider: true,
            insurance_issue_date: true,
            insurance_expiry: true,
            insurance_image: true,
            verification_status: true,
            isActive: true,
          },
        },
        driver_identities: {
          select: {
            verification_status: true,
            citizen_id: true,
            driver_license_class: true,
            driver_license_expiry: true,
            citizen_id_front_image: true,
            citizen_id_back_image: true,
            face_image: true,
            driver_license_image: true,
            criminal_record_image: true,
          },
        },
      },
    });

    if (!driver) throw new NotFoundException('Chưa đăng ký tài xế');
    return this.formatDriverFull(driver);
  }

  async getDriverById(driverId: string) {
    const driver = await this.prisma.driver.findUnique({
      where: { id: driverId },
      include: {
        user: { select: { firstName: true, lastName: true, email: true, avatar_url: true, phoneNumber: true } },
        vehicles: {
          where: { isActive: true },
          select: {
            id: true,
            vehicleType: true,
            licensePlate: true,
            is_primary: true,
            brand: true,
            model: true,
            year: true,
            color: true,
            front_image: true,
            back_image: true,
            left_image: true,
            right_image: true,
            plate_closeup_image: true,
            registration_number: true,
            registration_issue_date: true,
            registration_expiry: true,
            registration_image: true,
            insurance_number: true,
            insurance_provider: true,
            insurance_issue_date: true,
            insurance_expiry: true,
            insurance_image: true,
            verification_status: true,
            isActive: true,
          },
        },
        driver_identities: {
          select: {
            verification_status: true,
            citizen_id: true,
            driver_license_class: true,
            driver_license_expiry: true,
            citizen_id_front_image: true,
            citizen_id_back_image: true,
            face_image: true,
            driver_license_image: true,
            criminal_record_image: true,
          },
        },
      },
    });
    if (!driver) throw new NotFoundException('Không tìm thấy tài xế');
    return this.formatDriverFull(driver);
  }

  async updateProfile(userId: string, dto: UpdateDriverProfileDto) {
    const driver = await this.prisma.driver.findUnique({
      where: { userId },
      include: { user: true },
    });
    if (!driver) throw new NotFoundException('Chưa đăng ký tài xế');

    const userUpdate: Record<string, unknown> = {};
    if (dto.firstName !== undefined) userUpdate.firstName = dto.firstName;
    if (dto.lastName !== undefined) userUpdate.lastName = dto.lastName;
    if (dto.avatar_url !== undefined) userUpdate.avatar_url = String(dto.avatar_url).trim();
    if (dto.phoneNumber !== undefined) userUpdate.phoneNumber = dto.phoneNumber;

    if (Object.keys(userUpdate).length > 0) {
      try {
        await this.prisma.user.update({
          where: { id: userId },
          data: userUpdate,
        });
      } catch (e: any) {
        throw new BadRequestException(
          e?.meta?.target ? `Trường ${e.meta.target.join(', ')} bị trùng hoặc không hợp lệ` : e?.message || 'Không cập nhật được profile',
        );
      }
    }

    try {
      return await this.getProfile(userId);
    } catch (e: any) {
      console.error('[updateProfile] getProfile failed:', e?.message ?? e);
      throw new BadRequestException(
        'Đã cập nhật nhưng tải lại profile thất bại: ' + (e?.message ?? String(e)),
      );
    }
  }

  async updateIdentity(userId: string, dto: UpdateDriverIdentityDto) {
    const driver = await this.prisma.driver.findUnique({
      where: { userId },
      include: { driver_identities: true },
    });
    if (!driver) throw new NotFoundException('Chưa đăng ký tài xế');

    const updates: Record<string, unknown> = {};
    if (dto.citizenIdFrontImage !== undefined) updates.citizen_id_front_image = dto.citizenIdFrontImage;
    if (dto.citizenIdBackImage !== undefined) updates.citizen_id_back_image = dto.citizenIdBackImage;
    if (dto.faceImage !== undefined) updates.face_image = dto.faceImage;
    if (dto.driverLicenseImage !== undefined) updates.driver_license_image = dto.driverLicenseImage;
    if (dto.criminalRecordImage !== undefined) updates.criminal_record_image = dto.criminalRecordImage;

    if (Object.keys(updates).length === 0) {
      return this.getProfile(userId);
    }

    if (!driver.driver_identities) {
      // Tạo bản ghi driver_identities nếu chưa có (user chưa qua form đăng ký đầy đủ)
      const placeholderImage =
        dto.faceImage ?? dto.citizenIdFrontImage ?? dto.citizenIdBackImage ?? dto.driverLicenseImage ?? dto.criminalRecordImage;
      if (!placeholderImage) {
        throw new BadRequestException('Cần ít nhất một ảnh để tạo thông tin giấy tờ');
      }
      const placeholderDate = new Date('2000-01-01');
      await this.prisma.driver_identities.create({
        data: {
          driver_id: driver.id,
          citizen_id: driver.driverNumber, // VarChar(20), unique, e.g. "LS-DRV-000001"
          citizen_id_issue_date: placeholderDate,
          citizen_id_issue_place: 'PENDING',
          citizen_id_front_image: dto.citizenIdFrontImage ?? placeholderImage,
          citizen_id_back_image: dto.citizenIdBackImage ?? placeholderImage,
          face_image: dto.faceImage ?? placeholderImage,
          driver_license_number: 'PENDING',
          driver_license_class: 'B2',
          driver_license_issue_date: placeholderDate,
          driver_license_expiry: new Date('2030-12-31'),
          driver_license_image: dto.driverLicenseImage ?? placeholderImage,
          criminal_record_number: 'PENDING',
          criminal_record_issue_date: placeholderDate,
          criminal_record_image: dto.criminalRecordImage ?? placeholderImage,
        },
      });
    } else {
      await this.prisma.driver_identities.update({
        where: { driver_id: driver.id },
        data: updates,
      });
    }

    return this.getProfile(userId);
  }

  async updateVehicleDocuments(userId: string, vehicleId: string, dto: UpdateVehicleDocumentsDto) {
    const driver = await this.prisma.driver.findUnique({ where: { userId } });
    if (!driver) throw new NotFoundException('Chưa đăng ký tài xế');

    const vehicle = await this.prisma.vehicle.findFirst({
      where: { id: vehicleId, driverId: driver.id },
    });
    if (!vehicle) throw new NotFoundException('Không tìm thấy phương tiện');

    const updates: Record<string, unknown> = {};
    if (dto.frontImage !== undefined) updates.front_image = dto.frontImage;
    if (dto.backImage !== undefined) updates.back_image = dto.backImage;
    if (dto.leftImage !== undefined) updates.left_image = dto.leftImage;
    if (dto.rightImage !== undefined) updates.right_image = dto.rightImage;
    if (dto.plateCloseupImage !== undefined) updates.plate_closeup_image = dto.plateCloseupImage;
    if (dto.registrationImage !== undefined) updates.registration_image = dto.registrationImage;
    if (dto.insuranceImage !== undefined) updates.insurance_image = dto.insuranceImage;
    if (dto.insuranceNumber !== undefined) updates.insurance_number = dto.insuranceNumber;
    if (dto.insuranceExpiry !== undefined) updates.insurance_expiry = new Date(dto.insuranceExpiry);

    if (Object.keys(updates).length > 0) {
      await this.prisma.vehicle.update({
        where: { id: vehicleId },
        data: updates,
      });
    }

    return this.prisma.vehicle.findUnique({ where: { id: vehicleId } });
  }

  async getDashboard(userId: string) {
    const driver = await this.prisma.driver.findUnique({
      where: { userId },
    });
    if (!driver) throw new NotFoundException('Chưa đăng ký tài xế');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [todayBookings, totalBookings, recentBookings, completedThisWeek] = await Promise.all([
      this.prisma.booking.count({
        where: { driverId: driver.id, status: 'COMPLETED', completedAt: { gte: today } },
      }),
      this.prisma.booking.count({
        where: { driverId: driver.id, status: 'COMPLETED' },
      }),
      this.prisma.booking.findMany({
        where: { driverId: driver.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          bookingNumber: true,
          status: true,
          totalPrice: true,
          pickupAddress: true,
          dropoffAddress: true,
          createdAt: true,
        },
      }),
      this.prisma.booking.findMany({
        where: {
          driverId: driver.id,
          status: 'COMPLETED',
          completedAt: { gte: weekAgo },
        },
        select: { totalPrice: true, completedAt: true },
      }),
    ]);

    const todayEarningsResult = await this.prisma.booking.aggregate({
      where: {
        driverId: driver.id,
        status: 'COMPLETED',
        completedAt: { gte: today },
      },
      _sum: { totalPrice: true },
    });
    const todayEarnings = Number(todayEarningsResult._sum.totalPrice ?? 0);

    const dailyEarningsMap: Record<string, number> = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const dayKey = d.toISOString().split('T')[0];
      dailyEarningsMap[dayKey] = 0;
    }
    for (const b of completedThisWeek) {
      if (!b.completedAt) continue;
      const dayKey = b.completedAt.toISOString().split('T')[0];
      if (dailyEarningsMap[dayKey] !== undefined) {
        dailyEarningsMap[dayKey] += Number(b.totalPrice);
      }
    }
    const weekDays = [0, 1, 2, 3, 4, 5, 6].map((i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      const dayKey = d.toISOString().split('T')[0];
      const label = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][d.getDay()];
      return { day: label, date: dayKey, earnings: dailyEarningsMap[dayKey] ?? 0 };
    });

    return {
      driver: {
        driverNumber: driver.driverNumber,
        status: driver.status,
        onlineStatus: driver.onlineStatus,
        rating: Number(driver.rating),
        totalRatings: driver.total_ratings,
        acceptanceRate: Number(driver.acceptanceRate),
      },
      stats: {
        todayTrips: todayBookings,
        totalTrips: driver.totalTrips,
        totalEarnings: Number(driver.totalEarnings),
        currentBalance: Number(driver.current_balance),
      },
      totalEarnings: Number(driver.totalEarnings),
      today: {
        totalTrips: todayBookings,
        totalEarnings: todayEarnings,
        onlineHours: 0,
        acceptanceRate: Number(driver.acceptanceRate),
        cancellationRate: Number(driver.cancellation_rate),
        averageRating: Number(driver.rating),
      },
      weeklyEarnings: weekDays,
      recentBookings: recentBookings.map((b) => ({
        ...b,
        totalPrice: Number(b.totalPrice),
      })),
    };
  }

  async addVehicle(userId: string, dto: AddVehicleDto) {
    const driver = await this.prisma.driver.findUnique({ where: { userId } });
    if (!driver) throw new NotFoundException('Chưa đăng ký tài xế');

    const vehicleData: Record<string, unknown> = {
      driverId: driver.id,
      vehicleType: dto.vehicleType,
      licensePlate: dto.licensePlate,
      brand: dto.brand,
      model: dto.model,
      year: dto.year,
      color: dto.color,
      front_image: dto.frontImage,
      back_image: dto.backImage,
      left_image: dto.leftImage,
      right_image: dto.rightImage,
      plate_closeup_image: dto.plateCloseupImage,
      registration_number: dto.registrationNumber,
      registration_issue_date: new Date(dto.registrationIssueDate),
      registration_image: dto.registrationImage,
      insurance_number: dto.insuranceNumber,
      insurance_provider: dto.insuranceProvider,
      insurance_issue_date: new Date(dto.insuranceIssueDate),
      insurance_expiry: new Date(dto.insuranceExpiry),
      insurance_image: dto.insuranceImage,
    };
    if (dto.vehicleClass) vehicleData.vehicle_class = dto.vehicleClass;
    if (dto.registrationExpiry) vehicleData.registration_expiry = new Date(dto.registrationExpiry);
    if (dto.inspectionNumber && dto.inspectionIssueDate && dto.inspectionExpiry) {
      vehicleData.inspection_number = dto.inspectionNumber;
      vehicleData.inspection_issue_date = new Date(dto.inspectionIssueDate);
      vehicleData.inspection_expiry = new Date(dto.inspectionExpiry);
    }

    const vehicle = await this.prisma.vehicle.create({
      data: vehicleData as any,
    });

    return vehicle;
  }

  async getVehicles(userId: string) {
    const driver = await this.prisma.driver.findUnique({ where: { userId } });
    if (!driver) throw new NotFoundException('Chưa đăng ký tài xế');

    return this.prisma.vehicle.findMany({
      where: { driverId: driver.id, isActive: true },
    });
  }

  async listDrivers(query: DriverListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = { deletedAt: null };
    if (query.status) where.status = query.status;

    const [drivers, total] = await Promise.all([
      this.prisma.driver.findMany({
        where,
        include: {
          user: { select: { firstName: true, lastName: true, email: true, avatar_url: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.driver.count({ where }),
    ]);

    return {
      data: drivers.map((d) => this.formatDriver(d)),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async verifyDriver(driverId: string, adminId: string, dto: VerifyDriverDto) {
    const driver = await this.prisma.driver.findUnique({
      where: { id: driverId },
      include: { driver_identities: true },
    });
    if (!driver) throw new NotFoundException('Không tìm thấy tài xế');

    if (driver.status !== 'PENDING_VERIFICATION') {
      throw new BadRequestException(`Tài xế đang ở trạng thái ${driver.status}`);
    }

    const updates: any = {
      verified_at: new Date(),
      verified_by: adminId,
    };

    if (dto.action === 'APPROVED') {
      updates.status = 'ACTIVE';
      updates.onboarding_completed = true;
    } else {
      updates.status = 'INACTIVE';
      updates.rejection_reason = dto.rejectionReason || 'Không đạt yêu cầu xác minh';
    }

    const updated = await this.prisma.driver.update({
      where: { id: driverId },
      data: updates,
    });

    if (driver.driver_identities) {
      await this.prisma.driver_identities.update({
        where: { driver_id: driverId },
        data: {
          verification_status: dto.action === 'APPROVED' ? 'APPROVED' : 'REJECTED',
          verified_at: new Date(),
          verified_by: adminId,
          rejection_reason: dto.action === 'REJECTED' ? dto.rejectionReason : null,
        },
      });
    }

    return this.formatDriver(updated);
  }

  async getDriverStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [
      total,
      active,
      pending,
      online,
      aggregates,
      todayEarningsResult,
      weekEarningsResult,
    ] = await Promise.all([
      this.prisma.driver.count({ where: { deletedAt: null } }),
      this.prisma.driver.count({ where: { status: 'ACTIVE', deletedAt: null } }),
      this.prisma.driver.count({ where: { status: 'PENDING_VERIFICATION', deletedAt: null } }),
      this.prisma.driver.count({ where: { onlineStatus: 'ONLINE', deletedAt: null } }),
      this.prisma.driver.aggregate({
        where: { status: 'ACTIVE', deletedAt: null },
        _avg: { acceptanceRate: true, rating: true },
        _sum: { totalEarnings: true },
      }),
      this.prisma.booking.aggregate({
        where: { status: 'COMPLETED', completedAt: { gte: today } },
        _sum: { totalPrice: true },
      }),
      this.prisma.booking.aggregate({
        where: { status: 'COMPLETED', completedAt: { gte: weekAgo } },
        _sum: { totalPrice: true },
      }),
    ]);

    const avg = aggregates._avg;
    const sum = aggregates._sum;
    const averageAcceptanceRate =
      avg.acceptanceRate != null ? Number(avg.acceptanceRate) / 100 : null;
    const todayEarnings = Number(todayEarningsResult._sum.totalPrice ?? 0);
    const weekEarnings = Number(weekEarningsResult._sum.totalPrice ?? 0);

    return {
      total,
      active,
      pending,
      online,
      averageAcceptanceRate,
      averageRating: avg.rating != null ? Number(avg.rating) : null,
      totalDriverEarnings: sum.totalEarnings != null ? Number(sum.totalEarnings) : 0,
      todayEarnings,
      weekEarnings,
    };
  }

  async getDriverOwnStats(userId: string) {
    const driver = await this.prisma.driver.findUnique({
      where: { userId },
    });
    if (!driver) throw new NotFoundException('Chưa đăng ký tài xế');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTrips = await this.prisma.booking.count({
      where: { driverId: driver.id, status: 'COMPLETED', completedAt: { gte: today } },
    });

    return {
      todayTrips,
      totalTrips: driver.totalTrips,
      totalEarnings: Number(driver.totalEarnings),
      currentBalance: Number(driver.current_balance),
      acceptanceRate: Number(driver.acceptanceRate),
      rating: Number(driver.rating),
      onlineStatus: driver.onlineStatus,
    };
  }

  private defaultOrderReceivingSettings() {
    return {
      cashOnHand: 0,
      pendingCOD: 0,
      enabledServices: {
        foodDelivery: true,
        rideBike: true,
        rideCar4: true,
        rideCar7: false,
        parcel: true,
      },
      autoAcceptEnabled: false,
      autoAcceptMaxDistanceKm: 5,
      autoAcceptMinAmount: 30000,
      maxBatchOrders: 3,
    };
  }

  async getOrderReceivingSettings(userId: string) {
    const driver = await this.prisma.driver.findUnique({
      where: { userId },
    });
    if (!driver) throw new NotFoundException('Chưa đăng ký tài xế');

    const meta = (driver.metadata as Record<string, unknown>) || {};
    const orderReceiving = {
      ...this.defaultOrderReceivingSettings(),
      ...(meta.orderReceiving as Record<string, unknown> || {}),
    };
    const availableCash = Math.max(0, (orderReceiving.cashOnHand as number) - (orderReceiving.pendingCOD as number));

    return {
      isOnline: driver.onlineStatus === 'ONLINE',
      cashOnHand: orderReceiving.cashOnHand as number,
      availableCash,
      pendingCOD: orderReceiving.pendingCOD as number,
      enabledServices: orderReceiving.enabledServices as Record<string, boolean>,
      autoAcceptEnabled: orderReceiving.autoAcceptEnabled as boolean,
      autoAcceptMaxDistanceKm: orderReceiving.autoAcceptMaxDistanceKm as number,
      autoAcceptMinAmount: orderReceiving.autoAcceptMinAmount as number,
      maxBatchOrders: orderReceiving.maxBatchOrders as number,
    };
  }

  async updateOrderReceivingSettings(userId: string, dto: OrderReceivingSettingsDto) {
    const driver = await this.prisma.driver.findUnique({
      where: { userId },
    });
    if (!driver) throw new NotFoundException('Chưa đăng ký tài xế');

    const meta = (driver.metadata as Record<string, unknown>) || {};
    const current = {
      ...this.defaultOrderReceivingSettings(),
      ...(meta.orderReceiving as Record<string, unknown> || {}),
    };

    if (dto.cashOnHand !== undefined) current.cashOnHand = dto.cashOnHand;
    if (dto.enabledServices !== undefined) current.enabledServices = { ...current.enabledServices, ...dto.enabledServices };
    if (dto.autoAcceptEnabled !== undefined) current.autoAcceptEnabled = dto.autoAcceptEnabled;
    if (dto.autoAcceptMaxDistanceKm !== undefined) current.autoAcceptMaxDistanceKm = dto.autoAcceptMaxDistanceKm;
    if (dto.autoAcceptMinAmount !== undefined) current.autoAcceptMinAmount = dto.autoAcceptMinAmount;
    if (dto.maxBatchOrders !== undefined) current.maxBatchOrders = dto.maxBatchOrders;

    const newMeta = { ...meta, orderReceiving: current };
    await this.prisma.driver.update({
      where: { userId: userId },
      data: { metadata: newMeta },
    });

    return this.getOrderReceivingSettings(userId);
  }

  async declareCash(userId: string, dto: DeclareCashDto) {
    const driver = await this.prisma.driver.findUnique({
      where: { userId },
    });
    if (!driver) throw new NotFoundException('Chưa đăng ký tài xế');

    const meta = (driver.metadata as Record<string, unknown>) || {};
    const current = {
      ...this.defaultOrderReceivingSettings(),
      ...(meta.orderReceiving as Record<string, unknown> || {}),
    };
    current.cashOnHand = dto.amount;

    const newMeta = { ...meta, orderReceiving: current };
    await this.prisma.driver.update({
      where: { userId },
      data: { metadata: newMeta },
    });

    const availableCash = Math.max(0, current.cashOnHand - (current.pendingCOD as number));
    return {
      cashOnHand: current.cashOnHand,
      availableCash,
      pendingCOD: current.pendingCOD as number,
      message: 'Đã cập nhật tiền mang theo',
    };
  }

  private formatDriver(d: any) {
    return {
      id: d.id,
      driverNumber: d.driverNumber,
      userId: d.userId,
      status: d.status,
      onlineStatus: d.onlineStatus,
      rating: Number(d.rating),
      totalRatings: d.total_ratings,
      totalTrips: d.totalTrips,
      totalEarnings: Number(d.totalEarnings),
      acceptanceRate: Number(d.acceptanceRate),
      onboardingCompleted: d.onboarding_completed,
      createdAt: d.createdAt,
      user: d.user || undefined,
    };
  }

  private formatDriverFull(d: any) {
    const primaryVehicle = d.vehicles?.find((v: any) => v.is_primary) ?? d.vehicles?.[0];
    const vehicles = (d.vehicles ?? []).map((v: any) => ({
      id: v.id,
      vehicleType: v.vehicleType,
      licensePlate: v.licensePlate,
      is_primary: v.is_primary,
      vehicle_class: v.vehicle_class,
      brand: v.brand,
      model: v.model,
      year: v.year,
      color: v.color,
      front_image: v.front_image,
      back_image: v.back_image,
      left_image: v.left_image,
      right_image: v.right_image,
      plate_closeup_image: v.plate_closeup_image,
      registration_number: v.registration_number,
      registration_issue_date: v.registration_issue_date,
      registration_expiry: v.registration_expiry,
      registration_image: v.registration_image,
      insurance_number: v.insurance_number,
      insurance_provider: v.insurance_provider,
      insurance_issue_date: v.insurance_issue_date,
      insurance_expiry: v.insurance_expiry,
      insurance_image: v.insurance_image,
      verification_status: v.verification_status,
      isActive: v.isActive,
    }));
    return {
      ...this.formatDriver(d),
      rejectionReason: d.rejection_reason ?? undefined,
      firstName: d.user?.firstName,
      lastName: d.user?.lastName,
      email: d.user?.email,
      avatar_url: d.user?.avatar_url,
      phoneNumber: d.user?.phoneNumber,
      vehicleType: primaryVehicle?.vehicleType ?? null,
      vehiclePlate: primaryVehicle?.licensePlate ?? null,
      currentLat: d.currentLat != null ? Number(d.currentLat) : null,
      currentLng: d.currentLng != null ? Number(d.currentLng) : null,
      lastLocationAt: d.lastLocationAt,
      totalDistanceKm: Number(d.totalDistanceKm ?? 0),
      vehicles,
      identity: d.driver_identities
        ? {
            verificationStatus: d.driver_identities.verification_status,
            citizenId: d.driver_identities.citizen_id,
            driverLicenseClass: d.driver_identities.driver_license_class,
            driverLicenseExpiry: d.driver_identities.driver_license_expiry,
            citizenIdFrontImage: d.driver_identities.citizen_id_front_image,
            citizenIdBackImage: d.driver_identities.citizen_id_back_image,
            faceImage: d.driver_identities.face_image,
            driverLicenseImage: d.driver_identities.driver_license_image,
            criminalRecordImage: d.driver_identities.criminal_record_image,
          }
        : null,
    };
  }
}
