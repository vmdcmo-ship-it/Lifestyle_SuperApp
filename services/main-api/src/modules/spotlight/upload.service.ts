import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

// ─── Allowed file types ──────────────────────────────────────────────────────

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'video/avi',
];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

// ─── Service ─────────────────────────────────────────────────────────────────

@Injectable()
export class UploadService {
  private readonly uploadDir: string;

  constructor(private readonly config: ConfigService) {
    this.uploadDir = this.config.get('UPLOAD_DEST', './uploads');
    this.ensureDirectories();
  }

  /**
   * Tạo các thư mục upload nếu chưa có
   */
  private ensureDirectories(): void {
    const dirs = [
      this.uploadDir,
      path.join(this.uploadDir, 'images'),
      path.join(this.uploadDir, 'videos'),
      path.join(this.uploadDir, 'thumbnails'),
      path.join(this.uploadDir, 'avatars'),
    ];

    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  }

  /**
   * Upload ảnh - lưu vào ổ cứng local
   * (Sau chuyển sang Cloud Storage: S3/GCS/Cloudinary)
   */
  async uploadImage(
    file: Express.Multer.File,
    subfolder = 'images',
  ): Promise<{
    url: string;
    originalName: string;
    size: number;
    mimeType: string;
  }> {
    // Validate
    if (!file) {
      throw new BadRequestException('Không có file nào được upload');
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `Định dạng không hỗ trợ. Chỉ chấp nhận: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
      );
    }

    if (file.size > MAX_IMAGE_SIZE) {
      throw new BadRequestException(
        `File quá lớn. Tối đa ${MAX_IMAGE_SIZE / 1024 / 1024}MB`,
      );
    }

    // Generate unique filename
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${uuidv4()}${ext}`;
    const filePath = path.join(this.uploadDir, subfolder, filename);

    // Save file
    fs.writeFileSync(filePath, file.buffer);

    // Return URL (localhost in dev, CDN in production)
    const baseUrl = `http://localhost:${this.config.get('PORT', 3000)}`;

    return {
      url: `${baseUrl}/uploads/${subfolder}/${filename}`,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
    };
  }

  /**
   * Upload video - lưu vào ổ cứng local
   */
  async uploadVideo(
    file: Express.Multer.File,
  ): Promise<{
    url: string;
    originalName: string;
    size: number;
    mimeType: string;
  }> {
    if (!file) {
      throw new BadRequestException('Không có file nào được upload');
    }

    if (!ALLOWED_VIDEO_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `Định dạng video không hỗ trợ. Chỉ chấp nhận: ${ALLOWED_VIDEO_TYPES.join(', ')}`,
      );
    }

    if (file.size > MAX_VIDEO_SIZE) {
      throw new BadRequestException(
        `Video quá lớn. Tối đa ${MAX_VIDEO_SIZE / 1024 / 1024}MB`,
      );
    }

    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${uuidv4()}${ext}`;
    const filePath = path.join(this.uploadDir, 'videos', filename);

    fs.writeFileSync(filePath, file.buffer);

    const baseUrl = `http://localhost:${this.config.get('PORT', 3000)}`;

    return {
      url: `${baseUrl}/uploads/videos/${filename}`,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
    };
  }

  /**
   * Upload nhiều file cùng lúc
   */
  async uploadMultiple(
    files: Express.Multer.File[],
    type: 'image' | 'video' = 'image',
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Không có file nào');
    }

    if (files.length > 10) {
      throw new BadRequestException('Tối đa 10 files mỗi lần upload');
    }

    const results = [];
    for (const file of files) {
      if (type === 'video') {
        results.push(await this.uploadVideo(file));
      } else {
        results.push(await this.uploadImage(file));
      }
    }

    return {
      count: results.length,
      files: results,
    };
  }

  /**
   * Xoá file
   */
  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      // Extract path from URL
      const urlPath = new URL(fileUrl).pathname;
      const filePath = path.join(
        process.cwd(),
        urlPath.replace(/^\//, ''),
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}
