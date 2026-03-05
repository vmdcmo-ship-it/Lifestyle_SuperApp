import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tìm bất động sản - Để lại nhu cầu mua thuê',
  description:
    'Bạn có nhu cầu mua hoặc thuê bất động sản? Để lại thông tin, chuyên viên sẽ liên hệ tư vấn và giới thiệu sản phẩm phù hợp.',
  keywords: [
    'tìm bất động sản',
    'mua nhà',
    'thuê nhà',
    'tư vấn bất động sản',
    'tìm nhà theo nhu cầu',
  ],
  alternates: { canonical: '/bat-dong-san/tim-bat-dong-san' },
  openGraph: {
    title: 'Tìm bất động sản theo nhu cầu - Lifestyle',
    description: 'Để lại thông tin mua/thuê BDS, nhận tư vấn và giới thiệu sản phẩm phù hợp.',
    url: '/bat-dong-san/tim-bat-dong-san',
    type: 'website',
  },
};

export default function TimBatDongSanLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return <>{children}</>;
}
