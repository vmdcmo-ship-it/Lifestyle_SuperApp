import type { MetadataRoute } from 'next';

const PRODUCTION_BASE = 'https://www.vmd.asia';

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? PRODUCTION_BASE
      : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/private/', '/login'],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/', '/bat-dong-san/', '/wealth/', '/spotlight/'],
        disallow: ['/api/', '/admin/', '/_next/', '/private/', '/login'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
