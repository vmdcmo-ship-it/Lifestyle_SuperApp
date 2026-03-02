import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface SearchQuery {
  q: string;
  type?: 'all' | 'merchants' | 'products' | 'drivers';
  city?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  page?: number;
  limit?: number;
}

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: SearchQuery) {
    const { q, type = 'all', page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const results: any = {};

    if (type === 'all' || type === 'merchants') {
      const where: any = {
        deleted_at: null,
        status: 'ACTIVE',
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      };
      if (query.city) where.city = { contains: query.city, mode: 'insensitive' };

      const [merchants, merchantCount] = await Promise.all([
        this.prisma.merchants.findMany({
          where,
          select: {
            id: true,
            merchant_number: true,
            name: true,
            type: true,
            logo_url: true,
            rating_overall: true,
            total_reviews: true,
            full_address: true,
            latitude: true,
            longitude: true,
          },
          orderBy: { rating_overall: 'desc' },
          skip: type === 'merchants' ? skip : 0,
          take: type === 'merchants' ? limit : 5,
        }),
        this.prisma.merchants.count({ where }),
      ]);

      results.merchants = {
        data: merchants.map((m) => ({
          ...m,
          rating: Number(m.rating_overall),
          latitude: Number(m.latitude),
          longitude: Number(m.longitude),
          distance: query.lat && query.lng
            ? this.haversine(query.lat, query.lng, Number(m.latitude), Number(m.longitude))
            : null,
        })),
        total: merchantCount,
      };
    }

    if (type === 'all' || type === 'products') {
      const where: any = {
        isActive: true,
        deletedAt: null,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { tags: { has: q } },
        ],
      };

      const [products, productCount] = await Promise.all([
        this.prisma.product.findMany({
          where,
          select: {
            id: true,
            sku: true,
            name: true,
            price: true,
            thumbnailUrl: true,
            images: true,
            rating: true,
            totalSold: true,
            merchant: { select: { id: true, name: true } },
          },
          orderBy: { totalSold: 'desc' },
          skip: type === 'products' ? skip : 0,
          take: type === 'products' ? limit : 5,
        }),
        this.prisma.product.count({ where }),
      ]);

      results.products = {
        data: products.map((p) => ({
          ...p,
          price: Number(p.price),
          rating: Number(p.rating),
        })),
        total: productCount,
      };
    }

    return {
      query: q,
      results,
    };
  }

  async nearby(lat: number, lng: number, radius: number = 5, type?: string) {
    const where: any = { deleted_at: null, status: 'ACTIVE' };
    if (type) where.type = type;

    const merchants = await this.prisma.merchants.findMany({
      where,
      select: {
        id: true,
        name: true,
        type: true,
        logo_url: true,
        rating_overall: true,
        total_reviews: true,
        full_address: true,
        latitude: true,
        longitude: true,
        phone: true,
      },
    });

    const nearby = merchants
      .map((m) => ({
        ...m,
        rating: Number(m.rating_overall),
        latitude: Number(m.latitude),
        longitude: Number(m.longitude),
        distanceKm: this.haversine(lat, lng, Number(m.latitude), Number(m.longitude)),
      }))
      .filter((m) => m.distanceKm <= radius)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return {
      center: { lat, lng },
      radius,
      data: nearby,
      total: nearby.length,
    };
  }

  private haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 100) / 100;
  }
}
