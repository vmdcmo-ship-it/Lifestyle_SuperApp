import type { ZaloCheckResult, ZaloExecutor } from '../zalo/types.js';
import type { OpenclawClient } from './openclawClient.js';

/**
 * ZaloExecutor thật qua OpenClaw: mô phỏng "Tìm bạn qua SĐT".
 * OpenClaw trả: { status, data: { has_zalo: boolean, display_name?: string } }.
 */
export class OpenclawZaloExecutor implements ZaloExecutor {
  private readonly client: OpenclawClient;

  constructor(client: OpenclawClient) {
    this.client = client;
  }

  async checkPhone(phone: string, accountId: string): Promise<ZaloCheckResult> {
    const res = await this.client.run('check_phone', accountId, { phone });
    if (res.status === 'checkpoint') {
      return { phone, outcome: 'checkpoint', message: res.message ?? 'checkpoint' };
    }
    if (res.status === 'error') {
      return { phone, outcome: 'error', message: res.message ?? 'error' };
    }
    const hasZalo = Boolean(res.data?.has_zalo);
    const displayName = typeof res.data?.display_name === 'string' ? (res.data.display_name as string) : undefined;
    if (hasZalo) {
      return displayName ? { phone, outcome: 'has_zalo', displayName } : { phone, outcome: 'has_zalo' };
    }
    return { phone, outcome: 'no_zalo' };
  }
}
