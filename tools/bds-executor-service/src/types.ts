export type ActionName =
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

export interface ActionParams {
  phone?: string;
  message?: string;
  groupId?: string;
  postId?: string;
  text?: string;
  /** ID người dùng hoặc URL hội thoại Messenger (fb_message). */
  recipientId?: string;
  /** Từ khóa tìm nhóm Facebook (fb_join_group). */
  keyword?: string;
  /** Số nhóm tối đa xin tham gia trong 1 lần (fb_join_group). */
  max?: number;
  /** Bộ câu trả lời chuẩn bị trước cho câu hỏi gia nhập (fb_join_group). Câu hỏi chứa 1 trong `keys` -> dùng `answer`. */
  answers?: Array<{ keys: string[]; answer: string }>;
  /** Câu trả lời mặc định khi không khớp answer nào (fb_join_group). */
  defaultAnswer?: string;
  /** Tự tick đồng ý nội quy nhóm (fb_join_group, mặc định true). */
  agreeRules?: boolean;
  /** Username, id số, hoặc URL Fanpage (fb_page_*). */
  pageId?: string;
  /** Theo dõi Fanpage trước khi like/comment (fb_page_interact). */
  doFollow?: boolean;
  /** Thích bài gần nhất trên Fanpage (fb_page_interact, mặc định true). */
  doLike?: boolean;
  /** Bình luận bài gần nhất — cần params.text (fb_page_interact). */
  doComment?: boolean;
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
