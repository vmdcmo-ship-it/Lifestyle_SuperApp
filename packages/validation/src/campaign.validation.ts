/**
 * Marketing Campaign Validation Schemas (Web Admin)
 */

import { z } from 'zod';

export const createCampaignSchema = z
  .object({
    name: z.string().min(1, 'Tên chiến dịch không được để trống'),
    description: z.string().optional(),
    startDate: z.string().min(1, 'Ngày bắt đầu không được để trống'),
    endDate: z.string().min(1, 'Ngày kết thúc không được để trống'),
    budget: z.number().min(0).optional(),
  })
  .refine(
    (data) => new Date(data.endDate) > new Date(data.startDate),
    { message: 'Ngày kết thúc phải sau ngày bắt đầu', path: ['endDate'] },
  );

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
