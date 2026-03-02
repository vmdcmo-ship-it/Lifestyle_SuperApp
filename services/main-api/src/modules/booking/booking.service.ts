import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventsGateway } from '../gateway/events.gateway';
import { PricingService } from '../pricing/pricing.service';
import {
  CreateBookingDto,
  FindNearestDriversDto,
  UpdateDriverLocationDto,
  CancelBookingDto,
  RateBookingDto,
  BookingListQueryDto,
} from './dto/booking.dto';

export interface NearbyDriver {
  id: string;
  driverNumber: string;
  distanceKm: number;
  estimatedArrivalMin: number;
  rating: number;
  totalTrips: number;
  vehicle: {
    type: string;
    brand: string;
    model: string;
    color: string;
    licensePlate: string;
  } | null;
  user: {
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
}

export interface PriceEstimate {
  distanceKm: number;
  estimatedDurationMin: number;
  basePrice: number;
  distancePrice: number;
  timePrice: number;
  totalPrice: number;
  currency: string;
  surgeMultiplier: number;
}

const DEFAULT_PRICE_CONFIG: Record<string, { baseFare: number; perKm: number; perMin: number; minFare: number }> = {
  BIKE: { baseFare: 12000, perKm: 4200, perMin: 300, minFare: 12000 },
  CAR_4_SEATS: { baseFare: 25000, perKm: 8500, perMin: 500, minFare: 25000 },
  CAR_7_SEATS: { baseFare: 30000, perKm: 10000, perMin: 600, minFare: 30000 },
};

@Injectable()
export class BookingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsGateway: EventsGateway,
    private readonly pricingService: PricingService,
  ) {}

  // ─── Geo helpers ────────────────────────────────────────────────────────────

  private haversineDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private toRad(deg: number): number {
    return (deg * Math.PI) / 180;
  }

  private estimateArrivalMinutes(distanceKm: number, vehicleType: string): number {
    const avgSpeed: Record<string, number> = {
      BIKE: 25,
      CAR_4_SEATS: 20,
      CAR_7_SEATS: 18,
      TRUCK: 15,
    };
    const speed = avgSpeed[vehicleType] || 20;
    return Math.round((distanceKm / speed) * 60 + 2);
  }

  // ─── Pricing ────────────────────────────────────────────────────────────────

  private async getPriceConfig(vehicleType: string): Promise<{
    baseFare: number;
    perKm: number;
    perMin: number;
    minFare: number;
  }> {
    const fromDb = await this.pricingService.getByVehicleType(vehicleType);
    if (fromDb) return fromDb;
    return (
      DEFAULT_PRICE_CONFIG[vehicleType] || DEFAULT_PRICE_CONFIG.BIKE
    );
  }

  private calculatePrice(
    distanceKm: number,
    durationMin: number,
    config: { baseFare: number; perKm: number; perMin: number; minFare: number },
  ): PriceEstimate {

    const hour = new Date().getHours();
    let surgeMultiplier = 1.0;
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) surgeMultiplier = 1.3;
    if (hour >= 22 || hour <= 5) surgeMultiplier = 1.5;

    const basePrice = config.baseFare;
    const distancePrice = Math.round(distanceKm * config.perKm);
    const timePrice = Math.round(durationMin * config.perMin);

    let totalPrice = Math.round(
      (basePrice + distancePrice + timePrice) * surgeMultiplier,
    );
    totalPrice = Math.max(totalPrice, config.minFare);
    totalPrice = Math.ceil(totalPrice / 1000) * 1000;

    return {
      distanceKm: Math.round(distanceKm * 100) / 100,
      estimatedDurationMin: durationMin,
      basePrice,
      distancePrice,
      timePrice,
      totalPrice,
      currency: 'VND',
      surgeMultiplier,
    };
  }

  private async generateBookingNumber(): Promise<string> {
    const count = await this.prisma.booking.count();
    return `LS-BK-${String(count + 1).padStart(6, '0')}`;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FIND NEAREST DRIVERS
  // ═══════════════════════════════════════════════════════════════════════════

  async findNearestDrivers(dto: FindNearestDriversDto): Promise<{
    drivers: NearbyDriver[];
    searchRadius: number;
    total: number;
  }> {
    const { lat, lng, radiusKm = 5, vehicleType } = dto;

    const onlineDrivers = await this.prisma.driver.findMany({
      where: {
        status: 'ACTIVE',
        onlineStatus: 'ONLINE',
        currentLat: { not: null },
        currentLng: { not: null },
        deletedAt: null,
      },
      include: {
        user: { select: { firstName: true, lastName: true, avatar_url: true } },
        vehicles: {
          where: {
            isActive: true,
            ...(vehicleType && { vehicleType: vehicleType as any }),
          },
          take: 1,
        },
      },
    });

    const nearbyDrivers: NearbyDriver[] = [];

    for (const driver of onlineDrivers) {
      if (!driver.currentLat || !driver.currentLng) continue;
      if (driver.vehicles.length === 0) continue;

      const distance = this.haversineDistance(
        lat,
        lng,
        Number(driver.currentLat),
        Number(driver.currentLng),
      );

      if (distance <= radiusKm) {
        const vehicle = driver.vehicles[0];
        nearbyDrivers.push({
          id: driver.id,
          driverNumber: driver.driverNumber,
          distanceKm: Math.round(distance * 100) / 100,
          estimatedArrivalMin: this.estimateArrivalMinutes(distance, vehicle.vehicleType),
          rating: Number(driver.rating),
          totalTrips: driver.totalTrips,
          vehicle: {
            type: vehicle.vehicleType,
            brand: vehicle.brand,
            model: vehicle.model,
            color: vehicle.color,
            licensePlate: vehicle.licensePlate,
          },
          user: {
            firstName: driver.user.firstName,
            lastName: driver.user.lastName,
            avatar: driver.user.avatar_url,
          },
        });
      }
    }

    nearbyDrivers.sort((a, b) => a.distanceKm - b.distanceKm);

    return {
      drivers: nearbyDrivers.slice(0, 10),
      searchRadius: radiusKm,
      total: nearbyDrivers.length,
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PRICE ESTIMATE
  // ═══════════════════════════════════════════════════════════════════════════

  async estimatePrice(dto: CreateBookingDto): Promise<PriceEstimate> {
    const config = await this.getPriceConfig(dto.vehicleType);
    const distanceKm = this.haversineDistance(
      dto.pickupLat,
      dto.pickupLng,
      dto.dropoffLat,
      dto.dropoffLng,
    );
    const actualDistanceKm = distanceKm * 1.3;
    const durationMin = this.estimateArrivalMinutes(actualDistanceKm, dto.vehicleType);
    return this.calculatePrice(actualDistanceKm, durationMin, config);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CREATE BOOKING  →  persisted to PostgreSQL
  // ═══════════════════════════════════════════════════════════════════════════

  async createBooking(userId: string, dto: CreateBookingDto) {
    const estimate = await this.estimatePrice(dto);
    const useMarketplace = dto.useMarketplace === true;
    const codAmount = dto.codAmount ?? 0;

    if (useMarketplace) {
      const bookingNumber = await this.generateBookingNumber();
      const booking = await this.prisma.booking.create({
        data: {
          bookingNumber,
          userId,
          driverId: null,
          status: 'SEARCHING_DRIVER',
          vehicleType: dto.vehicleType as any,
          pickupLat: dto.pickupLat,
          pickupLng: dto.pickupLng,
          pickupAddress: dto.pickupAddress,
          dropoffLat: dto.dropoffLat,
          dropoffLng: dto.dropoffLng,
          dropoffAddress: dto.dropoffAddress,
          distanceKm: estimate.distanceKm,
          durationMin: estimate.estimatedDurationMin,
          basePrice: estimate.basePrice,
          distancePrice: estimate.distancePrice,
          timePrice: estimate.timePrice,
          totalPrice: estimate.totalPrice,
          surgeMultiplier: estimate.surgeMultiplier,
          currency: estimate.currency,
          note: dto.note || null,
          metadata: { codAmount, senderNotes: dto.note || null } as object,
        },
      });
      const formatted = this.formatBooking(booking, {
        codAmount,
        senderNotes: dto.note || undefined,
        eta: `~${estimate.estimatedDurationMin} phút`,
      });
      this.eventsGateway.emitNewOrderToDrivers(formatted);
      return {
        ...formatted,
        basePrice: estimate.basePrice,
        distancePrice: estimate.distancePrice,
        timePrice: estimate.timePrice,
        totalPrice: estimate.totalPrice,
      };
    }

    const { drivers } = await this.findNearestDrivers({
      lat: dto.pickupLat,
      lng: dto.pickupLng,
      vehicleType: dto.vehicleType as any,
    });

    if (drivers.length === 0) {
      throw new BadRequestException(
        'Không tìm thấy tài xế trong khu vực. Vui lòng thử lại sau.',
      );
    }

    const assignedDriver = drivers[0];
    const bookingNumber = await this.generateBookingNumber();

    const booking = await this.prisma.booking.create({
      data: {
        bookingNumber,
        userId,
        driverId: assignedDriver.id,
        status: 'DRIVER_ASSIGNED',
        vehicleType: dto.vehicleType as any,
        pickupLat: dto.pickupLat,
        pickupLng: dto.pickupLng,
        pickupAddress: dto.pickupAddress,
        dropoffLat: dto.dropoffLat,
        dropoffLng: dto.dropoffLng,
        dropoffAddress: dto.dropoffAddress,
        distanceKm: estimate.distanceKm,
        durationMin: estimate.estimatedDurationMin,
        basePrice: estimate.basePrice,
        distancePrice: estimate.distancePrice,
        timePrice: estimate.timePrice,
        totalPrice: estimate.totalPrice,
        surgeMultiplier: estimate.surgeMultiplier,
        currency: estimate.currency,
        note: dto.note || null,
        metadata: { codAmount, senderNotes: dto.note || null } as object,
      },
    });

    await this.prisma.driver.update({
      where: { id: assignedDriver.id },
      data: { onlineStatus: 'BUSY' },
    });

    return {
      ...booking,
      basePrice: Number(booking.basePrice),
      distancePrice: Number(booking.distancePrice),
      timePrice: Number(booking.timePrice),
      totalPrice: Number(booking.totalPrice),
      assignedDriver,
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // GET BOOKING
  // ═══════════════════════════════════════════════════════════════════════════

  async getBooking(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) {
      throw new NotFoundException('Không tìm thấy booking');
    }
    return this.formatBooking(booking);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LIST USER BOOKINGS (history)
  // ═══════════════════════════════════════════════════════════════════════════

  async listUserBookings(userId: string, query: BookingListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (query.status) where.status = query.status;

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      data: bookings.map((b) => this.formatBooking(b)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async listDriverBookings(driverUserId: string, query: BookingListQueryDto) {
    const driver = await this.prisma.driver.findFirst({
      where: { userId: driverUserId, deletedAt: null },
    });
    if (!driver) return { data: [], pagination: { page: 1, limit: query.limit ?? 10, total: 0, totalPages: 0 } };

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: any = { driverId: driver.id };
    if (query.status) where.status = query.status;

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      data: bookings.map((b) => this.formatBooking(b)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getDriverAvailableBookings(driverUserId: string) {
    const driver = await this.prisma.driver.findFirst({
      where: { userId: driverUserId, deletedAt: null },
    });
    if (!driver) return { data: [] };

    const driverLat = driver.currentLat != null ? Number(driver.currentLat) : null;
    const driverLng = driver.currentLng != null ? Number(driver.currentLng) : null;

    const marketplaceBookings = await this.prisma.booking.findMany({
      where: {
        status: 'SEARCHING_DRIVER',
        driverId: null,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const data = marketplaceBookings.map((b) => {
      let distanceFromDriver: number | null = null;
      if (driverLat != null && driverLng != null) {
        distanceFromDriver = Math.round(
          this.haversineDistance(driverLat, driverLng, Number(b.pickupLat), Number(b.pickupLng)) * 100,
        ) / 100;
      }
      const meta = (b.metadata as Record<string, unknown>) || {};
      const codAmount = (meta.codAmount as number) ?? 0;
      const senderNotes = (meta.senderNotes as string) ?? b.note ?? '';
      return this.formatBooking(b, {
        distanceFromDriver: distanceFromDriver ?? undefined,
        codAmount,
        senderNotes,
        eta: `~${b.durationMin} phút`,
      });
    });

    return { data };
  }

  async rejectBooking(bookingId: string, driverUserId: string, reason?: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) throw new NotFoundException('Không tìm thấy booking');

    if (booking.status === 'SEARCHING_DRIVER' && !booking.driverId) {
      return { message: 'Đã bỏ qua đơn', id: bookingId };
    }

    const driver = await this.prisma.driver.findFirst({
      where: { userId: driverUserId, deletedAt: null },
    });

    if (!driver || driver.id !== booking.driverId) {
      throw new BadRequestException('Bạn không phải tài xế được gán cho chuyến này');
    }

    if (booking.status !== 'DRIVER_ASSIGNED') {
      throw new BadRequestException(
        `Không thể từ chối booking ở trạng thái ${booking.status}`,
      );
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CANCELLED',
        cancelReason: reason || null,
        cancelledBy: 'DRIVER',
        cancelledAt: new Date(),
        driverId: null,
      },
    });

    await this.prisma.driver.update({
      where: { id: driver.id },
      data: { onlineStatus: 'ONLINE' },
    });

    return this.formatBooking(updated);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CANCEL BOOKING
  // ═══════════════════════════════════════════════════════════════════════════

  async cancelBooking(bookingId: string, userId: string, dto: CancelBookingDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw new NotFoundException('Không tìm thấy booking');
    if (booking.userId !== userId) {
      throw new BadRequestException('Bạn không có quyền hủy booking này');
    }

    const cancellable = [
      'SEARCHING_DRIVER',
      'DRIVER_ASSIGNED',
      'DRIVER_ACCEPTED',
      'DRIVER_ARRIVING',
    ];
    if (!cancellable.includes(booking.status)) {
      throw new BadRequestException(
        `Không thể hủy booking ở trạng thái ${booking.status}`,
      );
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CANCELLED',
        cancelReason: dto.reason || null,
        cancelledBy: 'CUSTOMER',
        cancelledAt: new Date(),
      },
    });

    if (booking.driverId) {
      await this.prisma.driver.update({
        where: { id: booking.driverId },
        data: { onlineStatus: 'ONLINE' },
      });
    }

    return this.formatBooking(updated);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // COMPLETE BOOKING (driver calls this)
  // ═══════════════════════════════════════════════════════════════════════════

  async completeBooking(bookingId: string, driverUserId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw new NotFoundException('Không tìm thấy booking');

    const driver = await this.prisma.driver.findFirst({
      where: { userId: driverUserId, deletedAt: null },
    });

    if (!driver || driver.id !== booking.driverId) {
      throw new BadRequestException('Bạn không phải tài xế của chuyến này');
    }

    if (booking.status !== 'IN_PROGRESS' && booking.status !== 'PICKED_UP') {
      throw new BadRequestException(
        `Không thể hoàn thành booking ở trạng thái ${booking.status}`,
      );
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'COMPLETED', completedAt: new Date() },
    });

    await this.prisma.driver.update({
      where: { id: driver.id },
      data: {
        onlineStatus: 'ONLINE',
        totalTrips: { increment: 1 },
        totalEarnings: { increment: booking.totalPrice },
      },
    });

    return this.formatBooking(updated);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ACCEPT BOOKING (driver calls this)
  // ═══════════════════════════════════════════════════════════════════════════

  async acceptBooking(bookingId: string, driverUserId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) throw new NotFoundException('Không tìm thấy booking');

    const driver = await this.prisma.driver.findFirst({
      where: { userId: driverUserId, deletedAt: null },
    });
    if (!driver) throw new NotFoundException('Chưa đăng ký tài xế');

    const isMarketplaceGrab =
      booking.status === 'SEARCHING_DRIVER' && !booking.driverId;

    if (isMarketplaceGrab) {
      const updated = await this.prisma.$transaction(async (tx) => {
        const b = await tx.booking.findUnique({ where: { id: bookingId } });
        if (!b || b.status !== 'SEARCHING_DRIVER' || b.driverId)
          throw new BadRequestException('Đơn đã được tài xế khác nhận');
        return tx.booking.update({
          where: { id: bookingId },
          data: {
            driverId: driver.id,
            status: 'DRIVER_ACCEPTED',
            acceptedAt: new Date(),
          },
        });
      });
      await this.prisma.driver.update({
        where: { id: driver.id },
        data: { onlineStatus: 'BUSY' },
      });
      return this.formatBooking(updated);
    }

    if (driver.id !== booking.driverId) {
      throw new BadRequestException('Bạn không phải tài xế được gán cho chuyến này');
    }

    if (booking.status !== 'DRIVER_ASSIGNED') {
      throw new BadRequestException(
        `Không thể accept booking ở trạng thái ${booking.status}`,
      );
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'DRIVER_ACCEPTED', acceptedAt: new Date() },
    });

    return this.formatBooking(updated);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // UPDATE BOOKING STATUS (driver: ARRIVING / PICKED_UP / IN_PROGRESS)
  // ═══════════════════════════════════════════════════════════════════════════

  async updateBookingStatus(
    bookingId: string,
    driverUserId: string,
    newStatus: 'DRIVER_ARRIVING' | 'PICKED_UP' | 'IN_PROGRESS',
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) throw new NotFoundException('Không tìm thấy booking');

    const driver = await this.prisma.driver.findFirst({
      where: { userId: driverUserId, deletedAt: null },
    });

    if (!driver || driver.id !== booking.driverId) {
      throw new BadRequestException('Bạn không phải tài xế của chuyến này');
    }

    const validTransitions: Record<string, string[]> = {
      DRIVER_ACCEPTED: ['DRIVER_ARRIVING'],
      DRIVER_ARRIVING: ['PICKED_UP'],
      PICKED_UP: ['IN_PROGRESS'],
    };

    const allowed = validTransitions[booking.status] || [];
    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Không thể chuyển từ ${booking.status} sang ${newStatus}`,
      );
    }

    const data: any = { status: newStatus };
    if (newStatus === 'PICKED_UP') data.pickedUpAt = new Date();

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data,
    });

    return this.formatBooking(updated);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RATE DRIVER
  // ═══════════════════════════════════════════════════════════════════════════

  async rateBooking(bookingId: string, userId: string, dto: RateBookingDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) throw new NotFoundException('Không tìm thấy booking');
    if (booking.userId !== userId) {
      throw new BadRequestException('Bạn không có quyền đánh giá booking này');
    }
    if (booking.status !== 'COMPLETED') {
      throw new BadRequestException('Chỉ có thể đánh giá booking đã hoàn thành');
    }
    if (booking.rating) {
      throw new BadRequestException('Booking này đã được đánh giá');
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        rating: dto.rating,
        ratingComment: dto.comment || null,
        ratedAt: new Date(),
      },
    });

    if (booking.driverId) {
      const driverBookings = await this.prisma.booking.findMany({
        where: { driverId: booking.driverId, rating: { not: null } },
        select: { rating: true },
      });

      const avgRating =
        driverBookings.reduce((sum, b) => sum + Number(b.rating), 0) /
        driverBookings.length;

      await this.prisma.driver.update({
        where: { id: booking.driverId },
        data: {
          rating: Math.round(avgRating * 100) / 100,
          total_ratings: driverBookings.length,
        },
      });
    }

    return this.formatBooking(updated);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // UPDATE DRIVER LOCATION
  // ═══════════════════════════════════════════════════════════════════════════

  async updateDriverLocation(
    driverId: string,
    dto: UpdateDriverLocationDto,
  ): Promise<{ message: string }> {
    const lat = dto.lat ?? dto.latitude;
    const lng = dto.lng ?? dto.longitude;
    if (lat == null || lng == null) {
      throw new BadRequestException('Cần truyền lat/lng hoặc latitude/longitude');
    }

    const driver = await this.prisma.driver.findFirst({
      where: { userId: driverId, deletedAt: null },
    });
    if (!driver) throw new NotFoundException('Không tìm thấy tài xế');

    await this.prisma.driver.update({
      where: { id: driver.id },
      data: {
        currentLat: lat,
        currentLng: lng,
        lastLocationAt: new Date(),
      },
    });

    return { message: 'Cập nhật vị trí thành công' };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TOGGLE DRIVER ONLINE STATUS
  // ═══════════════════════════════════════════════════════════════════════════

  async toggleOnlineStatus(
    userId: string,
    status: 'ONLINE' | 'OFFLINE' | 'BUSY',
  ): Promise<{ message: string; status: string }> {
    const driver = await this.prisma.driver.findFirst({
      where: { userId, deletedAt: null },
    });
    if (!driver) throw new NotFoundException('Không tìm thấy tài xế');

    if (driver.status !== 'ACTIVE') {
      throw new BadRequestException(
        'Tài khoản tài xế chưa được kích hoạt. Vui lòng hoàn tất xác minh.',
      );
    }

    await this.prisma.driver.update({
      where: { id: driver.id },
      data: { onlineStatus: status as any },
    });

    return {
      message:
        status === 'ONLINE'
          ? 'Đã bật nhận chuyến'
          : status === 'OFFLINE'
            ? 'Đã tắt nhận chuyến'
            : 'Đã chuyển trạng thái bận',
      status,
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SIMULATE DRIVERS (DEV ONLY)
  // ═══════════════════════════════════════════════════════════════════════════

  async simulateDrivers(centerLat: number, centerLng: number, count = 10) {
    const simulated = [];

    for (let i = 0; i < count; i++) {
      const latOffset = (Math.random() - 0.5) * 0.054;
      const lngOffset = (Math.random() - 0.5) * 0.054;

      const driverLat = centerLat + latOffset;
      const driverLng = centerLng + lngOffset;
      const distance = this.haversineDistance(centerLat, centerLng, driverLat, driverLng);

      simulated.push({
        id: `sim-${i + 1}`,
        driverNumber: `LS-DRV-SIM-${String(i + 1).padStart(3, '0')}`,
        lat: Math.round(driverLat * 1_000_000) / 1_000_000,
        lng: Math.round(driverLng * 1_000_000) / 1_000_000,
        distanceKm: Math.round(distance * 100) / 100,
        estimatedArrivalMin: this.estimateArrivalMinutes(distance, 'BIKE'),
        vehicleType: ['BIKE', 'CAR_4_SEATS', 'CAR_7_SEATS'][
          Math.floor(Math.random() * 3)
        ],
        rating: Math.round((4 + Math.random()) * 10) / 10,
      });
    }

    simulated.sort((a, b) => a.distanceKm - b.distanceKm);

    return {
      center: { lat: centerLat, lng: centerLng },
      drivers: simulated,
      total: simulated.length,
      note: 'Dữ liệu giả lập cho development. Trên production sẽ dùng real-time GPS.',
    };
  }

  // ─── Helper ─────────────────────────────────────────────────────────────────

  private formatBooking(
    b: any,
    extra?: { distanceFromDriver?: number; codAmount?: number; senderNotes?: string; eta?: string },
  ) {
    const meta = (b.metadata as Record<string, unknown>) || {};
    const codAmount = extra?.codAmount ?? (meta.codAmount as number) ?? 0;
    const senderNotes = extra?.senderNotes ?? (meta.senderNotes as string) ?? b.note ?? '';

    return {
      id: b.id,
      bookingNumber: b.bookingNumber,
      status: b.status,
      vehicleType: b.vehicleType,
      pickup: {
        lat: Number(b.pickupLat),
        lng: Number(b.pickupLng),
        address: b.pickupAddress,
      },
      dropoff: {
        lat: Number(b.dropoffLat),
        lng: Number(b.dropoffLng),
        address: b.dropoffAddress,
      },
      price: {
        distanceKm: Number(b.distanceKm),
        durationMin: b.durationMin,
        basePrice: Number(b.basePrice),
        distancePrice: Number(b.distancePrice),
        timePrice: Number(b.timePrice),
        totalPrice: Number(b.totalPrice),
        surgeMultiplier: Number(b.surgeMultiplier),
        currency: b.currency,
      },
      estimatedPrice: Number(b.totalPrice),
      distanceFromDriver: extra?.distanceFromDriver,
      codAmount,
      senderNotes,
      eta: extra?.eta ?? `~${b.durationMin} phút`,
      driverId: b.driverId,
      note: b.note,
      rating: b.rating ? Number(b.rating) : null,
      ratingComment: b.ratingComment,
      cancelReason: b.cancelReason,
      cancelledBy: b.cancelledBy,
      acceptedAt: b.acceptedAt,
      pickedUpAt: b.pickedUpAt,
      completedAt: b.completedAt,
      cancelledAt: b.cancelledAt,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
    };
  }
}
