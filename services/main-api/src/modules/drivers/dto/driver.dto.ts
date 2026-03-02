import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export enum VehicleType {
  BIKE = 'BIKE',
  CAR_4_SEATS = 'CAR_4_SEATS',
  CAR_7_SEATS = 'CAR_7_SEATS',
  TRUCK = 'TRUCK',
}

export enum DriverLicenseClass {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
}

export class RegisterDriverDto {
  @ApiProperty({ example: 'A2' })
  @IsEnum(DriverLicenseClass)
  driverLicenseClass: DriverLicenseClass;

  @ApiProperty({ example: '079123456789' })
  @IsString()
  citizenId: string;

  @ApiProperty({ example: '2020-01-15' })
  @IsDateString()
  citizenIdIssueDate: string;

  @ApiProperty({ example: 'CA TP.HCM' })
  @IsString()
  citizenIdIssuePlace: string;

  @ApiPropertyOptional({ example: '2030-01-15' })
  @IsOptional()
  @IsDateString()
  citizenIdExpiry?: string;

  @ApiProperty({ example: 'https://storage.example.com/front.jpg' })
  @IsString()
  citizenIdFrontImage: string;

  @ApiProperty({ example: 'https://storage.example.com/back.jpg' })
  @IsString()
  citizenIdBackImage: string;

  @ApiProperty({ example: 'https://storage.example.com/face.jpg' })
  @IsString()
  faceImage: string;

  @ApiProperty({ example: 'DL-12345678' })
  @IsString()
  driverLicenseNumber: string;

  @ApiProperty({ example: '2019-06-01' })
  @IsDateString()
  driverLicenseIssueDate: string;

  @ApiProperty({ example: '2029-06-01' })
  @IsDateString()
  driverLicenseExpiry: string;

  @ApiProperty({ example: 'https://storage.example.com/license.jpg' })
  @IsString()
  driverLicenseImage: string;

  @ApiProperty({ example: 'CR-98765432' })
  @IsString()
  criminalRecordNumber: string;

  @ApiProperty({ example: '2024-01-10' })
  @IsDateString()
  criminalRecordIssueDate: string;

  @ApiProperty({ example: 'https://storage.example.com/criminal.jpg' })
  @IsString()
  criminalRecordImage: string;
}

export class AddVehicleDto {
  @ApiProperty({ enum: VehicleType, example: 'BIKE', description: 'Nhóm/loại xe (BIKE, CAR_4_SEATS, CAR_7_SEATS, TRUCK)' })
  @IsEnum(VehicleType)
  vehicleType: VehicleType;

  @ApiPropertyOptional({ example: 'VAN_1000_2000KG', description: 'Loại chi tiết xe tải (bắt buộc khi vehicleType=TRUCK): BAN_TAI, VAN_500KG, VAN_UNDER_950KG, VAN_1000_2000KG, VAN_OVER_2000KG' })
  @IsOptional()
  @IsString()
  vehicleClass?: string;

  @ApiProperty({ example: '59A-12345', description: 'Biển số (theo giấy đăng ký xe)' })
  @IsString()
  licensePlate: string;

  @ApiProperty({ example: 'Honda', description: 'Thương hiệu' })
  @IsString()
  brand: string;

  @ApiProperty({ example: 'Air Blade 150', description: 'Model/dòng xe' })
  @IsString()
  model: string;

  @ApiProperty({ example: 2024, description: 'Năm sản xuất' })
  @IsInt()
  year: number;

  @ApiProperty({ example: 'Đen', description: 'Màu sắc' })
  @IsString()
  color: string;

  @ApiProperty({ example: 'https://storage.example.com/front.jpg' })
  @IsString()
  frontImage: string;

  @ApiProperty({ example: 'https://storage.example.com/back.jpg' })
  @IsString()
  backImage: string;

  @ApiProperty({ example: 'https://storage.example.com/left.jpg' })
  @IsString()
  leftImage: string;

  @ApiProperty({ example: 'https://storage.example.com/right.jpg' })
  @IsString()
  rightImage: string;

  @ApiProperty({ example: 'https://storage.example.com/plate.jpg' })
  @IsString()
  plateCloseupImage: string;

  @ApiProperty({ example: 'REG-123456' })
  @IsString()
  registrationNumber: string;

  @ApiProperty({ example: '2024-01-01' })
  @IsDateString()
  registrationIssueDate: string;

  @ApiPropertyOptional({
    example: null,
    description: 'Giấy đăng ký xe không có ngày hết hạn. Để trống hoặc null.',
  })
  @IsOptional()
  @IsDateString()
  registrationExpiry?: string;

  @ApiProperty({ example: 'https://storage.example.com/reg.jpg' })
  @IsString()
  registrationImage: string;

  @ApiProperty({ example: 'INS-789012' })
  @IsString()
  insuranceNumber: string;

  @ApiProperty({ example: 'Bảo Việt' })
  @IsString()
  insuranceProvider: string;

  @ApiProperty({ example: '2024-01-01' })
  @IsDateString()
  insuranceIssueDate: string;

  @ApiProperty({ example: '2025-01-01' })
  @IsDateString()
  insuranceExpiry: string;

  @ApiProperty({ example: 'https://storage.example.com/ins.jpg' })
  @IsString()
  insuranceImage: string;

