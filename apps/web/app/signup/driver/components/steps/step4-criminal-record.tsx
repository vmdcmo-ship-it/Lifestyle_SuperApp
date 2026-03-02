import { DriverFormData } from '../../utils/form-storage';
import { FileUpload } from '../file-upload';

interface Step4Props {
  formData: DriverFormData;
  onChange: (field: keyof DriverFormData, value: string) => void;
  errors: Record<string, string>;
}

export function Step4CriminalRecord({ formData, onChange, errors }: Step4Props) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
        <p className="text-sm text-red-800 dark:text-red-200">
          <strong>⚠️ Yêu cầu bảo mật:</strong> Lý lịch tư pháp (mẫu số 2) là bắt buộc
          để đảm bảo an toàn cho khách hàng. Giấy tờ phải còn hiệu lực (trong 6 tháng).
        </p>
      </div>

      {/* Criminal Record Number */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Số giấy Lý lịch tư pháp <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.criminalRecordNumber}
          onChange={(e) => onChange('criminalRecordNumber', e.target.value)}
          className={`w-full rounded-lg border ${
            errors.criminalRecordNumber ? 'border-red-500' : 'border-gray-300'
          } bg-white px-4 py-3 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
          placeholder="Số văn bản trên giấy lý lịch"
        />
        {errors.criminalRecordNumber && (
          <p className="mt-1 text-xs text-red-500">{errors.criminalRecordNumber}</p>
        )}
      </div>

      {/* Issue Date */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Ngày cấp <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={formData.criminalRecordIssueDate}
          onChange={(e) => onChange('criminalRecordIssueDate', e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className={`w-full rounded-lg border ${
            errors.criminalRecordIssueDate ? 'border-red-500' : 'border-gray-300'
          } bg-white px-4 py-3 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
        />
        {errors.criminalRecordIssueDate && (
          <p className="mt-1 text-xs text-red-500">{errors.criminalRecordIssueDate}</p>
        )}
        {formData.criminalRecordIssueDate && (() => {
          const issueDate = new Date(formData.criminalRecordIssueDate);
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          if (issueDate < sixMonthsAgo) {
            return (
              <p className="mt-1 text-xs text-red-500">
                ⚠️ Lý lịch tư pháp đã hết hiệu lực (quá 6 tháng)
              </p>
            );
          }
          return null;
        })()}
      </div>

      {/* Criminal Record Image */}
      <FileUpload
        label="Ảnh Lý lịch tư pháp (Mẫu số 2)"
        value={formData.criminalRecordImage}
        onChange={(value) => onChange('criminalRecordImage', value)}
        required
        helperText="Chụp rõ toàn bộ giấy tờ, đảm bảo chữ và con dấu rõ ràng"
      />

      {/* Instructions */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <h4 className="mb-2 font-semibold">📝 Cách xin Lý lịch tư pháp:</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li>Đến Sở Tư pháp hoặc UBND cấp xã nơi cư trú</li>
          <li>Yêu cầu cấp Lý lịch tư pháp mẫu số 2</li>
          <li>Mang theo CCCD gốc</li>
          <li>Thời gian nhận: 3-7 ngày làm việc</li>
          <li>Lệ phí: Khoảng 50.000đ - 100.000đ</li>
        </ol>
      </div>

      {/* Warning */}
      <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>⚠️ Lưu ý:</strong> Hồ sơ có tiền án, tiền sự liên quan đến giết người,
          cướp, trộm cắp, ma túy hoặc vi phạm giao thông nghiêm trọng sẽ không được chấp thuận.
        </p>
      </div>
    </div>
  );
}
