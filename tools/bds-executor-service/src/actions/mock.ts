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
  'fb_search_pages',
  'fb_page_info',
  'fb_page_follow',
  'fb_page_interact',
  'fb_page_message',
];

export function runMock(action: ActionName, params: ActionParams): ActionResponse {
  if (!VALID.includes(action)) return ERROR(`action không hợp lệ: ${String(action)}`);
  const probe = `${params.phone ?? ''}${params.postId ?? ''}${params.groupId ?? ''}${params.recipientId ?? ''}${params.keyword ?? ''}${params.pageId ?? ''}`;
  if (probe.includes('0000')) return CHECKPOINT('mock: checkpoint mô phỏng');
  if (probe.includes('9999')) return ERROR('mock: lỗi mô phỏng');

  if (action === 'fb_join_group') {
    const kw = params.keyword ?? '';
    if (!kw) return ERROR('thiếu params.keyword');
    return OK({ keyword: kw, joined: [{ name: `Mock Group ${kw}`, status: 'requested_or_joined' }], skipped: [] });
  }
  if (action === 'fb_search_pages') {
    const kw = params.keyword ?? '';
    if (!kw) return ERROR('thiếu params.keyword');
    return OK({ keyword: kw, pages: [{ slug: 'mock-page', name: `Mock Page ${kw}`, href: 'https://facebook.com/mock-page', info: '' }] });
  }
  if (action === 'fb_page_info') {
    const pid = params.pageId ?? '';
    if (!pid) return ERROR('thiếu params.pageId');
    return OK({ name: `Mock Page ${pid}`, followers: '10K', recentPosts: ['https://facebook.com/mock/posts/1'] });
  }
  if (action === 'fb_page_follow') {
    return OK({ pageId: params.pageId, followed: true });
  }
  if (action === 'fb_page_interact') {
    return OK({
      pageId: params.pageId,
      targetPost: 'https://facebook.com/mock/posts/1',
      steps: { follow: !!params.doFollow, like: true, comment: !!params.text },
    });
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
