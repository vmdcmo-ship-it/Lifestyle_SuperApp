import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://lifestyle-app.com';

  // Static pages
  const routes = ['', '/about', '/contact', '/privacy', '/terms'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Service pages
  const services = [
    '/food-delivery',
    '/ride-hailing',
    '/shopping',
    '/wallet',
    '/savings-packages',
    '/lifestyle-xu',
    '/referral',
  ].map((service) => ({
    url: `${baseUrl}${service}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...routes, ...services];
}
