import type { QuotaConfig } from './configLoader.js';
import { isWithinActiveHours } from './delay.js';
import type { SafetyStateStore } from './state.js';
import type { PermitDecision, QuotaRule } from './types.js';

function usageKey(platform: string, action: string): string {
  return `${platform.toLowerCase()}:${action.toLowerCase()}`;
}

export class QuotaManager {
  private readonly config: QuotaConfig;

  private readonly state: SafetyStateStore;

  constructor(config: QuotaConfig, state: SafetyStateStore) {
    this.config = config;
    this.state = state;
  }

  private dailyLimit(rule: QuotaRule, isNew: boolean): number {
    return isNew && rule.limitAccountNew > 0 ? rule.limitAccountNew : rule.limitPerAccountPerDay;
  }

  /** Quyết định có được phép thực hiện 1 hành động cho 1 account ngay bây giờ không. */
  permit(accountId: string, platform: string, action: string, now: Date = new Date()): PermitDecision {
    const account = this.state.getAccount(accountId);
    if (account.status === 'paused') {
      return { allowed: false, reason: 'paused' };
    }
    const rule = this.config.getRule(platform, action);
    if (!rule) {
      return { allowed: false, reason: 'no_rule' };
    }
    if (!isWithinActiveHours(rule.activeHours, now)) {
      return { allowed: false, reason: 'outside_active_hours' };
    }
    const limit = this.dailyLimit(rule, account.isNew);
    const used = this.state.getUsage(accountId, usageKey(platform, action));
    if (used >= limit) {
      return { allowed: false, reason: 'quota_exceeded', remaining: 0 };
    }
    return { allowed: true, remaining: limit - used };
  }

  record(accountId: string, platform: string, action: string): void {
    this.state.incrementUsage(accountId, usageKey(platform, action));
  }

  /** Phanh: tạm dừng account (vd khi gặp checkpoint/captcha). */
  pauseAccount(accountId: string, reason: string): void {
    this.state.pauseAccount(accountId, reason);
  }

  getDelayRange(platform: string, action: string): { min: number; max: number } {
    const rule = this.config.getRule(platform, action);
    return rule ? { min: rule.delayMinSeconds, max: rule.delayMaxSeconds } : { min: 60, max: 180 };
  }
}
