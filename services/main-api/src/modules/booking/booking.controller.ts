import {
  Controller,
  Post,
  Get,
  Put,
  Patch,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { BookingService } from './booking.service';
import {
  CreateBookingDto,
  FindNearestDriversDto,
  UpdateDriverLocationDto,
  CancelBookingDto,
  RejectBookingDto,
  UpdateDriverStatusDto,
  RateBookingDto,
  BookingListQueryDto,
} from './dto/booking.dto';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Booking')
@ApiBearerAuth('access-token')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // ─── POST /booking/estimate ──────────────────────────────────────────

  @Post('estimate')
  @ApiOperation({
    summary: 'Ước tính giá cuốc xe',
    description: 'Tính giá dự kiến dựa trên điểm đón, điểm trả, loại xe',
  })
  @ApiResponse({ status: 200, description: 'Thông tin giá ước tính' })
  async estimatePrice(@Body() dto: CreateBookingDto) {
    return this.bookingService.estimatePrice(dto);
  }

  // ─── POST /booking/find-drivers ──────────────────────────────────────

  @Post('find-drivers')
  @ApiOperation({
    summary: 'Tìm tài xế gần nhất',
    description: 'Tìm các tài xế online trong bán kính (Haversine)',
  })
  @ApiResponse({ status: 200, description: 'Danh sách tài xế gần nhất' })
  async findNearestDrivers(@Body() dto: FindNearestDriversDto) {
    return this.bookingService.findNearestDrivers(dto);
  }

  // ─── POST /booking/create ────────────────────────────────────────────

  @Post('create')
  @ApiOperation({
    summary: 'Đặt xe',
    description: 'Tạo booking mới, tự động tìm và gán tài xế gần nhất. Dữ liệu lưu vào PostgreSQL.',
  })
  @ApiResponse({ status: 201, description: 'Booking đã tạo' })
  @ApiResponse({ status: 400, description: 'Không tìm thấy tài xế' })
  async createBooking(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: CreateBookingDto,
  ) {
    return this.bookingService.createBooking(user.id, dto);
  }

  // ─── GET /booking/history ────────────────────────────────────────────

  @Get('history')
  @ApiOperation({
    summary: 'Lịch sử booking',
    description: 'Khách: booking của tôi; Tài xế: booking tôi nhận',
  })
  @ApiResponse({ status: 200, description: 'Danh sách booking' })
  async listBookings(
    @CurrentUser() user: CurrentUserData,
    @Query() query: BookingListQueryDto,
  ) {
    const isDriver = Array.isArray(user.roles)
      ? user.roles.includes('DRIVER')
      : (user as any).role === 'DRIVER';
    if (isDriver) {
      return this.bookingService.listDriverBookings(user.id, query);
    }
    return this.bookingService.listUserBookings(user.id, query);
  }

  // ─── GET /booking/driver/available ──────────────────────────────────

  @Get('driver/available')
  @Roles('DRIVER')
  @ApiOperation({
    summary: '[Driver] Đơn chờ xác nhận',
    description: 'Danh sách đơn đã gán cho tài xế, chưa accept',
  })
  @ApiResponse({ status: 200, description: 'Danh sách booking' })
  async getDriverAvailable(@CurrentUser() user: CurrentUserData) {
    return this.bookingService.getDriverAvailableBookings(user.id);
  }

  // ─── GET /booking/:id ────────────────────────────────────────────────

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin booking' })
  @ApiResponse({ status: 200, description: 'Chi tiết booking' })
  async getBooking(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookingService.getBooking(id);
  }

  // ─── PATCH /booking/:id/cancel ───────────────────────────────────────

  @Patch(':id/cancel')
  @ApiOperation({
    summary: 'Hủy booking',
    description: 'Khách hàng hủy booking (trước khi tài xế đón)',
  })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Booking đã hủy' })
  async cancelBooking(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserData,
    @Body() dto: CancelBookingDto,
  ) {
    return this.bookingService.cancelBooking(id, user.id, dto);
  }

  // ─── PATCH /booking/:id/accept ───────────────────────────────────────

  @Patch(':id/accept')
  @Roles('DRIVER')
  @ApiOperation({
    summary: '[Driver] Chấp nhận chuyến',
    description: 'Tài xế accept booking được gán',
  })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Đã chấp nhận' })
  async acceptBooking(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.bookingService.acceptBooking(id, user.id);
  }

  @Post(':id/accept')
  @Roles('DRIVER')
  @ApiOperation({
    summary: '[Driver] Chấp nhận chuyến (POST alias)',
  })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Đã chấp nhận' })
  async acceptBookingPost(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.bookingService.acceptBooking(id, user.id);
  }

  // ─── POST /booking/:id/reject ────────────────────────────────────────

  @Post(':id/reject')
  @Roles('DRIVER')
  @ApiOperation({
    summary: '[Driver] Từ chối chuyến',
  })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Đã từ chối' })
  async rejectBooking(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserData,
    @Body() dto: RejectBookingDto,
  ) {
    return this.bookingService.rejectBooking(id, user.id, dto.reason);
  }

  // ─── PATCH /booking/:id/status ───────────────────────────────────────

  @Patch(':id/status')
  @Roles('DRIVER')
  @ApiOperation({
    summary: '[Driver] Cập nhật trạng thái chuyến',
    description: 'DRIVER_ARRIVING → PICKED_UP → IN_PROGRESS',
  })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiQuery({
    name: 'status',
    enum: ['DRIVER_ARRIVING', 'PICKED_UP', 'IN_PROGRESS'],
  })
  @ApiResponse({ status: 200, description: 'Đã cập nhật' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserData,
    @Query('status') status: 'DRIVER_ARRIVING' | 'PICKED_UP' | 'IN_PROGRESS',
  ) {
    return this.bookingService.updateBookingStatus(id, user.id, status);
  }

  // ─── PATCH /booking/:id/complete ─────────────────────────────────────

  @Patch(':id/complete')
  @Roles('DRIVER')
  @ApiOperation({
    summary: '[Driver] Hoàn thành chuyến',
    description: 'Tài xế xác nhận hoàn thành và cập nhật thống kê',
  })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Chuyến đã hoàn thành' })
  async completeBooking(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.bookingService.completeBooking(id, user.id);
  }

  @Post(':id/complete')
  @Roles('DRIVER')
  @ApiOperation({
    summary: '[Driver] Hoàn thành chuyến (POST alias)',
  })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Chuyến đã hoàn thành' })
  async completeBookingPost(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.bookingService.completeBooking(id, user.id);
  }

  // ─── PATCH /booking/:id/rate ─────────────────────────────────────────

  @Patch(':id/rate')
  @ApiOperation({
    summary: 'Đánh giá chuyến xe',
    description: 'Khách hàng đánh giá tài xế sau khi hoàn thành chuyến',
  })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Đã đánh giá' })
  async rateBooking(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserData,
    @Body() dto: RateBookingDto,
  ) {
    return this.bookingService.rateBooking(id, user.id, dto);
  }

  // ─── PUT /booking/driver/location ────────────────────────────────────

  @Put('driver/location')
  @Roles('DRIVER')
  @ApiOperation({
    summary: '[Driver] Cập nhật vị trí GPS',
    description: 'Gửi liên tục từ driver app (mỗi 5-10 giây)',
  })
  @ApiResponse({ status: 200, description: 'Đã cập nhật' })
  async updateLocation(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: UpdateDriverLocationDto,
  ) {
    return this.bookingService.updateDriverLocation(user.id, dto);
  }

  @Post('driver/location')
  @Roles('DRIVER')
  @ApiOperation({
    summary: '[Driver] Cập nhật vị trí GPS (POST, driver app)',
  })
  @ApiResponse({ status: 200, description: 'Đã cập nhật' })
  async updateLocationPost(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: UpdateDriverLocationDto,
  ) {
    return this.bookingService.updateDriverLocation(user.id, dto);
  }

  // ─── PUT /booking/driver/status ──────────────────────────────────────

  @Put('driver/status')
  @Roles('DRIVER')
  @ApiOperation({
    summary: '[Driver] Bật/tắt nhận chuyến',
    description: 'Toggle trạng thái ONLINE/OFFLINE',
  })
  @ApiQuery({ name: 'status', enum: ['ONLINE', 'OFFLINE'] })
  @ApiResponse({ status: 200, description: 'Đã cập nhật trạng thái' })
  async toggleStatus(
    @CurrentUser() user: CurrentUserData,
    @Query('status') status: 'ONLINE' | 'OFFLINE',
  ) {
    return this.bookingService.toggleOnlineStatus(user.id, status);
  }

  @Patch('driver/status')
  @Roles('DRIVER')
  @ApiOperation({
    summary: '[Driver] Cập nhật trạng thái (body, driver app)',
  })
  @ApiResponse({ status: 200, description: 'Đã cập nhật trạng thái' })
  async updateDriverStatus(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: UpdateDriverStatusDto,
  ) {
    return this.bookingService.toggleOnlineStatus(user.id, dto.status);
  }

  // ─── GET /booking/simulate/drivers ───────────────────────────────────

  @Public()
  @Get('simulate/drivers')
  @ApiOperation({
    summary: '[DEV] Giả lập tài xế quanh vị trí',
    description: 'Tạo dữ liệu giả lập cho testing.',
  })
  @ApiQuery({ name: 'lat', type: Number, example: 10.7769 })
  @ApiQuery({ name: 'lng', type: Number, example: 106.7009 })
  @ApiQuery({ name: 'count', type: Number, required: false, example: 10 })
  async simulateDrivers(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('count') count?: number,
  ) {
    return this.bookingService.simulateDrivers(
      Number(lat),
      Number(lng),
      count ? Number(count) : 10,
    );
  }
}
