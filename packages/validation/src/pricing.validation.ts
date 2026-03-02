/**
 * Pricing Table Validation Schemas (Web Admin)
 */

import { z } from 'zod';

export const createPricingTableSchema = z.object({
  code: z
    .string()
    .min(1, 'Mã không được để trống')
    .max(50, 'Mã tối đa 50 ký tự')
    .transform((v) => v.trim()),
  name: z.string().min(1, 'Tên không được để trống').transform((v) => v.trim()),
  serviceType: z.enum(['TRANSPORT', 'DELIVERY']),
  regionIds: z.array(z.string().uuid()).min(1, 'Chọn ít nhất một vùng địa lý'),
});

export type CreatePricingTableInput = z.infer<typeof createPricingTableSchema>;
