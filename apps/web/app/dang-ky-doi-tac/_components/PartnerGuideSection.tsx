'use client';

import Link from 'next/link';
import { getPartnerGuide } from '@/lib/config/partner-guides';
import { getPartnerGuideMockups } from '@/lib/config/partner-guide-mockups';
import { GuideStepMockup } from './GuideStepMockup';
import type { BusinessGroupId } from '@/lib/config/partner-registration';

interface PartnerGuideSectionProps {
  groupId: BusinessGroupId;
  appStoreUrl?: string;
  googlePlayUrl?: string;
}

export function PartnerGuideSection({
  groupId,
  appStoreUrl = '#',
  googlePlayUrl = '#',
}: PartnerGuideSectionProps): JSX.Element {
  const guide = getPartnerGuide(groupId);
  const mockupItems = getPartnerGuideMockups(groupId);
  const mockupByStep = new Map(
    mockupItems.map((item) => [item.stepIndex, item.mockup])
  );

  return (
    <div className="space-y-6">
      {/* Tóm tắt */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-2 font-medium" style={{ color: '#1e3a5f' }}>{guide.groupTitle}</h3>
        <p className="text-sm text-slate-600">{guide.summary}</p>
        <p className="mt-2 text-xs text-slate-500">
          Thời gian xử lý: <span className="font-medium" style={{ color: '#FFB800' }}>{guide.estimatedDays}</span>
        </p>
      </div>

      {/* Hồ sơ cần chuẩn bị */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-3 font-medium text-slate-800">Hồ sơ cần chuẩn bị</h3>
        <ul className="list-inside list-disc space-y-1 text-sm text-slate-600">
          {guide.requirements.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>

      {/* Quy trình từng bước - có mockup iPhone + hướng dẫn chữ đỏ */}
      <div className="space-y-6">
        <h3 className="font-medium text-slate-800">Quy trình đăng ký (có minh họa)</h3>
        {guide.steps.map((step, i) => {
          const mockup = mockupByStep.get(i);
          if (mockup) {
            return <GuideStepMockup key={i} data={mockup} />;
          }
          return (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h4 className="mb-2 font-medium text-slate-800">{step.title}</h4>
              <p className="text-sm text-slate-600">{step.description}</p>
              {step.details && step.details.length > 0 && (
                <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-slate-600">
                  {step.details.map((d, j) => (
                    <li key={j}>{d}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {/* Lợi ích */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-3 font-medium text-slate-800">Lợi ích khi tham gia</h3>
        <ul className="space-y-2 text-sm text-slate-600">
          {guide.benefits.map((b, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-0.5 text-amber-500">✓</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Lưu ý */}
      {guide.notes && guide.notes.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-3 font-medium text-slate-800">Lưu ý</h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-600">
            {guide.notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Tải App Merchant */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-3 font-medium text-slate-800">Tải App Merchant</h3>
        <p className="mb-4 text-sm text-slate-600">
          Quản lý đơn hàng, sản phẩm và tương tác với khách qua App KODO Merchant.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={appStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50 hover:border-slate-300"
          >
            App Store
          </Link>
          <Link
            href={googlePlayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50 hover:border-slate-300"
          >
            Google Play
          </Link>
        </div>
      </div>

      {/* Cần hỗ trợ */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-2 font-medium text-slate-800">Cần hỗ trợ?</h3>
        <p className="text-sm text-slate-600">
          Liên hệ qua{' '}
          <Link href="/contact" className="font-medium underline-offset-4 hover:underline" style={{ color: '#FFB800' }}>
            trang Liên hệ
          </Link>{' '}
          hoặc{' '}
          <Link href="/partner" className="font-medium underline-offset-4 hover:underline" style={{ color: '#FFB800' }}>
            trang Đối tác
          </Link>
          . Email:{' '}
          <a
            href="mailto:merchant@kodo.vn"
            className="font-medium underline-offset-4 hover:underline"
            style={{ color: '#FFB800' }}
          >
            merchant@kodo.vn
          </a>
        </p>
      </div>
    </div>
  );
}
