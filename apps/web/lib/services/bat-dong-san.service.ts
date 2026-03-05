export interface RentalListingPayload {
  fullName: string;
  phone: string;
  email?: string;
  type: 'owner' | 'agent';
  title: string;
  propertyType: string;
  location: string;
  price?: number;
  area?: number;
  description: string;
  contactNote?: string;
}

export interface FindRequestPayload {
  fullName: string;
  phone: string;
  email?: string;
  type: 'mua' | 'thue' | 'ca-hai';
  location?: string;
  note?: string;
}

export interface BdsArticle {
  slug: string;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  featuredImage?: string | null;
  publishedAt?: string | null;
}

export const batDongSanService = {
  /** Gửi yêu cầu đăng tin cho thuê (qua Next.js API route) */
  async submitRentalListing(data: RentalListingPayload): Promise<void> {
    const res = await fetch('/api/bat-dong-san/rental-listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { message?: string };
      throw new Error(err.message || 'Gửi thất bại');
    }
  },

  /** Gửi yêu cầu tìm bất động sản (qua Next.js API route) */
  async submitFindRequest(data: FindRequestPayload): Promise<void> {
    const res = await fetch('/api/bat-dong-san/find-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { message?: string };
      throw new Error(err.message || 'Gửi thất bại');
    }
  },

  /** Lấy danh sách bài viết (dùng Next.js API route có fallback) */
  async getArticles(limit = 50): Promise<BdsArticle[]> {
    const res = await fetch(`/api/bat-dong-san/articles?limit=${limit}`);
    if (!res.ok) return [];
    const json = (await res.json()) as { data?: BdsArticle[] };
    return json.data ?? [];
  },

  /** Lấy chi tiết bài viết theo slug */
  async getArticleBySlug(slug: string): Promise<BdsArticle | null> {
    const res = await fetch(`/api/bat-dong-san/articles/${encodeURIComponent(slug)}`);
    if (!res.ok) return null;
    return res.json();
  },
};
