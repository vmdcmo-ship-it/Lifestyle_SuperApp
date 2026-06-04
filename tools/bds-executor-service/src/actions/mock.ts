import { CHECKPOINT, ERROR, OK, type ActionName, type ActionParams, type ActionResponse } from '../types.js';

/**
 * Backend MOCK: không mở trình duyệt, không cần selector.
 * Dùng để smoke-test server + router + contract.
 * Quy ước tất định (giống stub): chứa "0000" -> checkpoint; "9999" -> error;
 * check_phone: SĐT lẻ -> no_zalo, chẵn -> has_zalo.
 */
const VALID: ActionName[] = [
  'check_phone',
  'add_friend',
  'send_message',
  'add_group',
  'fb_like',
  'fb_comment',
  'fb_message',
  'fb_join_group',
];

export function runMock(action: ActionName, params: ActionParams): ActionResponse {
  if (!VALID.includes(action)) return ERROR(`action không hợp lệ: ${String(action)}`);
  const probe = `${params.phone ?? ''}${params.postId ?? ''}${params.groupId ?? ''}${params.recipientId ?? ''}${params.keyword ?? ''}`;
  if (probe.includes('0000')) return CHECKPOINT('mock: checkpoint mô phỏng');
  if (probe.includes('9999')) return ERROR('mock: lỗi mô phỏng');

  if (action === 'fb_join_group') {
    const kw = params.keyword ?? '';
    if (!kw) return ERROR('thiếu params.keyword');
    return OK({ keyword: kw, joined: [{ name: `Mock Group ${kw}`, status: 'requested_or_joined' }], skipped: [] });
  }

  if (action === 'check_phone') {
    const phone = params.phone ?? '';
    if (!phone) return ERROR('thiếu params.phone');
    const last = Number(phone.slice(-1));
    const hasZalo = Number.isFinite(last) && last % 2 === 0;
    return hasZalo ? OK({ has_zalo: true, display_name: `Mock User ${phone.slice(-4)}` }) : OK({ has_zalo: false });
  }
  return OK();
}
