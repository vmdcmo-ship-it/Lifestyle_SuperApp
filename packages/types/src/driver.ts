/**
 * Driver/Partner Types
 * Thông tin đăng ký tài xế/đối tác
 */

import type { BaseEntity } from './common';
import type { VerificationStatus, EKYCLevel } from './user';

/**
 * Driver Status
 */
export enum DriverStatus {
  PENDING_VERIFICATION = 'PENDING_VERIFICATION', // Chờ xác minh
  ACTIVE = 'ACTIVE',                             // Đang hoạt động
  INACTIVE = 'INACTIVE',                         // Tạm ngưng
  SUSPENDED = 'SUSPENDED',                       // Bị đình chỉ
  BANNED = 'BANNED',                             // Bị cấm
}

/**
 * Vehicle Type
 */
export enum VehicleType {
  BIKE = 'BIKE',           // Xe máy
  CAR_4_SEATS = 'CAR_4_SEATS',   // Xe 4 chỗ
  CAR_7_SEATS = 'CAR_7_SEATS',   // Xe 7 chỗ
  TRUCK = 'TRUCK',         // Xe tải nhỏ
}

/**
 * Driver Identity Information
 * Thông tin định danh tài xế
 */
export interface DriverIdentity extends BaseEntity {
  userId: string;
  
  // Căn cước công dân
  citizenId: string;
  citizenIdIssueDate: Date;
  citizenIdIssuePlace: string;
  citizenIdExpiry?: Date;
  citizenIdFrontImage: string; // URL ảnh mặt trước CCCD
  citizenIdBackImage: string;  // URL ảnh mặt sau CCCD
  
  // eKYC
  ekycLevel: EKYCLevel;
  ekycVerifiedAt?: Date;
  faceImage: string; // Ảnh chân dung (sinh trắc học)
  
  // Giấy phép lái xe
  driverLicenseNumber: string;
  driverLicenseClass: string; // A1, A2, B1, B2, C, D, E, F
  driverLicenseIssueDate: Date;
  driverLicenseExpiry: Date;
  driverLicenseImage: string; // URL ảnh giấy phép lái xe
  
  // Lý lịch tư pháp (mẫu số 2)
  criminalRecordNumber: string;
  criminalRecordIssueDate: Date;
  criminalRecordImage: string; // URL ảnh lý lịch tư pháp
  
  verificationStatus: VerificationStatus;
  verifiedAt?: Date;
  verifiedBy?: string; // Admin ID
  rejectionReason?: string;
}

/**
 * Vehicle Information
 * Thông tin phương tiện
 */
export interface VehicleInfo extends BaseEntity {
  driverId: string;
  
  // Thông tin xe
  vehicleType: VehicleType;
  licensePlate: string; // Biển số xe
  brand: string;        // Hãng xe (Honda, Toyota, ...)
  model: string;        // Dòng xe (Wave, Vios, ...)
  year: number;         // Năm sản xuất
  color: string;        // Màu sắc
  
  // Hình ảnh phương tiện (4 góc)
  vehicleFrontImage: string;      // Góc trước (bắt buộc thấy biển số)
  vehicleBackImage: string;       // Góc sau
  vehicleLeftImage: string;       // Góc trái
  vehicleRightImage: string;      // Góc phải
  licensePlateCloseupImage: string; // Ảnh cận cảnh biển số
  
  // Đăng ký xe
  registrationNumber: string;     // Số đăng ký xe
  registrationIssueDate: Date;
  registrationExpiry: Date;
  registrationImage: string;      // URL ảnh đăng ký xe
  
  // Bảo hiểm TNDS (Trách nhiệm dân sự)
  insuranceNumber: string;
  insuranceProvider: string;      // Nhà cung cấp bảo hiểm
  insuranceIssueDate: Date;
  insuranceExpiry: Date;
  insuranceImage: string;         // URL ảnh bảo hiểm
  
  verificationStatus: VerificationStatus;
  verifiedAt?: Date;
  rejectionReason?: string;
  
  isActive: boolean;
}

/**
 * Bank Account Information
 * Thông tin tài khoản ngân hàng
 */
export interface DriverBankAccount extends BaseEntity {
  driverId: string;
  
  accountHolderName: string;  // Tên chủ tài khoản
  accountNumber: string;      // Số tài khoản
  bankName: string;           // Tên ngân hàng
  bankCode: string;           // Mã ngân hàng
  branchName: string;         // Chi nhánh
  
  // Xác thực
  isVerified: boolean;
  verifiedAt?: Date;
  
  // Mặc định
  isDefault: boolean;
}

/**
 * Driver Profile
 * Hồ sơ tài xế
 */
export interface DriverProfile extends BaseEntity {
  userId: string;
  
  status: DriverStatus;
  
  // References
  identity?: DriverIdentity;
  vehicles: VehicleInfo[];
  bankAccounts: DriverBankAccount[];
  
  // Rating & Stats
  rating: number;
  totalTrips: number;
  totalEarnings: number;
  
  // Availability
  isOnline: boolean;
  isAvailable: boolean;
  
  // Approval
  approvedAt?: Date;
  approvedBy?: string;
}

/**
 * Driver Registration Request
 * Yêu cầu đăng ký tài xế
 */
export interface DriverRegistrationRequest {
  // Personal Info (from User)
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: Date;
  address: string;
  
  // Identity
  citizenId: string;
  citizenIdIssueDate: Date;
  citizenIdIssuePlace: string;
  citizenIdFrontImage: File | string;
  citizenIdBackImage: File | string;
  faceImage: File | string;
  
  // Driver License
  driverLicenseNumber: string;
  driverLicenseClass: string;
  driverLicenseIssueDate: Date;
  driverLicenseExpiry: Date;
  driverLicenseImage: File | string;
  
  // Criminal Record
  criminalRecordNumber: string;
  criminalRecordIssueDate: Date;
  criminalRecordImage: File | string;
  
  // Vehicle
  vehicleType: VehicleType;
  licensePlate: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleColor: string;
  vehicleFrontImage: File | string;
  vehicleBackImage: File | string;
  vehicleLeftImage: File | string;
  vehicleRightImage: File | string;
  licensePlateCloseupImage: File | string;
  registrationNumber: string;
  registrationIssueDate: Date;
  registrationExpiry: Date;
  registrationImage: File | string;
  
  // Insurance
  insuranceNumber: string;
  insuranceProvider: string;
  insuranceIssueDate: Date;
  insuranceExpiry: Date;
  insuranceImage: File | string;
  
  // Bank Account
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  bankCode: string;
  branchName: string;
  
  // Terms
  agreedToTerms: boolean;
  agreedToDriverPolicy: boolean;
}
