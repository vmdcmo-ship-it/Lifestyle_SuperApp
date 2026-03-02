import { DriverFormData } from '../../utils/form-storage';
import { FileUpload } from '../file-upload';

interface Step6Props {
  formData: DriverFormData;
  onChange: (field: keyof DriverFormData, value: string) => void;
  errors: Record<string, string>;
}

export function Step6Insurance({ formData, onChange, errors }: Step6Props) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
        <p className="text-sm text-red-800 dark:text-red-200">
          <strong>⚠️ Bắt buộc:</strong> Bảo hiểm TNDS (Trách nhiệm dân sự) là yêu cầu
          pháp lý bắt buộc. Bảo hiểm phải còn hiệu lực và khớp với biển số xe đã đăng ký.
        </p>
      </div>

      {/* Insurance Number */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Số hợp đồng bảo hiểm <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.insuranceNumber}
          onChange={(e) => onChange('insuranceNumber', e.target.value)}
          className={`w-full rounded-lg border ${
            errors.insuranceNumber ? 'border-red-500' : 'border-gray-300'
          } bg-white px-4 py-3 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
          placeholder="Số hợp đồng hoặc số chứng nhận"
        />
        {errors.insuranceNumber && (
          <p className="mt-1 text-xs text-red-500">{errors.insuranceNumber}</p>
        )}
      </div>

      {/* Insurance Provider */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Nhà cung cấp bảo hiểm <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.insuranceProvider}
          onChange={(e) => onChange('insuranceProvider', e.target.value)}
          className={`w-full rounded-lg border ${
            errors.insuranceProvider ? 'border-red-500' : 'border-gray-300'
          } bg-white px-4 py-3 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
        >
          <option value="">-- Chọn nhà cung cấp --</option>
          <option value="Bảo Việt">Bảo Việt</option>
          <option value="PVI">PVI (Bảo hiểm Dầu khí)</option>
          <option value="BIC">BIC (Bảo hiểm Ngân hàng)</option>
          <option value="BSH">BSH (Bảo hiểm Sài Gòn - Hà Nội)</option>
          <option value="PTI">PTI (Bưu điện)</option>
          <option value="MIC">MIC (Bảo hiểm Quân đội)</option>
          <option value="VNI">VNI (Bảo Minh)</option>
          <option value="Khác">Khác</option>
        </select>
        {errors.insuranceProvider && (
          <p className="mt-1 text-xs text-red-500">{errors.insuranceProvider}</p>
        )}
      </div>

      {/* Insurance Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Ngày có hiệu lực <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.insuranceIssueDate}
            onChange={(e) => onChange('insuranceIssueDate', e.target.value)}
            className={`w-full rounded-lg border ${
              errors.insuranceIssueDate ? 'border-red-500' : 'border-gray-300'
            } bg-white px-4 py-3 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
          />
          {errors.insuranceIssueDate && (
            <p className="mt-1 text-xs text-red-500">{errors.insuranceIssueDate}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Ngày hết hạn <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.insuranceExpiry}
            onChange={(e) => onChange('insuranceExpiry', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className={`w-full rounded-lg border ${
              errors.insuranceExpiry ? 'border-red-500' : 'border-gray-300'
            } bg-white px-4 py-3 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
          />
          {errors.insuranceExpiry && (
            <p className="mt-1 text-xs text-red-500">{errors.insuranceExpiry}</p>
          )}
          {formData.insuranceExpiry &&
            new Date(formData.insuranceExpiry) < new Date() && (
              <p className="mt-1 text-xs text-red-500">⚠️ Bảo hiểm đã hết hạn</p>
            )}
        </div>
      </div>

      {/* Insurance Image */}
      <FileUpload
        label="Ảnh Giấy bảo hiểm TNDS"
        value={formData.insuranceImage}
        onChange={(value) => onChange('insuranceImage', value)}
        required
        helperText="Chụp rõ số hợp đồng, biển số xe, ngày hết hạn"
      />

      {/* Info Box */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <h4 className="mb-2 font-semibold">🛡️ Về bảo hiểm TNDS:</h4>
        <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li>• Bắt buộc theo Luật Giao thông đường bộ</li>
          <li>• Mức bảo hiểm tối thiểu: 100 triệu đồng</li>
          <li>• Mua tại các công ty bảo hiểm uy tín</li>
          <li>• Cần gia hạn trước khi hết hạn</li>
        </ul>
      </div>
    </div>
  );
}
