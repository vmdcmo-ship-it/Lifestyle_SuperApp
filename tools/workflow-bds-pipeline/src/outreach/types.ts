export type OutreachAction = 'add_friend' | 'message' | 'add_group';

export type ActionStatus = 'sent' | 'checkpoint' | 'error' | 'skipped' | 'draft_pending_approval';

export interface OutreachTask {
  phone: string;
  accountId: string;
  action: OutreachAction;
  projectId: string;
  projectName: string;
  leadName: string;
  leadNeed: string;
  groupId: string;
  groupName: string;
  approved: boolean;
}

export interface ActionResult {
  phone: string;
  action: OutreachAction;
  status: 'sent' | 'checkpoint' | 'error';
  detail?: string;
}

export interface OutreachResult {
  phone: string;
  accountId: string;
  action: OutreachAction;
  status: ActionStatus;
  content: string;
  reason?: string;
}

/**
 * Cổng thực thi hành động Zalo có tác động (gửi đi). Production cài bằng OpenClaw.
 */
export interface OutreachExecutor {
  addFriend(phone: string, accountId: string, message: string): Promise<ActionResult>;
  sendMessage(phone: string, accountId: string, message: string): Promise<ActionResult>;
  addToGroup(phone: string, accountId: string, groupId: string): Promise<ActionResult>;
}
