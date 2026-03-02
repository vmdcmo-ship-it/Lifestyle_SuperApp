import { DriverFormData } from '../../utils/form-storage';
import { FileUpload } from '../file-upload';

interface Step5Props {
  formData: DriverFormData;
  onChange: (field: keyof DriverFormData, value: string) => void;
  errors: Record<string, string>;
}

export function Step5VehicleInfo({ formData, onChange, errors }: Step5Props) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Bước 5:</strong> Cung cấp thông tin phương tiện và 5 ảnh chụp
          (4 góc + cận cảnh biển số). Đảm bảo ảnh rõ nét, biển số rõ ràng.
        </p>
      </div>

      {/* Vehicle Type */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Loại phương tiện <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.vehicleType}
          onChange={(e) => onChange('vehicleType', e.target.value)}
          className={`w-full rounded-lg border ${
            errors.vehicleType ? 'border-red-500' : 'border-gray-300'
          } bg-white px-4 py-3 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
        >
          <option value="">-- Chọn loại xe --</option>
          <option value="BIKE">🏍️ Xe máy</option>
          <option value="CAR_4_SEATS">🚗 Xe ô tô 4 chỗ</option>
          <option value="CAR_7_SEATS">🚐 Xe ô tô 7 chỗ</option>
          <option value="TRUCK">🚚 Xe tải nhỏ</option>
        </select>
        {errors.vehicleType && (
          <p className="mt-1 text-xs text-red-500">{errors.vehicleType}</p>
        )}
      </div>

      {/* License Plate */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Biển số xe <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.licensePlate}
          onChange={(e) => {
            const value = e.target.value.toUpperCase();
            onChange('licensePlate', value);
          }}
          className={`w-full rounded-lg border ${
            errors.licensePlate ? 'border-red-500' : 'border-gray-300'
          } bg-white px-4 py-3 font-mono text-lg focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
          placeholder="29A-12345"
        />
        {errors.licensePlate && (
          <p className="mt-1 text-xs text-red-500">{errors.licensePlate}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Ví dụ: 29A-12345, 51G-98765
        </p>
      </div>

      {/* Brand, Model, Year, Color */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Hãng xe <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.brand}
            onChange={(e) => onChange('brand', e.target.value)}
            className={`w-full rounded-lg border ${
              errors.brand ? 'border-red-500' : 'border-gray-300'
            } bg-white px-4 py-3 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
            placeholder="Honda, Toyota, ..."
          />
          {errors.brand && (
            <p className="mt-1 text-xs text-red-500">{errors.brand}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Dòng xe <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.model}
            onChange={(e) => onChange('model', e.target.value)}
            className={`w-full rounded-lg border ${
              errors.model ? 'border-red-500' : 'border-gray-300'
            } bg-white px-4 py-3 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
            placeholder="Wave, Vios, ..."
          />
          {errors.model && (
            <p className="mt-1 text-xs text-red-500">{errors.model}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Năm sản xuất <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.year}
            onChange={(e) => onChange('year', e.target.value)}
            min="2000"
            max={new Date().getFullYear() + 1}
            className={`w-full rounded-lg border ${
              errors.year ? 'border-red-500' : 'border-gray-300'
            } bg-white px-4 py-3 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
            placeholder="2020"
          />
          {errors.year && (
            <p className="mt-1 text-xs text-red-500">{errors.year}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Màu sắc <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.color}
            onChange={(e) => onChange('color', e.target.value)}
            className={`w-full rounded-lg border ${
              errors.color ? 'border-red-500' : 'border-gray-300'
            } bg-white px-4 py-3 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
            placeholder="Đen, Trắng, Xanh, ..."
          />
          {errors.color && (
            <p className="mt-1 text-xs text-red-500">{errors.color}</p>
          )}
        </div>
      </div>

      {/* Vehicle Images - 4 corners */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">
          📸 Hình ảnh phương tiện (4 góc nhìn) <span className="text-red-500">*</span>
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FileUpload
            label="Góc trước (Phải thấy rõ biển số)"
            value={formData.vehicleFrontImage}
            onChange={(value) => onChange('vehicleFrontImage', value)}
            required
            helperText="Chụp toàn cảnh từ phía trước, biển số rõ ràng"
          />
          <FileUpload
            label="Góc sau"
            value={formData.vehicleBackImage}
            onChange={(value) => onChange('vehicleBackImage', value)}
            required
            helperText="Chụp toàn cảnh từ phía sau"
          />
          <FileUpload
            label="Góc trái"
            value={formData.vehicleLeftImage}
            onChange={(value) => onChange('vehicleLeftImage', value)}
            required
            helperText="Chụp toàn bộ từ bên trái"
          />
          <FileUpload
            label="Góc phải"
            value={formData.vehicleRightImage}
            onChange={(value) => onChange('vehicleRightImage', value)}
            required
            helperText="Chụp toàn bộ từ bên phải"
          />
        </div>
      </div>

      {/* License Plate Closeup */}
      <FileUpload
        label="Ảnh cận cảnh biển số xe"
        value={formData.licensePlateCloseupImage}
        onChange={(value) => onChange('licensePlateCloseupImage', value)}
        required
        helperText="Chụp cận cảnh biển số, đảm bảo các số và chữ cái hoàn toàn rõ nét"
      />

      {/* Registration Certificate */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">
          📄 Đăng ký xe (Giấy đăng kiểm)
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Số đăng ký xe <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.registrationNumber}
              onChange={(e) => onChange('registrationNumber', e.target.value)}
              className={`w-full rounded-lg border ${
                errors.registrationNumber ? 'border-red-500' : 'border-gray-300'
              } bg-white px-4 py-3 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
              placeholder="Số đăng ký"
            />
            {errors.registrationNumber && (
              <p className="mt-1 text-xs text-red-500">{errors.registrationNumber}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Ngày hết hạn đăng kiểm <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.registrationExpiry}
              onChange={(e) => onChange('registrationExpiry', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full rounded-lg border ${
                errors.registrationExpiry ? 'border-red-500' : 'border-gray-300'
              } bg-white px-4 py-3 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
            />
            {errors.registrationExpiry && (
              <p className="mt-1 text-xs text-red-500">{errors.registrationExpiry}</p>
            )}
          </div>
        </div>

        <FileUpload
          label="Ảnh Giấy đăng ký xe / Giấy đăng kiểm"
          value={formData.registrationImage}
          onChange={(value) => onChange('registrationImage', value)}
          required
          helperText="Chụp rõ toàn bộ giấy tờ"
        />
      </div>
    </div>
  );
}
