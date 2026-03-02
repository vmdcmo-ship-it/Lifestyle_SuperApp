import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Vui lòng nhập email').email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
    newPassword: z.string().min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu mới và xác nhận không khớp',
    path: ['confirmPassword'],
  });

export const mfaCodeSchema = z.object({
  code: z
    .string()
    .length(6, 'Vui lòng nhập mã OTP 6 chữ số')
    .regex(/^\d{6}$/, 'Mã OTP chỉ gồm 6 chữ số'),
});

export const mfaDisableSchema = z.object({
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
  code: z
    .string()
    .length(6, 'Vui lòng nhập mã OTP 6 chữ số')
    .regex(/^\d{6}$/, 'Mã OTP chỉ gồm 6 chữ số'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type MfaCodeInput = z.infer<typeof mfaCodeSchema>;
export type MfaDisableInput = z.infer<typeof mfaDisableSchema>;
