'use client';

import { useState } from 'react';

interface Transaction {
  id: string;
  type: 'topup' | 'payment' | 'refund';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export function WalletContent() {
  const [balance] = useState(1250000); // Demo: 1,250,000 VND
  const [transactions] = useState<Transaction[]>([
    {
      id: 'TXN001',
      type: 'topup',
      amount: 500000,
      description: 'Nạp tiền qua MoMo',
      date: '2026-02-14T10:30:00',
      status: 'completed',
    },
    {
      id: 'TXN002',
      type: 'payment',
      amount: -85000,
      description: 'Thanh toán đơn hàng #ORD12345',
      date: '2026-02-13T15:20:00',
      status: 'completed',
    },
    {
      id: 'TXN003',
      type: 'payment',
      amount: -45000,
      description: 'Đặt xe đi Quận 1',
      date: '2026-02-13T09:15:00',
      status: 'completed',
    },
    {
      id: 'TXN004',
      type: 'refund',
      amount: 120000,
      description: 'Hoàn tiền đơn hàng #ORD12340',
      date: '2026-02-12T14:00:00',
      status: 'completed',
    },
    {
      id: 'TXN005',
      type: 'topup',
      amount: 1000000,
      description: 'Nạp tiền qua ZaloPay',
      date: '2026-02-10T08:45:00',
      status: 'completed',
    },
  ]);

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'topup':
        return '💰';
      case 'payment':
        return '🛒';
      case 'refund':
        return '↩️';
      default:
        return '💳';
    }
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'failed':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusText = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'Thành công';
      case 'pending':
        return 'Đang xử lý';
      case 'failed':
        return 'Thất bại';
      default:
        return 'N/A';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 py-16 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              💳 Ví Lifestyle
            </h1>
            <p className="mb-8 text-lg text-white/90 md:text-xl">
              Quản lý tài chính thông minh, thanh toán mọi dịch vụ trong hệ sinh thái
            </p>
          </div>
        </div>
      </section>

      {/* Balance Overview */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {/* Main Balance Card */}
            <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-8 text-white shadow-2xl">
              <div className="mb-2 text-sm font-medium text-white/80">
                Số dư khả dụng
              </div>
              <div className="mb-6 text-5xl font-bold">
                {balance.toLocaleString('vi-VN')} ₫
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="rounded-lg bg-white px-6 py-3 font-semibold text-purple-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl">
                  💰 Nạp tiền
                </button>
                <button className="rounded-lg bg-white/20 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/30">
                  🔄 Rút tiền
                </button>
                <button className="rounded-lg bg-white/20 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/30">
                  🔗 Liên kết ngân hàng
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                  Tổng nạp tháng này
                </div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  1,500,000 ₫
                </div>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                  Tổng chi tháng này
                </div>
                <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                  250,000 ₫
                </div>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                  Tiết kiệm được
                </div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  350,000 ₫
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-8 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-bold">💳 Phương thức thanh toán</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-2xl dark:bg-blue-900">
                      🏦
                    </div>
                    <div>
                      <div className="font-semibold">Vietcombank</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        **** **** **** 1234
                      </div>
                    </div>
                  </div>
                  <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900 dark:text-green-300">
                    Mặc định
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-2xl dark:bg-purple-900">
                      📱
                    </div>
                    <div>
                      <div className="font-semibold">MoMo</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Đã liên kết
                      </div>
                    </div>
                  </div>
                </div>
                <button className="w-full rounded-lg border-2 border-dashed border-gray-300 p-4 text-center font-semibold text-gray-600 transition-colors hover:border-purple-500 hover:text-purple-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-purple-400 dark:hover:text-purple-400">
                  + Thêm phương thức thanh toán
                </button>
              </div>
            </div>

            {/* Transaction History */}
            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">📊 Lịch sử giao dịch</h2>
                <button className="text-sm font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300">
                  Xem tất cả →
                </button>
              </div>

              <div className="space-y-3">
                {transactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-750"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-xl dark:bg-gray-700">
                        {getTransactionIcon(txn.type)}
                      </div>
                      <div>
                        <div className="font-semibold">{txn.description}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {new Date(txn.date).toLocaleString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-lg font-bold ${
                          txn.amount > 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {txn.amount > 0 ? '+' : ''}
                        {txn.amount.toLocaleString('vi-VN')} ₫
                      </div>
                      <div className={`text-xs ${getStatusColor(txn.status)}`}>
                        {getStatusText(txn.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-12 text-center text-3xl font-bold">
              ✨ Tính năng nổi bật của Ví Lifestyle
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon="🔒"
                title="Bảo mật tuyệt đối"
                description="Mã hóa 256-bit, xác thực 2 lớp, bảo vệ tài khoản của bạn"
              />
              <FeatureCard
                icon="⚡"
                title="Nạp/Rút siêu nhanh"
                description="Giao dịch hoàn tất trong vài giây, không phí ẩn"
              />
              <FeatureCard
                icon="🎁"
                title="Nhiều ưu đãi"
                description="Hoàn tiền, giảm giá khi thanh toán bằng Ví Lifestyle"
              />
              <FeatureCard
                icon="🔗"
                title="Liên kết đa dạng"
                description="Kết nối với mọi ngân hàng, MoMo, ZaloPay và các ví khác"
              />
              <FeatureCard
                icon="📊"
                title="Quản lý chi tiêu"
                description="Theo dõi chi tiêu, lập ngân sách thông minh"
              />
              <FeatureCard
                icon="🌐"
                title="Dùng mọi dịch vụ"
                description="Thanh toán tất cả dịch vụ trong hệ sinh thái Lifestyle"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-12 text-center text-white shadow-2xl">
            <h2 className="mb-4 text-3xl font-bold">Bắt đầu sử dụng Ví Lifestyle ngay!</h2>
            <p className="mb-8 text-lg text-white/90">
              Nạp tiền lần đầu nhận ngay 50,000₫ thưởng và voucher giảm giá 20%
            </p>
            <button className="rounded-lg bg-white px-8 py-4 text-lg font-bold text-purple-600 shadow-xl transition-all hover:scale-105 hover:shadow-2xl">
              💰 Nạp tiền ngay
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl dark:bg-gray-800">
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="mb-2 text-lg font-bold">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
