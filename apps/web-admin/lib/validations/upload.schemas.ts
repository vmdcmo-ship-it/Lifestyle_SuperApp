/** Giới hạn upload ảnh nội dung (news, training) - khớp với main-api contentImagesUploadConfig */
export const CONTENT_IMAGE_MAX_BYTES = 5 * 1024 * 1024; // 5MB
export const CONTENT_IMAGE_ACCEPT = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

/**
 * Validate file ảnh trước khi upload.
 * Trả về string lỗi hoặc null nếu hợp lệ.
 */
export function validateContentImageFile(file: File): string | null {
  if (!file.type || !CONTENT_IMAGE_ACCEPT.includes(file.type)) {
    return 'Chỉ chấp nhận ảnh JPEG, PNG, WebP, GIF';
  }
  if (file.size > CONTENT_IMAGE_MAX_BYTES) {
    return `Dung lượng tối đa ${CONTENT_IMAGE_MAX_BYTES / 1024 / 1024}MB`;
  }
  return null;
}
