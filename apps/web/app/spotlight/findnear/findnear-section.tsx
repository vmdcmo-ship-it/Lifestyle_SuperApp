'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { FindnearBar } from './findnear-bar';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_PREFIX = '/api/v1';
const DEFAULT_RADIUS_KM = 7;
const MAX_SERVICES = 10;
const RADIUS_OPTIONS = [7, 10, 15, 20, 30] as const; // Đà Lạt & vùng xa: tối đa 30km
const LOCATION_CACHE_KEY = 'findnear_location';
const LOCATION_CACHE_TTL_MS = 30 * 60 * 1000; // 30 phút

interface NearbyService {
  id: string;
  name: string;
  type: string;
  full_address: string;
  distanceKm: number;
  rating: number;
  logo_url?: string | null;
}

function getCachedLocation(): { lat: number; lng: number } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LOCATION_CACHE_KEY);
    if (!raw) return null;
    const { lat, lng, ts } = JSON.parse(raw);
    if (Date.now() - ts > LOCATION_CACHE_TTL_MS) return null;
    return { lat, lng };
  } catch {
    return null;
  }
}

function setCachedLocation(lat: number, lng: number): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify({ lat, lng, ts: Date.now() }));
  } catch {}
}

export function FindnearSection(): JSX.Element {
  const [services, setServices] = useState<NearbyService[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentType, setCurrentType] = useState<string | undefined>();
  const [currentRadius, setCurrentRadius] = useState(DEFAULT_RADIUS_KM);
  const [lastSearch, setLastSearch] = useState<{ lat: number; lng: number; type?: string } | null>(null);

  const fetchNearby = useCallback(
    async (lat: number, lng: number, type?: string, radiusKm: number = DEFAULT_RADIUS_KM) => {
      setLoading(true);
      setHasSearched(true);
      setServices([]);
      setLastSearch({ lat, lng, type });
      setCurrentRadius(radiusKm);
      try {
        const params = new URLSearchParams({ lat: String(lat), lng: String(lng), radius: String(radiusKm) });
        if (type) params.set('type', type);
        const res = await fetch(`${API_BASE.replace(/\/$/, '')}${API_PREFIX}/search/nearby?${params}`);
        if (!res.ok) return;
        const json = await res.json();
        const data = (json.data ?? []) as NearbyService[];
        setServices(data.slice(0, MAX_SERVICES));
        setCachedLocation(lat, lng);
      } catch {
        setServices([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const handleLocationReady = useCallback(
    (lat: number, lng: number) => {
      setCachedLocation(lat, lng);
    },
    [],
  );

  const handleSearch = useCallback(
    ({ lat, lng, type }: { lat: number; lng: number; type?: string }) => {
      setCurrentType(type);
      fetchNearby(lat, lng, type, DEFAULT_RADIUS_KM);
    },
    [fetchNearby],
  );

  const handleTryRadius = useCallback(
    (radiusKm: number) => {
      if (lastSearch) {
        fetchNearby(lastSearch.lat, lastSearch.lng, lastSearch.type, radiusKm);
      }
    },
    [lastSearch, fetchNearby],
  );

  const showRadiusSuggestion = hasSearched && !loading && services.length < MAX_SERVICES && lastSearch;

  useEffect(() => {
    const cached = getCachedLocation();
    if (cached) {
      fetchNearby(cached.lat, cached.lng);
    }
  }, [fetchNearby]);

  return (
    <div className="space-y-4">
      <FindnearBar onSearch={handleSearch} onLocationReady={handleLocationReady} />

      {loading && (
        <div className="flex justify-center py-8">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
        </div>
      )}

      {!loading && hasSearched && (
        <div className="rounded-lg border bg-card">
          <h3 className="border-b px-4 py-3 font-semibold text-foreground">
            Dịch vụ gần bạn (bán kính {currentRadius} km)
          </h3>
          {services.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <p className="mb-4">Không tìm thấy dịch vụ trong {currentRadius} km.</p>
              <p className="mb-4 text-sm">Thử tăng bán kính (phù hợp vùng như Đà Lạt – điểm tham quan cách xa nhau):</p>
              <div className="flex flex-wrap justify-center gap-2">
                {RADIUS_OPTIONS.filter((r) => r > currentRadius).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleTryRadius(r)}
                    className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-800 transition-colors hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:hover:bg-emerald-900/60"
                  >
                    {r} km
                  </button>
                ))}
              </div>
            </div>
          ) : showRadiusSuggestion ? (
            <>
              <ul className="divide-y">
                {services.map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-muted/50">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground">{s.name}</p>
                      <p className="truncate text-sm text-muted-foreground">{s.full_address}</p>
                      <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                        📏 {s.distanceKm.toFixed(1)} km
                        {s.rating > 0 && ` · ⭐ ${s.rating.toFixed(1)}`}
                      </p>
                    </div>
                    <Link
                      href={`/spotlight?merchantId=${encodeURIComponent(s.id)}`}
                      className="shrink-0 rounded-md bg-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:hover:bg-emerald-900/60"
                    >
                      Xem video
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="border-t px-4 py-3">
                <p className="mb-2 text-sm text-muted-foreground">Chỉ có {services.length} kết quả. Thử tăng bán kính:</p>
                <div className="flex flex-wrap gap-2">
                  {RADIUS_OPTIONS.filter((r) => r > currentRadius).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleTryRadius(r)}
                      className="rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-800 transition-colors hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:hover:bg-emerald-900/60"
                    >
                      Thử {r} km
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <ul className="divide-y">
              {services.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-muted/50">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{s.name}</p>
                    <p className="truncate text-sm text-muted-foreground">{s.full_address}</p>
                    <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                      📏 {s.distanceKm.toFixed(1)} km
                      {s.rating > 0 && ` · ⭐ ${s.rating.toFixed(1)}`}
                    </p>
                  </div>
                  <Link
                    href={`/spotlight?merchantId=${encodeURIComponent(s.id)}`}
                    className="shrink-0 rounded-md bg-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:hover:bg-emerald-900/60"
                  >
                    Xem video
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
