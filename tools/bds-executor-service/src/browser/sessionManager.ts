import { join, resolve } from 'node:path';
import { mkdir } from 'node:fs/promises';
import { chromium, type BrowserContext, type Page } from 'playwright';
import type { ServiceConfig } from '../config.js';

/**
 * Quản lý 1 browser context BỀN cho mỗi account (userDataDir riêng → giữ đăng nhập).
 * Tái sử dụng context giữa các request để không phải login lại.
 */
export class SessionManager {
  private readonly config: ServiceConfig;

  private readonly contexts = new Map<string, BrowserContext>();

  private readonly locks = new Map<string, Promise<BrowserContext>>();

  constructor(config: ServiceConfig) {
    this.config = config;
  }

  /** Đường dẫn profile của account (tạo nếu chưa có). */
  profilePath(accountId: string): string {
    return resolve(join(this.config.profilesDir, accountId));
  }

  private buildOptions(accountId: string): Parameters<typeof chromium.launchPersistentContext>[1] {
    const proxyUrl = this.config.accountProxies[accountId];
    const options: Parameters<typeof chromium.launchPersistentContext>[1] = {
      headless: this.config.headless,
      locale: this.config.locale,
      timezoneId: this.config.timezone,
      viewport: { width: 1280, height: 800 },
      args: ['--disable-blink-features=AutomationControlled'],
    };
    if (proxyUrl) {
      options.proxy = { server: proxyUrl };
    }
    return options;
  }

  /** Lấy (hoặc mở) context bền cho account. An toàn khi gọi song song (lock theo account). */
  async getContext(accountId: string): Promise<BrowserContext> {
    const existing = this.contexts.get(accountId);
    if (existing) return existing;

    const inFlight = this.locks.get(accountId);
    if (inFlight) return inFlight;

    const promise = (async () => {
      const dir = this.profilePath(accountId);
      await mkdir(dir, { recursive: true });
      const ctx = await chromium.launchPersistentContext(dir, this.buildOptions(accountId));
      this.contexts.set(accountId, ctx);
      this.locks.delete(accountId);
      return ctx;
    })();
    this.locks.set(accountId, promise);
    return promise;
  }

  /** Lấy 1 page sẵn có hoặc tạo mới trong context của account. */
  async getPage(accountId: string): Promise<Page> {
    const ctx = await this.getContext(accountId);
    const pages = ctx.pages();
    return pages[0] ?? (await ctx.newPage());
  }

  async closeAccount(accountId: string): Promise<void> {
    const ctx = this.contexts.get(accountId);
    if (ctx) {
      await ctx.close();
      this.contexts.delete(accountId);
    }
  }

  async closeAll(): Promise<void> {
    await Promise.all([...this.contexts.values()].map((c) => c.close()));
    this.contexts.clear();
  }
}

/** Lỗi đặc biệt báo platform chặn (captcha / bắt đăng nhập lại). Server map -> status:"checkpoint". */
export class CheckpointError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CheckpointError';
  }
}

/**
 * Dò dấu hiệu checkpoint phổ biến trên page. Tuỳ chỉnh thêm theo thực tế.
 * Trả true nếu URL/nội dung khớp marker chặn.
 */
export async function detectCheckpoint(page: Page, markers: string[]): Promise<boolean> {
  const url = page.url().toLowerCase();
  if (markers.some((m) => url.includes(m.toLowerCase()))) return true;
  try {
    const body = (await page.locator('body').innerText({ timeout: 2000 })).toLowerCase();
    const textMarkers = ['captcha', 'xác minh', 'unusual activity', 'bảo mật tài khoản', 'verify it\u2019s you'];
    return textMarkers.some((m) => body.includes(m.toLowerCase()));
  } catch {
    return false;
  }
}

/** Delay ngẫu nhiên giống người (ms). Pipeline đã có quota/delay tổng; đây là vi-delay thao tác. */
export async function humanPause(min = 400, max = 1400): Promise<void> {
  const ms = Math.floor(min + Math.random() * (max - min));
  await new Promise((r) => setTimeout(r, ms));
}
