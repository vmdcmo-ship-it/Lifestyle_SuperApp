import type { ActionResult, OutreachAction, OutreachExecutor } from '../outreach/types.js';
import type { OpenclawClient } from './openclawClient.js';

function toResult(phone: string, action: OutreachAction, status: 'ok' | 'checkpoint' | 'error', message?: string): ActionResult {
  if (status === 'ok') {
    return message ? { phone, action, status: 'sent', detail: message } : { phone, action, status: 'sent' };
  }
  if (status === 'checkpoint') {
    return { phone, action, status: 'checkpoint', detail: message ?? 'checkpoint' };
  }
  return { phone, action, status: 'error', detail: message ?? 'error' };
}

/**
 * OutreachExecutor thật qua OpenClaw: kết bạn / nhắn tin / mời vào nhóm.
 */
export class OpenclawOutreachExecutor implements OutreachExecutor {
  private readonly client: OpenclawClient;

  constructor(client: OpenclawClient) {
    this.client = client;
  }

  async addFriend(phone: string, accountId: string, message: string): Promise<ActionResult> {
    const res = await this.client.run('add_friend', accountId, { phone, message });
    return toResult(phone, 'add_friend', res.status, res.message);
  }

  async sendMessage(phone: string, accountId: string, message: string): Promise<ActionResult> {
    const res = await this.client.run('send_message', accountId, { phone, message });
    return toResult(phone, 'message', res.status, res.message);
  }

  async addToGroup(phone: string, accountId: string, groupId: string): Promise<ActionResult> {
    const res = await this.client.run('add_group', accountId, { phone, groupId });
    return toResult(phone, 'add_group', res.status, res.message);
  }
}