  @ApiPropertyOptional({
    description: 'Số giấy kiểm định (bắt buộc với ô tô, xe tải; xe máy không yêu cầu kiểm định)',
  })
  @IsOptional()
  @IsString()
  inspectionNumber?: string;

  @ApiPropertyOptional({ description: 'Ngày cấp giấy kiểm định' })
  @IsOptional()
  @IsDateString()
  inspectionIssueDate?: string;

  @ApiPropertyOptional({ description: 'Ngày hết hạn giấy kiểm định' })
  @IsOptional()
  @IsDateString()
  inspectionExpiry?: string;
}

export class DriverListQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;

  @ApiPropertyOptional({ enum: ['PENDING_VERIFICATION', 'ACTIVE', 'INACTIVE', 'SUSPENDED', 'BANNED'] })
  @IsOptional()
  @IsString()
  status?: string;
}

export class VerifyDriverDto {
  @ApiProperty({ enum: ['APPROVED', 'REJECTED'] })
  @IsEnum(['APPROVED', 'REJECTED'] as const)
  action: 'APPROVED' | 'REJECTED';

  @ApiPropertyOptional({ example: 'Giấy tờ không hợp lệ' })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}

export class UpdateDriverProfileDto {
  @ApiPropertyOptional({ example: 'Nguyễn' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Văn A' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  avatar_url?: string;

  @ApiPropertyOptional({ example: '0901234567' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}

export class OrderReceivingSettingsDto {
  @ApiPropertyOptional({ example: 500000, description: 'Tiền mang theo (VND)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10000000)
  cashOnHand?: number;

  @ApiPropertyOptional({ description: 'Dịch vụ bật nhận (key: serviceCode, value: true/false)' })
  @IsOptional()
  enabledServices?: Record<string, boolean>;

  @ApiPropertyOptional({ example: false, description: 'Tự động nhận đơn' })
  @IsOptional()
  autoAcceptEnabled?: boolean;

  @ApiPropertyOptional({ example: 5, description: 'Khoảng cách tối đa (km) cho tự động nhận' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  autoAcceptMaxDistanceKm?: number;

  @ApiPropertyOptional({ example: 30000, description: 'Giá trị đơn tối thiểu (VND) cho tự động nhận' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  autoAcceptMinAmount?: number;

  @ApiPropertyOptional({ example: 3, description: 'Số đơn tối đa ghép (batch)' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  maxBatchOrders?: number;
}

export class DeclareCashDto {
  @ApiProperty({ example: 500000, description: 'Số tiền khai báo mang theo (VND)' })
  @IsNumber()
  @Min(0)
  @Max(10000000)
  amount: number;
}

/** Cập nhật ảnh giấy tờ (chụp thực tế, lưu làm tài liệu quản lý) */
export class UpdateDriverIdentityDto {
  @ApiPropertyOptional({ description: 'URL ảnh CCCD mặt trước' })
  @IsOptional()
  @IsString()
  citizenIdFrontImage?: string;

  @ApiPropertyOptional({ description: 'URL ảnh CCCD mặt sau' })
  @IsOptional()
  @IsString()
  citizenIdBackImage?: string;

  @ApiPropertyOptional({ description: 'URL ảnh khuôn mặt' })
  @IsOptional()
  @IsString()
  faceImage?: string;

  @ApiPropertyOptional({ description: 'URL ảnh giấy phép lái xe' })
  @IsOptional()
  @IsString()
  driverLicenseImage?: string;

  @ApiPropertyOptional({ description: 'URL ảnh phiếu lý lịch tư pháp' })
  @IsOptional()
  @IsString()
  criminalRecordImage?: string;
}

/** Cập nhật ảnh phương tiện và giấy xe (chụp thực tế) */
export class UpdateVehicleDocumentsDto {
  @ApiPropertyOptional({ description: 'URL ảnh xe trước' })
  @IsOptional()
  @IsString()
  frontImage?: string;

  @ApiPropertyOptional({ description: 'URL ảnh xe sau' })
  @IsOptional()
  @IsString()
  backImage?: string;

  @ApiPropertyOptional({ description: 'URL ảnh xe trái' })
  @IsOptional()
  @IsString()
  leftImage?: string;

  @ApiPropertyOptional({ description: 'URL ảnh xe phải' })
  @IsOptional()
  @IsString()
  rightImage?: string;

  @ApiPropertyOptional({ description: 'URL ảnh biển số (close-up)' })
  @IsOptional()
  @IsString()
  plateCloseupImage?: string;

  @ApiPropertyOptional({ description: 'URL ảnh giấy đăng ký xe' })
  @IsOptional()
  @IsString()
  registrationImage?: string;

  @ApiPropertyOptional({ description: 'URL ảnh bảo hiểm TNDS' })
  @IsOptional()
  @IsString()
  insuranceImage?: string;

  @ApiPropertyOptional({ description: 'Mã số bảo hiểm TNDS (để kiểm soát, nhắc gia hạn)' })
  @IsOptional()
  @IsString()
  insuranceNumber?: string;

  @ApiPropertyOptional({ description: 'Ngày hết hạn BH TNDS (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  insuranceExpiry?: string;
}
