/**
 * An Cư Lạc Nghiệp - Chính sách & Văn bản pháp luật
 * Nhà ở xã hội: mua, thuê mua, văn bản quy định
 */

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Chính sách & Văn bản pháp luật - Nhà ở xã hội',
  description:
    'Chính sách nhà ở xã hội, mua và thuê mua cho người lao động thu nhập thấp. Các văn bản quy định liên quan.',
  alternates: { canonical: '/an-cu-lac-nghiep/chinh-sach' },
};

const POLICIES = [
  { title: 'Chính sách mua nhà ở xã hội', desc: 'Điều kiện, đối tượng, trình tự thủ tục mua nhà ở xã hội.', icon: '🏠' },
  { title: 'Chính sách thuê mua nhà ở xã hội', desc: 'Quy định thuê mua, thanh toán dần, chuyển nhượng sau khi thanh toán.', icon: '📋' },
  { title: 'Đối tượng đủ điều kiện', desc: 'Người lao động thu nhập thấp, công nhân khu công nghiệp, cán bộ công chức.', icon: '👥' },
];

const VB_PHAP_LUAT = [
  { name: 'Luật Nhà ở 2023', code: 'Luật số 27/2023/QH15' },
  { name: 'Nghị định hướng dẫn Luật Nhà ở', code: 'Nghị định về nhà ở xã hội' },
  { name: 'Thông tư quy định chi tiết', code: 'Bộ Xây dựng' },
];

export default function ChinhSachPage(): JSX.Element {
  return (
    <div className="min-h-screen">
      <section className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-800 py-16 text-white">
        <div className="container mx-auto px-4">
          <h1 className="font-heading mb-4 text-3xl font-bold md:text-4xl">Chính sách & Văn bản pháp luật</h1>
          <p className="max-w-2xl text-emerald-100">
            Cập nhật chính sách nhà ở xã hội, văn bản quy định về mua và thuê mua nhà cho người lao động thu nhập thấp.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-xl font-semibold">Chính sách nhà ở xã hội</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {POLICIES.map((p) => (
            <div key={p.title} className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-md">
              <span className="mb-3 block text-4xl">{p.icon}</span>
              <h3 className="mb-2 font-semibold">{p.title}</h3>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
              <p className="mt-4 text-xs italic text-muted-foreground">(Nội dung chi tiết sẽ cập nhật từ CMS / văn bản)</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-xl font-semibold">Văn bản quy định liên quan</h2>
        <div className="space-y-4">
          {VB_PHAP_LUAT.map((vb) => (
            <div key={vb.code} className="flex items-center justify-between rounded-lg border bg-card p-4">
              <div>
                <h3 className="font-medium">{vb.name}</h3>
                <p className="text-sm text-muted-foreground">{vb.code}</p>
              </div>
              <span className="text-xs text-muted-foreground">Liên kết tới văn bản gốc</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border bg-muted/30 p-6">
        <p className="mb-4 text-sm text-muted-foreground">Cần tư vấn cụ thể về điều kiện và thủ tục mua nhà ở xã hội?</p>
        <Link
          href="/an-cu-lac-nghiep/tu-van"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-emerald-700"
        >
          Đăng ký tư vấn
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </section>

      <div className="mt-8">
        <Link href="/an-cu-lac-nghiep" className="text-sm font-medium text-emerald-600 hover:underline">
          ← Về tổng quan An Cư Lạc Nghiệp
        </Link>
      </div>
    </div>
  );
}
