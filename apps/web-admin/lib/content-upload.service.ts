import { api } from './api/api';
import { API_ENDPOINTS } from './config/api';
import { validateContentImageFile } from './validations/upload.schemas';

/**
 * Upload ảnh cho nội dung (news, training).
 * Sử dụng endpoint /news/upload - dùng chung cho cả news và training.
 * Validate file trước khi gửi (type, size).
 */
export async function uploadContentImage(file: File): Promise<string> {
  const validationError = validateContentImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }
  const res = await api.upload<{ url: string }>(API_ENDPOINTS.NEWS.UPLOAD, file);
  return res.url;
}
