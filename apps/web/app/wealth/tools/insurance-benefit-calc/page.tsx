'use client';

import { useState } from 'react';
import Link from 'next/link';

const AGE_BANDS = [
  { min: 18, max: 30, suggestion: 'Gói cơ bản: BH y tế + BH nhân thọ tích lũy' },
  { min: 31, max: 45, suggestion: 'Gói mở rộng: Thêm BH bổ sung cho con, BH tai nạn' },
  { min: 46, max: 60, suggestion: 'Gói chuẩn bị nghỉ hưu: BH nhân thọ, BH sức khỏe cao cấp' },
  { min: 61, max: 99, suggestion: 'BH y tế, BH chăm sóc dài hạn' },
];

export default function InsuranceBenefitCalcPage(): JSX.Element {
  const [age, setAge] = useState<string>('35');
  const [hasFamily, setHasFamily] = useState(true);
  const [hasChild, setHasChild] = useState(true);

  const ageNum = parseInt(age, 10) || 0;
  const band = AGE_BANDS.find((b) => ageNum >= b.min && ageNum <= b.max);

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <nav className="mb-8 text-sm text-muted-foreground">
        <Link href="/wealth" className="hover:text-foreground">KODO Wealth</Link>
        <span className="mx-2">/</span>
        <Link href="/wealth/tools" className="hover:text-foreground">Công cụ</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Tính quyền lợi bảo hiểm</span>
      </nav>

      <h1 className="font-heading mb-2 text-3xl font-bold text-[#0D1B2A]">
        Công cụ tính quyền lợi bảo hiểm
      </h1>
      <p className="mb-8 text-muted-foreground">
        Nhập tuổi và nhu cầu để nhận gợi ý gói bảo hiểm phù hợp
      </p>

      <div className="space-y-6 rounded-2xl border border-amber-200/60 bg-white p-8">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#0D1B2A]">
            Tuổi hiện tại
          </label>
          <input
            type="number"
            min="18"
            max="99"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full rounded-lg border border-amber-200 px-4 py-2 focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={hasFamily}
              onChange={(e) => setHasFamily(e.target.checked)}
              className="rounded border-amber-300 text-[#D4AF37] focus:ring-[#D4AF37]"
            />
            <span className="text-sm">Có gia đình</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={hasChild}
              onChange={(e) => setHasChild(e.target.checked)}
              className="rounded border-amber-300 text-[#D4AF37] focus:ring-[#D4AF37]"
            />
            <span className="text-sm">Có con</span>
          </label>
        </div>

        {ageNum >= 18 && ageNum <= 99 && band && (
          <div className="rounded-xl bg-amber-50 p-6">
            <p className="mb-2 font-semibold text-[#0D1B2A]">Gợi ý gói bảo hiểm</p>
            <p className="mb-4 text-muted-foreground">{band.suggestion}</p>
            {hasChild && (
              <p className="text-sm text-[#D4AF37]">
                → Nên bổ sung BH giáo dục cho con
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-4">
        <Link
          href="/wealth/products"
          className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-5 py-2.5 font-medium text-[#0D1B2A] hover:bg-amber-500"
        >
          Xem danh mục sản phẩm
        </Link>
        <Link
          href="/wealth/consulting"
          className="rounded-lg border border-[#D4AF37] px-5 py-2.5 font-medium text-[#D4AF37] hover:bg-amber-50"
        >
          Đăng ký tư vấn 1-1
        </Link>
      </div>
    </div>
  );
}
