'use client';

import { IPhoneMockup } from '@/components/ui/iphone-mockup';
import type { GuideStepMockupData } from '@/lib/config/partner-guide-mockups';

/** Form mockup - Bước 1: Chọn nhóm & ngành */
function FormSelectScreen(): JSX.Element {
  return (
    <div className="space-y-4 p-4">
      <div className="rounded-lg border-2 border-slate-200 bg-white p-3" id="field-group">
        <p className="mb-1 text-[10px] font-medium text-slate-600">Nhóm kinh doanh *</p>
        <div className="rounded border border-slate-200 bg-white py-2 text-xs text-slate-700">
          Giao thức ăn — Quán ăn, nhà hàng...
        </div>
      </div>
      <div className="rounded-lg border-2 border-slate-200 bg-white p-3" id="field-subcategory">
        <p className="mb-1 text-[10px] font-medium text-slate-600">Ngành kinh doanh chi tiết *</p>
        <div className="rounded border border-slate-200 bg-white py-2 text-xs text-slate-700">Nhà hàng</div>
      </div>
    </div>
  );
}

/** Form mockup - Điền thông tin liên hệ */
function FormContactScreen(): JSX.Element {
  return (
    <div className="space-y-3 p-4">
      <div className="rounded-lg border-2 border-slate-200 bg-white p-2" id="field-store">
        <p className="mb-1 text-[10px] text-slate-600">Tên cửa hàng *</p>
        <div className="rounded border border-slate-200 bg-white py-1.5 text-[11px] text-slate-700">
          VD: Luxe Fashion Store
        </div>
      </div>
      <div className="rounded-lg border-2 border-slate-200 bg-white p-2" id="field-contact">
        <p className="mb-1 text-[10px] text-slate-600">Người liên hệ *</p>
        <div className="rounded border border-slate-200 bg-white py-1.5 text-[11px] text-slate-700">Họ và tên</div>
      </div>
      <div className="rounded-lg border-2 border-slate-200 bg-white p-2" id="field-email">
        <p className="mb-1 text-[10px] text-slate-600">Email *</p>
        <div className="rounded border border-slate-200 bg-white py-1.5 text-[11px] text-slate-700">
          email@example.com
        </div>
      </div>
      <div className="rounded-lg border-2 border-slate-200 bg-white p-2" id="field-phone">
        <p className="mb-1 text-[10px] text-slate-600">Số điện thoại *</p>
        <div className="rounded border border-slate-200 bg-white py-1.5 text-[11px] text-slate-700">0901234567</div>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-2" id="field-message">
        <p className="mb-1 text-[10px] text-slate-600">Mô tả (tùy chọn)</p>
        <div className="h-12 rounded border border-slate-200 bg-white text-[10px] text-slate-500">
          Giới thiệu sơ lược...
        </div>
      </div>
      <button
        type="button"
        className="w-full rounded-lg py-2.5 text-xs font-medium text-white"
        style={{ backgroundColor: '#FFB800' }}
      >
        Gửi đăng ký
      </button>
    </div>
  );
}

/** Form mockup - Điền tất cả (1 màn hình đầy đủ, scroll) */
function FormFullScreen(): JSX.Element {
  return (
    <div className="space-y-2 p-3">
      <p className="mb-2 text-center text-[10px] font-medium text-slate-400">
        KODO — Đăng ký đối tác
      </p>
      <div className="rounded border-2 border-slate-200 bg-white p-2" id="field-group">
        <p className="text-[9px] text-slate-600">Nhóm kinh doanh *</p>
        <div className="rounded border border-slate-200 bg-white py-1 text-[10px] text-slate-700">Chọn nhóm...</div>
      </div>
      <div className="rounded border-2 border-slate-200 bg-white p-2" id="field-subcategory">
        <p className="text-[9px] text-slate-600">Ngành chi tiết *</p>
        <div className="rounded border border-slate-200 bg-white py-1 text-[10px] text-slate-700">Chọn ngành...</div>
      </div>
      <div className="rounded border-2 border-slate-200 bg-white p-2" id="field-store">
        <p className="text-[9px] text-slate-600">Tên cửa hàng *</p>
        <div className="rounded border border-slate-200 bg-white py-1 text-[10px] text-slate-700">VD: Bếp nhà Mẹ</div>
      </div>
      <div className="rounded border-2 border-slate-200 bg-white p-2" id="field-contact">
        <p className="text-[9px] text-slate-600">Người liên hệ *</p>
        <div className="rounded border border-slate-200 bg-white py-1 text-[10px] text-slate-700">Nguyễn Văn A</div>
      </div>
      <div className="rounded border-2 border-slate-200 bg-white p-2" id="field-email">
        <p className="text-[9px] text-slate-600">Email *</p>
        <div className="rounded border border-slate-200 bg-white py-1 text-[10px] text-slate-700">contact@store.vn</div>
      </div>
      <div className="rounded border-2 border-slate-200 bg-white p-2" id="field-phone">
        <p className="text-[9px] text-slate-600">Số điện thoại *</p>
        <div className="rounded border border-slate-200 bg-white py-1 text-[10px] text-slate-700">0901234567</div>
      </div>
      <div className="rounded border border-slate-200 bg-white p-2" id="field-message">
        <p className="text-[9px] text-slate-600">Mô tả (tùy chọn)</p>
        <div className="h-8 rounded border border-slate-200 bg-white text-[9px] text-slate-500">Giới thiệu sơ lược...</div>
      </div>
      <button
        type="button"
        className="mt-2 w-full rounded-lg py-2 text-[11px] font-medium text-white"
        style={{ backgroundColor: '#FFB800' }}
      >
        Gửi đăng ký
      </button>
    </div>
  );
}

