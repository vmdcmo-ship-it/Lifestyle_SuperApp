'use client';

import { useState } from 'react';
import Link from 'next/link';

const INFLATION_RATE = 0.05;

export default function RetirementCalculatorPage(): JSX.Element {
  const [targetAmount, setTargetAmount] = useState<string>('3');
  const [yearsToRetire, setYearsToRetire] = useState<string>('25');
  const [monthlyExpense, setMonthlyExpense] = useState<string>('15');
  const [expectedReturn, setExpectedReturn] = useState<string>('8');

  const targetNum = parseFloat(targetAmount) || 0;
  const years = parseInt(yearsToRetire, 10) || 25;
  const expenseNum = (parseFloat(monthlyExpense) || 15) * 1_000_000;
  const returnRate = (parseFloat(expectedReturn) || 8) / 100;

  const targetVND = targetNum * 1_000_000_000;
  const futureValue = targetVND * Math.pow(1 + INFLATION_RATE, years);
  const monthlySave = futureValue / (years * 12);
  const withReturn =
    (futureValue * (returnRate / 12)) /
    (Math.pow(1 + returnRate / 12, years * 12) - 1);

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <nav className="mb-8 text-sm text-muted-foreground">
        <Link href="/wealth" className="hover:text-foreground">KODO Wealth</Link>
        <span className="mx-2">/</span>
        <Link href="/wealth/tools" className="hover:text-foreground">Công cụ</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Máy tính nghỉ hưu</span>
      </nav>

      <h1 className="font-heading mb-2 text-3xl font-bold text-[#0D1B2A]">
        Máy tính nghỉ hưu
      </h1>
      <p className="mb-8 text-muted-foreground">
        Tính số tiền cần tích lũy để đạt mục tiêu tài chính khi nghỉ hưu
      </p>

      <div className="space-y-6 rounded-2xl border border-amber-200/60 bg-white p-8">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#0D1B2A]">
            Số tiền mong muốn khi nghỉ hưu (tỷ VND)
          </label>
          <input
            type="number"
            min="0.5"
            step="0.5"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            className="w-full rounded-lg border border-amber-200 px-4 py-2 focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[#0D1B2A]">
            Số năm còn lại đến khi nghỉ hưu
          </label>
          <input
            type="number"
            min="5"
            max="50"
            value={yearsToRetire}
            onChange={(e) => setYearsToRetire(e.target.value)}
            className="w-full rounded-lg border border-amber-200 px-4 py-2 focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[#0D1B2A]">
            Chi phí sinh hoạt hiện tại (triệu VND/tháng)
          </label>
          <input
            type="number"
            min="5"
            value={monthlyExpense}
            onChange={(e) => setMonthlyExpense(e.target.value)}
            className="w-full rounded-lg border border-amber-200 px-4 py-2 focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[#0D1B2A]">
            Lợi nhuận kỳ vọng (%/năm)
          </label>
          <input
            type="number"
            min="0"
            max="20"
            step="0.5"
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(e.target.value)}
            className="w-full rounded-lg border border-amber-200 px-4 py-2 focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
          />
        </div>

        {targetNum > 0 && (
          <div className="space-y-3 rounded-xl bg-amber-50 p-6">
            <p className="font-semibold text-[#0D1B2A]">Kết quả (với lạm phát ~5%/năm)</p>
            <p>
              Số tiền cần tích lũy:{' '}
              <span className="font-bold text-[#D4AF37]">
                {(futureValue / 1_000_000_000).toFixed(1)} tỷ VND
              </span>
            </p>
            <p>
              Tiết kiệm đơn thuần: ~
              <span className="font-semibold">
                {Math.round(monthlySave / 1_000_000).toLocaleString('vi-VN')} triệu/tháng
              </span>
            </p>
            <p>
              Nếu đầu tư {expectedReturn}%/năm: ~
              <span className="font-semibold">
                {Math.round(withReturn / 1_000_000).toLocaleString('vi-VN')} triệu/tháng
              </span>
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-4">
        <Link
          href="/wealth/consulting"
          className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-5 py-2.5 font-medium text-[#0D1B2A] hover:bg-amber-500"
        >
          Tải bản kế hoạch chi tiết
        </Link>
        <Link
          href="/wealth"
          className="rounded-lg border border-[#D4AF37] px-5 py-2.5 font-medium text-[#D4AF37] hover:bg-amber-50"
        >
          Về KODO Wealth
        </Link>
      </div>
    </div>
  );
}
