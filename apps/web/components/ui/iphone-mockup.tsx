'use client';

/**
 * iPhone mockup - thiết kế theo iPhone 14/15
 * Tỷ lệ thực tế: ~71.5mm x 147.5mm (rộng x cao)
 * aspect-ratio ~ 1 : 2.06 (width : height)
 */

interface IPhoneMockupProps {
  children: React.ReactNode;
  className?: string;
  /** Chiều rộng cố định — dùng để giữ tỷ lệ chính xác */
  width?: number;
}

const PHONE_ASPECT_RATIO = 71.5 / 147.5; // width / height (tỷ lệ thực iPhone 14/15)

export function IPhoneMockup({
  children,
  className = '',
  width = 260,
}: IPhoneMockupProps): JSX.Element {
  return (
    <div
      className={`relative mx-auto flex justify-center ${className}`}
      style={{
        width,
        flexShrink: 0,
      }}
    >
      {/* Khung iPhone — khóa aspect-ratio để không bị bóp méo */}
      <div
        className="relative overflow-hidden rounded-[2.8rem] border-[8px] border-slate-800 bg-black shadow-2xl shadow-black/60"
        style={{
          aspectRatio: PHONE_ASPECT_RATIO,
          width: '100%',
        }}
      >
        {/* Notch - pill shape giống iPhone X/14 */}
        <div className="absolute left-1/2 top-0 z-10 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-black" />

        {/* Màn hình */}
        <div className="absolute inset-[10px] overflow-hidden rounded-[1.5rem] bg-slate-100 pt-3">
          <div className="h-full min-h-0 overflow-y-auto bg-white">{children}</div>
        </div>

        {/* Nút bên trái - volume, silent */}
        <div className="absolute -left-0.5 top-[28%] h-14 w-1 rounded-l bg-slate-700" />
        <div className="absolute -left-0.5 top-[42%] h-8 w-1 rounded-l bg-slate-700" />
        <div className="absolute -left-0.5 top-[52%] h-8 w-1 rounded-l bg-slate-700" />
        {/* Nút bên phải - power */}
        <div className="absolute -right-0.5 top-[38%] h-20 w-1 rounded-r bg-slate-700" />
      </div>
    </div>
  );
}
