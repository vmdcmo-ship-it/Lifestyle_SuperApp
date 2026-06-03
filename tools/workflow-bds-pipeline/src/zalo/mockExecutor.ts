import type { ZaloCheckResult, ZaloExecutor } from './types.js';

export interface MockOptions {
  hasZaloRate: number;
  checkpointRate: number;
}

/**
 * Executor giả lập để test orchestrator mà không cần Zalo/OpenClaw thật.
 * Sinh kết quả ngẫu nhiên tất định theo SĐT + tỉ lệ checkpoint cấu hình được.
 */
export class MockZaloExecutor implements ZaloExecutor {
  private readonly options: MockOptions;

  constructor(options: Partial<MockOptions> = {}) {
    this.options = {
      hasZaloRate: options.hasZaloRate ?? 0.7,
      checkpointRate: options.checkpointRate ?? 0.0,
    };
  }

  async checkPhone(phone: string, _accountId: string): Promise<ZaloCheckResult> {
    if (Math.random() < this.options.checkpointRate) {
      return { phone, outcome: 'checkpoint', message: 'Phát hiện captcha/checkpoint' };
    }
    const hasZalo = hashRatio(phone) < this.options.hasZaloRate;
    return hasZalo
      ? { phone, outcome: 'has_zalo', displayName: `User ${phone.slice(-4)}` }
      : { phone, outcome: 'no_zalo' };
  }
}

function hashRatio(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h * 31 + input.charCodeAt(i)) % 1000;
  }
  return h / 1000;
}
