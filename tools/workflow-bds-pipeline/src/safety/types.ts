export interface QuotaRule {
  platform: string;
  action: string;
  limitPerAccountPerDay: number;
  limitAccountNew: number;
  delayMinSeconds: number;
  delayMaxSeconds: number;
  activeHours: string;
  note: string;
}

export type AccountStatus = 'active' | 'paused';

export interface AccountInfo {
  status: AccountStatus;
  isNew: boolean;
  pausedReason?: string;
  pausedAt?: string;
}

export interface SafetyState {
  date: string;
  usage: Record<string, Record<string, number>>;
  accounts: Record<string, AccountInfo>;
}

export type DenyReason = 'paused' | 'quota_exceeded' | 'outside_active_hours' | 'no_rule';

export interface PermitDecision {
  allowed: boolean;
  reason?: DenyReason;
  remaining?: number;
}
