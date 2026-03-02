import { DriverFormData } from '../../utils/form-storage';
import Link from 'next/link';

interface Step8Props {
  formData: DriverFormData;
  onChange: (field: keyof DriverFormData, value: string | boolean) => void;
  errors: Record<string, string>;
}

export function Step8Terms({ formData, onChange, errors }: Step8Props) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
        <p className="text-sm text-green-800 dark:text-green-200">
          <strong>🎉 Bước cuối:</strong> Xác nhận thông tin và đồng ý với các điều khoản
          để hoàn tất đăng ký. Hồ sơ của bạn sẽ được xét duyệt trong 1-3 ngày làm việc.
        </p>
      </div>

      {/* Summary of Information */}
      <div className="rounded-xl border-2 border-purple-200 bg-purple-50 p-6 dark:border-purple-800 dark:bg-purple-900/20">
        <h3 className="mb-4 text-lg font-bold text-purple-800 dark:text-purple-200">
          📋 Tóm tắt thông tin đã cung cấp
        </h3>
        
        <div className="space-y-4">
          {/* Personal Info */}
          <div>
            <h4 className="mb-2 font-semibold text-sm">👤 Thông tin cá nhân:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Họ tên: <strong>{formData.fullName}</strong></div>
              <div>SĐT: <strong>{formData.phoneNumber}</strong></div>
              <div>Email: <strong>{formData.email}</strong></div>
              <div>Ngày sinh: <strong>{formData.dateOfBirth}</strong></div>
            </div>
          </div>

          {/* Identity */}
          <div>
            <h4 className="mb-2 font-semibold text-sm">🪪 CCCD & GPLX:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Số CCCD: <strong>{formData.citizenId}</strong></div>
              <div>Số GPLX: <strong>{formData.driverLicenseNumber}</strong></div>
              <div>Hạng GPLX: <strong>{formData.driverLicenseClass}</strong></div>
            </div>
          </div>

          {/* Vehicle */}
          <div>
            <h4 className="mb-2 font-semibold text-sm">🚗 Phương tiện:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Biển số: <strong>{formData.licensePlate}</strong></div>
              <div>Loại xe: <strong>{formData.vehicleType}</strong></div>
              <div>Hãng/Dòng: <strong>{formData.brand} {formData.model}</strong></div>
              <div>Năm/Màu: <strong>{formData.year} - {formData.color}</strong></div>
            </div>
          </div>

          {/* Bank */}
          <div>
            <h4 className="mb-2 font-semibold text-sm">🏦 Ngân hàng:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Ngân hàng: <strong>{formData.bankName}</strong></div>
              <div>Số TK: <strong>{formData.accountNumber}</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="space-y-4">
        <label className="flex items-start gap-3 rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-purple-300 dark:border-gray-700">
          <input
            type="checkbox"
            checked={formData.agreedToTerms}
            onChange={(e) => onChange('agreedToTerms', e.target.checked)}
            className="mt-1 h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <div className="flex-1">
            <p className="font-medium">
              Tôi đồng ý với{' '}
              <Link
                href="/terms/driver"
                target="_blank"
                className="text-purple-600 hover:underline"
              >
                Điều khoản đối tác tài xế
              </Link>
            </p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              Bao gồm: Chính sách phân chia doanh thu, quy tắc vận hành, trách nhiệm pháp lý
            </p>
          </div>
        </label>
        {errors.agreedToTerms && (
          <p className="text-xs text-red-500">{errors.agreedToTerms}</p>
        )}

        <label className="flex items-start gap-3 rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-purple-300 dark:border-gray-700">
          <input
            type="checkbox"
            checked={formData.agreedToDriverPolicy}
            onChange={(e) => onChange('agreedToDriverPolicy', e.target.checked)}
            className="mt-1 h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <div className="flex-1">
            <p className="font-medium">
              Tôi đồng ý với{' '}
              <Link
                href="/privacy/driver"
                target="_blank"
                className="text-purple-600 hover:underline"
              >
                Chính sách bảo mật và xử lý dữ liệu
              </Link>
            </p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              Bao gồm: Thu thập và sử dụng dữ liệu, chia sẻ vị trí, camera, quyền riêng tư
            </p>
          </div>
        </label>
        {errors.agreedToDriverPolicy && (
          <p className="text-xs text-red-500">{errors.agreedToDriverPolicy}</p>
        )}
      </div>

      {/* Commitment */}
      <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
        <h4 className="mb-2 font-semibold text-amber-800 dark:text-amber-200">
          ✍️ Cam kết của tôi:
        </h4>
        <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
          <li>✓ Thông tin cung cấp là chính xác và trung thực</li>
          <li>✓ Tuân thủ luật giao thông và quy định pháp luật</li>
          <li>✓ Đảm bảo an toàn cho khách hàng</li>
          <li>✓ Duy trì chất lượng dịch vụ tốt</li>
          <li>✓ Cập nhật giấy tờ khi hết hạn</li>
        </ul>
      </div>

      {/* Next Steps Info */}
      <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <h4 className="mb-2 font-semibold text-blue-800 dark:text-blue-200">
          🚀 Sau khi gửi hồ sơ:
        </h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700 dark:text-blue-300">
          <li>Hồ sơ được chuyển đến bộ phận xét duyệt</li>
          <li>Nhân viên sẽ gọi điện xác nhận trong 24h</li>
          <li>Xét duyệt và phê duyệt: 1-3 ngày làm việc</li>
          <li>Nhận thông báo qua Email/SMS</li>
          <li>Kích hoạt tài khoản và bắt đầu nhận chuyến</li>
        </ol>
      </div>

      {/* Error Display */}
      {errors.submit && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          <strong>❌ Lỗi:</strong> {errors.submit}
        </div>
      )}
    </div>
  );
}
