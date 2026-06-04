import type { Page } from 'playwright';
import { CHECKPOINT, ERROR, OK, type ActionParams, type ActionResponse } from '../types.js';
import { detectCheckpoint, humanPause, type SessionManager } from '../browser/sessionManager.js';
import { clickFirst, dumpDebug, firstVisible } from '../browser/dom.js';
import { CHECKPOINT_MARKERS, FACEBOOK, FACEBOOK_PAGE } from '../selectors.js';
import * as facebook from './facebook.js';

async function isCheckpoint(page: Page): Promise<boolean> {
  return detectCheckpoint(page, CHECKPOINT_MARKERS.fbUrl, CHECKPOINT_MARKERS.bodyText);
}

/** URL Fanpage: username, id số, hoặc URL đầy đủ. */
export function pageUrl(pageId: string): string {
  const id = pageId.trim();
  if (id.startsWith('http')) return id;
  if (/^\d+$/.test(id)) return `https://www.facebook.com/profile.php?id=${id}`;
  return `https://www.facebook.com/${id.replace(/^\/+/, '')}`;
}

async function gotoPage(page: Page, pageId: string): Promise<ActionResponse | null> {
  await page.goto(pageUrl(pageId), { waitUntil: 'domcontentloaded' });
  await humanPause(2000, 3800);
  if (await isCheckpoint(page)) return CHECKPOINT('Facebook checkpoint khi mở Fanpage');
  return null;
}

/** Cuộn timeline Fanpage để tải bài viết. */
async function scrollPageFeed(page: Page, rounds = 3): Promise<void> {
  for (let i = 0; i < rounds; i += 1) {
    await page.mouse.wheel(0, 1400);
    await humanPause(1200, 2200);
  }
}

/** Lấy permalink bài viết gần nhất trên Fanpage (read-only DOM). */
export async function collectLatestPostUrls(page: Page, limit = 5): Promise<string[]> {
  return page.evaluate((max) => {
    const hrefs: string[] = [];
    const seen = new Set<string>();
    for (const a of Array.from(document.querySelectorAll('a[href]'))) {
      const h = (a as HTMLAnchorElement).href;
      if (!/\/(posts|permalink|videos|photo|reel)/.test(h) && !/story_fbid=|fbid=/.test(h)) continue;
      const clean = h.split('?')[0] ?? h;
      if (seen.has(clean)) continue;
      seen.add(clean);
      hrefs.push(h);
      if (hrefs.length >= max) break;
    }
    return hrefs;
  }, limit);
}

/** Tìm Fanpage theo từ khóa (đối thủ / thị trường). */
export async function searchPages(
  sessions: SessionManager,
  accountId: string,
  params: ActionParams,
): Promise<ActionResponse> {
  const keyword = (params.keyword ?? params.text ?? '').trim();
  if (!keyword) return ERROR('thiếu params.keyword (từ khóa tìm Fanpage)');
  const max = Math.max(1, Math.min(params.max ?? 10, 25));
  const page = await sessions.getPage(accountId);

  await page.goto(`https://www.facebook.com/search/pages/?q=${encodeURIComponent(keyword)}`, {
    waitUntil: 'domcontentloaded',
  });
  await humanPause(2500, 4200);
  if (await isCheckpoint(page)) return CHECKPOINT('Facebook checkpoint khi tìm Fanpage');

  for (let s = 0; s < 3; s += 1) {
    await page.mouse.wheel(0, 1200);
    await humanPause(1000, 1800);
  }

  const pages = await page.evaluate((maxItems) => {
    const out: Array<Record<string, string>> = [];
    const seen = new Set<string>();
    for (const a of Array.from(document.querySelectorAll('a[href*="/"]'))) {
      const href = (a as HTMLAnchorElement).href;
      // Fanpage: /PageName hoặc profile.php?id= — loại group, user cá nhân /search
      const m =
        href.match(/facebook\.com\/([^/?]+)\/?$/) ??
        href.match(/profile\.php\?id=(\d+)/);
      if (!m) continue;
      const slug = m[1] ?? '';
      if (!slug || ['search', 'groups', 'watch', 'gaming', 'marketplace', 'messages'].includes(slug)) continue;
      const name = (a.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 80);
      if (!name || name.length < 2) continue;
      let info = '';
      let node: HTMLElement | null = a as HTMLElement;
      for (let k = 0; k < 8 && node; k += 1) {
        node = node.parentElement;
        const t = node?.textContent ?? '';
        if (/(follower|theo dõi|like|thích|page|trang)/i.test(t)) {
          info = t.replace(/\s+/g, ' ').slice(0, 100);
          break;
        }
      }
      const key = slug + href;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ slug, name, href, info });
      if (out.length >= maxItems) break;
    }
    return out;
  }, max);

  if (pages.length === 0) {
    await dumpDebug(page, 'fb-no-pages-search');
    return ERROR('không thấy Fanpage nào (selector tìm kiếm pages)');
  }
  return OK({ keyword, pages });
}

