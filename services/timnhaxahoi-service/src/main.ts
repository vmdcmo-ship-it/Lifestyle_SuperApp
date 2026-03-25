import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import { AppModule } from './app.module';

function initSentry(): void {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) {
    return;
  }
  Sentry.init({
    dsn,
    environment: process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0),
  });
}

initSentry();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',').map((s) => s.trim()) ?? true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('timnhaxahoi.com API')
    .setDescription('Satellite web — NOXH projects & eligibility')
    .setVersion('0.1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: 'JWT từ POST /ai/eligibility-check (dashboardToken)' },
      'dashboard-jwt',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Assertion họ C — main-api GET /api/v1/auth/satellite/timnhaxahoi/sync-assertion (xem docs/timnhaxahoi/JWT_CONTRACT.md)',
      },
      'auth-sync-assertion',
    )
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = parseInt(process.env.PORT ?? '3020', 10);
  await app.listen(port);
  console.warn(`timnhaxahoi-service http://localhost:${port}/api/v1 — docs /api/docs`);
}

bootstrap().catch((err: unknown) => {
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(err);
  }
  console.error(err);
  process.exit(1);
});
