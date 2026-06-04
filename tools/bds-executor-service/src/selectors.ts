/**
 * Selector tập trung — TINH CHỈNH TẠI ĐÂY (không đụng logic ở actions).
 *
 * Nguyên tắc bền vững (ưu tiên từ trên xuống trong mỗi mảng):
 *  - Ưu tiên text/aria/placeholder (ổn định hơn class CSS rối của Zalo/FB).
 *  - Dùng `clickFirst/fillFirst/firstVisible` (browser/dom.ts) để thử lần lượt nhiều ứng viên.
 *  - Mỗi chuỗi là 1 Playwright selector hợp lệ (css= mặc định, hoặc tiền tố `text=`, `[aria-label=...]`).
 *
 * Quy trình chốt selector: chạy `npm run inspect -- --account <id> --flow <flow>` với account đã đăng nhập,
 * xem debug/ (ảnh + html) rồi điền selector đúng vào các mảng dưới.
 */

export interface SelectorSet {
  candidates: string[];
}

export const ZALO = {
  // Nút mở popup "Thêm bạn"
  addFriendButton: [
    '[data-id="btn_Main_AddFrd"]',
    '[title="Thêm bạn"]',
    'div[aria-label="Thêm bạn"]',
    'text=Thêm bạn',
  ],
  // Ô nhập SĐT trong popup thêm bạn / tìm kiếm
  phoneInput: [
    'input[placeholder*="số điện thoại" i]',
    'input[type="tel"]',
    'input[placeholder*="Số điện thoại" i]',
    '#txt-search-phone',
  ],
  // Dấu hiệu "không tìm thấy" tài khoản
  notFound: [
    'text=/không tìm thấy/i',
    'text=/chưa có tài khoản/i',
    'text=/không có kết quả/i',
    'text=/số điện thoại chưa đăng ký/i',
  ],
  // Tên hiển thị hồ sơ tìm được
  profileName: [
    '.profile-name',
    '[class*="profile"] [class*="name"]',
    '[data-id="profile_name"]',
  ],
  // Nút kết bạn / gửi lời mời
  addFriendConfirm: ['text=/kết bạn/i', 'text=/gửi lời mời/i', 'button:has-text("Kết bạn")'],
  // Ô lời nhắn kèm lời mời
  inviteMessageBox: ['textarea', '[contenteditable="true"]'],
  // Nút gửi cuối cùng
  sendInvite: ['text=/gửi lời mời/i', 'text=/gửi/i', 'button:has-text("Gửi")'],
  // Nút mở hội thoại / nhắn tin từ hồ sơ
  openChat: ['text=/nhắn tin/i', 'text=/gửi tin nhắn/i', 'button:has-text("Nhắn tin")'],
  // Ô soạn tin nhắn trong khung chat
  chatInput: ['#richInput', '[contenteditable="true"]', 'textarea'],
  // ----- add_group -----
  // Ô tìm nhóm / hội thoại ở sidebar
  searchConversation: ['input[placeholder*="Tìm kiếm" i]', '#contact-search-input'],
  // Menu / nút "Thêm thành viên" trong nhóm
  addMemberButton: ['text=/thêm thành viên/i', '[title="Thêm thành viên"]', 'text=/mời vào nhóm/i'],
  // Xác nhận thêm thành viên
  addMemberConfirm: ['text=/xác nhận/i', 'button:has-text("Thêm")', 'button:has-text("Xác nhận")'],
} as const;

export const FACEBOOK = {
  likeButton: ['[aria-label="Thích"]', '[aria-label="Like"]', 'div[role="button"]:has-text("Thích")'],
  commentBox: [
    '[aria-label*="bình luận" i]',
    '[aria-label*="comment" i]',
    'div[contenteditable="true"][role="textbox"]',
  ],
} as const;

export const CHECKPOINT_MARKERS = {
  zaloUrl: ['id.zalo.me', 'login', 'verify'],
  fbUrl: ['checkpoint', 'login', 'two_step_verification'],
  bodyText: ['captcha', 'xác minh', 'unusual activity', 'bảo mật tài khoản', "verify it's you", 'xác nhận danh tính'],
} as const;
