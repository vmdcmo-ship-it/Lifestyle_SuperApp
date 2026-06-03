import type { ActionResult, OutreachAction, OutreachExecutor } from './types.js';

export interface MockOutreachOptions {
  checkpointRate: number;
}

/**
 * Executor giả lập cho hành động Zalo có tác động (test orchestrator, KHÔNG gửi thật).
 */
export class MockOutreachExecutor implements OutreachExecutor {
  private readonly checkpointRate: number;

  constructor(options: Partial<MockOutreachOptions> = {}) {
    this.checkpointRate = options.checkpointRate ?? 0;
  }

  addFriend(phone: string, _accountId: string, _message: string): Promise<ActionResult> {
    return this.simulate(phone, 'add_friend');
  }

  sendMessage(phone: string, _accountId: string, _message: string): Promise<ActionResult> {
    return this.simulate(phone, 'message');
  }

  addToGroup(phone: string, _accountId: string, groupId: string): Promise<ActionResult> {
    return this.simulate(phone, 'add_group', `group=${groupId}`);
  }

  private async simulate(phone: string, action: OutreachAction, detail?: string): Promise<ActionResult> {
    if (Math.random() < this.checkpointRate) {
      return { phone, action, status: 'checkpoint', detail: 'Phát hiện checkpoint' };
    }
    return detail ? { phone, action, status: 'sent', detail } : { phone, action, status: 'sent' };
  }
}
