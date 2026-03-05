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

async function fetchBatDongSanArticleSlugs(): Promise<string[]> {
  try {
    const url = `${API_BASE.replace(/\/$/, '')}${API_PREFIX}/bat-dong-san/articles?limit=100`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = (await res.json()) as { data?: { slug: string }[] };
    return (json.data ?? []).map((i) => i.slug);
  } catch {
    return [];
  }
}

// Production domain hardcode - đảm bảo sitemap luôn dùng vmd.asia (không phụ thuộc env)
const PRODUCTION_BASE = 'https://www.vmd.asia';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? PRODUCTION_BASE
      : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');

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

  // Bất động sản
  const batDongSanRoutes = [
    '/bat-dong-san',
    '/bat-dong-san/tin-bat-dong-san',
    '/bat-dong-san/nha-o-xa-hoi',
    '/bat-dong-san/du-an-chung-cu',
    '/bat-dong-san/nha-cho-thue',
    '/bat-dong-san/tim-bat-dong-san',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Dynamic: Tin cho thuê (fetch từ API, fallback static)
  const RENTAL_IDS_STATIC = ['1', '2', '3'];
  let bdsRentalIds: string[] = [];
  try {
    const rentalUrl = `${API_BASE.replace(/\/$/, '')}${API_PREFIX}/bat-dong-san/rental-listings?limit=100`;
    const rentalRes = await fetch(rentalUrl, { next: { revalidate: 3600 } });
    if (rentalRes.ok) {
      const rentalJson = (await rentalRes.json()) as { data?: { id: string }[] };
      bdsRentalIds = (rentalJson.data ?? []).map((i) => i.id);
    }
  } catch {
    bdsRentalIds = [];
  }
  const bdsRentalIdsFallback = bdsRentalIds.length > 0 ? bdsRentalIds : RENTAL_IDS_STATIC;
  const bdsRentalUrls = bdsRentalIdsFallback.map((id) => ({
    url: `${baseUrl}/bat-dong-san/nha-cho-thue/${id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  // Dynamic: Tin Bất Động Sản bài viết (fetch từ API, fallback static)
  const bdsArticleSlugs = await fetchBatDongSanArticleSlugs();
  const bdsArticleSlugsFallback = bdsArticleSlugs.length > 0
    ? bdsArticleSlugs
    : [
        'bat-dong-san-2024-xu-huong',
        'chinh-sach-lai-suat-moi-anh-huong-bds',
        'du-an-chung-cu-moi-khai-truong-tphcm',
        'nha-o-xa-hoi-quy-dinh-moi-2024',
      ];
  const bdsArticleUrls = bdsArticleSlugsFallback.map((slug) => ({
    url: `${baseUrl}/bat-dong-san/tin-bat-dong-san/${slug}`,
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
    ...batDongSanRoutes,
    ...bdsRentalUrls,
    ...bdsArticleUrls,
    ...newsUrls,
    ...contentUrls,
    ...trainingUrls,
  ];
}
