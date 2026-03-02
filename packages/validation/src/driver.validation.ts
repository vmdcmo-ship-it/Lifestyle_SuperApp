/**
 * Driver Registration Validation Schemas
 */

import { z } from 'zod';
import { vietnamesePhoneSchema, emailSchema, vietnameseNameSchema } from './auth.validation';

/**
 * Citizen ID (CCCD) Validation
 */
export const citizenIdSchema = z
  .string()
  .length(12, 'Số CCCD phải có 12 số')
  .regex(/^[0-9]{12}$/, 'Số CCCD chỉ được chứa số');

/**
 * Driver License Number Validation
 */
export const driverLicenseNumberSchema = z
  .string()
  .length(12, 'Số GPLX phải có 12 số')
  .regex(/^[0-9]{12}$/, 'Số GPLX không hợp lệ');

/**
 * License Plate Validation (Vietnamese format)
 */
export const licensePlateSchema = z
  .string()
  .regex(/^[0-9]{2}[A-Z]{1,2}-[0-9]{4,5}(\.[0-9]{2})?$/, 'Biển số xe không hợp lệ (VD: 29A-12345)')
  .toUpperCase();

/**
 * File Upload Validation
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const imageFileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, 'Kích thước file không được vượt quá 5MB')
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    'Chỉ chấp nhận file ảnh (.jpg, .jpeg, .png, .webp)'
  );

/**
 * Step 1: Personal Information
 */
export const driverPersonalInfoSchema = z.object({
  fullName: z.string().min(5, 'Họ tên phải có ít nhất 5 ký tự').max(100),
  phoneNumber: vietnamesePhoneSchema,
  email: emailSchema,
  dateOfBirth: z.date().refine((date) => {
    const age = new Date().getFullYear() - date.getFullYear();
    return age >= 18 && age <= 65;
  }, 'Tuổi phải từ 18 đến 65'),
  address: z.string().min(10, 'Địa chỉ phải có ít nhất 10 ký tự'),
  password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
});

export type DriverPersonalInfoInput = z.infer<typeof driverPersonalInfoSchema>;

/**
 * Step 2: Identity & eKYC
 */
export const driverIdentitySchema = z.object({
  citizenId: citizenIdSchema,
  citizenIdIssueDate: z.date(),
  citizenIdIssuePlace: z.string().min(5, 'Nơi cấp không hợp lệ'),
  citizenIdExpiry: z.date().optional(),
  citizenIdFrontImage: imageFileSchema,
  citizenIdBackImage: imageFileSchema,
  faceImage: imageFileSchema,
});

export type DriverIdentityInput = z.infer<typeof driverIdentitySchema>;

/**
 * Step 3: Driver License
 */
export const driverLicenseSchema = z.object({
  driverLicenseNumber: driverLicenseNumberSchema,
  driverLicenseClass: z.enum(['A1', 'A2', 'B1', 'B2', 'C', 'D', 'E', 'F']),
  driverLicenseIssueDate: z.date(),
  driverLicenseExpiry: z.date().refine((date) => date > new Date(), {
    message: 'GPLX đã hết hạn',
  }),
  driverLicenseImage: imageFileSchema,
});

export type DriverLicenseInput = z.infer<typeof driverLicenseSchema>;

/**
 * Step 4: Criminal Record
 */
export const driverCriminalRecordSchema = z.object({
  criminalRecordNumber: z.string().min(5, 'Số giấy tờ không hợp lệ'),
  criminalRecordIssueDate: z.date().refine((date) => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return date > sixMonthsAgo;
  }, 'Lý lịch tư pháp phải còn hiệu lực (trong 6 tháng)'),
  criminalRecordImage: imageFileSchema,
});

export type DriverCriminalRecordInput = z.infer<typeof driverCriminalRecordSchema>;

/**
 * Step 5: Vehicle Information
 */
export const driverVehicleSchema = z.object({
  vehicleType: z.enum(['BIKE', 'CAR_4_SEATS', 'CAR_7_SEATS', 'TRUCK']),
  licensePlate: licensePlateSchema,
  brand: z.string().min(2, 'Hãng xe không hợp lệ'),
  model: z.string().min(2, 'Dòng xe không hợp lệ'),
  year: z.number().int().min(2000).max(new Date().getFullYear() + 1),
  color: z.string().min(2, 'Màu sắc không hợp lệ'),
  vehicleFrontImage: imageFileSchema,
  vehicleBackImage: imageFileSchema,
  vehicleLeftImage: imageFileSchema,
  vehicleRightImage: imageFileSchema,
  licensePlateCloseupImage: imageFileSchema,
  registrationNumber: z.string().min(5, 'Số đăng ký xe không hợp lệ'),
  registrationIssueDate: z.date(),
  registrationExpiry: z.date().refine((date) => date > new Date(), {
    message: 'Đăng ký xe đã hết hạn',
  }),
  registrationImage: imageFileSchema,
});

export type DriverVehicleInput = z.infer<typeof driverVehicleSchema>;

/**
 * Step 6: Insurance
 */
export const driverInsuranceSchema = z.object({
  insuranceNumber: z.string().min(5, 'Số hợp đồng bảo hiểm không hợp lệ'),
  insuranceProvider: z.string().min(3, 'Nhà cung cấp bảo hiểm không hợp lệ'),
  insuranceIssueDate: z.date(),
  insuranceExpiry: z.date().refine((date) => date > new Date(), {
    message: 'Bảo hiểm đã hết hạn',
  }),
  insuranceImage: imageFileSchema,
});

export type DriverInsuranceInput = z.infer<typeof driverInsuranceSchema>;

/**
 * Step 7: Bank Account
 */
export const driverBankAccountSchema = z.object({
  accountHolderName: z.string().min(5, 'Tên chủ tài khoản không hợp lệ'),
  accountNumber: z.string().regex(/^[0-9]{9,14}$/, 'Số tài khoản không hợp lệ (9-14 số)'),
  bankName: z.string().min(3, 'Tên ngân hàng không hợp lệ'),
  bankCode: z.string().min(3, 'Mã ngân hàng không hợp lệ'),
  branchName: z.string().min(3, 'Chi nhánh không hợp lệ'),
});

export type DriverBankAccountInput = z.infer<typeof driverBankAccountSchema>;

/**
 * Step 8: Terms & Conditions
 */
export const driverTermsSchema = z.object({
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: 'Bạn phải đồng ý với Điều khoản đối tác',
  }),
  agreedToDriverPolicy: z.boolean().refine((val) => val === true, {
    message: 'Bạn phải đồng ý với Chính sách tài xế',
  }),
});

export type DriverTermsInput = z.infer<typeof driverTermsSchema>;

/**
 * Complete Driver Registration Schema
 */
export const completeDriverRegistrationSchema = driverPersonalInfoSchema
  .merge(driverIdentitySchema)
  .merge(driverLicenseSchema)
  .merge(driverCriminalRecordSchema)
  .merge(driverVehicleSchema)
  .merge(driverInsuranceSchema)
  .merge(driverBankAccountSchema)
  .merge(driverTermsSchema);

export type CompleteDriverRegistrationInput = z.infer<typeof completeDriverRegistrationSchema>;
