import { Metadata } from 'next';
import { DriverSignupWizard } from './driver-signup-wizard';

export const metadata: Metadata = {
  title: 'Đăng ký tài xế đối tác | Lifestyle Super App',
  description: 'Đăng ký làm tài xế đối tác với Lifestyle. Thu nhập hấp dẫn, linh hoạt thời gian.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DriverSignupPage() {
  return <DriverSignupWizard />;
}
