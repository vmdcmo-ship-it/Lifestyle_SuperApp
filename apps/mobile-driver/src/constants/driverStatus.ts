/**
 * Trạng thái hồ sơ tài xế — khi backend có luồng duyệt.
 */
export const DRIVER_STATUS = {
  PENDING_VERIFICATION: 'PENDING_VERIFICATION',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type DriverStatusType = (typeof DRIVER_STATUS)[keyof typeof DRIVER_STATUS];

export const DRIVER_STATUS_LABEL: Record<string, string> = {
  [DRIVER_STATUS.PENDING_VERIFICATION]: 'Chờ duyệt',
  [DRIVER_STATUS.ACTIVE]: 'Đang hoạt động',
  [DRIVER_STATUS.INACTIVE]: 'Chưa được duyệt',
  SUSPENDED: 'Tạm khóa',
  BANNED: 'Bị chặn',
};

/** Kiểm tra tài xế có thể nhận đơn (bật Online) không */
export function canAcceptOrders(status: string | undefined): boolean {
  return status === DRIVER_STATUS.ACTIVE;
}
