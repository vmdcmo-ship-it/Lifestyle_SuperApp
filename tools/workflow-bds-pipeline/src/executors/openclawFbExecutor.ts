import type { FbActionResult, FbExecutor } from '../fb/types.js';
import type { OpenclawClient } from './openclawClient.js';

function toResult(postId: string, status: 'ok' | 'checkpoint' | 'error', message?: string): FbActionResult {
  if (status === 'ok') {
    return { postId, status: 'sent' };
  }
  if (status === 'checkpoint') {
    return { postId, status: 'checkpoint', detail: message ?? 'checkpoint' };
  }
  return { postId, status: 'error', detail: message ?? 'error' };
}

/**
 * FbExecutor thật qua OpenClaw: like + comment bài Facebook.
 */
export class OpenclawFbExecutor implements FbExecutor {
  private readonly client: OpenclawClient;

  constructor(client: OpenclawClient) {
    this.client = client;
  }

  async like(postId: string, accountId: string): Promise<FbActionResult> {
    const res = await this.client.run('fb_like', accountId, { postId });
    return toResult(postId, res.status, res.message);
  }

  async comment(postId: string, accountId: string, text: string): Promise<FbActionResult> {
    const res = await this.client.run('fb_comment', accountId, { postId, text });
    return toResult(postId, res.status, res.message);
  }
}
