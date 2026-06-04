import { loadConfig } from './config.js';
import { SessionManager } from './browser/sessionManager.js';

/**
 * Đăng nhập THỦ CÔNG 1 lần cho mỗi account để lưu phiên vào profile bền.
 * Dùng: npm run login -- --account zalo_acc01 --platform zalo
 *       npm run login -- --account fb_acc01 --platform fb
 * Cần HEADLESS=false (mặc định) để bạn thao tác đăng nhập + quét QR.
 *
 * Lưu phiên KHÔNG cần bấm Enter: đăng nhập xong, chỉ cần ĐÓNG cửa sổ trình duyệt.
 * Profile bền (launchPersistentContext) tự ghi cookie xuống đĩa khi đóng.
 */

function parseFlags(argv: string[]): Map<string, string> {
  const map = new Map<string, string>();
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a && a.startsWith('--')) {
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        map.set(a.slice(2), next);
        i += 1;
      } else {
        map.set(a.slice(2), 'true');
      }
    }
  }
  return map;
}

const START_URLS: Record<string, string> = {
  zalo: 'https://chat.zalo.me/',
  fb: 'https://www.facebook.com/',
};

async function main(): Promise<void> {
  const flags = parseFlags(process.argv.slice(2));
  const accountId = flags.get('account');
  const platform = (flags.get('platform') ?? 'zalo').toLowerCase();
  if (!accountId || !START_URLS[platform]) {
    throw new Error('Cần --account <id> và --platform <zalo|fb>.');
  }

  const config = { ...loadConfig(), headless: false };
  const sessions = new SessionManager(config);
  const context = await sessions.getContext(accountId);
  const page = await context.newPage();
  await page.goto(START_URLS[platform], { waitUntil: 'domcontentloaded' });

  process.stdout.write(
    `\nĐã mở ${platform} cho account "${accountId}".\n` +
      `1) Đăng nhập trong cửa sổ trình duyệt (Zalo: quét QR; FB: nhập tài khoản).\n` +
      `2) Xong thì ĐÓNG cửa sổ trình duyệt — phiên tự lưu (KHÔNG cần Enter).\n` +
      `Profile lưu tại: ${sessions.profilePath(accountId)}\n`,
  );

  // Chờ tới khi người dùng đóng trình duyệt (context đóng) hoặc hết thời gian tối đa.
  const MAX_WAIT_MS = 15 * 60 * 1000;
  await new Promise<void>((resolve) => {
    let done = false;
    const finish = (): void => {
      if (done) return;
      done = true;
      resolve();
    };
    context.on('close', finish);
    const timer = setTimeout(() => {
      process.stdout.write('\nHết thời gian chờ (15 phút). Đang lưu & đóng...\n');
      finish();
    }, MAX_WAIT_MS);
    if (typeof timer.unref === 'function') timer.unref();
  });

  await sessions.closeAll().catch(() => undefined);
  process.stdout.write('Đã lưu phiên. Xong.\n');
  process.exit(0);
}

main().catch((err: unknown) => {
  process.stderr.write(`Lỗi login: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exitCode = 1;
});
