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
  // Ô tìm kiếm chính (đã xác nhận qua probe)
  searchInput: ['[data-id="txt_Main_Search"]', 'input[placeholder*="Tìm kiếm" i]'],
  // Nút tạo nhóm chat (đã xác nhận qua probe)
  createGroupButton: ['[data-id="btn_NewGrp_"]', '[title="Tạo nhóm chat"]'],
  // Nút mở popup "Thêm bạn" (đã xác nhận qua probe: data-id="btn_Main_AddFrd")
  addFriendButton: [
    '[data-id="btn_Main_AddFrd"]',
    '[title="Thêm bạn"]',
    'div[aria-label="Thêm bạn"]',
    'text=Thêm bạn',
  ],
  // Ô nhập SĐT trong popup thêm bạn (đã xác nhận qua probe)
  phoneInput: [
    '[data-id="txt_Main_AddFrd_Phone"]',
    'input.phone-i-input',
    'input[placeholder*="số điện thoại" i]',
    'input[type="tel"]',
  ],
  // Nút "Tìm kiếm" trong popup thêm bạn (đã xác nhận qua probe)
  searchPhoneButton: ['[data-id="btn_Main_AddFrd_Search"]', 'text=Tìm kiếm'],
  // Nút "Hủy" đóng popup thêm bạn (đã xác nhận qua probe)
  addFriendCancel: ['[data-id="btn_Main_AddFrd_CXL"]', 'text=Hủy'],
  // Dấu hiệu "không tìm thấy" tài khoản
  notFound: [
    'text=/không tìm thấy/i',
    'text=/chưa có tài khoản/i',
    'text=/không có kết quả/i',
    'text=/số điện thoại chưa đăng ký/i',
    'text=/chưa sử dụng zalo/i',
  ],
  // Dấu hiệu CHẮC CHẮN SĐT có Zalo: modal chuyển sang hồ sơ "Thông tin tài khoản"
  // (đã xác nhận qua probe: header + các nút btn_UserProfile_*)
  accountFound: [
    '[data-id="btn_UserProfile_Share"]',
    '[data-id="btn_UserProfile_Unblock"]',
    'text=Thông tin tài khoản',
  ],
  // Tên hiển thị hồ sơ tìm được (đã xác nhận: div.truncate[title] trong modal hồ sơ)
  profileName: [
    'div.truncate[title]',
    '.profile-name',
    '[class*="profile"] [class*="name"]',
  ],
  // Nút "Kết bạn" trong hồ sơ kết quả -> mở dialog soạn lời mời. (text engine -> phần tử lá)
  addFriendConfirm: ['text=Kết bạn'],
  // Ô lời nhắn kèm lời mời (trong dialog soạn).
  inviteMessageBox: ['textarea', '[contenteditable="true"]'],
  // Nút gửi cuối cùng = "Kết bạn" MÀU XANH (btn-primary) trong dialog soạn lời mời.
  sendInvite: [
    'div[class*="btn-primary"]:has-text("Kết bạn")',
    'div[class*="btn-primary"]:has-text("Gửi lời mời")',
    'text=Gửi lời mời',
  ],
  // Dấu hiệu lời mời ĐÃ gửi thành công (Zalo hiện nút "Hủy kết bạn"/"Hủy lời mời").
  inviteSent: [
    'text=/hủy kết bạn/i',
    'text=/đã gửi lời mời/i',
    'text=/hủy lời mời/i',
    'text=/thu hồi lời mời/i',
  ],
  // Nút "Nhắn tin" trong hồ sơ (khớp CHÍNH XÁC để tránh dính chữ "Nhắn tin nhiều hơn..." ở màn chờ).
  openChat: [
    'div[class*="btn-secondary"]:has-text("Nhắn tin")',
    'text="Nhắn tin"',
    'text="Gửi tin nhắn"',
  ],
  // Ô soạn tin nhắn trong khung chat
  chatInput: [
    '#richInput',
    'div[contenteditable="true"][role="textbox"]',
    'div[contenteditable="true"]',
    'textarea',
  ],
  // Cảnh báo Zalo chặn giao tin khi người nhận từ chối tin từ người lạ (tin gõ ra nhưng KHÔNG tới nơi).
  messageBlocked: [
    'text=/chưa thể gửi tin nhắn đến người này/i',
    'text=/không nhận tin nhắn từ người lạ/i',
  ],
  // ----- add_group -----
  // Ô tìm nhóm / hội thoại ở sidebar
  searchConversation: ['input[placeholder*="Tìm kiếm" i]', '#contact-search-input'],
  // Menu / nút "Thêm thành viên" trong nhóm
  addMemberButton: ['text=/thêm thành viên/i', '[title="Thêm thành viên"]', 'text=/mời vào nhóm/i'],
  // Xác nhận thêm thành viên
  addMemberConfirm: ['text=/xác nhận/i', 'button:has-text("Thêm")', 'button:has-text("Xác nhận")'],
} as const;

