export type ZaloCheckOutcome = 'has_zalo' | 'no_zalo' | 'checkpoint' | 'error';

export interface ZaloCheckResult {
  phone: string;
  outcome: ZaloCheckOutcome;
  displayName?: string;
  message?: string;
}

/**
 * Cổng thực thi hành vi Zalo. Production: cài đặt bằng OpenClaw (mô phỏng "Tìm bạn qua SĐT").
 * Test: dùng MockZaloExecutor.
 */
export interface ZaloExecutor {
  checkPhone(phone: string, accountId: string): Promise<ZaloCheckResult>;
}
