import { randomDelayMs, sleep } from '../safety/delay.js';
import type { QuotaManager } from '../safety/quotaManager.js';
import type { CommentGenerator } from './commentGenerator.js';
import type { CommentResult, FbExecutor, FbPost } from './types.js';

export interface FbRunnerOptions {
  applyDelay: boolean;
  sleepFn: (ms: number) => Promise<void>;
  onLog?: (message: string) => void;
}

const DEFAULTS: Omit<FbRunnerOptions, 'onLog'> = { applyDelay: true, sleepFn: sleep };

export interface FbRunReport {
  results: CommentResult[];
  pausedAccounts: string[];
  commented: number;
  pendingApproval: number;
  skipped: number;
  notRelevant: number;
}

export class FbCommentRunner {
  private readonly quota: QuotaManager;

  private readonly executor: FbExecutor;

  private readonly generator: CommentGenerator;

  private readonly opts: FbRunnerOptions;

  private readonly platform = 'facebook';

  private readonly action = 'comment';

  private lastPostedGroup: Record<string, string> = {};

  constructor(
    quota: QuotaManager,
    executor: FbExecutor,
    generator: CommentGenerator,
    options: Partial<FbRunnerOptions> = {},
  ) {
    this.quota = quota;
    this.executor = executor;
    this.generator = generator;
    this.opts = { ...DEFAULTS, ...options };
  }

  private log(message: string): void {
    this.opts.onLog?.(message);
  }

  async run(posts: FbPost[]): Promise<FbRunReport> {
    const report: FbRunReport = {
      results: [],
      pausedAccounts: [],
      commented: 0,
      pendingApproval: 0,
      skipped: 0,
      notRelevant: 0,
    };

    for (const post of posts) {
      const decision = await this.generator.generate(post);
      const base = { postId: post.postId, groupId: post.groupId, accountId: post.accountId };

      if (!decision.shouldComment) {
        report.results.push({ ...base, outcome: 'skipped_not_relevant', comment: '', reason: decision.reason, hasCta: false });
        report.notRelevant += 1;
        this.log(`SKIP (khong phu hop) ${post.postId}: ${decision.reason}`);
        continue;
      }

      if (!post.approved) {
        report.results.push({ ...base, outcome: 'draft_pending_approval', comment: decision.comment, hasCta: decision.hasCta });
        report.pendingApproval += 1;
        this.log(`DRAFT (cho duyet) ${post.postId}${decision.hasCta ? ' [co CTA]' : ''}`);
        continue;
      }

      const permit = this.quota.permit(post.accountId, this.platform, this.action);
      if (!permit.allowed) {
        report.results.push({ ...base, outcome: 'skipped', comment: decision.comment, reason: permit.reason, hasCta: decision.hasCta });
        report.skipped += 1;
        this.log(`SKIP ${post.postId}: ${permit.reason}`);
        continue;
      }

      if (this.lastPostedGroup[post.accountId] === post.groupId) {
        report.results.push({ ...base, outcome: 'skipped', comment: decision.comment, reason: 'same_group_consecutive', hasCta: decision.hasCta });
        report.skipped += 1;
        this.log(`SKIP ${post.postId}: 2 bai lien tiep cung nhom`);
        continue;
      }

      if (this.opts.applyDelay) {
        const range = this.quota.getDelayRange(this.platform, this.action);
        const ms = randomDelayMs(range.min, range.max);
        this.log(`DELAY ${ms}ms truoc comment ${post.postId}`);
        await this.opts.sleepFn(ms);
      }

      await this.executor.like(post.postId, post.accountId);
      const result = await this.executor.comment(post.postId, post.accountId, decision.comment);

      if (result.status === 'checkpoint') {
        this.quota.pauseAccount(post.accountId, 'checkpoint');
        if (!report.pausedAccounts.includes(post.accountId)) {
          report.pausedAccounts.push(post.accountId);
        }
        report.results.push({ ...base, outcome: 'checkpoint', comment: decision.comment, hasCta: decision.hasCta });
        this.log(`CHECKPOINT -> PHANH ${post.accountId}`);
        continue;
      }
      if (result.status === 'error') {
        report.results.push({ ...base, outcome: 'error', comment: decision.comment, reason: result.detail, hasCta: decision.hasCta });
        continue;
      }

      this.quota.record(post.accountId, this.platform, this.action);
      this.lastPostedGroup[post.accountId] = post.groupId;
      report.results.push({ ...base, outcome: 'commented', comment: decision.comment, hasCta: decision.hasCta });
      report.commented += 1;
      this.log(`COMMENTED ${post.postId}`);
    }

    return report;
  }
}
