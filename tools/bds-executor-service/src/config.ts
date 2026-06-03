import 'dotenv/config';

export type ExecutorBackend = 'mock' | 'playwright';

export interface ServiceConfig {
  backend: ExecutorBackend;
  port: number;
  token: string;
  profilesDir: string;
  headless: boolean;
  accountProxies: Record<string, string>;
  locale: string;
  timezone: string;
}

function parseProxies(raw: string | undefined): Record<string, string> {
  if (!raw || raw.trim() === '') return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === 'object') {
      return parsed as Record<string, string>;
    }
  } catch {
    /* ignore - trả về rỗng */
  }
  return {};
}

export function loadConfig(): ServiceConfig {
  return {
    backend: (process.env.EXECUTOR_BACKEND ?? 'playwright').toLowerCase() === 'mock' ? 'mock' : 'playwright',
    port: Number(process.env.PORT ?? '5678'),
    token: process.env.BDS_EXECUTOR_TOKEN ?? '',
    profilesDir: process.env.PROFILES_DIR ?? './profiles',
    headless: (process.env.HEADLESS ?? 'false').toLowerCase() === 'true',
    accountProxies: parseProxies(process.env.ACCOUNT_PROXIES),
    locale: process.env.BROWSER_LOCALE ?? 'vi-VN',
    timezone: process.env.BROWSER_TIMEZONE ?? 'Asia/Ho_Chi_Minh',
  };
}
