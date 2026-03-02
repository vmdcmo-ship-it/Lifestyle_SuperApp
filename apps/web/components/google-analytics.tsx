'use client';

import Script from 'next/script';

// Type definitions for gtag
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * Google Analytics component - Optimized for PageSpeed
 *
 * Cấu hình:
 * 1. Thêm NEXT_PUBLIC_GA_MEASUREMENT_ID vào .env.local
 * 2. Format: G-XXXXXXXXXX (GA4) hoặc UA-XXXXXXXXX-X (Universal Analytics)
 *
 * Tối ưu:
 * - Strategy: afterInteractive (không chặn hydration)
 * - Chỉ load ở production
 * - Anonymize IP mặc định
 * - Web Vitals tracking
 *
 * @example
 * // .env.local
 * NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
 */
export function GoogleAnalytics(): JSX.Element | null {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // Không render nếu chưa có GA ID hoặc đang ở môi trường development
  if (!gaId || process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <>
      {/* Google Analytics gtag.js - Load after page interactive */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
              send_page_view: true,
              anonymize_ip: true,
              cookie_flags: 'SameSite=None;Secure',
            });
          `,
        }}
      />
      {/* Web Vitals tracking */}
      <Script
        id="google-analytics-web-vitals"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('load', function() {
              if ('web-vital' in window) return;
              // Track Core Web Vitals
              function sendToAnalytics(metric) {
                if (window.gtag) {
                  gtag('event', metric.name, {
                    event_category: 'Web Vitals',
                    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
                    event_label: metric.id,
                    non_interaction: true,
                  });
                }
              }
              // Observe performance entries if available
              if ('PerformanceObserver' in window) {
                try {
                  const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                      if (entry.entryType === 'largest-contentful-paint') {
                        sendToAnalytics({ name: 'LCP', value: entry.renderTime || entry.loadTime, id: entry.id });
                      }
                    }
                  });
                  observer.observe({ entryTypes: ['largest-contentful-paint'] });
                } catch (e) {
                  // Silent fail
                }
              }
            });
          `,
        }}
      />
    </>
  );
}

/**
 * Utility function để track custom events
 *
 * @param eventName - Tên event (vd: 'click_cta', 'add_to_cart')
 * @param eventParams - Parameters cho event
 *
 * @example
 * trackEvent('sign_up_click', {
 *   method: 'email',
 *   location: 'header'
 * });
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, string | number | boolean>
): void => {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).gtag('event', eventName, eventParams);
  }
};

/**
 * Utility function để track page views manually
 *
 * @param url - URL của page
 *
 * @example
 * trackPageView('/about');
 */
export const trackPageView = (url: string): void => {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};
