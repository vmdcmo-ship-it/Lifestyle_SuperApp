/** Base URL công khai — ưu tiên biến môi trường, mặc định timnhaxahoi.com. */
export function siteBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://timnhaxahoi.com').replace(/\/$/, '');
}
