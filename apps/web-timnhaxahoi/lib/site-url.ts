/** Base URL công khai — ưu tiên env, fallback SPEC. */
export function siteBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://timnhaxahoi.com').replace(/\/$/, '');
}
