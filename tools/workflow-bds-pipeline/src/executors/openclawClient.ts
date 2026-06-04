import { randomUUID } from 'node:crypto';
import type { OpenclawConfig } from '../config.js';

export type OpenclawAction =
  | 'check_phone'
  | 'add_friend'
  | 'send_message'
  | 'add_group'
  | 'fb_like'
  | 'fb_comment'
  | 'fb_message'
  | 'fb_join_group'
  | 'fb_search_pages'
  | 'fb_page_info'
  | 'fb_page_follow'
  | 'fb_page_interact'
  | 'fb_page_message';

export interface OpenclawTaskParams {
  phone?: string;
  message?: string;
  groupId?: string;
  postId?: string;
  text?: string;
  recipientId?: string;
  keyword?: string;
  max?: number;
  pageId?: string;
  doFollow?: boolean;
  doLike?: boolean;
  doComment?: boolean;
  defaultAnswer?: string;
  agreeRules?: boolean;
  answers?: Array<{ keys: string[]; answer: string }>;
}

export interface OpenclawResponse {
  status: 'ok' | 'checkpoint' | 'error';
  data?: Record<string, unknown>;
  message?: string;
}

/**
 * Client gọi OpenClaw (qua n8n webhook hoặc gateway) để thực thi MỘT hành động trình duyệt.
 * Quota/delay/phanh nằm ở phía orchestrator; OpenClaw chỉ thực thi nguyên tử và trả JSON.
 */
export class OpenclawClient {
  private readonly config: OpenclawConfig;

  constructor(config: OpenclawConfig) {
    this.config = config;
  }

  async run(action: OpenclawAction, accountId: string, params: OpenclawTaskParams): Promise<OpenclawResponse> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (this.config.token) {
        headers.Authorization = `Bearer ${this.config.token}`;
      }
      const res = await fetch(this.config.runUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ action, account_id: accountId, params, correlation_id: randomUUID() }),
        signal: controller.signal,
      });
      if (!res.ok) {
        return { status: 'error', message: `OpenClaw HTTP ${res.status}: ${await res.text()}` };
      }
      return this.normalize((await res.json()) as Record<string, unknown>);
    } catch (err) {
      return { status: 'error', message: err instanceof Error ? err.message : String(err) };
    } finally {
      clearTimeout(timer);
    }
  }

  private normalize(raw: Record<string, unknown>): OpenclawResponse {
    const status = raw.status === 'checkpoint' || raw.status === 'error' ? raw.status : 'ok';
    const result: OpenclawResponse = { status };
    if (raw.data && typeof raw.data === 'object') {
      result.data = raw.data as Record<string, unknown>;
    }
    if (typeof raw.message === 'string') {
      result.message = raw.message;
    }
    return result;
  }
}