/** App Merchant - Thêm món / Sản phẩm */
function AppMenuScreen(): JSX.Element {
  return (
    <div className="space-y-3 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-800">KODO Merchant</span>
        <span className="text-[10px] text-slate-400">Menu</span>
      </div>
      <div className="rounded-lg border-2 border-slate-200 bg-white p-3" id="field-menu-name">
        <p className="mb-1 text-[10px] text-slate-600">Tên món *</p>
        <div className="rounded border border-slate-200 bg-white py-1.5 text-[11px] text-slate-700">VD: Phở bò đặc biệt</div>
      </div>
      <div className="rounded-lg border-2 border-slate-200 bg-white p-3" id="field-menu-price">
        <p className="mb-1 text-[10px] text-slate-600">Giá (VNĐ) *</p>
        <div className="rounded border border-slate-200 bg-white py-1.5 text-[11px] text-slate-700">45.000</div>
      </div>
      <div className="rounded-lg border-2 border-slate-200 bg-white p-3" id="field-menu-photo">
        <p className="mb-1 text-[10px] text-slate-600">Ảnh món</p>
        <div className="flex h-16 items-center justify-center rounded border-2 border-dashed border-slate-300 bg-white text-[10px] text-slate-500">
          + Thêm ảnh
        </div>
      </div>
      <button
        type="button"
        className="w-full rounded-lg py-2 text-xs font-medium text-white"
        style={{ backgroundColor: '#FFB800' }}
      >
        Thêm món
      </button>
    </div>
  );
}

/** App Merchant - Đơn hàng */
function AppOrdersScreen(): JSX.Element {
  return (
    <div className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-800">Đơn hàng mới</span>
      </div>
      <div className="space-y-2" id="orders">
        <div className="rounded-lg border border-slate-200 bg-green-50/50 p-3">
          <p className="text-[11px] font-medium text-slate-800">#ĐH-2026-001</p>
          <p className="text-[10px] text-slate-600">Phở bò x2, Trà đá x1</p>
          <p className="mt-1 text-[9px] text-green-600">Đang chờ xác nhận</p>
        </div>
      </div>
    </div>
  );
}

function renderScreen(type: GuideStepMockupData['screenType']): JSX.Element {
  switch (type) {
    case 'form_register':
      return <FormSelectScreen />;
    case 'form_contact':
      return <FormContactScreen />;
    case 'app_menu':
      return <AppMenuScreen />;
    case 'app_orders':
      return <AppOrdersScreen />;
    case 'generic':
    default:
      return <FormFullScreen />;
  }
}

interface GuideStepMockupProps {
  data: GuideStepMockupData;
}

export function GuideStepMockup({ data }: GuideStepMockupProps): JSX.Element {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h4 className="mb-2 font-medium" style={{ color: '#1e3a5f' }}>{data.stepTitle}</h4>
      {data.stepDescription && (
        <p className="mb-4 text-sm text-slate-600">{data.stepDescription}</p>
      )}

      <div className="relative flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-center lg:gap-4">
        {/* Chú thích bên trái — mũi tên nằm về phía mockup, chỉ vào ô */}
        <div className="order-2 flex w-full flex-col gap-3 lg:order-1 lg:w-52 lg:flex-shrink-0">
          {data.annotations
            .filter((a) => a.arrowSide === 'left')
            .sort((a, b) => a.order - b.order)
            .map((ann, i) => (
              <div
                key={`left-${i}`}
                className="relative flex items-center rounded-lg border border-slate-200 bg-slate-50 p-3 pr-12"
              >
                <p className="text-sm font-medium text-slate-800">{ann.text}</p>
                {/* SVG mũi tên hướng về phía mockup, chỉ vào ô */}
                <div className="absolute -right-2 top-1/2 flex -translate-y-1/2 items-center lg:-right-6">
                  <svg
                    width="48"
                    height="24"
                    viewBox="0 0 48 24"
                    fill="none"
                    className="text-slate-600"
                  >
                    <path
                      d="M2 12H44M44 12L34 6M44 12L34 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            ))}
        </div>

        {/* iPhone mockup ở giữa */}
        <div className="order-1 shrink-0 lg:order-2">
          <IPhoneMockup width={260}>{renderScreen(data.screenType)}</IPhoneMockup>
        </div>

        {/* Chú thích bên phải — mũi tên nằm về phía mockup, chỉ vào ô */}
        <div className="order-3 flex w-full flex-col gap-3 lg:w-52 lg:flex-shrink-0">
          {data.annotations
            .filter((a) => a.arrowSide === 'right')
            .sort((a, b) => a.order - b.order)
            .map((ann, i) => (
              <div
                key={`right-${i}`}
                className="relative flex items-center rounded-lg border border-slate-200 bg-slate-50 p-3 pl-12"
              >
                {/* SVG mũi tên hướng về phía mockup (trái), chỉ vào ô */}
                <div className="absolute -left-2 top-1/2 flex -translate-y-1/2 items-center lg:-left-6">
                  <svg
                    width="48"
                    height="24"
                    viewBox="0 0 48 24"
                    fill="none"
                    className="scale-x-[-1] text-slate-600"
                  >
                    <path
                      d="M2 12H44M44 12L34 6M44 12L34 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-800">{ann.text}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
