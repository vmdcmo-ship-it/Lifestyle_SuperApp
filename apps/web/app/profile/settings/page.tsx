import type { Metadata } from 'next';
import { SettingsContent } from './settings-content';

export const metadata: Metadata = {
  title: 'Cài đặt - Lifestyle Super App',
  description: 'Quản lý cài đặt tài khoản và thông báo.',
  robots: { index: false, follow: false },
};

export default function SettingsPage(): JSX.Element {
  return <SettingsContent />;
}
