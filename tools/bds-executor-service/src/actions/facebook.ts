import type { Page } from 'playwright';
import { CHECKPOINT, ERROR, OK, type ActionParams, type ActionResponse } from '../types.js';
import { detectCheckpoint, humanPause, type SessionManager } from '../browser/sessionManager.js';
import { clickFirst, dumpDebug, firstVisible } from '../browser/dom.js';
import { CHECKPOINT_MARKERS, FACEBOOK } from '../selectors.js';

/** URL bài viết. Nếu postId là URL đầy đủ thì dùng luôn; nếu là id thì ghép. */
function postUrl(postId: string): string {
  if (postId.startsWith('http')) return postId;
  return `https://www.facebook.com/${postId}`;
}

async function isCheckpoint(page: Page): Promise<boolean> {
  return detectCheckpoint(page, CHECKPOINT_MARKERS.fbUrl, CHECKPOINT_MARKERS.bodyText);
}

async function ensureFbReady(page: Page, postId: string): Promise<ActionResponse | null> {
  await page.goto(postUrl(postId), { waitUntil: 'domcontentloaded' });
  await humanPause(1000, 2200);
  if (await isCheckpoint(page)) return CHECKPOINT('Facebook checkpoint / yêu cầu đăng nhập lại');
  return null;
}

export async function like(
  sessions: SessionManager,
  accountId: string,
  params: ActionParams,
): Promise<ActionResponse> {
  const postId = params.postId ?? '';
  if (!postId) return ERROR('thiếu params.postId');
  const page = await sessions.getPage(accountId);
  const guard = await ensureFbReady(page, postId);
  if (guard) return guard;

  if (!(await clickFirst(page, FACEBOOK.likeButton, 8000))) {
    await dumpDebug(page, 'fb-no-like-button');
    return ERROR('không thấy nút Thích (selector FACEBOOK.likeButton)');
  }
  await humanPause();
  if (await isCheckpoint(page)) return CHECKPOINT('FB chặn khi like');
  return OK();
}

export async function comment(
  sessions: SessionManager,
  accountId: string,
  params: ActionParams,
): Promise<ActionResponse> {
  const postId = params.postId ?? '';
  const text = params.text ?? '';
  if (!postId || !text) return ERROR('thiếu params.postId hoặc params.text');
  const page = await sessions.getPage(accountId);
  const guard = await ensureFbReady(page, postId);
  if (guard) return guard;

  const box = await firstVisible(page, FACEBOOK.commentBox, 8000);
  if (!box) {
    await dumpDebug(page, 'fb-no-comment-box');
    return ERROR('không thấy ô bình luận (selector FACEBOOK.commentBox)');
  }
  await box.click({ timeout: 4000 }).catch(() => undefined);
  await humanPause(500, 1400);
  await page.keyboard.type(text, { delay: 30 });
  await humanPause(700, 1600);
  await page.keyboard.press('Enter');
  await humanPause();

  if (await isCheckpoint(page)) return CHECKPOINT('FB chặn khi comment');
  return OK();
}
