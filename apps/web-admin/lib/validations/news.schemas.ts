import { z } from 'zod';

export const newsCreateSchema = z.object({
  slug: z.string().min(1, 'Slug không được để trống'),
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Nội dung không được để trống'),
  featuredImage: z.string().optional().nullable(),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
  targetApps: z.string().optional(),
  isPublished: z.boolean().optional(),
});

export const newsUpdateSchema = newsCreateSchema.partial();

export type NewsCreateInput = z.infer<typeof newsCreateSchema>;
export type NewsUpdateInput = z.infer<typeof newsUpdateSchema>;