export const FACEBOOK = {
  // Nút Like trên bài viết (đã xác nhận EN="Like"; hỗ trợ thêm VI). Khớp CHÍNH XÁC để
  // tránh dính '[aria-label="Like: 25 people"]'.
  likeButton: [
    'div[aria-label="Like"][role="button"]',
    'div[aria-label="Thích"][role="button"]',
    '[aria-label="Like"]',
    '[aria-label="Thích"]',
  ],
  // Nút mở ô bình luận (đã xác nhận EN="Leave a comment"; hỗ trợ thêm VI).
  commentButton: [
    'div[aria-label="Leave a comment"][role="button"]',
    'div[aria-label="Comment"][role="button"]',
    'div[aria-label="Viết bình luận"][role="button"]',
    'div[aria-label="Bình luận"][role="button"]',
    '[aria-label="Leave a comment"]',
  ],
  // Ô soạn bình luận (contenteditable). Khớp theo aria-label EN/VI + fallback chung.
  commentBox: [
    'div[contenteditable="true"][aria-label*="comment" i]',
    'div[contenteditable="true"][aria-label*="bình luận" i]',
    'div[contenteditable="true"][role="textbox"]',
    'div[contenteditable="true"]',
  ],
  // Ô soạn tin nhắn Messenger (đã xác nhận: role=textbox, aria-label "Write to <Tên>").
  messageBox: [
    'div[role="textbox"][contenteditable="true"][aria-label^="Write to" i]',
    'div[role="textbox"][contenteditable="true"][aria-label*="nhắn tin" i]',
    'div[role="textbox"][contenteditable="true"][aria-label*="viết tin" i]',
    'div[role="textbox"][contenteditable="true"]',
  ],
  // Dấu hiệu hội thoại không khả dụng (chưa thể nhắn / bị chặn).
  messageUnavailable: ['text=/can\'t reply to this conversation/i', 'text=/không thể trả lời/i'],
  // ----- join_group (tìm & tham gia nhóm theo từ khóa) -----
  // Nút "Join group <tên>" trên trang kết quả tìm nhóm (EN="Join group", VI="Tham gia nhóm").
  groupJoinButton: ['div[aria-label^="Join group" i][role="button"]', 'div[aria-label^="Tham gia nhóm" i][role="button"]'],
  // Hộp thoại hiện ra sau khi bấm Join (xác nhận / câu hỏi gia nhập).
  groupJoinDialog: ['div[role="dialog"]'],
  // Ô câu hỏi bắt buộc khi xin vào nhóm (nếu có -> bỏ qua, không tự trả lời).
  groupJoinQuestion: ['div[role="dialog"] textarea', 'div[role="dialog"] div[contenteditable="true"][role="textbox"]'],
  // Nút gửi yêu cầu trong hộp thoại (EN/VI; theo aria-label rồi tới text).
  groupJoinSubmit: [
    'div[role="dialog"] div[aria-label="Submit" i][role="button"]',
    'div[role="dialog"] div[aria-label="Send request" i][role="button"]',
    'div[role="dialog"] div[aria-label="Gửi" i][role="button"]',
    'div[role="dialog"] div[aria-label="Gửi yêu cầu" i][role="button"]',
    'div[role="dialog"] div[role="button"]:has-text("Gửi yêu cầu")',
    'div[role="dialog"] div[role="button"]:has-text("Gửi")',
    'div[role="dialog"] div[role="button"]:has-text("Submit")',
    'div[role="dialog"] div[role="button"]:has-text("Send Request")',
  ],
  // Trạng thái sau khi join thành công / đang chờ duyệt.
  groupJoinedMarker: [
    '[aria-label^="Joined" i]',
    '[aria-label^="Cancel request" i]',
    '[aria-label^="Đã tham gia" i]',
    '[aria-label^="Hủy yêu cầu" i]',
  ],
} as const;

export const CHECKPOINT_MARKERS = {
  zaloUrl: ['id.zalo.me', 'login', 'verify'],
  fbUrl: ['checkpoint', 'login', 'two_step_verification'],
  bodyText: ['captcha', 'xác minh', 'unusual activity', 'bảo mật tài khoản', "verify it's you", 'xác nhận danh tính'],
} as const;
