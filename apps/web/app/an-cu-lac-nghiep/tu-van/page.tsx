/**
 * An Cư Lạc Nghiệp - Đăng ký tư vấn mua nhà ở xã hội
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { AnCuConsultingForm } from '../_components/an-cu-consulting-form';

export const metadata: Metadata = {
  title: 'Đăng ký tư vấn nhà ở xã hội',
  description: 'Đăng ký nhận tư vấn mua và thuê mua nhà ở xã hội. TP.HCM, Bình Dương và các tỉnh thành.',
  alternates: { canonical: '/an-cu-lac-nghiep/tu-van' },
};

export default function TuVanPage(): JSX.Element {
  return (
    <div className="container mx-auto max-w-xl px-4 py-12">
      <nav className="mb-8 text-sm text-muted-foreground">
        <Link href="/an-cu-lac-nghiep" className="hover:text-foreground">An Cư Lạc Nghiệp</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Đăng ký tư vấn</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-heading mb-4 text-3xl font-bold text-foreground">
          Đăng ký tư vấn nhà ở xã hội
        </h1>
        <p className="text-muted-foreground">
          Để lại thông tin để nhận tư vấn về mua, thuê mua nhà ở xã hội tại TP.HCM, Bình Dương và các tỉnh thành
        </p>
      </div>

      <div className="rounded-2xl border border-emerald-200/60 bg-white p-8 dark:border-emerald-800/40">
        <AnCuConsultingForm />
      </div>

      <div className="mt-8">
        <Link href="/an-cu-lac-nghiep" className="text-sm font-medium text-emerald-600 hover:underline">
          Về An Cư Lạc Nghiệp
        </Link>
      </div>
    </div>
  );
}
