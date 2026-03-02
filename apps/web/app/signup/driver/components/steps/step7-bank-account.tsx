import { DriverFormData } from '../../utils/form-storage';

interface Step7Props {
  formData: DriverFormData;
  onChange: (field: keyof DriverFormData, value: string) => void;
  errors: Record<string, string>;
}

const VIETNAM_BANKS = [
  { code: 'VCB', name: 'Vietcombank' },
  { code: 'TCB', name: 'Techcombank' },
  { code: 'BIDV', name: 'BIDV' },
  { code: 'VTB', name: 'Vietinbank' },
  { code: 'ACB', name: 'ACB' },
  { code: 'MB', name: 'MB Bank' },
  { code: 'VPB', name: 'VPBank' },
  { code: 'TPB', name: 'TPBank' },
  { code: 'STB', name: 'Sacombank' },
  { code: 'HDB', name: 'HDBank' },
  { code: 'VIB', name: 'VIB' },
  { code: 'SHB', name: 'SHB' },
  { code: 'EIB', name: 'Eximbank' },
  { code: 'MSB', name: 'MSB' },
  { code: 'OCB', name: 'OCB' },
  { code: 'SCB', name: 'SCB' },
  { code: 'SEA', name: 'SeABank' },
  { code: 'AGR', name: 'Agribank' },
  { code: 'VCCB', name: 'VietCapitalBank' },
];

export function Step7BankAccount({ formData, onChange, errors }: Step7Props) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
        <p className="text-sm text-green-800 dark:text-green-200">
          <strong>💰 Bước 7:</strong> Thông tin tài khoản ngân hàng để nhận thanh toán thu nhập.
          Tên chủ tài khoản phải trùng với tên trên CCCD.
        </p>
      </div>

      {/* Account Holder Name */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Tên chủ tài khoản <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.accountHolderName}
          onChange={(e) => onChange('accountHolderName', e.target.value.toUpperCase())}
          className={`w-full rounded-lg border ${
            errors.accountHolderName ? 'border-red-500' : 'border-gray-300'
          } bg-white px-4 py-3 font-semibold uppercase focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
          placeholder="NGUYEN VAN A"
        />
        {errors.accountHolderName && (
          <p className="mt-1 text-xs text-red-500">{errors.accountHolderName}</p>
        )}
        <p className="mt-1 text-xs text-red-500">
          ⚠️ Phải trùng với họ tên trên CCCD
        </p>
      </div>

      {/* Account Number */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Số tài khoản <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.accountNumber}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 14);
            onChange('accountNumber', value);
          }}
          maxLength={14}
          className={`w-full rounded-lg border ${
            errors.accountNumber ? 'border-red-500' : 'border-gray-300'
          } bg-white px-4 py-3 font-mono text-lg focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
          placeholder="1234567890"
        />
        {errors.accountNumber && (
          <p className="mt-1 text-xs text-red-500">{errors.accountNumber}</p>
        )}
      </div>

      {/* Bank Name & Code */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Ngân hàng <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.bankCode}
          onChange={(e) => {
            const bank = VIETNAM_BANKS.find((b) => b.code === e.target.value);
            onChange('bankCode', e.target.value);
            if (bank) {
              onChange('bankName', bank.name);
            }
          }}
          className={`w-full rounded-lg border ${
            errors.bankCode ? 'border-red-500' : 'border-gray-300'
          } bg-white px-4 py-3 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
        >
          <option value="">-- Chọn ngân hàng --</option>
          {VIETNAM_BANKS.map((bank) => (
            <option key={bank.code} value={bank.code}>
              {bank.name}
            </option>
          ))}
        </select>
        {errors.bankCode && (
          <p className="mt-1 text-xs text-red-500">{errors.bankCode}</p>
        )}
      </div>

      {/* Branch Name */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Chi nhánh <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.branchName}
          onChange={(e) => onChange('branchName', e.target.value)}
          className={`w-full rounded-lg border ${
            errors.branchName ? 'border-red-500' : 'border-gray-300'
          } bg-white px-4 py-3 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
          placeholder="Chi nhánh Tân Bình, Chi nhánh Quận 1, ..."
        />
        {errors.branchName && (
          <p className="mt-1 text-xs text-red-500">{errors.branchName}</p>
        )}
      </div>

      {/* Info Box */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <h4 className="mb-2 font-semibold text-blue-800 dark:text-blue-200">
          💡 Lưu ý về tài khoản ngân hàng:
        </h4>
        <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
          <li>✓ Tên chủ TK phải trùng với tên trên CCCD</li>
          <li>✓ Tài khoản phải đang hoạt động</li>
          <li>✓ Hệ thống sẽ chuyển thử 1.000đ để xác thực</li>
          <li>✓ Thu nhập sẽ được chuyển vào TK này hàng tuần</li>
        </ul>
      </div>

      {/* Summary */}
      {formData.accountNumber && formData.bankName && (
        <div className="rounded-lg border-2 border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
          <h4 className="mb-2 font-semibold text-purple-800 dark:text-purple-200">
            📋 Thông tin tài khoản:
          </h4>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Chủ TK:</strong> {formData.accountHolderName || '(Chưa nhập)'}
            </p>
            <p>
              <strong>Số TK:</strong> {formData.accountNumber}
            </p>
            <p>
              <strong>Ngân hàng:</strong> {formData.bankName}
            </p>
            <p>
              <strong>Chi nhánh:</strong> {formData.branchName || '(Chưa nhập)'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
