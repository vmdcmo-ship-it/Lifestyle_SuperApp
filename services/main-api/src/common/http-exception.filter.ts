import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

/** MulterError có code: LIMIT_FILE_SIZE, LIMIT_UNEXPECTED_FILE, v.v. */
function isMulterError(e: unknown): e is { code: string; message: string } {
  return (
    typeof e === 'object' &&
    e !== null &&
    'code' in e &&
    typeof (e as any).code === 'string' &&
    String((e as any).code).startsWith('LIMIT_')
  );
}

/**
 * Chuyển lỗi multer/file upload và Error thông thường thành HTTP 400
 * thay vì 500, giúp client nhận thông báo rõ ràng.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'object' && res !== null && 'message' in res
        ? (res as any).message
        : String(res);
    } else if (isMulterError(exception)) {
      status = HttpStatus.BAD_REQUEST;
      message =
        exception.code === 'LIMIT_FILE_SIZE'
          ? 'File quá lớn. Tối đa 5MB cho ảnh đại diện và giấy tờ.'
          : `Lỗi upload: ${exception.message}`;
    } else if (exception instanceof Error) {
      // Lỗi từ fileFilter (Error) → trả 400 thay vì 500
      if (exception.message?.includes('File không hợp lệ') || exception.message?.includes('upload')) {
        status = HttpStatus.BAD_REQUEST;
        message = exception.message;
      } else {
        this.logger.error(exception.message, exception.stack);
      }
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: status >= 500 ? 'Internal Server Error' : 'Bad Request',
    });
  }
}
