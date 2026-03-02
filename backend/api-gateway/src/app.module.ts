import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';

const SERVICES = {
  mainApi: process.env.MAIN_API_URL || 'http://localhost:4000',
  userService: process.env.USER_SERVICE_URL || 'http://localhost:4001',
  paymentService: process.env.PAYMENT_SERVICE_URL || 'http://localhost:4002',
  notificationService: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:4003',
};

@Module({})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        createProxyMiddleware({
          target: SERVICES.mainApi,
          changeOrigin: true,
          pathRewrite: { '^/api/v1': '/api/v1' },
          on: {
            proxyReq: (proxyReq, req) => {
              if (req.headers.authorization) {
                proxyReq.setHeader('authorization', req.headers.authorization);
              }
            },
          },
        }),
      )
      .forRoutes(
        'v1/auth/*',
        'v1/users/*',
        'v1/booking/*',
        'v1/drivers/*',
        'v1/merchants/*',
        'v1/orders/*',
        'v1/wallet/*',
        'v1/addresses/*',
        'v1/spotlight/*',
        'v1/notifications/*',
        'v1/loyalty/*',
        'v1/insurance/*',
        'v1/search/*',
      );
  }
}
