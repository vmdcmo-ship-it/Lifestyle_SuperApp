import type { Page } from 'playwright';
import { CHECKPOINT, ERROR, OK, type ActionParams, type ActionResponse } from '../types.js';
import { detectCheckpoint, humanPause, type SessionManager } from '../browser/sessionManager.js';
import { anyVisible, clickFirst, dumpDebug, fillFirst, firstVisible } from '../browser/dom.js';
import { CHECKPOINT_MARKERS, ZALO } from '../selectors.js';

const ZALO_URL = 'https://chat.zalo.me/';

async function isCheckpoint(page: Page): Promise<boolean> {
  return detectCheckpoint(page, CHECKPOINT_MARKERS.zaloUrl, CHECKPOINT_MARKERS.bodyText);
}

/** Đóng popup "đồng bộ" nếu Zalo hiển thị sau khi vào. */
async function dismissSyncPopup(page: Page): Promise<void> {
  for (const t of ['Tôi không muốn đồng bộ', 'Để sau', 'Bỏ qua']) {
    const loc = page.locator(`text=${t}`).first();
    if (await loc.isVisible({ timeout: 800 }).catch(() => false)) {
      await loc.click().catch(() => undefined);
      break;
    }
  }
}

async function ensureReady(page: Page): Promise<ActionResponse | null> {
  if (!page.url().includes('chat.zalo.me')) {
    await page.goto(ZALO_URL, { waitUntil: 'domcontentloaded' });
  }
  if (await isCheckpoint(page)) return CHECKPOINT('Zalo yêu cầu đăng nhập lại / xác minh');

  // Tự đăng nhập + render SPA có thể mất ~10s -> chờ app shell sẵn sàng (ô tìm kiếm).
  const ready = await page
    .locator(ZALO.searchInput[0])
    .first()
    .waitFor({ state: 'visible', timeout: 30000 })
    .then(() => true)
    .catch(() => false);
  if (!ready) {
    await dumpDebug(page, 'zalo-app-not-ready');
    if (await isCheckpoint(page)) return CHECKPOINT('Zalo chưa đăng nhập (app không sẵn sàng)');
    return ERROR('Zalo app chưa sẵn sàng (không thấy ô tìm kiếm) — có thể cần đăng nhập lại');
  }
  await dismissSyncPopup(page);
  await humanPause(500, 1200);
  return null;
}

/** Mở popup "Thêm bạn" + tìm theo SĐT. Trả về { found, name } hoặc ném checkpoint qua response. */
async function searchByPhone(page: Page, phone: string): Promise<ActionResponse | { found: boolean; name?: string }> {
  // Dọn modal còn sót từ action trước (nếu có).
  await page.keyboard.press('Escape').catch(() => undefined);
  await humanPause(300, 700);
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
  // Modal Zalo có nút "Tìm kiếm" riêng; fallback sang Enter nếu không thấy.
  if (!(await clickFirst(page, ZALO.searchPhoneButton, 2000))) {
    await page.keyboard.press('Enter');
  }
  await humanPause(1200, 2200);

  if (await isCheckpoint(page)) return CHECKPOINT('Zalo chặn khi tìm SĐT');
  if (await anyVisible(page, ZALO.notFound)) return { found: false };

  // Dấu hiệu chắc chắn: modal hồ sơ "Thông tin tài khoản" xuất hiện.
  if (!(await anyVisible(page, ZALO.accountFound))) return { found: false };

  const profile = await firstVisible(page, ZALO.profileName, 3000);
  if (profile) {
    const titleAttr = (await profile.getAttribute('title').catch(() => null)) ?? '';
    const name = (titleAttr || (await profile.innerText().catch(() => ''))).trim();
    return name ? { found: true, name } : { found: true };
  }
  return { found: true };
}

/** Đóng modal thêm bạn / hồ sơ để action sau bắt đầu sạch. */
async function closeModal(page: Page): Promise<void> {
  await page.keyboard.press('Escape').catch(() => undefined);
  await humanPause(300, 700);
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
  // check_phone chỉ đọc trạng thái -> đóng modal lại cho sạch.
  await closeModal(page);
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
  await humanPause(900, 1700); // chờ dialog soạn lời mời mở
  if (message) {
    await fillFirst(page, ZALO.inviteMessageBox, message);
    await humanPause(600, 1500);
  }
  // Nút gửi cuối = "Kết bạn" màu xanh (btn-primary) trong dialog soạn.
  const clicked = await clickFirst(page, ZALO.sendInvite, 5000);
  await humanPause(1200, 2200);

  if (await isCheckpoint(page)) return CHECKPOINT('Zalo chặn khi kết bạn');

  // Xác nhận đã gửi: hồ sơ chuyển sang "Đã gửi lời mời" / "Hủy lời mời".
  if (await anyVisible(page, ZALO.inviteSent, 4000)) {
    await closeModal(page);
    return OK({ invited: true });
  }
  if (!clicked) {
    await dumpDebug(page, 'zalo-invite-not-sent');
    return ERROR('không bấm được nút gửi lời mời (selector ZALO.sendInvite)');
  }
  // Click được nhưng chưa thấy dấu hiệu xác nhận -> coi như đã gửi nhưng cảnh báo.
  await closeModal(page);
  return OK({ invited: true, note: 'không thấy xác nhận rõ ràng' });
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

  if (!(await clickFirst(page, ZALO.openChat, 5000))) {
    await dumpDebug(page, 'zalo-no-openchat');
    return ERROR('không thấy nút "Nhắn tin" (selector ZALO.openChat)');
  }
  await humanPause(1500, 2600); // chờ khung chat mở
  if (!(await fillFirst(page, ZALO.chatInput, message, 10000))) {
    await dumpDebug(page, 'zalo-no-chat-input');
    return ERROR('không thấy ô soạn tin (selector ZALO.chatInput)');
  }
  await humanPause(700, 1800);
  await page.keyboard.press('Enter');
  await humanPause(1200, 2200);

  if (await isCheckpoint(page)) return CHECKPOINT('Zalo chặn khi nhắn tin');

  // Người nhận chặn tin từ người lạ -> tin đã gõ nhưng KHÔNG được giao.
  if (await anyVisible(page, ZALO.messageBlocked, 1500)) {
    return OK({ delivered: false, reason: 'recipient_blocks_strangers' });
  }
  return OK({ delivered: true });
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
