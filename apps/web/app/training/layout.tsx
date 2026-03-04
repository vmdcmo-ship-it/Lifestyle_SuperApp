import { ContentLayout3Col } from '@/components/layout/content-layout-3-col';

const TRAINING_LEFT_NAV = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Đào tạo', href: '/training' },
  { label: 'KODO Wealth', href: '/wealth' },
  { label: 'Thể thao', href: '/the-thao' },
  { label: 'Hợp tác', href: '/hop-tac' },
];

export default function TrainingLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <ContentLayout3Col leftNav={TRAINING_LEFT_NAV}>
      {children}
    </ContentLayout3Col>
  );
}
