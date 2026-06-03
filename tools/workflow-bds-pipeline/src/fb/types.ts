export interface FbPost {
  postId: string;
  groupId: string;
  groupName: string;
  authorName: string;
  content: string;
  accountId: string;
  productBrief: string;
  approved: boolean;
}

export interface CommentDecision {
  shouldComment: boolean;
  reason: string;
  comment: string;
  hasCta: boolean;
}

export type FbActionStatus = 'sent' | 'checkpoint' | 'error';

export interface FbActionResult {
  postId: string;
  status: FbActionStatus;
  detail?: string;
}

export type CommentOutcome = 'commented' | 'draft_pending_approval' | 'skipped_not_relevant' | 'skipped' | 'checkpoint' | 'error';

export interface CommentResult {
  postId: string;
  groupId: string;
  accountId: string;
  outcome: CommentOutcome;
  comment: string;
  reason?: string;
  hasCta: boolean;
}

/**
 * Cổng thực thi hành động Facebook. Production cài bằng OpenClaw.
 * like/seen trước khi comment để hành vi tự nhiên hơn.
 */
export interface FbExecutor {
  like(postId: string, accountId: string): Promise<FbActionResult>;
  comment(postId: string, accountId: string, text: string): Promise<FbActionResult>;
}
