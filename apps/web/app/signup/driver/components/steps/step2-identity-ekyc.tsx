import { DriverFormData } from '../../utils/form-storage';
import { FileUpload } from '../file-upload';

interface Step2Props {
  formData: DriverFormData;
  onChange: (field: keyof DriverFormData, value: string) => void;
  errors: Record<string, string>;
}

export function Step2IdentityEKYC({ formData, onChange, errors }: Step2Props) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>⭐ Bước quan trọng:</strong> Xác thực CCCD với eKYC Level 2 (bắt buộc cho tài xế).
          Vui lòng chuẩn bị CCCD và chụp ảnh khuôn mặt rõ nét.
        </p>
      </div>

      {/* Citizen ID Number */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Số CCCD (12 số) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.citizenId}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 12);
            onChange('citizenId', value);
          }}
          maxLength={12}
          className={`w-full rounded-lg border ${
            errors.citizenId ? 'border-red-500' : 'border-gray-300'
          } bg-white px-4 py-3 font-mono text-lg focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
          placeholder="001234567890"
        />
        {errors.citizenId && (
          <p className="mt-1 text-xs text-red-500">{errors.citizenId}</p>
        )}
      </div>

      {/* Issue Date & Place */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Ngày cấp <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.citizenIdIssueDate}
            onChange={(e) => onChange('citizenIdIssueDate', e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className={`w-full rounded-lg border ${
              errors.citizenIdIssueDate ? 'border-red-500' : 'border-gray-300'
            } bg-white px-4 py-3 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
          />
          {errors.citizenIdIssueDate && (
            <p className="mt-1 text-xs text-red-500">{errors.citizenIdIssueDate}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Nơi cấp <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.citizenIdIssuePlace}
            onChange={(e) => onChange('citizenIdIssuePlace', e.target.value)}
            className={`w-full rounded-lg border ${
              errors.citizenIdIssuePlace ? 'border-red-500' : 'border-gray-300'
            } bg-white px-4 py-3 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
            placeholder="Cục Cảnh sát QLHC về TTXH"
          />
          {errors.citizenIdIssuePlace && (
            <p className="mt-1 text-xs text-red-500">{errors.citizenIdIssuePlace}</p>
          )}
        </div>
      </div>

      {/* CCCD Images */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FileUpload
          label="Ảnh mặt trước CCCD"
          value={formData.citizenIdFrontImage}
          onChange={(value) => onChange('citizenIdFrontImage', value)}
          required
          helperText="Chụp rõ toàn bộ CCCD, không bị mờ hay chói sáng"
        />
        <FileUpload
          label="Ảnh mặt sau CCCD"
          value={formData.citizenIdBackImage}
          onChange={(value) => onChange('citizenIdBackImage', value)}
          required
          helperText="Đảm bảo mã QR và thông tin rõ nét"
        />
      </div>

      {/* Face Image for eKYC */}
      <div>
        <FileUpload
          label="Ảnh khuôn mặt (Sinh trắc học)"
          value={formData.faceImage}
          onChange={(value) => onChange('faceImage', value)}
          required
          helperText="Chụp trực diện, rõ mặt, không đeo kính hoặc khẩu trang"
        />
      </div>

      {/* Info Box */}
      <div className="rounded-lg border-2 border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
        <h4 className="mb-2 font-semibold text-purple-800 dark:text-purple-200">
          🔐 eKYC Level 2 - Xác thực tự động
        </h4>
        <ul className="space-y-1 text-sm text-purple-700 dark:text-purple-300">
          <li>✓ AI OCR: Trích xuất thông tin tự động từ CCCD</li>
          <li>✓ Face Match: So khớp khuôn mặt với ảnh CCCD</li>
          <li>✓ Xác thực với cơ sở dữ liệu Bộ Công An</li>
          <li>✓ Thời gian xử lý: 2-5 phút</li>
        </ul>
      </div>
    </div>
  );
}
