/**
 * Nhà ở xã hội - Chính sách, dự án nhà ở xã hội cho người lao động
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { BdsBreadcrumb } from '../_components/bds-breadcrumb';
import { FaqJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'Nhà ở xã hội - Chính sách và dự án',
  description:
    'Chính sách nhà ở xã hội cho người lao động thu nhập thấp. Mua và thuê mua. Dự án, điều kiện, thủ tục.',
  keywords: [
    'nhà ở xã hội',
    'chính sách nhà ở xã hội',
    'thuê mua nhà',
    'điều kiện mua nhà ở xã hội',
  ],
  alternates: { canonical: '/bat-dong-san/nha-o-xa-hoi' },
  openGraph: {
    title: 'Nhà ở xã hội - Chính sách và dự án',
    description: 'Chính sách nhà ở xã hội, mua và thuê mua. Dự án, điều kiện, thủ tục.',
    url: '/bat-dong-san/nha-o-xa-hoi',
    type: 'website',
  },
};

const POLICIES = [
  { title: 'Chính sách mua nhà ở xã hội', desc: 'Điều kiện, đối tượng, trình tự thủ tục mua nhà ở xã hội.', icon: '🏠' },
  { title: 'Chính sách thuê mua', desc: 'Quy định thuê mua, thanh toán dần, chuyển nhượng sau khi thanh toán.', icon: '📋' },
  { title: 'Đối tượng đủ điều kiện', desc: 'Người lao động thu nhập thấp, công nhân khu công nghiệp.', icon: '👥' },
];

const FAQS = [
  {
    question: 'Ai được mua nhà ở xã hội?',
    answer:
      'Người lao động thu nhập thấp, công nhân làm việc tại khu công nghiệp, sĩ quan quân đội, công an, cán bộ công chức và các đối tượng khác theo quy định của Luật Nhà ở. Thu nhập và điều kiện nhà ở hiện tại phải đáp ứng các tiêu chí do Chính phủ quy định.',
  },
  {
    question: 'Mua nhà ở xã hội cần điều kiện gì?',
    answer:
      'Cần đủ điều kiện về đối tượng, thu nhập, chưa có nhà ở hoặc có nhà nhưng diện tích bình quân dưới mức tối thiểu. Cần có hộ khẩu thường trú tại địa phương nơi có dự án (trừ một số trường hợp đặc biệt). Các giấy tờ cụ thể do từng địa phương quy định.',
  },
  {
    question: 'Thời hạn chuyển nhượng nhà ở xã hội?',
    answer:
      'Theo Luật Nhà ở 2023, chủ sở hữu nhà ở xã hội được quyền chuyển nhượng sau khi đã thanh toán đủ tiền và hoàn thành thủ tục cấp Giấy chứng nhận. Thời hạn tối thiểu thường là 5 năm kể từ ngày cấp Giấy chứng nhận, tùy theo quy định của từng dự án và địa phương.',
  },
  {
    question: 'Thuê mua nhà ở xã hội là gì?',
    answer:
      'Thuê mua là hình thức người thuê trả tiền thuê hàng tháng, sau khi thanh toán đủ theo hợp đồng sẽ được chuyển sang sở hữu. Thời gian thuê mua thường từ 15–20 năm. Người thuê mua được hưởng quyền tương tự chủ sở hữu trong thời gian thuê mua.',
  },
];

export default function NhaOXaHoiPage(): JSX.Element {
  return (
    <div className="min-h-screen">
      <BdsBreadcrumb items={[{ label: 'Nhà ở xã hội', href: '/bat-dong-san/nha-o-xa-hoi' }]} />
      <FaqJsonLd faqs={FAQS} />
      <section className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-800 to-orange-800 py-16 text-white">
        <div className="container mx-auto px-4">
          <h1 className="font-heading mb-4 text-3xl font-bold md:text-4xl">Nhà ở xã hội</h1>
          <p className="max-w-2xl text-amber-100">
            Chính sách nhà ở xã hội cho người lao động thu nhập thấp. Mua và thuê mua nhà. Dự án, văn bản quy định.
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
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12 rounded-xl border bg-card p-6">
        <h2 className="mb-6 text-xl font-semibold">Câu hỏi thường gặp</h2>
        <dl className="space-y-6">
          {FAQS.map((faq, i) => (
            <div key={i} className="rounded-lg border border-amber-100 bg-amber-50/50 p-4">
              <dt className="font-semibold text-slate-800">{faq.question}</dt>
              <dd className="mt-2 text-sm text-muted-foreground">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mb-12 rounded-xl border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">Tin tức nhà ở xã hội</h2>
        <p className="mb-4 text-muted-foreground">
          Cập nhật tin tức, quy định mới, dự án nhà ở xã hội tại các tỉnh thành.
        </p>
        <Link
          href="/bat-dong-san/tin-bat-dong-san?tag=nha-o-xa-hoi"
          className="inline-flex items-center gap-2 font-medium text-amber-600 hover:underline"
        >
          Xem tin tức nhà ở xã hội
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </section>

      <section className="rounded-xl border bg-muted/30 p-6">
        <h2 className="mb-4 text-xl font-semibold">Đăng ký tư vấn</h2>
        <p className="mb-4 text-muted-foreground">
          Bạn muốn tư vấn mua hoặc thuê mua nhà ở xã hội? Đăng ký để nhận tư vấn từ chuyên viên.
        </p>
        <Link
          href="/bat-dong-san/tim-bat-dong-san"
          className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-3 font-semibold text-white transition-all hover:bg-amber-700"
        >
          Đăng ký tư vấn
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </section>

      <p className="mt-8 text-sm text-muted-foreground">
        <Link href="/bat-dong-san" className="font-medium text-amber-600 hover:underline">
          ← Về Bất động sản
        </Link>
      </p>
    </div>
  );
}
