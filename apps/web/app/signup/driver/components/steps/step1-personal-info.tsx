import { DriverFormData } from '../../utils/form-storage';

interface Step1Props {
  formData: DriverFormData;
  onChange: (field: keyof DriverFormData, value: string) => void;
  errors: Record<string, string>;
}

export function Step1PersonalInfo({ formData, onChange, errors }: Step1Props) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Bước 1:</strong> Vui lòng cung cấp thông tin cá nhân chính xác.
          Thông tin này sẽ được xác thực với CCCD ở bước tiếp theo.
        </p>
      </div>

      {/* Full Name */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Họ và tên đầy đủ <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => onChange('fullName', e.target.value)}
          className={`w-full rounded-lg border ${
            errors.fullName ? 'border-red-500' : 'border-gray-300'
          } bg-white px-4 py-3 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
          placeholder="Nguyễn Văn A"
        />
        {errors.fullName && (
          <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Nhập đúng như trên CCCD
        </p>
      </div>

      {/* Phone Number */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Số điện thoại <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => onChange('phoneNumber', e.target.value)}
          className={`w-full rounded-lg border ${
            errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
          } bg-white px-4 py-3 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
          placeholder="0912345678"
        />
        {errors.phoneNumber && (
          <p className="mt-1 text-xs text-red-500">{errors.phoneNumber}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
          className={`w-full rounded-lg border ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          } bg-white px-4 py-3 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
          placeholder="email@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email}</p>
        )}
      </div>

      {/* Date of Birth */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Ngày sinh <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => onChange('dateOfBirth', e.target.value)}
          max={new Date(new Date().setFullYear(new Date().getFullYear() - 18))
            .toISOString()
            .split('T')[0]}
          className={`w-full rounded-lg border ${
            errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
          } bg-white px-4 py-3 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
        />
        {errors.dateOfBirth && (
          <p className="mt-1 text-xs text-red-500">{errors.dateOfBirth}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Phải từ 18 tuổi trở lên
        </p>
      </div>

      {/* Address */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Địa chỉ thường trú <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.address}
          onChange={(e) => onChange('address', e.target.value)}
          rows={3}
          className={`w-full rounded-lg border ${
            errors.address ? 'border-red-500' : 'border-gray-300'
          } bg-white px-4 py-3 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
          placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
        />
        {errors.address && (
          <p className="mt-1 text-xs text-red-500">{errors.address}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Mật khẩu <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => onChange('password', e.target.value)}
          className={`w-full rounded-lg border ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          } bg-white px-4 py-3 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-500">{errors.password}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Tối thiểu 8 ký tự, chứa chữ hoa, chữ thường và số
        </p>
      </div>
    </div>
  );
}
