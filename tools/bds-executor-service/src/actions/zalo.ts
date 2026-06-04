import type { Page } from 'playwright';
import { CHECKPOINT, ERROR, OK, type ActionParams, type ActionResponse } from '../types.js';
import { detectCheckpoint, humanPause, type SessionManager } from '../browser/sessionManager.js';
import { anyVisible, clickFirst, dumpDebug, fillFirst, firstVisible } from '../browser/dom.js';
import { CHECKPOINT_MARKERS, ZALO } from '../selectors.js';

const ZALO_URL = 'https://chat.zalo.me/';

async function isCheckpoint(page: Page): Promise<boolean> {
  return detectCheckpoint(page, CHECKPOINT_MARKERS.zaloUrl, CHECKPOINT_MARKERS.bodyText);
}

async function ensureReady(page: Page): Promise<ActionResponse | null> {
  if (!page.url().includes('chat.zalo.me')) {
    await page.goto(ZALO_URL, { waitUntil: 'domcontentloaded' });
    await humanPause();
  }
  if (await isCheckpoint(page)) return CHECKPOINT('Zalo yêu cầu đăng nhập lại / xác minh');
  return null;
}

/** Mở popup "Thêm bạn" + tìm theo SĐT. Trả về { found, name } hoặc ném checkpoint qua response. */
async function searchByPhone(page: Page, phone: string): Promise<ActionResponse | { found: boolean; name?: string }> {
  if (!(await clickFirst(page, ZALO.addFriendButton))) {
    await dumpDebug(page, 'zalo-no-addfriend-button');
    return ERROR('không thấy nút "Thêm bạn" (cần tinh chỉnh selector ZALO.addFriendButton)');
  }
  await humanPause();
  if (!(await fillFirst(page, ZALO.phoneInput, phone))) {
    await dumpDebug(page, 'zalo-no-phone-input');
    return ERROR('không thấy ô nhập SĐT (cần tinh chỉnh selector ZALO.phoneInput)');
  }
  await humanPause(800, 1800);
  await page.keyboard.press('Enter');
  await humanPause(1200, 2200);

  if (await isCheckpoint(page)) return CHECKPOINT('Zalo chặn khi tìm SĐT');
  if (await anyVisible(page, ZALO.notFound)) return { found: false };

  const profile = await firstVisible(page, ZALO.profileName, 4000);
  if (profile) {
    const name = (await profile.innerText().catch(() => '')).trim();
    return name ? { found: true, name } : { found: true };
  }
  return { found: false };
}

export async function checkPhone(
  sessions: SessionManager,
  accountId: string,
  params: ActionParams,
): Promise<ActionResponse> {
  const phone = params.phone ?? '';
  if (!phone) return ERROR('thiếu params.phone');
  const page = await sessions.getPage(accountId);
  const guard = await ensureReady(page);
  if (guard) return guard;

  const r = await searchByPhone(page, phone);
  if ('status' in r) return r;
  if (!r.found) return OK({ has_zalo: false });
  return r.name ? OK({ has_zalo: true, display_name: r.name }) : OK({ has_zalo: true });
}

export async function addFriend(
  sessions: SessionManager,
  accountId: string,
  params: ActionParams,
): Promise<ActionResponse> {
  const phone = params.phone ?? '';
  const message = params.message ?? '';
  if (!phone) return ERROR('thiếu params.phone');
  const page = await sessions.getPage(accountId);
  const guard = await ensureReady(page);
  if (guard) return guard;

  const r = await searchByPhone(page, phone);
  if ('status' in r) return r;
  if (!r.found) return ERROR('SĐT không có Zalo, không thể kết bạn');

  if (!(await clickFirst(page, ZALO.addFriendConfirm))) {
    await dumpDebug(page, 'zalo-no-addfriend-confirm');
    return ERROR('không thấy nút kết bạn (selector ZALO.addFriendConfirm)');
  }
  await humanPause();
  if (message) {
    await fillFirst(page, ZALO.inviteMessageBox, message);
    await humanPause(600, 1500);
  }
  await clickFirst(page, ZALO.sendInvite);
  await humanPause();

  if (await isCheckpoint(page)) return CHECKPOINT('Zalo chặn khi kết bạn');
  return OK();
}

export async function sendMessage(
  sessions: SessionManager,
  accountId: string,
  params: ActionParams,
): Promise<ActionResponse> {
  const phone = params.phone ?? '';
  const message = params.message ?? '';
  if (!phone || !message) return ERROR('thiếu params.phone hoặc params.message');
  const page = await sessions.getPage(accountId);
  const guard = await ensureReady(page);
  if (guard) return guard;

  const r = await searchByPhone(page, phone);
  if ('status' in r) return r;
  if (!r.found) return ERROR('SĐT không có Zalo, không thể nhắn tin');

  await clickFirst(page, ZALO.openChat);
  await humanPause();
  if (!(await fillFirst(page, ZALO.chatInput, message))) {
    await dumpDebug(page, 'zalo-no-chat-input');
    return ERROR('không thấy ô soạn tin (selector ZALO.chatInput)');
  }
  await humanPause(700, 1800);
  await page.keyboard.press('Enter');
  await humanPause();

  if (await isCheckpoint(page)) return CHECKPOINT('Zalo chặn khi nhắn tin');
  return OK();
}

export async function addToGroup(
  sessions: SessionManager,
  accountId: string,
  params: ActionParams,
): Promise<ActionResponse> {
  const phone = params.phone ?? '';
  const groupId = params.groupId ?? '';
  if (!phone || !groupId) return ERROR('thiếu params.phone hoặc params.groupId');
  const page = await sessions.getPage(accountId);
  const guard = await ensureReady(page);
  if (guard) return guard;

  // Mở nhóm qua tìm kiếm theo groupId/tên nhóm.
  if (!(await fillFirst(page, ZALO.searchConversation, groupId))) {
    await dumpDebug(page, 'zalo-no-search');
    return ERROR('không thấy ô tìm kiếm hội thoại (selector ZALO.searchConversation)');
  }
  await humanPause(1000, 2000);
  await page.keyboard.press('Enter');
  await humanPause();

  if (!(await clickFirst(page, ZALO.addMemberButton))) {
    await dumpDebug(page, 'zalo-no-addmember');
    return ERROR('không thấy "Thêm thành viên" (selector ZALO.addMemberButton) — kiểm tra đã mở đúng nhóm chưa');
  }
  await humanPause();
  if (!(await fillFirst(page, ZALO.phoneInput, phone))) {
    await dumpDebug(page, 'zalo-no-member-phone');
    return ERROR('không thấy ô nhập SĐT thành viên (selector ZALO.phoneInput)');
  }
  await humanPause(800, 1600);
  await clickFirst(page, ZALO.addMemberConfirm);
  await humanPause();

  if (await isCheckpoint(page)) return CHECKPOINT('Zalo chặn khi thêm nhóm');
  return OK();
}
