import { DriverFormData } from '../../utils/form-storage';
import { FileUpload } from '../file-upload';

interface Step3Props {
  formData: DriverFormData;
  onChange: (field: keyof DriverFormData, value: string) => void;
  errors: Record<string, string>;
}

export function Step3DriverLicense({ formData, onChange, errors }: Step3Props) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Bước 3:</strong> Cung cấp thông tin Giấy phép lái xe hợp lệ.
          GPLX phải còn hiệu lực và phù hợp với loại xe bạn muốn đăng ký.
        </p>
      </div>

      {/* License Number */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Số GPLX (12 số) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.driverLicenseNumber}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 12);
            onChange('driverLicenseNumber', value);
          }}
          maxLength={12}
          className={`w-full rounded-lg border ${
            errors.driverLicenseNumber ? 'border-red-500' : 'border-gray-300'
          } bg-white px-4 py-3 font-mono text-lg focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
          placeholder="012345678901"
        />
        {errors.driverLicenseNumber && (
          <p className="mt-1 text-xs text-red-500">{errors.driverLicenseNumber}</p>
        )}
      </div>

      {/* License Class */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Hạng GPLX <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.driverLicenseClass}
          onChange={(e) => onChange('driverLicenseClass', e.target.value)}
          className={`w-full rounded-lg border ${
            errors.driverLicenseClass ? 'border-red-500' : 'border-gray-300'
          } bg-white px-4 py-3 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
        >
          <option value="">-- Chọn hạng --</option>
          <option value="A1">A1 - Xe máy dưới 175cc</option>
          <option value="A2">A2 - Xe máy trên 175cc</option>
          <option value="B1">B1 - Xe ô tô đến 9 chỗ (số tự động)</option>
          <option value="B2">B2 - Xe ô tô đến 9 chỗ (số sàn)</option>
          <option value="C">C - Xe tải, xe khách</option>
          <option value="D">D - Xe khách trên 30 chỗ</option>
          <option value="E">E - Xe kéo moóc, sơ mi rơ moóc</option>
          <option value="F">F - Các loại xe tương tự hạng E</option>
        </select>
        {errors.driverLicenseClass && (
          <p className="mt-1 text-xs text-red-500">{errors.driverLicenseClass}</p>
        )}
      </div>

      {/* Issue & Expiry Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Ngày cấp <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.driverLicenseIssueDate}
            onChange={(e) => onChange('driverLicenseIssueDate', e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className={`w-full rounded-lg border ${
              errors.driverLicenseIssueDate ? 'border-red-500' : 'border-gray-300'
            } bg-white px-4 py-3 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
          />
          {errors.driverLicenseIssueDate && (
            <p className="mt-1 text-xs text-red-500">{errors.driverLicenseIssueDate}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Ngày hết hạn <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.driverLicenseExpiry}
            onChange={(e) => onChange('driverLicenseExpiry', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className={`w-full rounded-lg border ${
              errors.driverLicenseExpiry ? 'border-red-500' : 'border-gray-300'
            } bg-white px-4 py-3 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
          />
          {errors.driverLicenseExpiry && (
            <p className="mt-1 text-xs text-red-500">{errors.driverLicenseExpiry}</p>
          )}
          {formData.driverLicenseExpiry &&
            new Date(formData.driverLicenseExpiry) < new Date() && (
              <p className="mt-1 text-xs text-red-500">⚠️ GPLX đã hết hạn</p>
            )}
        </div>
      </div>

      {/* License Image */}
      <FileUpload
        label="Ảnh Giấy phép lái xe"
        value={formData.driverLicenseImage}
        onChange={(value) => onChange('driverLicenseImage', value)}
        required
        helperText="Chụp rõ cả 2 mặt GPLX hoặc quét toàn bộ nếu là thẻ PET"
      />

      {/* Info about license classes */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <h4 className="mb-2 font-semibold">📋 Hạng GPLX phù hợp với loại xe:</h4>
        <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li>🏍️ Xe máy: Hạng A1, A2</li>
          <li>🚗 Xe ô tô 4 chỗ: Hạng B1, B2</li>
          <li>🚐 Xe ô tô 7 chỗ: Hạng B2, C</li>
          <li>🚚 Xe tải nhỏ: Hạng C</li>
        </ul>
      </div>
    </div>
  );
}
