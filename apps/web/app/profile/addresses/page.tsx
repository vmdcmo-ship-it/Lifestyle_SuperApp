import type { Metadata } from 'next';
import { AddressesContent } from './addresses-content';

export const metadata: Metadata = {
  title: 'Địa chỉ của tôi - Lifestyle Super App',
  description: 'Quản lý địa chỉ giao hàng và thanh toán.',
  robots: { index: false, follow: false },
};

export default function AddressesPage(): JSX.Element {
  return <AddressesContent />;
}
