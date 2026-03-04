'use client';

import { useState } from 'react';

const RADIUS_KM = 7;
const MAX_RESULTS = 10;

interface FindnearBarProps {
  onSearch?: (params: { lat: number; lng: number; type?: string }) => void;
  onLocationReady?: (lat: number, lng: number) => void;
  categories?: { id: string; name: string; type?: string; icon: string }[];
}

const DEFAULT_CATEGORIES = [
  { id: '', name: 'Tất cả', type: undefined, icon: '📍' },
  { id: 'cafe', name: 'Cà phê', type: 'CAFE', icon: '☕' },
  { id: 'restaurant', name: 'Nhà hàng', type: 'RESTAURANT', icon: '🍜' },
  { id: 'pharmacy', name: 'Nhà thuốc', type: 'PHARMACY', icon: '💊' },
  { id: 'beauty', name: 'Spa & Làm đẹp', type: 'BEAUTY', icon: '💆' },
  { id: 'other', name: 'Khác', type: 'OTHER', icon: '🏪' },
];

export function FindnearBar({
  onSearch,
  onLocationReady,
  categories = DEFAULT_CATEGORIES,
}: FindnearBarProps): JSX.Element {
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState<string | undefined>();
  const [expandCategories, setExpandCategories] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleNearMe = () => {
    setIsLoading(true);
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError('Trình duyệt không hỗ trợ định vị');
      setIsLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        onLocationReady?.(lat, lng);
        onSearch?.({ lat, lng, type: selectedType });
        setIsLoading(false);
      },
      () => {
        setLocationError('Không lấy được vị trí. Kiểm tra quyền truy cập.');
        setIsLoading(false);
      },
    );
  };

  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 px-4 py-3 dark:border-emerald-800 dark:bg-emerald-950/20">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-base" aria-hidden="true">📍</span>
        <span className="font-semibold text-emerald-800 dark:text-emerald-200">Findnear</span>
        <span className="text-sm text-muted-foreground">— Tìm dịch vụ gần bạn (bán kính {RADIUS_KM} km)</span>

        <div className="ml-auto flex items-center gap-2">
          <input
            type="search"
            placeholder="Tìm dịch vụ..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-40 rounded-md border border-emerald-200 bg-white px-2 py-1.5 text-sm dark:border-emerald-700 dark:bg-emerald-950/30"
          />
          <div className="relative">
            <button
              type="button"
              onClick={() => setExpandCategories(!expandCategories)}
              className="flex items-center gap-1 rounded-md border border-emerald-200 bg-white px-2 py-1.5 text-sm dark:border-emerald-700 dark:bg-emerald-950/30"
            >
              <span>▼</span>
              <span>{categories.find((c) => c.type === selectedType)?.name || 'Danh mục'}</span>
            </button>
            {expandCategories && (
              <div className="absolute right-0 top-full z-30 mt-1 min-w-[160px] rounded-lg border bg-background py-2 shadow-lg">
                {categories.map((c) => (
                  <button
                    key={c.id || 'all'}
                    type="button"
                    onClick={() => {
                      setSelectedType(c.type);
                      setExpandCategories(false);
                    }}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-muted"
                  >
                    <span className="mr-2">{c.icon}</span>
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleNearMe}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <span>📍</span>
            )}
            Gần tôi
          </button>
        </div>
      </div>
      {locationError ? (
        <p className="mt-2 text-sm text-destructive">{locationError}</p>
      ) : null}
    </div>
  );
}
