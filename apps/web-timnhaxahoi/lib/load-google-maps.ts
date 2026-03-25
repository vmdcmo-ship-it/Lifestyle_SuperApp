/** Tải script Maps (Places) một lần; dùng cho autocomplete địa chỉ. */
let loadPromise: Promise<void> | null = null;

export function loadGoogleMapsPlaces(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }
  const g = window as Window & { google?: { maps?: { places?: unknown } } };
  if (g.google?.maps?.places) {
    return Promise.resolve();
  }
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  if (!key) {
    return Promise.reject(new Error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set'));
  }
  if (loadPromise) {
    return loadPromise;
  }
  loadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-lifestyle-gmaps]');
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Google Maps script failed')), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.setAttribute('data-lifestyle-gmaps', '1');
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google Maps script failed'));
    document.head.appendChild(script);
  });
  return loadPromise;
}
