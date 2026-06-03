import { readFile } from 'node:fs/promises';
import { parseCsv } from '../csv.js';
import type { QuotaRule } from './types.js';

function ruleKey(platform: string, action: string): string {
  return `${platform.trim().toLowerCase()}:${action.trim().toLowerCase()}`;
}

export class QuotaConfig {
  private readonly rules: Map<string, QuotaRule>;

  constructor(rules: QuotaRule[]) {
    this.rules = new Map(rules.map((r) => [ruleKey(r.platform, r.action), r]));
  }

  static async fromCsv(path: string): Promise<QuotaConfig> {
    const records = parseCsv(await readFile(path, 'utf8'));
    const rules: QuotaRule[] = records
      .filter((r) => (r.platform ?? '').trim() !== '')
      .map((r) => ({
        platform: (r.platform ?? '').trim(),
        action: (r.action ?? '').trim(),
        limitPerAccountPerDay: Number(r.limit_per_account_per_day ?? '0'),
        limitAccountNew: Number(r.limit_account_new ?? '0'),
        delayMinSeconds: Number(r.delay_min_seconds ?? '60'),
        delayMaxSeconds: Number(r.delay_max_seconds ?? '180'),
        activeHours: (r.active_hours ?? '08:00-22:00').trim(),
        note: (r.note ?? '').trim(),
      }));
    return new QuotaConfig(rules);
  }

  getRule(platform: string, action: string): QuotaRule | undefined {
    return this.rules.get(ruleKey(platform, action));
  }
}
