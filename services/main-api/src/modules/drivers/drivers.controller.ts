import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  Res,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import {
  driverFaceUploadConfig,
  driverAvatarUploadConfig,
  driverDocumentsUploadConfig,
} from '../spotlight/upload.config';
import { DriversService } from './drivers.service';
import { OcrService } from './ocr.service';
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
import { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Drivers')
@ApiBearerAuth('access-token')
@Controller('drivers')
export class DriversController {
  constructor(
    private readonly driversService: DriversService,
    private readonly ocrService: OcrService,
  ) {}

  private getUploadBaseUrl(): string {
    if (process.env.API_BASE_URL) return process.env.API_BASE_URL;
    if (process.env.API_DOMAIN) return `https://${process.env.API_DOMAIN}`;
    return `http://localhost:${process.env.PORT || 3000}`;
  }

  @Post('upload/face')
  @Roles('DRIVER')
  @UseInterceptors(FileInterceptor('file', driverFaceUploadConfig))
  @ApiOperation({
    summary: 'Upload ảnh khuôn mặt',
    description: 'Chụp ảnh chân dung để xác minh tài xế. Ảnh cần đủ sáng và rõ mặt.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Ảnh chân dung (JPEG, PNG, WebP). Tối đa 5MB. Khuyến nghị thu nhỏ hoặc nén ảnh trước khi upload.',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'URL ảnh đã upload' })
  @ApiResponse({ status: 400, description: 'File quá lớn (max 5MB) hoặc định dạng không hợp lệ' })
  async uploadFace(
    @CurrentUser() user: CurrentUserData,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Vui lòng chọn ảnh');
    const baseUrl = this.getUploadBaseUrl();
    return { url: `${baseUrl}/uploads/driver-faces/${file.filename}` };
  }

  @Post('upload/avatar')
  @Roles('DRIVER')
  @UseInterceptors(FileInterceptor('file', driverAvatarUploadConfig))
  @ApiOperation({
    summary: 'Upload ảnh đại diện',
    description: 'Tải ảnh từ camera hoặc kho ảnh làm ảnh đại diện tài xế.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Ảnh đại diện (JPEG, PNG, WebP). Tối đa 5MB. Khuyến nghị thu nhỏ hoặc nén ảnh trước khi upload.',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'URL ảnh đã upload' })
  @ApiResponse({ status: 400, description: 'File quá lớn (max 5MB) hoặc định dạng không hợp lệ' })
  async uploadAvatar(
    @CurrentUser() user: CurrentUserData,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Vui lòng chọn ảnh');
    const baseUrl = this.getUploadBaseUrl();
    return { url: `${baseUrl}/api/v1/drivers/files/avatars/${file.filename}` };
  }

  @Get('files/avatars/:filename')
  @Public()
  @ApiOperation({ summary: 'Lấy ảnh avatar (public, không cần token)' })
  @ApiResponse({ status: 200, description: 'File ảnh' })
  @ApiResponse({ status: 404, description: 'File không tồn tại' })
  serveAvatar(@Param('filename') filename: string, @Res() res: Response): void {
    if (!/^[a-zA-Z0-9\-_.]+$/.test(filename)) {
      throw new BadRequestException('Filename không hợp lệ');
    }
    const path = join(process.cwd(), 'uploads', 'avatars', filename);
    if (!existsSync(path)) throw new NotFoundException('Ảnh không tồn tại');
    const dot = filename.lastIndexOf('.');
    const ext = dot >= 0 ? filename.toLowerCase().slice(dot) : '';
    const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
    res.type(mime);
    res.sendFile(path);
  }

  @Post('upload/document')
  @Roles('DRIVER')
  @UseInterceptors(FileInterceptor('file', driverDocumentsUploadConfig))
  @ApiOperation({
    summary: 'Upload ảnh giấy tờ (có xác thực OCR)',
    description:
      'Chụp ảnh GPLX, CCCD, đăng ký xe, bảo hiểm, ảnh xe. ' +
      'Truyền query ?type=citizen_front|citizen_back|license|registration|insurance|criminal_record để bật OCR validation. ' +
      'Khi OCR_ENABLED=true trên server, ảnh sai loại sẽ bị từ chối (422).',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Ảnh giấy tờ (JPEG, PNG, WebP). Tối đa 5MB.',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'URL ảnh đã upload' })
  @ApiResponse({ status: 400, description: 'File quá lớn (max 5MB) hoặc định dạng không hợp lệ' })
  @ApiResponse({ status: 422, description: 'Ảnh sai loại giấy tờ (OCR phát hiện) — yêu cầu chụp lại' })
  async uploadDocument(
    @CurrentUser() user: CurrentUserData,
    @UploadedFile() file: Express.Multer.File,
    @Query('type') documentType?: string,
  ) {
    if (!file) throw new BadRequestException('Vui lòng chọn ảnh');

    if (documentType) {
      const validation = await this.ocrService.validateDocument(file.path, documentType);
      if (!validation.valid) {
        await this.ocrService.deleteFile(file.path);
        throw new UnprocessableEntityException(
          validation.error ?? 'Ảnh không đúng loại giấy tờ. Vui lòng chụp lại.',
        );
      }
    }

    const baseUrl = this.getUploadBaseUrl();
    return { url: `${baseUrl}/uploads/driver-documents/${file.filename}` };
  }

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký làm tài xế', description: 'Gửi thông tin giấy tờ để xét duyệt' })
  @ApiResponse({ status: 201, description: 'Đã đăng ký thành công' })
  async register(@CurrentUser() user: CurrentUserData, @Body() dto: RegisterDriverDto) {
    return this.driversService.register(user.id, dto);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Xem profile tài xế' })
  async getProfile(@CurrentUser() user: CurrentUserData) {
    return this.driversService.getProfile(user.id);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Cập nhật profile tài xế (tên, avatar, SĐT)' })
  async updateProfile(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: UpdateDriverProfileDto,
  ) {
    return this.driversService.updateProfile(user.id, dto);
  }

  @Patch('identity')
  @Roles('DRIVER')
  @ApiOperation({
    summary: 'Cập nhật ảnh giấy tờ (CCCD, GPLX, khuôn mặt)',
    description: 'Cập nhật ảnh chụp thực tế, lưu làm tài liệu quản lý.',
  })
  async updateIdentity(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: UpdateDriverIdentityDto,
  ) {
    return this.driversService.updateIdentity(user.id, dto);
  }

  @Patch('vehicles/:id')
  @ApiOperation({
    summary: 'Cập nhật ảnh phương tiện (xe, đăng ký, bảo hiểm)',
    description: 'Cập nhật ảnh chụp thực tế phương tiện và giấy xe.',
  })
  async updateVehicleDocuments(
    @CurrentUser() user: CurrentUserData,
    @Param('id', ParseUUIDPipe) vehicleId: string,
    @Body() dto: UpdateVehicleDocumentsDto,
  ) {
    return this.driversService.updateVehicleDocuments(user.id, vehicleId, dto);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Dashboard tài xế', description: 'Thống kê trips, earnings, recent bookings' })
  async getDashboard(@CurrentUser() user: CurrentUserData) {
    return this.driversService.getDashboard(user.id);
  }

  @Post('vehicles')
  @ApiOperation({ summary: 'Thêm phương tiện', description: 'Đăng ký xe mới cho tài xế' })
  @ApiResponse({ status: 201, description: 'Đã thêm xe' })
  async addVehicle(@CurrentUser() user: CurrentUserData, @Body() dto: AddVehicleDto) {
    return this.driversService.addVehicle(user.id, dto);
  }

  @Get('vehicles')
  @ApiOperation({ summary: 'Danh sách xe của tài xế' })
  async getVehicles(@CurrentUser() user: CurrentUserData) {
    return this.driversService.getVehicles(user.id);
  }

  @Get('settings/order-receiving')
  @ApiOperation({ summary: 'Cài đặt nhận đơn', description: 'Tiền mang theo, dịch vụ bật, tự động nhận...' })
  async getOrderReceivingSettings(@CurrentUser() user: CurrentUserData) {
    return this.driversService.getOrderReceivingSettings(user.id);
  }

  @Patch('settings/order-receiving')
  @ApiOperation({ summary: 'Cập nhật cài đặt nhận đơn' })
  async updateOrderReceivingSettings(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: OrderReceivingSettingsDto,
  ) {
    return this.driversService.updateOrderReceivingSettings(user.id, dto);
  }

  @Post('cash/declare')
  @ApiOperation({ summary: 'Khai báo tiền mang theo', description: 'Dùng để ứng COD' })
  @ApiResponse({ status: 200, description: 'Đã cập nhật' })
  async declareCash(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: DeclareCashDto,
  ) {
    return this.driversService.declareCash(user.id, dto);
  }

  @Get('list')
  @Roles('ADMIN', 'ADMIN_TRANSPORT', 'SUPERVISOR')
  @ApiOperation({ summary: '[Admin] Danh sách tài xế', description: 'Phân trang + lọc theo status' })
  async listDrivers(@Query() query: DriverListQueryDto) {
    return this.driversService.listDrivers(query);
  }

  @Get('stats')
  @Roles('DRIVER', 'ADMIN', 'ADMIN_TRANSPORT', 'SUPERVISOR')
  @ApiOperation({
    summary: 'Thống kê',
    description: 'DRIVER: thống kê cá nhân; ADMIN: thống kê toàn hệ thống',
  })
  async getStats(@CurrentUser() user: CurrentUserData) {
    const isDriver = Array.isArray(user.roles)
      ? user.roles.includes('DRIVER')
      : (user as any).role === 'DRIVER';
    if (isDriver) {
      return this.driversService.getDriverOwnStats(user.id);
    }
    return this.driversService.getDriverStats();
  }

  @Patch(':id/verify')
  @Roles('ADMIN', 'ADMIN_TRANSPORT', 'SUPERVISOR')
  @ApiOperation({ summary: '[Admin] Xét duyệt tài xế', description: 'Approve hoặc reject đăng ký' })
  async verifyDriver(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() admin: CurrentUserData,
    @Body() dto: VerifyDriverDto,
  ) {
    return this.driversService.verifyDriver(id, admin.id, dto);
  }

  @Get(':id')
  @Roles('ADMIN', 'ADMIN_TRANSPORT', 'SUPERVISOR')
  @ApiOperation({ summary: '[Admin] Chi tiết tài xế' })
  async getDriverById(@Param('id', ParseUUIDPipe) id: string) {
    return this.driversService.getDriverById(id);
  }
}
