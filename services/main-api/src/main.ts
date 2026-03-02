import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import { join } from 'path';
import { AppModule } from './app.module';
import { BigIntInterceptor } from './common/bigint.interceptor';
import { HttpExceptionFilter } from './common/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  const expressApp = app.getHttpAdapter().getInstance();
  // Phục vụ file tĩnh uploads — index: false tránh lỗi ENOENT khi truy cập /uploads/
  expressApp.use(
    '/uploads',
    express.static(join(process.cwd(), 'uploads'), { index: false }),
  );

  // Root redirect — tránh 404 khi truy cập api.vmd.asia/
  expressApp.get('/', (_req: express.Request, res: express.Response) => {
    res.redirect(302, '/docs');
  });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // CORS — localhost + production + Expo Go (exp://) + Zalo Mini App
  const corsOrigins = process.env.CORS_ORIGIN?.split(',').filter(Boolean) || [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002', // Zalo Mini App dev (khi chạy song song main-api :3000)
    'http://localhost:8081',
    'https://vmd.asia',
    'https://www.vmd.asia',
    'https://api.vmd.asia',
  ];
  const isZaloOrigin = (origin: string) =>
    /^https:\/\/([a-z0-9-]+\.)*(zalo\.me|zaloapp\.com|zalopay\.vn)(\/|$)/i.test(origin);

  app.enableCors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // Cho phép request không có Origin (app native, Postman, Zalo webview)
      if (
        corsOrigins.includes(origin) ||
        origin.startsWith('exp://') ||
        origin.startsWith('http://192.168.') ||
        isZaloOrigin(origin)
      ) {
        return cb(null, true);
      }
      cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });

  // Global BigInt -> Number interceptor (PostgreSQL BigInt columns)
  app.useGlobalInterceptors(new BigIntInterceptor());

  // Validation pipe (auto-validate DTOs)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Swagger — hiển thị CẢ HAI server để user chọn (Production + Local)
  const port = process.env.PORT || 3000;
  const productionUrl = process.env.API_BASE_URL || 'https://api.vmd.asia';
  const localUrl = `http://localhost:${port}`;

  const config = new DocumentBuilder()
    .setTitle('Lifestyle Super App API')
    .setDescription('MVP Backend - Auth, Booking, Spotlight, Drivers')
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addTag('Auth', 'Authentication & Authorization')
    .addTag('Users', 'User management')
    .addTag('Drivers', 'Tài xế - đăng ký, upload ảnh khuôn mặt/đại diện/giấy tờ')
    .addTag('Booking', 'Ride booking & driver matching')
    .addTag('Spotlight', 'Redcomments & Reviews')
    .addServer(productionUrl, 'Production (api.vmd.asia)')
    .addServer(localUrl, 'Local (localhost)')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // Giữ nguyên 2 servers đã add — không ghi đè
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      displayRequestDuration: true,
      filter: true,
    },
  });

  // Express error handler — bắt lỗi từ multer (Express middleware), Nest filter không bắt được
  expressApp.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const status = err?.status || err?.statusCode || 500;
    const msg = err?.message || err?.response?.message || 'Internal server error';
    const code = err?.code;
    const isMulterLimit = typeof code === 'string' && code.startsWith('LIMIT_');
    const isFileError = typeof msg === 'string' && (msg.includes('File không hợp lệ') || msg.includes('upload'));
    if (status >= 500) console.error('[Express Error]', { code, message: msg, stack: err?.stack?.slice?.(0, 300) });

    if (isMulterLimit || isFileError) {
      const fallback = code === 'LIMIT_FILE_SIZE' ? 'File quá lớn. Tối đa 5MB.' : msg;
      return res.status(400).json({ statusCode: 400, message: fallback, error: 'Bad Request' });
    }
    if (status >= 400 && status < 600) {
      return res.status(status).json({ statusCode: status, message: msg, error: status >= 500 ? 'Internal Server Error' : 'Bad Request' });
    }
    res.status(500).json({ statusCode: 500, message: msg, error: 'Internal Server Error' });
  });

  await app.listen(port);
  console.log(`
╔════════════════════════════════════════════════╗
║     Lifestyle Super App - MVP Backend          ║
║     Running on: http://localhost:${port}           ║
║     Swagger:    http://localhost:${port}/docs      ║
║     Environment: ${process.env.NODE_ENV || 'development'}              ║
╚════════════════════════════════════════════════╝
  `);
}
bootstrap();
