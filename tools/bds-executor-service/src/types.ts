export type ActionName =
  | 'check_phone'
  | 'add_friend'
  | 'send_message'
  | 'add_group'
  | 'fb_like'
  | 'fb_comment';

export interface ActionParams {
  phone?: string;
  message?: string;
  groupId?: string;
  postId?: string;
  text?: string;
}

export interface ActionRequest {
  action: ActionName;
  account_id: string;
  params: ActionParams;
  correlation_id?: string;
}

/** Hợp đồng phản hồi — KHỚP với OpenclawClient phía pipeline. */
export interface ActionResponse {
  status: 'ok' | 'checkpoint' | 'error';
  data?: Record<string, unknown>;
  message?: string;
}

export const OK = (data?: Record<string, unknown>): ActionResponse =>
  data ? { status: 'ok', data } : { status: 'ok' };
export const CHECKPOINT = (message: string): ActionResponse => ({ status: 'checkpoint', message });
export const ERROR = (message: string): ActionResponse => ({ status: 'error', message });
