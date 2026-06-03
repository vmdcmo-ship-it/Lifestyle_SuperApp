import { randomDelayMs, sleep } from '../safety/delay.js';
import type { QuotaManager } from '../safety/quotaManager.js';
import type { ContentGenerator } from './contentGenerator.js';
import type { ActionResult, OutreachAction, OutreachResult, OutreachExecutor, OutreachTask } from './types.js';

const ACTION_TO_CONFIG: Record<OutreachAction, string> = {
  add_friend: 'add_friend',
  message: 'message_new',
  add_group: 'add_group',
};

export interface OutreachOptions {
  applyDelay: boolean;
  sleepFn: (ms: number) => Promise<void>;
  onLog?: (message: string) => void;
}

const DEFAULTS: Omit<OutreachOptions, 'onLog'> = { applyDelay: true, sleepFn: sleep };

export interface OutreachRunReport {
  results: OutreachResult[];
  pausedAccounts: string[];
  sent: number;
  pendingApproval: number;
  skipped: number;
}

export class OutreachRunner {
  private readonly quota: QuotaManager;

  private readonly executor: OutreachExecutor;

  private readonly content: ContentGenerator;

  private readonly opts: OutreachOptions;

  private readonly platform = 'zalo';

  constructor(
    quota: QuotaManager,
    executor: OutreachExecutor,
    content: ContentGenerator,
    options: Partial<OutreachOptions> = {},
  ) {
    this.quota = quota;
    this.executor = executor;
    this.content = content;
    this.opts = { ...DEFAULTS, ...options };
  }

  private log(message: string): void {
    this.opts.onLog?.(message);
  }

  async run(tasks: OutreachTask[]): Promise<OutreachRunReport> {
    const report: OutreachRunReport = { results: [], pausedAccounts: [], sent: 0, pendingApproval: 0, skipped: 0 };

    for (const task of tasks) {
      const draft = await this.content.generate(task);
      const configAction = ACTION_TO_CONFIG[task.action];

      if (!task.approved) {
        report.results.push({ ...this.base(task), status: 'draft_pending_approval', content: draft });
        report.pendingApproval += 1;
        this.log(`DRAFT (chờ duyệt) ${task.phone} [${task.action}]`);
        continue;
      }

      const decision = this.quota.permit(task.accountId, this.platform, configAction);
      if (!decision.allowed) {
        report.results.push({ ...this.base(task), status: 'skipped', content: draft, reason: decision.reason });
        report.skipped += 1;
        this.log(`SKIP ${task.phone} [${task.action}]: ${decision.reason}`);
        continue;
      }

      if (this.opts.applyDelay) {
        const range = this.quota.getDelayRange(this.platform, configAction);
        const ms = randomDelayMs(range.min, range.max);
        this.log(`DELAY ${ms}ms truoc ${task.action} -> ${task.phone}`);
        await this.opts.sleepFn(ms);
      }

      const actionResult = await this.execute(task, draft);
      if (actionResult.status === 'checkpoint') {
        this.quota.pauseAccount(task.accountId, 'checkpoint');
        if (!report.pausedAccounts.includes(task.accountId)) {
          report.pausedAccounts.push(task.accountId);
        }
        report.results.push({ ...this.base(task), status: 'checkpoint', content: draft });
        this.log(`CHECKPOINT -> PHANH ${task.accountId}`);
        continue;
      }
      if (actionResult.status === 'error') {
        report.results.push({ ...this.base(task), status: 'error', content: draft, reason: actionResult.detail });
        continue;
      }

      this.quota.record(task.accountId, this.platform, configAction);
      report.results.push({ ...this.base(task), status: 'sent', content: draft });
      report.sent += 1;
      this.log(`SENT ${task.phone} [${task.action}]`);
    }

    return report;
  }

  private base(task: OutreachTask): Pick<OutreachResult, 'phone' | 'accountId' | 'action'> {
    return { phone: task.phone, accountId: task.accountId, action: task.action };
  }

  private execute(task: OutreachTask, content: string): Promise<ActionResult> {
    if (task.action === 'add_friend') {
      return this.executor.addFriend(task.phone, task.accountId, content);
    }
    if (task.action === 'add_group') {
      return this.executor.addToGroup(task.phone, task.accountId, task.groupId);
    }
    return this.executor.sendMessage(task.phone, task.accountId, content);
  }
}
