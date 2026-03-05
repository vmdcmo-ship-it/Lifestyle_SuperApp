'use client';

import { useEffect } from 'react';

/**
 * Gửi Core Web Vitals lên Google Analytics (khi có GA_ID)
 * Sử dụng thư viện web-vitals để đo chính xác LCP, FID, CLS, INP, TTFB
 */
export function WebVitalsReporter(): null {
  useEffect(() => {
    const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    if (!gaId || typeof window === 'undefined') return;

    const sendToAnalytics = (metric: { name: string; value: number; id: string }) => {
      const gtag = (window as { gtag?: (...args: unknown[]) => void }).gtag;
      if (gtag) {
        gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          non_interaction: true,
        });
      }
    };

    import('web-vitals').then(({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
      onCLS(sendToAnalytics);
      onINP(sendToAnalytics);
      onLCP(sendToAnalytics);
      onFCP(sendToAnalytics);
      onTTFB(sendToAnalytics);
    }).catch(() => {
      // web-vitals chưa cài -> bỏ qua
    });
  }, []);

  return null;
}
