import { Injectable } from '@nestjs/common';

/** Chống replay `jti` trong TTL token (in-memory; multi-instance cần Redis sau). */
@Injectable()
export class AuthSyncJtiStore {
  private readonly store = new Map<string, number>();

  /** Trả false nếu `jti` đã dùng hoặc token hết hạn. */
  consumeIfValid(jti: string, expSec: number): boolean {
    const now = Math.floor(Date.now() / 1000);
    if (expSec < now) {
      return false;
    }
    if (this.store.has(jti)) {
      return false;
    }
    this.store.set(jti, expSec);
    if (this.store.size > 25_000) {
      this.prune(now);
    }
    return true;
  }

  private prune(now: number): void {
    for (const [k, e] of this.store) {
      if (e < now) {
        this.store.delete(k);
      }
    }
  }
}
