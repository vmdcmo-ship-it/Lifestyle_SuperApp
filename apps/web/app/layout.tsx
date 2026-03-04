import type { Metadata } from 'next';
import { Inter, Be_Vietnam_Pro, Playfair_Display } from 'next/font/google';
import '../styles/globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { GoogleAnalytics } from '@/components/google-analytics';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter',
});

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-heading',
});

const playfair = Playfair_Display({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: {
    default: 'Lifestyle Super App - Giải pháp tổng hợp cho cuộc sống hiện đại',
    template: '%s | Lifestyle Super App',
  },
  description:
    'Ứng dụng tổng hợp lifestyle hàng đầu tại Việt Nam - Giao đồ ăn, đặt xe, mua sắm, thanh toán và nhiều hơn nữa trong một nền tảng duy nhất.',
  keywords: [
    'lifestyle app',
    'food delivery',
    'ride hailing',
    'e-commerce',
    'lifestyle wallet',
    'savings packages',
    'lifestyle xu',
    'super app vietnam',
  ],
  authors: [{ name: 'Lifestyle Super App Team' }],
  creator: 'Lifestyle Super App',
  publisher: 'Lifestyle Super App',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://lifestyle-app.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: '/',
    title: 'Lifestyle Super App - Giải pháp tổng hợp cho cuộc sống hiện đại',
    description:
      'Ứng dụng tổng hợp lifestyle hàng đầu tại Việt Nam - Giao đồ ăn, đặt xe, mua sắm, thanh toán và nhiều hơn nữa.',
    siteName: 'Lifestyle Super App',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Lifestyle Super App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lifestyle Super App - Giải pháp tổng hợp cho cuộc sống hiện đại',
    description:
      'Ứng dụng tổng hợp lifestyle hàng đầu tại Việt Nam - Giao đồ ăn, đặt xe, mua sắm, thanh toán và nhiều hơn nữa.',
    images: ['/og-image.png'],
    creator: '@lifestyleapp',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    // yandex: 'yandex-verification-code',
    // yahoo: 'yahoo-verification-code',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
      },
    ],
  },
  manifest: '/site.webmanifest',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="vi" className={`light ${inter.variable} ${beVietnamPro.variable} ${playfair.variable}`}>
      <head>
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Local fonts: place .woff2 files in public/fonts/ and preload here when needed */}
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <GoogleAnalytics />
        <Providers>
        <div className="relative flex min-h-screen flex-col">
          <Header />
          
          <main className="flex-1">{children}</main>
          
          <Footer />
        </div>
        </Providers>
      </body>
    </html>
  );
}