/** Thu thập thông tin công khai Fanpage (CRM / đối thủ). */
export async function pageInfo(
  sessions: SessionManager,
  accountId: string,
  params: ActionParams,
): Promise<ActionResponse> {
  const pageId = (params.pageId ?? params.postId ?? '').trim();
  if (!pageId) return ERROR('thiếu params.pageId (username/URL Fanpage)');
  const page = await sessions.getPage(accountId);
  const guard = await gotoPage(page, pageId);
  if (guard) return guard;

  await scrollPageFeed(page, 2);

  const info = await page.evaluate(() => {
    const body = document.body.innerText.replace(/\s+/g, ' ');
    const pick = (re: RegExp): string | undefined => {
      const m = body.match(re);
      return m?.[1]?.trim().slice(0, 200);
    };
    const title =
      document.querySelector('h1')?.textContent?.trim() ??
      document.title.replace(/\s*\|\s*Facebook.*$/i, '').trim();
    const links: Record<string, string> = {};
    for (const a of Array.from(document.querySelectorAll('a[href^="http"]'))) {
      const h = (a as HTMLAnchorElement).href;
      const t = (a.textContent ?? '').trim();
      if (/tel:/i.test(h) || /\d{9,11}/.test(t)) links.phone = links.phone ?? t.slice(0, 30);
      if (/wa\.me|zalo|messenger|mailto:/i.test(h)) links.contact = links.contact ?? h;
      if (/\.(com|vn|net|org)\//i.test(h) && !/facebook\.com/i.test(h)) links.website = links.website ?? h;
    }
    return {
      name: title.slice(0, 120),
      followers: pick(/([\d.,]+[KMB]?)\s*(followers|người theo dõi)/i),
      likes: pick(/([\d.,]+[KMB]?)\s*(likes|lượt thích)/i),
      category: pick(/(Real Estate|Bất động sản|Property|Nhà đất)[^\n]{0,40}/i),
      aboutSnippet: body.slice(0, 500),
      links,
      pageUrl: location.href,
    };
  });

  const recentPosts = await collectLatestPostUrls(page, 5);
  return OK({ ...info, recentPosts });
}

/** Theo dõi / Thích Fanpage (bước đầu tạo niềm tin, nhận bài từ Page). */
export async function pageFollow(
  sessions: SessionManager,
  accountId: string,
  params: ActionParams,
): Promise<ActionResponse> {
  const pageId = (params.pageId ?? '').trim();
  if (!pageId) return ERROR('thiếu params.pageId');
  const page = await sessions.getPage(accountId);
  const guard = await gotoPage(page, pageId);
  if (guard) return guard;

  if (!(await clickFirst(page, FACEBOOK_PAGE.followButton, 8000))) {
    await dumpDebug(page, 'fb-page-no-follow');
    return ERROR('không thấy nút Theo dõi/Thích Trang (FACEBOOK_PAGE.followButton)');
  }
  await humanPause(1500, 2800);
  if (await isCheckpoint(page)) return CHECKPOINT('FB chặn khi theo dõi Fanpage');
  return OK({ pageId, followed: true });
}

/**
 * Nuôi dưỡng Fanpage: theo dõi (tuỳ chọn) → like + comment bài gần nhất.
 * Nội dung comment do pipeline/Claude sinh — truyền qua params.text (đúng ngữ cảnh).
 */
export async function pageInteract(
  sessions: SessionManager,
  accountId: string,
  params: ActionParams,
): Promise<ActionResponse> {
  const pageId = (params.pageId ?? '').trim();
  const text = (params.text ?? params.message ?? '').trim();
  const doFollow = params.doFollow ?? false;
  const doLike = params.doLike ?? true;
  const doComment = params.doComment ?? Boolean(text);
  if (!pageId) return ERROR('thiếu params.pageId');
  if (doComment && !text) return ERROR('thiếu params.text khi doComment=true');

  const page = await sessions.getPage(accountId);
  const guard = await gotoPage(page, pageId);
  if (guard) return guard;

  const steps: Record<string, boolean | string> = { follow: false, like: false, comment: false };
  let pageName = '';

  const meta = await page.evaluate(() => ({
    name: document.querySelector('h1')?.textContent?.trim() ?? '',
  }));
  pageName = meta.name;

  if (doFollow) {
    const followed = await clickFirst(page, FACEBOOK_PAGE.followButton, 6000);
    steps.follow = followed;
    await humanPause(2000, 3500);
  }

  await scrollPageFeed(page, 4);
  const posts = await collectLatestPostUrls(page, 3);
  if (posts.length === 0) {
    await dumpDebug(page, 'fb-page-no-posts');
    return ERROR('không tìm thấy bài viết nào trên Fanpage để tương tác');
  }
  const targetPost = posts[0]!;

  if (doLike) {
    const likeRes = await facebook.like(sessions, accountId, { postId: targetPost });
    steps.like = likeRes.status === 'ok';
    if (likeRes.status === 'checkpoint') return likeRes;
  }

  if (doComment) {
    const commentRes = await facebook.comment(sessions, accountId, { postId: targetPost, text });
    steps.comment = commentRes.status === 'ok';
    if (commentRes.status === 'checkpoint') return commentRes;
    if (commentRes.status === 'error') {
      return ERROR(`comment thất bại: ${commentRes.message ?? 'unknown'}`);
    }
  }

  if (await isCheckpoint(page)) return CHECKPOINT('FB chặn sau tương tác Fanpage');

  return OK({
    pageId,
    pageName,
    targetPost,
    steps,
    recentPosts: posts,
  });
}

/** Nhắn tin Fanpage qua Messenger (nếu Page bật tin nhắn). */
export async function pageMessage(
  sessions: SessionManager,
  accountId: string,
  params: ActionParams,
): Promise<ActionResponse> {
  const pageId = (params.pageId ?? params.recipientId ?? '').trim();
  const text = (params.message ?? params.text ?? '').trim();
  if (!pageId || !text) return ERROR('thiếu params.pageId hoặc params.message');
  // Messenger thread với Page thường dùng page id/username.
  return facebook.message(sessions, accountId, { recipientId: pageId, message: text });
}
