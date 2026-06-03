import type { Page } from 'playwright';
import { CHECKPOINT, ERROR, OK, type ActionParams, type ActionResponse } from '../types.js';
import { detectCheckpoint, humanPause, type SessionManager } from '../browser/sessionManager.js';

const CHECKPOINT_MARKERS = ['checkpoint', 'login', 'two_step_verification'];

/** URL bài viết. Nếu postId là URL đầy đủ thì dùng luôn; nếu là id thì ghép. */
function postUrl(postId: string): string {
  if (postId.startsWith('http')) return postId;
  return `https://www.facebook.com/${postId}`;
}

async function ensureFbReady(page: Page, postId: string): Promise<ActionResponse | null> {
  await page.goto(postUrl(postId), { waitUntil: 'domcontentloaded' });
  await humanPause(1000, 2200);
  if (await detectCheckpoint(page, CHECKPOINT_MARKERS)) {
    return CHECKPOINT('Facebook checkpoint / yêu cầu đăng nhập lại');
  }
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

  // TODO[selector]: nút Thích. FB dùng aria-label đa ngôn ngữ.
  const likeBtn = page.locator('[aria-label="Thích"], [aria-label="Like"]').first();
  await likeBtn.click({ timeout: 8000 }).catch(() => undefined);
  await humanPause();
  if (await detectCheckpoint(page, CHECKPOINT_MARKERS)) return CHECKPOINT('FB chặn khi like');
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

  // TODO[selector]: ô bình luận. Click -> gõ -> Enter.
  const box = page.locator('[aria-label*="bình luận" i], [aria-label*="comment" i]').first();
  await box.click({ timeout: 8000 }).catch(() => undefined);
  await humanPause(500, 1400);
  await page.keyboard.type(text, { delay: 30 });
  await humanPause(700, 1600);
  await page.keyboard.press('Enter');
  await humanPause();

  if (await detectCheckpoint(page, CHECKPOINT_MARKERS)) return CHECKPOINT('FB chặn khi comment');
  return OK();
}
