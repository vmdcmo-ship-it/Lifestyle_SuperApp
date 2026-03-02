/**
 * Phân loại phương tiện theo nhóm và loại chi tiết (phù hợp bảng giá dịch vụ, tham khảo chuẩn thị trường VN).
 * Tài xế chọn theo nhóm → loại → nhập thông tin theo giấy đăng ký/đăng kiểm.
 */

/** Nhóm xe (cấp 1) - dùng chung cho 3 nhóm tài xế */
export const VEHICLE_GROUPS = [
  {
    id: 'MOTORCYCLE',
    label: 'Xe máy',
    icon: '🏍️',
    description: 'Xe gắn máy 2 bánh',
    vehicleTypes: ['BIKE'] as const,
    vehicleClasses: null as null,
  },
  {
    id: 'CAR',
    label: 'Xe ô tô',
    icon: '🚗',
    description: '4 chỗ - 7 chỗ',
    vehicleTypes: ['CAR_4_SEATS', 'CAR_7_SEATS'] as const,
    vehicleClasses: [
      { value: 'CAR_4_SEATS', label: 'Xe 4 chỗ' },
      { value: 'CAR_7_SEATS', label: 'Xe 7 chỗ' },
    ],
  },
  {
    id: 'TRUCK',
    label: 'Xe tải',
    icon: '🚚',
    description: 'Bán tải, van, xe tải (theo tải trọng)',
    vehicleTypes: ['TRUCK'] as const,
    vehicleClasses: [
      { value: 'BAN_TAI', label: 'Bán tải' },
      { value: 'VAN_500KG', label: 'Van tải 500 kg' },
      { value: 'VAN_UNDER_950KG', label: 'Van < 950 kg' },
      { value: 'VAN_1000_2000KG', label: 'Van 1.000 - 2.000 kg' },
      { value: 'VAN_OVER_2000KG', label: 'Van > 2.000 kg' },
      { value: 'TRUCK_OTHER', label: 'Xe tải khác' },
    ],
  },
] as const;

export type VehicleTypeValue = 'BIKE' | 'CAR_4_SEATS' | 'CAR_7_SEATS' | 'TRUCK';
export type TruckClassValue =
  | 'BAN_TAI'
  | 'VAN_500KG'
  | 'VAN_UNDER_950KG'
  | 'VAN_1000_2000KG'
  | 'VAN_OVER_2000KG'
  | 'TRUCK_OTHER';

/** Map vehicleClass (xe tải) → vehicleType cho API (luôn TRUCK) */
export function getVehicleTypeForClass(vehicleClass: string): VehicleTypeValue {
  if (vehicleClass === 'CAR_4_SEATS' || vehicleClass === 'CAR_7_SEATS') return vehicleClass;
  return 'TRUCK';
}

/** Nhãn hiển thị theo vehicleType */
export const VEHICLE_TYPE_LABELS: Record<VehicleTypeValue, string> = {
  BIKE: 'Xe máy',
  CAR_4_SEATS: 'Xe 4 chỗ',
  CAR_7_SEATS: 'Xe 7 chỗ',
  TRUCK: 'Xe tải',
};

/** Nhãn loại xe tải (vehicle_class) */
export const TRUCK_CLASS_LABELS: Record<string, string> = {
  BAN_TAI: 'Bán tải',
  VAN_500KG: 'Van tải 500 kg',
  VAN_UNDER_950KG: 'Van < 950 kg',
  VAN_1000_2000KG: 'Van 1.000 - 2.000 kg',
  VAN_OVER_2000KG: 'Van > 2.000 kg',
  TRUCK_OTHER: 'Xe tải khác',
};
