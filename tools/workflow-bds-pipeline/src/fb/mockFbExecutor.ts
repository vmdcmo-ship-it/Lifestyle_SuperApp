import type { FbActionResult, FbExecutor } from './types.js';

export interface MockFbOptions {
  checkpointRate: number;
}

export class MockFbExecutor implements FbExecutor {
  private readonly checkpointRate: number;

  constructor(options: Partial<MockFbOptions> = {}) {
    this.checkpointRate = options.checkpointRate ?? 0;
  }

  async like(postId: string, _accountId: string): Promise<FbActionResult> {
    return { postId, status: 'sent' };
  }

  async comment(postId: string, _accountId: string, _text: string): Promise<FbActionResult> {
    if (Math.random() < this.checkpointRate) {
      return { postId, status: 'checkpoint', detail: 'Phát hiện checkpoint' };
    }
    return { postId, status: 'sent' };
  }
}
