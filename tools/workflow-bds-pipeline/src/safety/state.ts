import { readFile, writeFile } from 'node:fs/promises';
import type { AccountInfo, SafetyState } from './types.js';

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function emptyState(): SafetyState {
  return { date: today(), usage: {}, accounts: {} };
}

/**
 * Lưu trạng thái an toàn (quota dùng trong ngày + trạng thái account) ra file JSON.
 * Tự reset usage khi sang ngày mới.
 */
export class SafetyStateStore {
  private readonly path: string;

  private state: SafetyState;

  private constructor(path: string, state: SafetyState) {
    this.path = path;
    this.state = state;
  }

  static async load(path: string): Promise<SafetyStateStore> {
    let state: SafetyState;
    try {
      state = JSON.parse(await readFile(path, 'utf8')) as SafetyState;
    } catch {
      state = emptyState();
    }
    if (state.date !== today()) {
      state = { date: today(), usage: {}, accounts: state.accounts ?? {} };
    }
    return new SafetyStateStore(path, state);
  }

  async save(): Promise<void> {
    await writeFile(this.path, JSON.stringify(this.state, null, 2), 'utf8');
  }

  getUsage(accountId: string, key: string): number {
    return this.state.usage[accountId]?.[key] ?? 0;
  }

  incrementUsage(accountId: string, key: string): void {
    const acc = this.state.usage[accountId] ?? {};
    acc[key] = (acc[key] ?? 0) + 1;
    this.state.usage[accountId] = acc;
  }

  getAccount(accountId: string): AccountInfo {
    return this.state.accounts[accountId] ?? { status: 'active', isNew: false };
  }

  setAccount(accountId: string, info: AccountInfo): void {
    this.state.accounts[accountId] = info;
  }

  pauseAccount(accountId: string, reason: string): void {
    const current = this.getAccount(accountId);
    this.state.accounts[accountId] = {
      ...current,
      status: 'paused',
      pausedReason: reason,
      pausedAt: new Date().toISOString(),
    };
  }
}
