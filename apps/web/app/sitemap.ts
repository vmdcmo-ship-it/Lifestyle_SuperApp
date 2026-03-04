import type { MetadataRoute } from 'next';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_PREFIX = '/api/v1';

async function fetchSlugs(endpoint: string): Promise<string[]> {
  try {
    const url = `${API_BASE.replace(/\/$/, '')}${API_PREFIX}${endpoint}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = (await res.json()) as { items?: { slug: string }[] };
    return (json.items || []).map((i) => i.slug);
  } catch {
    return [];
  }
}

async function fetchAnCuArticleSlugs(): Promise<string[]> {
  try {
    const url = `${API_BASE.replace(/\/$/, '')}${API_PREFIX}/an-cu-lac-nghiep/articles?limit=100`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = (await res.json()) as { data?: { slug: string }[] };
    return (json.data ?? []).map((i) => i.slug);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://lifestyle-app.com';

  // Static pages (bao gồm đăng ký đối tác & tài xế)
  const routes = [
    '',
    '/about',
    '/contact',
    '/hop-tac',
    '/partner',
    '/dang-ky-doi-tac',
    '/signup/driver',
    '/car-rental',
    '/tai-ung-dung',
    '/privacy',
    '/terms',
    '/help',
  ].map((route) => ({
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

  // Shopping Mall (Luxury E-commerce)
  const shoppingMallRoutes = [
    '/shopping-mall',
    '/shopping-mall/gifting-concierge',
    '/shopping-mall/boutiques',
    '/shopping-mall/boutiques/1',
    '/shopping-mall/boutiques/2',
    '/shopping-mall/boutiques/3',
    '/shopping-mall/boutiques/6',
    '/shopping-mall/dang-ky-ban-hang',
    '/shopping-mall/dieu-khoan',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Spotlight silo (SEO)
  const spotlightRoutes = [
    '/spotlight',
    '/spotlight/an-uong',
    '/spotlight/diem-den',
    '/spotlight/phong-cach',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: 0.95,
  }));

  // Cộng đồng (Phase 3)
  const congDongRoutes = [
    '/the-thao',
    '/the-thao/tin-tuc',
    '/the-thao/clb-ban-chuyen-nghiep/tennis',
    '/the-thao/clb-ban-chuyen-nghiep/pickleball',
    '/the-thao/run-to-earn',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  // Pháp lý (Phase 3)
  const phapLyRoutes = [
    '/phap-ly',
    '/phap-ly/tieu-chuan-cong-dong',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // KODO Wealth (Phase 2)
  const wealthRoutes = [
    '/wealth',
    '/wealth/knowledge',
    '/wealth/tools',
    '/wealth/tools/retirement-calculator',
    '/wealth/tools/insurance-benefit-calc',
    '/wealth/products',
    '/wealth/consulting',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // An Cư Lạc Nghiệp (Nhà ở xã hội)
  const anCuRoutes = [
    '/an-cu-lac-nghiep',
    '/an-cu-lac-nghiep/chinh-sach',
    '/an-cu-lac-nghiep/bai-viet',
    '/an-cu-lac-nghiep/du-an',
    '/an-cu-lac-nghiep/tu-van',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Dynamic: An Cư bài viết (fetch từ API, fallback static)
  const anCuBaiVietSlugs = await fetchAnCuArticleSlugs();
  const anCuBaiVietSlugsFallback = anCuBaiVietSlugs.length > 0
    ? anCuBaiVietSlugs
    : [
        'dieu-kien-mua-nha-o-xa-hoi-2024',
        'thue-mua-nha-o-xa-hoi-uu-nhuoc-diem',
        'du-an-nha-o-xa-hoi-tphcm-moi-nhat',
        'nha-o-xa-hoi-binh-duong-gia-re',
      ];
  const anCuBaiVietUrls = anCuBaiVietSlugsFallback.map((slug) => ({
    url: `${baseUrl}/an-cu-lac-nghiep/bai-viet/${slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  // Dynamic: news, content, training (fetch slugs from API)
  const [newsSlugs, contentSlugs, trainingSlugs] = await Promise.all([
    fetchSlugs('/news/public/links?audience=USER&locale=vi'),
    fetchSlugs('/content/public/links?audience=USER&locale=vi'),
    fetchSlugs('/training/public/links?audience=USER&locale=vi'),
  ]);

  const newsUrls = newsSlugs.map((slug) => ({
    url: `${baseUrl}/news/${slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const contentUrls = contentSlugs.map((slug) => ({
    url: `${baseUrl}/content/${slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const trainingUrls = trainingSlugs.map((slug) => ({
    url: `${baseUrl}/training/${slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    ...routes,
    ...services,
    ...shoppingMallRoutes,
    ...spotlightRoutes,
    ...congDongRoutes,
    ...phapLyRoutes,
    ...wealthRoutes,
    ...anCuRoutes,
    ...anCuBaiVietUrls,
    ...newsUrls,
    ...contentUrls,
    ...trainingUrls,
  ];
}
