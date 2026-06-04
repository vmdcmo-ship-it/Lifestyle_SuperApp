import { loadConfig } from '../src/config.js';
import { SessionManager } from '../src/browser/sessionManager.js';

const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

async function main(): Promise<void> {
  const step = (process.argv[2] ?? 'feed').toLowerCase();
  const sessions = new SessionManager({ ...loadConfig(), headless: false, backend: 'playwright' });
  const page = await sessions.getPage('fb_acc01');

  // Bước resolve: mở Messenger, tìm + mở hội thoại theo TÊN, in ra URL (chứa id).
  if (step === 'resolve') {
    const name = process.argv[3] ?? '';
    if (!name) {
      process.stderr.write('Cần: npx tsx scripts/probe-fb.ts resolve "Tên người"\n');
      process.exit(1);
    }
    await page.goto('https://www.facebook.com/messages/t/', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => undefined);
    await sleep(7000);
    const before = page.url();
    const item = page.getByText(name, { exact: false }).first();
    if (!(await item.isVisible({ timeout: 5000 }).catch(() => false))) {
      process.stdout.write(`KHONG THAY hoi thoai ten "${name}" trong danh sach chat.\n`);
      await sessions.closeAll().catch(() => undefined);
      process.exit(2);
    }
    await item.click().catch(() => undefined);
    await sleep(4500);
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => undefined);
    process.stdout.write(`URL_HOI_THOAI=${page.url()}\n`);
    process.stdout.write(`(truoc khi click: ${before})\n`);
    await sessions.closeAll().catch(() => undefined);
    process.exit(0);
  }

  const url =
    step === 'messenger'
      ? 'https://www.messenger.com/'
      : step === 'messages'
        ? 'https://www.facebook.com/messages/t/'
        : 'https://www.facebook.com/';
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => undefined);
  await sleep(7000);
  // Chờ ổn định sau mọi redirect (messenger/messages hay điều hướng nhiều lần).
  await page.waitForLoadState('domcontentloaded').catch(() => undefined);
  await sleep(3000);

  process.stdout.write(`URL hiện tại: ${page.url()}\n`);

  const evalItems = (): Promise<Array<Record<string, string | number>>> =>
    page.evaluate(() => {
    const out: Array<Record<string, string | number>> = [];
    const els = Array.from(
      document.querySelectorAll('[aria-label],[role="button"],[contenteditable="true"],[role="textbox"]'),
    );
    for (const el of els) {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      const aria = el.getAttribute('aria-label') ?? '';
      const role = el.getAttribute('role') ?? '';
      const editable = el.getAttribute('contenteditable') ?? '';
      const text = (el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 25);
      out.push({
        tag: el.tagName.toLowerCase(),
        aria,
        role,
        editable,
        text,
        x: Math.round(rect.left),
        y: Math.round(rect.top),
      });
    }
    return out;
  });

  let items: Array<Record<string, string | number>> = [];
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      items = await evalItems();
      break;
    } catch {
      await sleep(2500);
    }
  }

  // Lọc các phần tử có khả năng là Like / Comment / ô soạn tin.
  const KEYS = [
    'thích',
    'like',
    'bình luận',
    'comment',
    'viết',
    'tin nhắn',
    'message',
    'gửi',
    'send',
    'chia sẻ',
    'share',
    'cảm xúc',
    'reaction',
  ];
  process.stdout.write(`\n===== PHAN TU LIEN QUAN (step=${step}) =====\n`);
  const seen = new Set<string>();
  for (const it of items) {
    const hay = `${it.aria} ${it.text}`.toLowerCase();
    const isEditable = it.editable === 'true' || it.role === 'textbox';
    if (isEditable || KEYS.some((k) => hay.includes(k))) {
      const key = `${it.tag}|${it.aria}|${it.role}|${it.editable}`;
      if (seen.has(key)) continue;
      seen.add(key);
      process.stdout.write(JSON.stringify(it) + '\n');
    }
  }

  await sessions.closeAll().catch(() => undefined);
  process.exit(0);
}

main().catch((err: unknown) => {
  process.stderr.write(`LOI probe-fb: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
