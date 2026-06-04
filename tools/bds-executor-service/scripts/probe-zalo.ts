import { loadConfig } from '../src/config.js';
import { SessionManager } from '../src/browser/sessionManager.js';

const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

async function main(): Promise<void> {
  const sessions = new SessionManager({ ...loadConfig(), headless: false, backend: 'playwright' });
  const page = await sessions.getPage('zalo_acc01');
  await page.goto('https://chat.zalo.me/', { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => undefined);
  await sleep(6000);

  // Đóng popup đồng bộ nếu có.
  for (const t of ['Tôi không muốn đồng bộ', 'Để sau', 'Bỏ qua', 'Đóng']) {
    const el = page.locator(`text=${t}`).first();
    if (await el.isVisible().catch(() => false)) {
      await el.click().catch(() => undefined);
      process.stdout.write(`(đã đóng popup: ${t})\n`);
      break;
    }
  }
  await sleep(1500);

  const step = (process.argv[2] ?? 'header').toLowerCase();

  if (step === 'modal' || step === 'search') {
    // Mở popup "Thêm bạn".
    const btn = page.locator('[data-id="btn_Main_AddFrd"]').first();
    await btn.click().catch(() => undefined);
    process.stdout.write('(đã bấm nút Thêm bạn)\n');
    await sleep(2500);
  }

  if (step === 'search') {
    // Nhập 1 SĐT rồi bấm "Tìm kiếm" để đọc DOM trạng thái kết quả (read-only).
    const phone = process.argv[3] ?? '0356999998';
    await page.locator('[data-id="txt_Main_AddFrd_Phone"]').first().fill(phone).catch(() => undefined);
    await sleep(800);
    await page.locator('[data-id="btn_Main_AddFrd_Search"]').first().click().catch(() => undefined);
    process.stdout.write(`(đã tìm SĐT: ${phone})\n`);
    await sleep(3000);
  }

  const collect = async (): Promise<Array<Record<string, string | number>>> =>
    page.evaluate(() => {
      const out: Array<Record<string, string | number>> = [];
      const els = Array.from(
        document.querySelectorAll('[title],[aria-label],input,[data-id],[role="button"],button'),
      );
      for (const el of els) {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        const text = (el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 30);
        out.push({
          tag: el.tagName.toLowerCase(),
          text,
          title: el.getAttribute('title') ?? '',
          aria: el.getAttribute('aria-label') ?? '',
          dataId: el.getAttribute('data-id') ?? '',
          placeholder: el.getAttribute('placeholder') ?? '',
          cls: (el.getAttribute('class') ?? '').slice(0, 45),
          x: Math.round(rect.left),
          y: Math.round(rect.top),
        });
      }
      return out;
    });

  const items = await collect();

  if (step === 'modal' || step === 'search') {
    process.stdout.write(`\n===== PHAN TU MODAL (step=${step}) =====\n`);
    for (const it of items) {
      if (it.tag === 'input' || it.placeholder || it.text || it.dataId) {
        process.stdout.write(JSON.stringify(it) + '\n');
      }
    }
  } else {
    process.stdout.write('\n===== PHAN TU HEADER (y<150) =====\n');
    for (const it of items) {
      if ((it.y as number) < 150 && (it.title || it.aria || it.placeholder || it.dataId || it.tag === 'input')) {
        process.stdout.write(JSON.stringify(it) + '\n');
      }
    }
    process.stdout.write('\n===== TAT CA INPUT =====\n');
    for (const it of items) {
      if (it.tag === 'input') process.stdout.write(JSON.stringify(it) + '\n');
    }
  }

  await sessions.closeAll().catch(() => undefined);
  process.exit(0);
}

main().catch((err: unknown) => {
  process.stderr.write(`LOI probe: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
