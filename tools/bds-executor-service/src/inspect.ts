import { loadConfig } from './config.js';
import { SessionManager } from './browser/sessionManager.js';
import { dumpDebug } from './browser/dom.js';
import * as zalo from './actions/zalo.js';
import * as facebook from './actions/facebook.js';
import type { ActionParams, ActionResponse } from './types.js';

/**
 * Công cụ TINH CHỈNH SELECTOR — chạy 1 flow với account ĐÃ ĐĂNG NHẬP, headless=false,
 * tự dump screenshot + HTML vào debug/ để bạn soi DOM thật rồi sửa selectors.ts.
 *
 * Ví dụ:
 *   npm run inspect -- --account zalo_acc01 --flow open
 *   npm run inspect -- --account zalo_acc01 --flow check_phone --phone 0901234567
 *   npm run inspect -- --account zalo_acc01 --flow send_message --phone 0901234567 --message "Chào anh/chị"
 *   npm run inspect -- --account zalo_acc01 --flow add_group --phone 0901234567 --groupId "Tên nhóm"
 *   npm run inspect -- --account fb_acc01 --flow fb_comment --postId <url> --text "..."
 *
 * Sau khi chạy: trình duyệt GIỮ MỞ để bạn dùng DevTools (Inspect) tìm selector,
 * nhấn Enter ở terminal để dump lần cuối + đóng.
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

const ZALO_HOME = 'https://chat.zalo.me/';
const FB_HOME = 'https://www.facebook.com/';

function buildParams(flags: Map<string, string>): ActionParams {
  const p: ActionParams = {};
  const phone = flags.get('phone');
  const message = flags.get('message');
  const groupId = flags.get('groupId');
  const postId = flags.get('postId');
  const text = flags.get('text');
  const recipientId = flags.get('recipientId');
  if (phone) p.phone = phone;
  if (message) p.message = message;
  if (groupId) p.groupId = groupId;
  if (postId) p.postId = postId;
  if (text) p.text = text;
  if (recipientId) p.recipientId = recipientId;
  return p;
}

async function main(): Promise<void> {
  const flags = parseFlags(process.argv.slice(2));
  const accountId = flags.get('account');
  const flow = (flags.get('flow') ?? 'open').toLowerCase();
  if (!accountId) throw new Error('Cần --account <id>.');

  const params = buildParams(flags);

  // Inspect luôn chạy hiển thị để quan sát.
  const config = { ...loadConfig(), headless: false, backend: 'playwright' as const };
  const sessions = new SessionManager(config);
  const context = await sessions.getContext(accountId);
  const page = await sessions.getPage(accountId);

  let result: ActionResponse | null = null;
  switch (flow) {
    case 'open':
      await page.goto(ZALO_HOME, { waitUntil: 'domcontentloaded' });
      break;
    case 'fb_open':
      await page.goto(FB_HOME, { waitUntil: 'domcontentloaded' });
      break;
    case 'check_phone':
      result = await zalo.checkPhone(sessions, accountId, params);
      break;
    case 'add_friend':
      result = await zalo.addFriend(sessions, accountId, params);
      break;
    case 'send_message':
      result = await zalo.sendMessage(sessions, accountId, params);
      break;
    case 'add_group':
      result = await zalo.addToGroup(sessions, accountId, params);
      break;
    case 'fb_like':
      result = await facebook.like(sessions, accountId, params);
      break;
    case 'fb_comment':
      result = await facebook.comment(sessions, accountId, params);
      break;
    case 'fb_message':
      result = await facebook.message(sessions, accountId, params);
      break;
    default:
      throw new Error(`flow không hợp lệ: ${flow}`);
  }

  if (result) {
    process.stdout.write(`\nKết quả flow "${flow}": ${JSON.stringify(result, null, 2)}\n`);
  }

  // Chờ SPA (Zalo/FB) render xong trước khi dump để DOM có đầy đủ phần tử.
  process.stdout.write('Chờ giao diện tải xong (tối đa ~20s)...\n');
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => undefined);
  await new Promise((r) => setTimeout(r, 5000));

  const base = await dumpDebug(page, `inspect-${flow}`);
  process.stdout.write(`Đã dump DOM/ảnh: ${base}.png / ${base}.html\n`);
  process.stdout.write(
    '\nMẹo: mở DevTools (F12) để soi selector. Xong thì ĐÓNG cửa sổ trình duyệt (KHÔNG cần Enter)\n' +
      'để dump lần cuối + kết thúc. (Tự đóng sau 10 phút nếu quên.)\n',
  );

  const MAX_WAIT_MS = 10 * 60 * 1000;
  await new Promise<void>((resolve) => {
    let done = false;
    const finish = (): void => {
      if (done) return;
      done = true;
      resolve();
    };
    context.on('close', finish);
    const timer = setTimeout(finish, MAX_WAIT_MS);
    if (typeof timer.unref === 'function') timer.unref();
  });

  await dumpDebug(page, `inspect-${flow}-final`).catch(() => undefined);
  await sessions.closeAll().catch(() => undefined);
  process.exit(0);
}

main().catch((err: unknown) => {
  process.stderr.write(`Lỗi inspect: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exitCode = 1;
});
