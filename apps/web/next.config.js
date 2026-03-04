const path = require('path');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Production optimizations
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  
  // Experimental features
  experimental: {
    // Monorepo: trỏ trace về root để tìm đúng node_modules
    outputFileTracingRoot: path.join(__dirname, '../../'),
    // Enable Server Actions
    serverActions: {
      allowedOrigins: ['localhost:3000', 'vmd.asia', 'www.vmd.asia'],
    },
    // Optimize package imports
    optimizePackageImports: ['lucide-react', '@lifestyle/design-system'],
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: '**.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true,
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Webpack configuration
  webpack: (config, { isServer, dev }) => {
    // Tắt cache webpack khi dev để tránh lỗi "Cannot read properties of undefined (reading 'call')"
    if (dev) {
      config.cache = false;
    }
    // Optimize bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Security headers
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
        ],
      },
      {
        // Cache static assets
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache images
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache Next.js static files
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      // SEO: chuyển /cong-dong → /the-thao (301 permanent)
      { source: '/cong-dong', destination: '/the-thao', permanent: true },
      { source: '/cong-dong/:path*', destination: '/the-thao/:path*', permanent: true },
    ];
  },

  // Rewrites
  async rewrites() {
    return [
      // Add any rewrites here
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
