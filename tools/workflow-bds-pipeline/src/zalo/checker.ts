import { randomDelayMs, sleep } from '../safety/delay.js';
import type { QuotaManager } from '../safety/quotaManager.js';
import type { DenyReason } from '../safety/types.js';
import type { ZaloCheckResult, ZaloExecutor } from './types.js';

export interface QueueItem {
  phone: string;
  accountId: string;
}

export interface SkippedItem {
  phone: string;
  accountId: string;
  reason: DenyReason;
}

export interface CheckRunReport {
  results: ZaloCheckResult[];
  skipped: SkippedItem[];
  pausedAccounts: string[];
  processed: number;
}

export interface CheckerOptions {
  platform: string;
  action: string;
  applyDelay: boolean;
  sleepFn: (ms: number) => Promise<void>;
  onLog?: (message: string) => void;
}

const DEFAULTS: Omit<CheckerOptions, 'onLog'> = {
  platform: 'zalo',
  action: 'check_phone',
  applyDelay: true,
  sleepFn: sleep,
};

export class ZaloChecker {
  private readonly quota: QuotaManager;

  private readonly executor: ZaloExecutor;

  private readonly opts: CheckerOptions;

  constructor(quota: QuotaManager, executor: ZaloExecutor, options: Partial<CheckerOptions> = {}) {
    this.quota = quota;
    this.executor = executor;
    this.opts = { ...DEFAULTS, ...options };
  }

  private log(message: string): void {
    this.opts.onLog?.(message);
  }

  async run(items: QueueItem[]): Promise<CheckRunReport> {
    const report: CheckRunReport = { results: [], skipped: [], pausedAccounts: [], processed: 0 };

    for (const item of items) {
      const decision = this.quota.permit(item.accountId, this.opts.platform, this.opts.action);
      if (!decision.allowed) {
        report.skipped.push({ phone: item.phone, accountId: item.accountId, reason: decision.reason ?? 'no_rule' });
        this.log(`SKIP ${item.phone} (${item.accountId}): ${decision.reason}`);
        continue;
      }

      if (this.opts.applyDelay) {
        const range = this.quota.getDelayRange(this.opts.platform, this.opts.action);
        const ms = randomDelayMs(range.min, range.max);
        this.log(`DELAY ${ms}ms truoc khi xu ly ${item.phone}`);
        await this.opts.sleepFn(ms);
      }

      const result = await this.executor.checkPhone(item.phone, item.accountId);
      report.processed += 1;

      if (result.outcome === 'checkpoint') {
        this.quota.pauseAccount(item.accountId, 'checkpoint');
        if (!report.pausedAccounts.includes(item.accountId)) {
          report.pausedAccounts.push(item.accountId);
        }
        report.results.push(result);
        this.log(`CHECKPOINT -> PHANH account ${item.accountId}, dung xu ly account nay`);
        continue;
      }

      this.quota.record(item.accountId, this.opts.platform, this.opts.action);
      report.results.push(result);
      this.log(`OK ${item.phone}: ${result.outcome}`);
    }

    return report;
  }
}
