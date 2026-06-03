import type { Page } from 'playwright';
import { CHECKPOINT, ERROR, OK, type ActionParams, type ActionResponse } from '../types.js';
import { detectCheckpoint, humanPause, type SessionManager } from '../browser/sessionManager.js';

const ZALO_URL = 'https://chat.zalo.me/';
const CHECKPOINT_MARKERS = ['login', 'id.zalo.me', 'verify'];

/**
 * LƯU Ý: selector Zalo Web thay đổi theo phiên bản. Các selector dưới là KHUNG mẫu —
 * cần mở DevTools trên máy bạn, kiểm tra và chỉnh lại cho khớp UI hiện tại.
 * Đánh dấu: // TODO[selector]
 */

async function ensureZaloReady(page: Page): Promise<ActionResponse | null> {
  if (!page.url().includes('chat.zalo.me')) {
    await page.goto(ZALO_URL, { waitUntil: 'domcontentloaded' });
    await humanPause();
  }
  if (await detectCheckpoint(page, CHECKPOINT_MARKERS)) {
    return CHECKPOINT('Zalo yêu cầu đăng nhập lại / xác minh');
  }
  return null;
}

export async function checkPhone(
  sessions: SessionManager,
  accountId: string,
  params: ActionParams,
): Promise<ActionResponse> {
  const phone = params.phone ?? '';
  if (!phone) return ERROR('thiếu params.phone');
  const page = await sessions.getPage(accountId);
  const guard = await ensureZaloReady(page);
  if (guard) return guard;

  // TODO[selector]: mở ô "Thêm bạn" và tìm theo SĐT.
  const addFriendBtn = page.locator('[data-id="btn_Main_AddFrd"], [title="Thêm bạn"]').first();
  await addFriendBtn.click({ timeout: 8000 }).catch(() => undefined);
  await humanPause();

  const searchInput = page.locator('input[placeholder*="số điện thoại" i], input[type="tel"]').first();
  await searchInput.fill(phone, { timeout: 8000 });
  await humanPause(800, 1800);
  await searchInput.press('Enter');
  await humanPause(1200, 2200);

  if (await detectCheckpoint(page, CHECKPOINT_MARKERS)) {
    return CHECKPOINT('Zalo chặn khi tìm SĐT');
  }

  // TODO[selector]: khu vực kết quả. Có hồ sơ -> has_zalo. "Không tìm thấy" -> no_zalo.
  const notFound = await page
    .locator('text=/không tìm thấy|chưa có tài khoản|không có kết quả/i')
    .first()
    .isVisible()
    .catch(() => false);
  if (notFound) return OK({ has_zalo: false });

  const profile = page.locator('[class*="profile"] [class*="name"], .profile-name').first();
  const hasProfile = await profile.isVisible({ timeout: 4000 }).catch(() => false);
  if (hasProfile) {
    const displayName = (await profile.innerText().catch(() => '')).trim();
    return OK(displayName ? { has_zalo: true, display_name: displayName } : { has_zalo: true });
  }
  // Không xác định rõ -> coi như không có (an toàn, tránh nhắn nhầm).
  return OK({ has_zalo: false });
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
  const guard = await ensureZaloReady(page);
  if (guard) return guard;

  // TODO[selector]: tìm SĐT như checkPhone, rồi bấm "Kết bạn" + nhập lời nhắn + gửi.
  const found = await checkPhone(sessions, accountId, params);
  if (found.status === 'checkpoint') return found;
  if (found.status === 'ok' && found.data?.has_zalo === false) {
    return ERROR('SĐT không có Zalo, không thể kết bạn');
  }

  const addBtn = page.locator('text=/kết bạn|gửi lời mời/i').first();
  await addBtn.click({ timeout: 8000 }).catch(() => undefined);
  await humanPause();
  if (message) {
    const msgBox = page.locator('textarea, [contenteditable="true"]').first();
    await msgBox.fill(message, { timeout: 6000 }).catch(() => undefined);
    await humanPause(600, 1500);
  }
  const sendBtn = page.locator('text=/gửi lời mời|gửi/i').last();
  await sendBtn.click({ timeout: 8000 }).catch(() => undefined);
  await humanPause();

  if (await detectCheckpoint(page, CHECKPOINT_MARKERS)) return CHECKPOINT('Zalo chặn khi kết bạn');
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
  const guard = await ensureZaloReady(page);
  if (guard) return guard;

  // TODO[selector]: mở hội thoại với SĐT (đã là bạn) rồi gõ tin.
  const found = await checkPhone(sessions, accountId, params);
  if (found.status === 'checkpoint') return found;

  const openChat = page.locator('text=/nhắn tin|gửi tin nhắn/i').first();
  await openChat.click({ timeout: 8000 }).catch(() => undefined);
  await humanPause();

  const input = page.locator('#richInput, [contenteditable="true"], textarea').first();
  await input.click({ timeout: 8000 }).catch(() => undefined);
  await input.fill(message, { timeout: 8000 });
  await humanPause(700, 1800);
  await input.press('Enter');
  await humanPause();

  if (await detectCheckpoint(page, CHECKPOINT_MARKERS)) return CHECKPOINT('Zalo chặn khi nhắn tin');
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
  const guard = await ensureZaloReady(page);
  if (guard) return guard;

  // TODO[selector]: mở nhóm groupId -> Thêm thành viên -> tìm SĐT -> xác nhận.
  // Khung tối thiểu; cần chỉnh theo UI thật.
  if (await detectCheckpoint(page, CHECKPOINT_MARKERS)) return CHECKPOINT('Zalo chặn khi thêm nhóm');
  return ERROR('addToGroup chưa cấu hình selector thật (TODO)');
}
