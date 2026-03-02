/**
 * Coupon Validation Schemas (Web Admin)
 */

import { z } from 'zod';

export const createCouponSchema = z
  .object({
    code: z
      .string()
      .min(1, 'Mã coupon không được để trống')
      .max(50, 'Mã coupon tối đa 50 ký tự')
      .transform((v) => v.toUpperCase().trim()),
    title: z.string().min(1, 'Tiêu đề không được để trống'),
    description: z.string().optional(),
    discountType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
    discountValue: z.number().min(1, 'Giá trị giảm phải lớn hơn 0'),
    maxDiscount: z.number().min(0).optional(),
    minOrderAmount: z.number().min(0).optional(),
    usageLimit: z.number().min(1).optional(),
    perUserLimit: z.number().min(1, 'Lượt/người phải >= 1'),
    startDate: z.string().min(1, 'Ngày bắt đầu không được để trống'),
    endDate: z.string().min(1, 'Ngày kết thúc không được để trống'),
  })
  .refine(
    (data) => {
      if (data.discountType === 'PERCENTAGE') {
        return data.discountValue <= 100;
      }
      return true;
    },
    { message: 'Phần trăm giảm không được quá 100', path: ['discountValue'] },
  )
  .refine(
    (data) => new Date(data.endDate) > new Date(data.startDate),
    { message: 'Ngày kết thúc phải sau ngày bắt đầu', path: ['endDate'] },
  );

export type CreateCouponInput = z.infer<typeof createCouponSchema>;

/** Schema cho form cập nhật coupon (không có code) */
export const updateCouponSchema = z
  .object({
    title: z.string().min(1, 'Tiêu đề không được để trống'),
    description: z.string().optional(),
    discountType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
    discountValue: z.number().min(1, 'Giá trị giảm phải lớn hơn 0'),
    maxDiscount: z.number().min(0).optional(),
    minOrderAmount: z.number().min(0).optional(),
    usageLimit: z.number().min(1).optional(),
    perUserLimit: z.number().min(1, 'Lượt/người phải >= 1'),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    isActive: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.discountType === 'PERCENTAGE') return data.discountValue <= 100;
      return true;
    },
    { message: 'Phần trăm giảm không được quá 100', path: ['discountValue'] },
  )
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.endDate) > new Date(data.startDate);
      }
      return true;
    },
    { message: 'Ngày kết thúc phải sau ngày bắt đầu', path: ['endDate'] },
  );

export type UpdateCouponInput = z.infer<typeof updateCouponSchema>;
