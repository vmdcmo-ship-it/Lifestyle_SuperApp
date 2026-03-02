import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng ký thành công | Lifestyle Driver',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DriverSignupSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 px-4 dark:from-gray-900 dark:to-gray-850">
      <div className="max-w-2xl text-center">
        <div className="mb-8 rounded-2xl bg-white p-12 shadow-2xl dark:bg-gray-800">
          {/* Success Icon */}
          <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-5xl text-white">
            ✓
          </div>

          <h1 className="mb-4 text-3xl font-bold">
            🎉 Đăng ký thành công!
          </h1>
          
          <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
            Cảm ơn bạn đã đăng ký làm tài xế đối tác với Lifestyle.
            Hồ sơ của bạn đang được xét duyệt.
          </p>

          {/* Next Steps */}
          <div className="mb-8 rounded-xl border-2 border-blue-200 bg-blue-50 p-6 text-left dark:border-blue-800 dark:bg-blue-900/20">
            <h3 className="mb-4 text-lg font-bold text-blue-800 dark:text-blue-200">
              📋 Các bước tiếp theo:
            </h3>
            <ol className="space-y-3 text-sm text-blue-700 dark:text-blue-300">
              <li className="flex gap-3">
                <span className="flex-shrink-0 font-bold">1.</span>
                <span>
                  Chúng tôi sẽ <strong>gọi điện xác nhận</strong> trong vòng <strong>24 giờ</strong>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 font-bold">2.</span>
                <span>
                  Hồ sơ được <strong>xét duyệt</strong> trong <strong>1-3 ngày làm việc</strong>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 font-bold">3.</span>
                <span>
                  Nhận <strong>email/SMS thông báo</strong> kết quả
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 font-bold">4.</span>
                <span>
                  Nếu được phê duyệt: <strong>Kích hoạt tài khoản</strong> và bắt đầu nhận chuyến
                </span>
              </li>
            </ol>
          </div>

          {/* Contact Info */}
          <div className="mb-8 rounded-xl bg-gray-50 p-6 dark:bg-gray-750">
            <h3 className="mb-3 font-bold">📞 Liên hệ hỗ trợ:</h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p>
                <strong>Hotline Driver:</strong>{' '}
                <a href="tel:1900000000" className="font-semibold text-purple-600">
                  1900-xxx-xxx
                </a>
              </p>
              <p>
                <strong>Email:</strong>{' '}
                <a
                  href="mailto:driver-support@lifestyle.vn"
                  className="text-purple-600 hover:underline"
                >
                  driver-support@lifestyle.vn
                </a>
              </p>
              <p>
                <strong>Telegram:</strong> @LifestyleDriverSupport
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 font-bold text-white shadow-lg transition-all hover:scale-105"
            >
              Về trang chủ
            </Link>
            <Link
              href="/driver/faq"
              className="rounded-lg border-2 border-purple-600 px-8 py-3 font-bold text-purple-600 transition-all hover:bg-purple-50 dark:hover:bg-purple-900/20"
            >
              Câu hỏi thường gặp
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
