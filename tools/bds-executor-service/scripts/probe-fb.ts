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

  // Bước findpost: mở profile theo TÊN (qua people search), lấy permalink bài viết gần nhất.
  if (step === 'findpost') {
    const name = process.argv[3] ?? '';
    if (!name) {
      process.stderr.write('Cần: npx tsx scripts/probe-fb.ts findpost "Tên người"\n');
      process.exit(1);
    }
    await page.goto(`https://www.facebook.com/search/people/?q=${encodeURIComponent(name)}`, {
      waitUntil: 'domcontentloaded',
    });
    await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => undefined);
    await sleep(6000);
    const profileLink = page.locator(`a:has-text("${name}")`).first();
    if (!(await profileLink.isVisible({ timeout: 5000 }).catch(() => false))) {
      process.stdout.write(`KHONG THAY profile "${name}" trong ket qua tim kiem.\n`);
      await sessions.closeAll().catch(() => undefined);
      process.exit(2);
    }
    const profileHref = (await profileLink.getAttribute('href').catch(() => null)) ?? '';
    process.stdout.write(`PROFILE=${profileHref}\n`);
    await profileLink.click().catch(() => undefined);
    await sleep(6000);
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => undefined);
    process.stdout.write(`PROFILE_URL=${page.url()}\n`);

    const links = await page.evaluate(() => {
      const hrefs: string[] = [];
      for (const a of Array.from(document.querySelectorAll('a[href]'))) {
        const h = (a as HTMLAnchorElement).href;
        if (/\/(posts|permalink|videos|photo)/.test(h) || /story_fbid=/.test(h) || /\/permalink\//.test(h)) {
          if (!hrefs.includes(h)) hrefs.push(h);
        }
      }
      return hrefs.slice(0, 15);
    });
    process.stdout.write('\n===== PERMALINK UNG VIEN =====\n');
    for (const h of links) process.stdout.write(h + '\n');
    await sessions.closeAll().catch(() => undefined);
    process.exit(0);
  }

  // Bước pages: tìm FANPAGE theo từ khóa (read-only list).
  if (step === 'pages') {
    const kw = process.argv[3] ?? 'bất động sản';
    await page.goto(`https://www.facebook.com/search/pages/?q=${encodeURIComponent(kw)}`, {
      waitUntil: 'domcontentloaded',
    });
    await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => undefined);
    await sleep(6000);
    const rows = await page.evaluate(() => {
      const out: Array<Record<string, string>> = [];
      const seen = new Set<string>();
      for (const a of Array.from(document.querySelectorAll('a[href*="facebook.com"]'))) {
        const href = (a as HTMLAnchorElement).href;
        const m = href.match(/facebook\.com\/([^/?]+)\/?$/);
        if (!m) continue;
        const slug = m[1] ?? '';
        if (['search', 'groups', 'watch', 'gaming', 'marketplace'].includes(slug)) continue;
        const name = (a.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 50);
        if (!name || seen.has(slug)) continue;
        seen.add(slug);
        out.push({ slug, name, href });
        if (out.length >= 15) break;
      }
      return out;
    });
    process.stdout.write(`\n===== FANPAGE (${kw}) =====\n`);
    for (const r of rows) process.stdout.write(JSON.stringify(r) + '\n');
    await sessions.closeAll().catch(() => undefined);
    process.exit(0);
  }

  // Bước dialogurl: mở TRỰC TIẾP 1 nhóm theo URL, bấm Join, dump hộp thoại gia nhập (KHÔNG submit).
  if (step === 'dialogurl') {
    const gurl = process.argv[3] ?? '';
    if (!gurl) {
      process.stderr.write('Cần: npx tsx scripts/probe-fb.ts dialogurl <url nhóm>\n');
      process.exit(1);
    }
    await page.goto(gurl, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => undefined);
    await sleep(6000);
    const joinBtn = page
      .locator(
        '[aria-label^="Join group" i][role="button"], [aria-label^="Tham gia nhóm" i][role="button"], div[role="button"]:has-text("Join group"), div[role="button"]:has-text("Tham gia nhóm")',
      )
      .first();
    if (await joinBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await joinBtn.click({ timeout: 4000 }).catch(() => undefined);
      process.stdout.write('(da bam Join)\n');
      await sleep(3500);
    } else {
      process.stdout.write('(KHONG thay nut Join tren trang nhom)\n');
    }
    const dlg = await page.evaluate(() => {
      const d = document.querySelector('div[role="dialog"]');
      if (!d) return [];
      const out: Array<Record<string, string>> = [];
      for (const el of Array.from(
        d.querySelectorAll('input,textarea,[contenteditable="true"],[role="checkbox"],[role="radio"],[role="button"],[aria-label],h1,h2,h3,span,label'),
      )) {
        const rect = (el as HTMLElement).getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        const text = (el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 80);
        const aria = el.getAttribute('aria-label') ?? '';
        const tag = el.tagName.toLowerCase();
        const role = el.getAttribute('role') ?? '';
        const editable = el.getAttribute('contenteditable') ?? '';
        if (!text && !aria && tag !== 'input' && tag !== 'textarea' && editable !== 'true') continue;
        out.push({ tag, role, editable, aria, text });
      }
      return out;
    });
    process.stdout.write(`\n===== HOP THOAI (${dlg.length} phan tu) =====\n`);
    for (const it of dlg) process.stdout.write(JSON.stringify(it) + '\n');
    await page.screenshot({ path: './debug/probe-fb-dialogurl.png', fullPage: false }).catch(() => undefined);
    process.stdout.write('(da chup: ./debug/probe-fb-dialogurl.png)\n');
    await page.keyboard.press('Escape').catch(() => undefined);
    await sessions.closeAll().catch(() => undefined);
    process.exit(0);
  }

  // Bước grouptypes (READ-ONLY): liệt kê nhóm + nhãn quyền riêng tư (Public/Private) để biết có nhóm kín không.
  if (step === 'grouptypes') {
    const kw = process.argv[3] ?? 'bất động sản';
    await page.goto(`https://www.facebook.com/search/groups/?q=${encodeURIComponent(kw)}`, {
      waitUntil: 'domcontentloaded',
    });
    await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => undefined);
    await sleep(6000);
    // cuộn để tải thêm
    for (let s = 0; s < 4; s += 1) {
      await page.mouse.wheel(0, 1600);
      await sleep(1500);
    }
    const rows = await page.evaluate(() => {
      const out: Array<Record<string, string>> = [];
      const seen = new Set<string>();
      for (const a of Array.from(document.querySelectorAll('a[href*="/groups/"]'))) {
        const href = (a as HTMLAnchorElement).href;
        const m = href.match(/\/groups\/([^/?]+)/);
        if (!m) continue;
        const id = m[1];
        if (seen.has(id)) continue;
        const name = (a.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 40);
        if (!name) continue;
        let node: HTMLElement | null = a as HTMLElement;
        let info = '';
        for (let k = 0; k < 7 && node; k += 1) {
          node = node.parentElement;
          const t = node?.textContent ?? '';
          if (/(riêng tư|private|công khai|public)/i.test(t) && /(member|thành viên)/i.test(t)) {
            info = t.replace(/\s+/g, ' ').slice(0, 90);
            break;
          }
        }
        const priv = /riêng tư|private/i.test(info) ? 'PRIVATE' : /công khai|public/i.test(info) ? 'public' : '?';
        seen.add(id);
        out.push({ priv, name, info });
      }
      return out.slice(0, 30);
    });
    process.stdout.write(`\n===== NHOM (${kw}) =====\n`);
    for (const r of rows) process.stdout.write(`${r.priv}\t${r.name}\t| ${r.info}\n`);
    process.stdout.write(`\nTONG: ${rows.length}, PRIVATE: ${rows.filter((r) => r.priv === 'PRIVATE').length}\n`);
    await sessions.closeAll().catch(() => undefined);
    process.exit(0);
  }

  // Bước joindialog: bấm Join lần lượt, DỪNG ở nhóm đầu tiên mở hộp thoại (nhóm kín),
  // dump toàn bộ cấu trúc hộp thoại (câu hỏi / ô trả lời / checkbox nội quy / nút gửi). KHÔNG submit.
  if (step === 'joindialog') {
    const kw = process.argv[3] ?? 'bất động sản';
    await page.goto(`https://www.facebook.com/search/groups/?q=${encodeURIComponent(kw)}`, {
      waitUntil: 'domcontentloaded',
    });
    await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => undefined);
    await sleep(6000);

    const dumpDialog = (): Promise<Array<Record<string, string>>> =>
      page.evaluate(() => {
        const dlg = document.querySelector('div[role="dialog"]');
        if (!dlg) return [];
        const out: Array<Record<string, string>> = [];
        const els = dlg.querySelectorAll(
          'input,textarea,[contenteditable="true"],[role="checkbox"],[role="radio"],[role="button"],[aria-label],h1,h2,h3,span,label',
        );
        for (const el of Array.from(els)) {
          const rect = (el as HTMLElement).getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) continue;
          const text = (el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 70);
          const aria = el.getAttribute('aria-label') ?? '';
          const role = el.getAttribute('role') ?? '';
          const tag = el.tagName.toLowerCase();
          const editable = el.getAttribute('contenteditable') ?? '';
          const type = el.getAttribute('type') ?? '';
          const checked = el.getAttribute('aria-checked') ?? '';
          if (!text && !aria && tag !== 'input' && tag !== 'textarea' && editable !== 'true') continue;
          out.push({ tag, role, type, editable, checked, aria, text });
        }
        return out;
      });

    // cuộn để tải thêm kết quả (nhóm private thường nằm sâu).
    for (let s = 0; s < 5; s += 1) {
      await page.mouse.wheel(0, 1700);
      await sleep(1200);
    }
    // CHỈ bấm Join các nút thuộc nhóm PRIVATE (đọc nhãn quyền riêng tư của hàng chứa nút).
    const privBtns = await page.evaluate(() => {
      const res: string[] = [];
      const btns = document.querySelectorAll(
        'div[aria-label^="Join group" i][role="button"], div[aria-label^="Tham gia nhóm" i][role="button"]',
      );
      for (const b of Array.from(btns)) {
        let node: HTMLElement | null = b as HTMLElement;
        let info = '';
        for (let k = 0; k < 9 && node; k += 1) {
          node = node.parentElement;
          const t = node?.textContent ?? '';
          if (/(riêng tư|private)/i.test(t) && /(member|thành viên)/i.test(t)) {
            info = 'PRIVATE';
            break;
          }
          if (/(công khai|public)/i.test(t) && /(member|thành viên)/i.test(t)) break;
        }
        if (info === 'PRIVATE') {
          const aria = b.getAttribute('aria-label') ?? '';
          if (aria) res.push(aria);
        }
      }
      return res;
    });
    process.stdout.write(`\nNhom PRIVATE tim thay: ${privBtns.length} -> ${JSON.stringify(privBtns)}\n`);
    let foundDialog = false;
    for (const aria of privBtns) {
      const btn = page.locator(`[aria-label="${aria.replace(/"/g, '\\"')}"][role="button"]`).first();
      if (!(await btn.isVisible({ timeout: 3000 }).catch(() => false))) continue;
      process.stdout.write(`\n[PRIVATE] bam: ${aria}\n`);
      await btn.scrollIntoViewIfNeeded().catch(() => undefined);
      await btn.click({ timeout: 4000 }).catch(() => undefined);
      await sleep(3500);
      const dlg = await dumpDialog();
      if (dlg.length > 0) {
        foundDialog = true;
        process.stdout.write(`===== HOP THOAI GIA NHAP (nhom kin) =====\n`);
        for (const it of dlg) process.stdout.write(JSON.stringify(it) + '\n');
        await page.screenshot({ path: './debug/probe-fb-joindialog.png', fullPage: false }).catch(() => undefined);
        process.stdout.write('(da chup: ./debug/probe-fb-joindialog.png)\n');
        await page.keyboard.press('Escape').catch(() => undefined);
        await sleep(1500);
        break;
      }
      process.stdout.write('(khong mo hop thoai -> co the da gui yeu cau truc tiep)\n');
      await sleep(2000);
    }
    if (!foundDialog) process.stdout.write('\nKHONG gap hop thoai nhom kin nao.\n');
    await sessions.closeAll().catch(() => undefined);
    process.exit(0);
  }

  // Bước groups: tìm NHÓM theo từ khóa, in danh sách nhóm + nút "Tham gia"/"Join".
  if (step === 'groups') {
    const kw = process.argv[3] ?? 'bất động sản';
    await page.goto(`https://www.facebook.com/search/groups/?q=${encodeURIComponent(kw)}`, {
      waitUntil: 'domcontentloaded',
    });
    await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => undefined);
    await sleep(6000);
    process.stdout.write(`URL: ${page.url()}\n`);

    const groups = await page.evaluate(() => {
      const out: Array<Record<string, string>> = [];
      for (const a of Array.from(document.querySelectorAll('a[href*="/groups/"]'))) {
        const href = (a as HTMLAnchorElement).href;
        const m = href.match(/\/groups\/([^/?]+)/);
        if (!m) continue;
        const text = (a.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 40);
        if (!text) continue;
        out.push({ id: m[1], name: text, href });
      }
      // unique theo id
      const seen = new Set<string>();
      return out.filter((g) => (seen.has(g.id) ? false : (seen.add(g.id), true))).slice(0, 15);
    });
    process.stdout.write('\n===== NHOM TIM THAY =====\n');
    for (const g of groups) process.stdout.write(JSON.stringify(g) + '\n');

    const buttons = await page.evaluate(() => {
      const out: Array<Record<string, string>> = [];
      for (const el of Array.from(document.querySelectorAll('[role="button"],[aria-label]'))) {
        const aria = el.getAttribute('aria-label') ?? '';
        const text = (el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 30);
        const hay = `${aria} ${text}`.toLowerCase();
        if (/tham gia|join/.test(hay)) {
          out.push({ tag: el.tagName.toLowerCase(), aria, text });
        }
      }
      return out.slice(0, 20);
    });
    process.stdout.write('\n===== NUT THAM GIA / JOIN =====\n');
    for (const b of buttons) process.stdout.write(JSON.stringify(b) + '\n');

    await page.screenshot({ path: './debug/probe-fb-groups.png', fullPage: false }).catch(() => undefined);
    process.stdout.write('(da chup: ./debug/probe-fb-groups.png)\n');
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
