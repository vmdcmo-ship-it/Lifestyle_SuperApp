import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Lifestyle Super App',
    short_name: 'Lifestyle',
    description: 'Ứng dụng tổng hợp lifestyle hàng đầu tại Việt Nam',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#9333ea',
    orientation: 'portrait',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['lifestyle', 'food', 'shopping', 'transportation'],
    lang: 'vi',
    dir: 'ltr',
  };
}
