'use client';

import { useState } from 'react';
import Link from 'next/link';

const INFLATION_RATE = 0.05;
const YEARS_TO_RETIRE = 25;
const MONTHLY_EXPENSE_NOW = 15000000;

export function WealthHeroCalculator(): JSX.Element {
  const [targetAmount, setTargetAmount] = useState<string>('3');
  const [showResult, setShowResult] = useState(false);

  const targetNum = parseFloat(targetAmount) || 0;
  const targetVND = targetNum * 1_000_000_000;
  const futureValue = targetVND * Math.pow(1 + INFLATION_RATE, YEARS_TO_RETIRE);
  const monthlySave = futureValue / (YEARS_TO_RETIRE * 12);

  const handleCalculate = (): void => {
    setShowResult(true);
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-amber-500/30 bg-white/10 p-6 backdrop-blur-sm">
      <div className="mb-4">
        <label htmlFor="target-amount" className="mb-2 block text-sm font-medium text-white/90">
          Số tiền mong muốn khi nghỉ hưu (tỷ VND)
        </label>
        <div className="flex items-center gap-2">
          <input
            id="target-amount"
            type="number"
            min="0.5"
            step="0.5"
            value={targetAmount}
            onChange={(e) => {
              setTargetAmount(e.target.value);
              setShowResult(false);
            }}
            className="w-full rounded-lg border border-amber-500/40 bg-white/20 px-4 py-3 text-lg font-semibold text-white placeholder-white/50 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
            placeholder="3"
          />
          <span className="text-white/80">tỷ</span>
        </div>
      </div>
      <button
        type="button"
        onClick={handleCalculate}
        className="w-full rounded-lg bg-[#D4AF37] px-4 py-3 font-semibold text-[#0D1B2A] transition-all hover:bg-amber-400 hover:shadow-lg"
      >
        Tính toán
      </button>

      {showResult && targetNum > 0 && (
        <div className="mt-6 rounded-xl border border-amber-500/20 bg-white/5 p-4">
          <p className="mb-2 text-sm text-white/80">Với lạm phát ~5%/năm, trong 25 năm:</p>
          <p className="mb-1 text-lg font-bold text-[#D4AF37]">
            Cần tích lũy:{' '}
            {(futureValue / 1_000_000_000).toFixed(1)} tỷ VND
          </p>
          <p className="mb-4 text-sm text-white/80">
            ≈ {Math.round(monthlySave / 1_000_000).toLocaleString('vi-VN')} triệu/tháng
          </p>
          <Link
            href="/wealth/tools/retirement-calculator"
            className="inline-block text-sm font-medium text-[#D4AF37] underline hover:no-underline"
          >
            Chi tiết công cụ tính nghỉ hưu →
          </Link>
        </div>
      )}

      <p className="mt-4 text-center text-xs text-white/60">
        Tải bản kế hoạch tài chính chi tiết (yêu cầu để lại thông tin)
      </p>
      <Link
        href="/wealth/consulting"
        className="mt-2 flex justify-center text-sm font-medium text-[#D4AF37] underline hover:no-underline"
      >
        Đăng ký nhận PDF →
      </Link>
    </div>
  );
}
