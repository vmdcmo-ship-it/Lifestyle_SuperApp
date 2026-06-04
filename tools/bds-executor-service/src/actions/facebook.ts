import type { Page } from 'playwright';
import { CHECKPOINT, ERROR, OK, type ActionParams, type ActionResponse } from '../types.js';
import { detectCheckpoint, humanPause, type SessionManager } from '../browser/sessionManager.js';
import { clickFirst, dumpDebug, firstVisible } from '../browser/dom.js';
import { CHECKPOINT_MARKERS, FACEBOOK } from '../selectors.js';
import { handleJoinDialog } from './fbGroupDialog.js';

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

  // Bấm nút "Leave a comment" để mở/đưa con trỏ vào ô soạn (nếu chưa mở sẵn).
  await clickFirst(page, FACEBOOK.commentButton, 5000);
  await humanPause(500, 1200);

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

/** URL hội thoại Messenger. recipientId là user id hoặc URL đầy đủ. */
function messageUrl(recipientId: string): string {
  if (recipientId.startsWith('http')) return recipientId;
  return `https://www.facebook.com/messages/t/${recipientId}`;
}

export async function message(
  sessions: SessionManager,
  accountId: string,
  params: ActionParams,
): Promise<ActionResponse> {
  const recipientId = params.recipientId ?? '';
  const text = params.message ?? params.text ?? '';
  if (!recipientId || !text) return ERROR('thiếu params.recipientId hoặc params.message');
  const page = await sessions.getPage(accountId);

  await page.goto(messageUrl(recipientId), { waitUntil: 'domcontentloaded' });
  await humanPause(1500, 2800);
  if (await isCheckpoint(page)) return CHECKPOINT('Facebook checkpoint khi mở Messenger');

  // Chờ ô soạn tin (Messenger tải sau vài giây).
  const box = await firstVisible(page, FACEBOOK.messageBox, 15000);
  if (!box) {
    await dumpDebug(page, 'fb-no-message-box');
    return ERROR('không thấy ô soạn tin Messenger (selector FACEBOOK.messageBox)');
  }
  await box.click({ timeout: 4000 }).catch(() => undefined);
  await humanPause(500, 1400);
  await page.keyboard.type(text, { delay: 25 });
  await humanPause(700, 1600);
  await page.keyboard.press('Enter');
  await humanPause();

  if (await isCheckpoint(page)) return CHECKPOINT('FB chặn khi gửi tin nhắn Messenger');
  return OK();
}

/** Tìm nhóm theo TỪ KHÓA và xin tham gia (tối đa `max` nhóm). Nhóm cần trả lời câu hỏi -> bỏ qua. */
export async function joinGroup(
  sessions: SessionManager,
  accountId: string,
  params: ActionParams,
): Promise<ActionResponse> {
  const keyword = (params.keyword ?? params.text ?? '').trim();
  if (!keyword) return ERROR('thiếu params.keyword (từ khóa tìm nhóm)');
  const max = Math.max(1, Math.min(params.max ?? 1, 10));
  const page = await sessions.getPage(accountId);

  await page.goto(`https://www.facebook.com/search/groups/?q=${encodeURIComponent(keyword)}`, {
    waitUntil: 'domcontentloaded',
  });
  await humanPause(2500, 4200);
  if (await isCheckpoint(page)) return CHECKPOINT('Facebook checkpoint khi tìm nhóm');

  const joined: Array<{ name: string; status: string; answered?: number; checkedRules?: number }> = [];
  const skipped: Array<{ name: string; reason: string }> = [];
  const agreeRules = params.agreeRules ?? true;

  for (let i = 0; i < max; i += 1) {
    // Lấy lại nút Join mỗi vòng vì DOM đổi sau khi tham gia nhóm trước.
    const btn = await firstVisible(page, FACEBOOK.groupJoinButton, 8000);
    if (!btn) break;
    const aria = (await btn.getAttribute('aria-label').catch(() => '')) ?? '';
    const name = aria.replace(/^(join group|tham gia nhóm)\s*/i, '').trim() || `nhóm #${i + 1}`;
    await btn.scrollIntoViewIfNeeded().catch(() => undefined);
    await btn.click({ timeout: 4000 }).catch(() => undefined);
    await humanPause(1800, 3000);

    // Nhóm kín thường mở hộp thoại "Trả lời câu hỏi để tham gia" / xác nhận nội quy.
    const dlg = await handleJoinDialog(page, {
      answers: params.answers,
      defaultAnswer: params.defaultAnswer,
      agreeRules,
      phone: params.phone,
    });
    if (dlg.handled) {
      if (!dlg.submitted) {
        // Không gửi được (vd câu hỏi bắt buộc không có câu trả lời phù hợp) -> chụp lại, bỏ qua.
        await dumpDebug(page, 'fb-group-join-dialog');
        await page.keyboard.press('Escape').catch(() => undefined);
        skipped.push({ name, reason: dlg.note ?? 'submit_failed' });
        await humanPause(1500, 2500);
        continue;
      }
      joined.push({ name, status: 'requested_with_answers', answered: dlg.answered, checkedRules: dlg.checkedRules });
    } else {
      joined.push({ name, status: 'requested_or_joined' });
    }

    await humanPause(3500, 7000); // giãn cách chống spam giữa các nhóm
    if (await isCheckpoint(page)) return CHECKPOINT('FB chặn khi tham gia nhóm');
  }

  if (joined.length === 0 && skipped.length === 0) {
    await dumpDebug(page, 'fb-no-group-join');
    return ERROR('không thấy nhóm nào để tham gia (selector FACEBOOK.groupJoinButton)');
  }
  return OK({ keyword, joined, skipped });
}
