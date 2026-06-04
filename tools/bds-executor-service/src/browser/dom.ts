import { join, resolve } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import type { Locator, Page } from 'playwright';

const DEFAULT_TIMEOUT = 6000;

/** Trả về locator đầu tiên VISIBLE trong danh sách ứng viên, hoặc null. */
export async function firstVisible(
  page: Page,
  candidates: readonly string[],
  timeout = DEFAULT_TIMEOUT,
): Promise<Locator | null> {
  const deadline = Date.now() + timeout;
  for (const sel of candidates) {
    const remaining = Math.max(500, deadline - Date.now());
    const loc = page.locator(sel).first();
    const ok = await loc.isVisible({ timeout: Math.min(1500, remaining) }).catch(() => false);
    if (ok) return loc;
  }
  return null;
}

/** Click ứng viên đầu tiên tìm được. Trả về true nếu click được. */
export async function clickFirst(page: Page, candidates: readonly string[], timeout = DEFAULT_TIMEOUT): Promise<boolean> {
  const loc = await firstVisible(page, candidates, timeout);
  if (!loc) return false;
  await loc.click({ timeout: 4000 }).catch(() => undefined);
  return true;
}

/** Điền giá trị vào ứng viên đầu tiên. Trả về true nếu điền được. */
export async function fillFirst(
  page: Page,
  candidates: readonly string[],
  value: string,
  timeout = DEFAULT_TIMEOUT,
): Promise<boolean> {
  const loc = await firstVisible(page, candidates, timeout);
  if (!loc) return false;
  await loc.click({ timeout: 3000 }).catch(() => undefined);
  await loc.fill(value, { timeout: 4000 }).catch(() => undefined);
  return true;
}

/** Có ứng viên nào hiển thị không (vd dấu hiệu "không tìm thấy"). */
export async function anyVisible(page: Page, candidates: readonly string[], timeout = 3000): Promise<boolean> {
  return (await firstVisible(page, candidates, timeout)) !== null;
}

const DEBUG_DIR = resolve(process.env.DEBUG_DIR ?? './debug');

/** Lưu screenshot + HTML để tinh chỉnh selector khi một bước thất bại. */
export async function dumpDebug(page: Page, label: string): Promise<string> {
  await mkdir(DEBUG_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const base = join(DEBUG_DIR, `${label}-${stamp}`);
  await page.screenshot({ path: `${base}.png`, fullPage: true }).catch(() => undefined);
  const html = await page.content().catch(() => '');
  await writeFile(`${base}.html`, html, 'utf8').catch(() => undefined);
  return base;
}
