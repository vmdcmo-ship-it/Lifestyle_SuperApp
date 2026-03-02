/**
 * OCR Service — xác thực loại giấy tờ bằng nhận diện chữ từ ảnh.
 *
 * Sử dụng tesseract.js (Node.js native OCR, tiếng Việt + tiếng Anh).
 * Khi OCR_ENABLED=false (mặc định) → bỏ qua xác thực, chấp nhận mọi ảnh.
 * Khi OCR_ENABLED=true → xác thực từ khóa; nếu sai loại → từ chối và yêu cầu chụp lại.
 *
 * Graceful degradation: nếu tesseract.js không cài hoặc timeout → soft-fail (chấp nhận).
 */
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';

/** Từ khóa nhận dạng từng loại giấy tờ (không phân biệt hoa/thường). */
const DOC_KEYWORDS: Record<string, string[]> = {
  citizen_front: [
    'CĂN CƯỚC CÔNG DÂN',
    'CAN CUOC CONG DAN',
    'CỘNG HÒA XÃ HỘI CHỦ NGHĨA',
    'SOCIALIST REPUBLIC',
    'CCCD',
    'Họ và tên',
    'Ho va ten',
  ],
  citizen_back: [
    'ĐẶC ĐIỂM NHẬN DẠNG',
    'DAC DIEM NHAN DANG',
    'NGÀY CẤP',
    'NGAY CAP',
    'Nơi cấp',
    'CĂN CƯỚC',
  ],
  license: [
    'GIẤY PHÉP LÁI XE',
    'GIAY PHEP LAI XE',
    'DRIVER LICENSE',
    'DRIVER\'S LICENSE',
    'GPLX',
    'Hạng',
    'HANG',
  ],
  registration: [
    'ĐĂNG KÝ XE',
    'DANG KY XE',
    'GIẤY CHỨNG NHẬN',
    'CERTIFICATE OF REGISTRATION',
    'Biển số',
    'BIEN SO',
    'Nhãn hiệu',
  ],
  insurance: [
    'BẢO HIỂM',
    'BAO HIEM',
    'TNDS',
    'HỢP ĐỒNG BẢO HIỂM',
    'HOP DONG BAO HIEM',
    'BẢO HIỂM XE CƠ GIỚI',
  ],
  criminal_record: [
    'LÝ LỊCH TƯ PHÁP',
    'LY LICH TU PHAP',
    'PHIẾU LÝ LỊCH',
    'PHIEU LY LICH',
    'Tư pháp',
    'Tu phap',
  ],
};

/** Loại ảnh không cần xác thực nội dung (ảnh phương tiện). */
const SKIP_VALIDATION = new Set([
  'vehicle_front',
  'vehicle_back',
  'vehicle_left',
  'vehicle_right',
  'vehicle_plate',
]);

/** Thông báo lỗi thân thiện khi ảnh sai loại. */
const OCR_ERROR_MESSAGES: Record<string, string> = {
  citizen_front:
    'Ảnh không phải CCCD mặt trước. Vui lòng chụp rõ MẶT TRƯỚC Căn cước công dân của bạn.',
  citizen_back:
    'Ảnh không phải CCCD mặt sau. Vui lòng chụp rõ MẶT SAU Căn cước công dân của bạn.',
  license:
    'Ảnh không phải Giấy phép lái xe (GPLX). Vui lòng chụp lại thẻ GPLX còn hạn của bạn.',
  registration:
    'Ảnh không phải Giấy đăng ký xe. Vui lòng chụp rõ giấy đăng ký xe của phương tiện.',
  insurance:
    'Ảnh không phải Bảo hiểm TNDS. Vui lòng chụp lại giấy bảo hiểm xe còn hiệu lực.',
  criminal_record:
    'Ảnh không phải Phiếu lý lịch tư pháp. Vui lòng chụp lại đúng phiếu lý lịch của bạn.',
};

export interface OcrValidationResult {
  valid: boolean;
  error?: string;
}

@Injectable()
export class OcrService {
  private readonly logger = new Logger(OcrService.name);
  /** Cache trạng thái tesseract.js: null=chưa kiểm tra, true=có, false=không có. */
  private tesseractAvailable: boolean | null = null;

  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (e: any) {
      this.logger.warn(`Không xóa được file ${filePath}: ${e?.message}`);
    }
  }

  /**
   * Xác thực ảnh giấy tờ qua OCR.
   * - Nếu OCR_ENABLED != 'true' → bỏ qua, trả valid: true.
   * - Nếu ảnh xe (vehicle_*) → bỏ qua, trả valid: true.
   * - Nếu OCR thất bại / timeout → soft-fail, trả valid: true.
   */
  async validateDocument(filePath: string, documentType: string): Promise<OcrValidationResult> {
    if (SKIP_VALIDATION.has(documentType)) {
      return { valid: true };
    }

    if (!DOC_KEYWORDS[documentType]) {
      return { valid: true };
    }

    if (process.env.OCR_ENABLED !== 'true') {
      this.logger.debug(
        `OCR_ENABLED != 'true'. Bỏ qua xác thực cho loại: ${documentType}.`,
      );
      return { valid: true };
    }

    if (this.tesseractAvailable === false) {
      this.logger.debug('tesseract.js không khả dụng. Bỏ qua xác thực.');
      return { valid: true };
    }

    let worker: any;
    try {
      // Dynamic require để graceful-degrade khi chưa npm install tesseract.js
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { createWorker } = require('tesseract.js');
      this.tesseractAvailable = true;

      worker = await createWorker(['vie', 'eng'], 1, {
        logger: () => {},
        errorHandler: () => {},
      });

      const ocrPromise = worker.recognize(filePath);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('OCR_TIMEOUT')), 20_000),
      );

      const result = await Promise.race([ocrPromise, timeoutPromise]);
      const upperText: string = (result as any).data.text.toUpperCase();

      const keywords = DOC_KEYWORDS[documentType] ?? [];
      const matched = keywords.some((kw) => upperText.includes(kw.toUpperCase()));

      if (!matched) {
        const errorMsg =
          OCR_ERROR_MESSAGES[documentType] ??
          'Ảnh không đúng loại giấy tờ yêu cầu. Vui lòng chụp lại.';
        this.logger.warn(
          `OCR từ chối ảnh: loại=${documentType}, không tìm thấy từ khóa phù hợp.`,
        );
        return { valid: false, error: errorMsg };
      }

      this.logger.log(`OCR xác thực thành công: loại=${documentType}`);
      return { valid: true };
    } catch (err: any) {
      if (
        err?.code === 'MODULE_NOT_FOUND' ||
        err?.message?.includes('Cannot find module')
      ) {
        this.tesseractAvailable = false;
        this.logger.warn(
          'tesseract.js chưa được cài. Bỏ qua OCR. Chạy: npm install tesseract.js trong main-api.',
        );
      } else if (err?.message === 'OCR_TIMEOUT') {
        this.logger.warn(`OCR timeout (>20s) cho ${documentType}. Chấp nhận ảnh.`);
      } else {
        this.logger.warn(`Lỗi OCR cho ${documentType}: ${err?.message}. Chấp nhận ảnh.`);
      }
      return { valid: true };
    } finally {
      if (worker) {
        await worker.terminate().catch(() => {});
      }
    }
  }
}
