const { withSentryConfig } = require('@sentry/nextjs');

/** Standalone: bật mặc định trên Linux/macOS/CI; trên Windows tắt (copy trace dùng symlink → EPERM nếu chưa Developer Mode). Bật local: NEXT_STANDALONE=true. Tắt mọi nơi: NEXT_STANDALONE=false. */
const useStandalone =
  process.env.NEXT_STANDALONE === 'false' || process.env.NEXT_STANDALONE === '0'
    ? false
    : process.env.NEXT_STANDALONE === 'true' || process.env.NEXT_STANDALONE === '1'
      ? true
      : process.platform !== 'win32';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(useStandalone ? { output: 'standalone' } : {}),
  experimental: {
    instrumentationHook: true,
  },
};

module.exports = withSentryConfig(nextConfig, {
  silent: true,
  org: process.env.SENTRY_ORG || 'lifestyle',
  project: process.env.SENTRY_PROJECT || 'web-timnhaxahoi',
  disableServerWebpackPlugin: true,
  disableClientWebpackPlugin: true,
});
