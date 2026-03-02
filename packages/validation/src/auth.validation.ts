/**
 * Authentication Validation Schemas
 * Using Zod for runtime validation
 */

import { z } from 'zod';

/**
 * Vietnamese Phone Number Validation
 */
export const vietnamesePhoneSchema = z
  .string()
  .regex(/^(0|\+84)[3-9][0-9]{8}$/, 'Số điện thoại không hợp lệ')
  .transform((val) => {
    // Normalize to +84 format
    if (val.startsWith('0')) {
      return '+84' + val.slice(1);
    }
    return val;
  });

/**
 * Password Validation
 * - Min 8 characters
 * - Must contain uppercase, lowercase, and number
 */
export const passwordSchema = z
  .string()
  .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
  .regex(/[A-Z]/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa')
  .regex(/[a-z]/, 'Mật khẩu phải chứa ít nhất 1 chữ thường')
  .regex(/[0-9]/, 'Mật khẩu phải chứa ít nhất 1 số');

/**
 * Email Validation
 */
export const emailSchema = z
  .string()
  .email('Email không hợp lệ')
  .toLowerCase();

/**
 * Vietnamese Name Validation
 */
export const vietnameseNameSchema = z
  .string()
  .min(2, 'Tên phải có ít nhất 2 ký tự')
  .max(50, 'Tên không được quá 50 ký tự')
  .regex(/^[a-zA-ZÀ-ỹ\s]+$/, 'Tên chỉ được chứa chữ cái và khoảng trắng');

/**
 * Member Registration Schema
 */
export const memberRegistrationSchema = z.object({
  firstName: vietnameseNameSchema,
  lastName: vietnameseNameSchema,
  phoneNumber: vietnamesePhoneSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  dateOfBirth: z.date().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  referralCode: z.string().length(8).optional(),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: 'Bạn phải đồng ý với Điều khoản sử dụng',
  }),
  agreedToPrivacy: z.boolean().refine((val) => val === true, {
    message: 'Bạn phải đồng ý với Chính sách bảo mật',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

export type MemberRegistrationInput = z.infer<typeof memberRegistrationSchema>;

/**
 * Login Schema
 */
export const loginSchema = z.object({
  emailOrPhone: z.string().min(1, 'Vui lòng nhập email hoặc số điện thoại'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
  rememberMe: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * OTP Verification Schema
 */
export const otpVerificationSchema = z.object({
  phoneNumber: vietnamesePhoneSchema,
  otp: z.string().length(6, 'Mã OTP phải có 6 số').regex(/^[0-9]{6}$/, 'Mã OTP không hợp lệ'),
});

export type OTPVerificationInput = z.infer<typeof otpVerificationSchema>;

/**
 * Forgot Password Schema
 */
export const forgotPasswordSchema = z.object({
  emailOrPhone: z.string().min(1, 'Vui lòng nhập email hoặc số điện thoại'),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/**
 * Reset Password Schema
 */
export const resetPasswordSchema = z.object({
  token: z.string(),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
