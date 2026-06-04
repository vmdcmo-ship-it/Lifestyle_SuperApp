import type { Page } from 'playwright';
import { humanPause } from '../browser/sessionManager.js';
import { clickFirst, firstVisible } from '../browser/dom.js';
import { FACEBOOK } from '../selectors.js';

/** Một câu trả lời chuẩn bị sẵn: nếu câu hỏi (đã lowercase) chứa 1 trong `keys` -> trả `answer`. */
export interface AnswerRule {
  keys: string[];
  answer: string;
}

/**
 * Answer-bank mặc định theo persona "người quan tâm/đầu tư BĐS, lịch sự, cam kết nội quy".
 * Hỗ trợ song ngữ Việt/Anh. Pipeline có thể override qua params.answers/defaultAnswer.
 */
export const DEFAULT_ANSWER_RULES: AnswerRule[] = [
  {
    keys: ['giới thiệu', 'introduce', 'tên của bạn', 'họ tên', 'your name', 'about you', 'bản thân'],
    answer:
      'Chào cả nhà, mình là thành viên mới quan tâm tới bất động sản, rất mong được giao lưu và học hỏi từ mọi người.',
  },
  {
    keys: ['vì sao', 'tại sao', 'lý do', 'why', 'reason', 'mục đích', 'purpose', 'muốn tham gia', 'want to join'],
    answer:
      'Mình muốn cập nhật thông tin thị trường, tìm cơ hội đầu tư và kết nối với cộng đồng trong nhóm.',
  },
  {
    keys: ['khu vực', 'area', 'location', 'ở đâu', 'region', 'tỉnh', 'thành phố', 'where', 'city'],
    answer: 'TP.HCM và các khu vực lân cận.',
  },
  {
    keys: ['môi giới', 'broker', 'agent', 'nghề', 'occupation', 'công việc', 'bạn là ai', 'are you', 'profession'],
    answer: 'Mình là người quan tâm và đầu tư bất động sản, mong được học hỏi thêm kinh nghiệm.',
  },
  {
    keys: ['quảng cáo', 'spam', 'đăng tin', 'đăng bài', 'sale', 'bán hàng', 'advertis', 'posting'],
    answer: 'Mình cam kết không spam và tuân thủ đầy đủ nội quy đăng bài của nhóm.',
  },
  {
    keys: ['đồng ý', 'agree', 'nội quy', 'rules', 'tuân thủ', 'cam kết', 'commit', 'comply', 'abide'],
    answer: 'Mình đồng ý và sẽ tuân thủ đầy đủ nội quy nhóm.',
  },
];

const DEFAULT_FALLBACK_ANSWER =
  'Mình quan tâm tới bất động sản, mong được tham gia để học hỏi và kết nối cùng cộng đồng. Mình cam kết tuân thủ nội quy nhóm.';

// Câu hỏi về SĐT/liên hệ: KHÔNG bịa số. Chỉ điền nếu pipeline truyền params.phone.
const PHONE_KEYS = ['số điện thoại', 'sđt', 'phone', 'liên hệ', 'contact', 'zalo', 'mobile', 'whatsapp'];

function pickAnswer(question: string, rules: AnswerRule[], fallback: string, phone?: string): string {
  const q = question.toLowerCase();
  if (PHONE_KEYS.some((k) => q.includes(k))) return phone ?? '';
  for (const r of rules) {
    if (r.keys.some((k) => q.includes(k.toLowerCase()))) return r.answer;
  }
  return fallback;
}

export interface JoinDialogResult {
  handled: boolean;
  submitted: boolean;
  answered: number;
  checkedRules: number;
  note?: string;
}

interface DialogField {
  idx: number;
  kind: 'text' | 'checkbox';
  question: string;
}

/**
 * Xử lý hộp thoại "Trả lời câu hỏi để tham gia" của Facebook (nếu xuất hiện sau khi bấm Join).
 * - Điền câu trả lời cho ô text (theo answer-bank, fallback defaultAnswer).
 * - Tick các checkbox đồng ý nội quy (nếu agreeRules).
 * - Bấm Gửi.
 * Trả về handled=false nếu KHÔNG có hộp thoại (nhóm public hoặc gửi yêu cầu thẳng).
 */
export async function handleJoinDialog(
  page: Page,
  opts: {
    answers?: AnswerRule[] | undefined;
    defaultAnswer?: string | undefined;
    agreeRules?: boolean | undefined;
    phone?: string | undefined;
  } = {},
): Promise<JoinDialogResult> {
  const dialog = await firstVisible(page, FACEBOOK.groupJoinDialog, 3000);
  if (!dialog) return { handled: false, submitted: false, answered: 0, checkedRules: 0 };

  const rules = opts.answers ?? DEFAULT_ANSWER_RULES;
  const fallback = opts.defaultAnswer ?? DEFAULT_FALLBACK_ANSWER;
  const agreeRules = opts.agreeRules ?? true;

  // Đánh dấu mọi control trong dialog bằng data-bdsidx + lấy câu hỏi gần nhất (nhãn phía trên).
  const fields: DialogField[] = await page.evaluate(() => {
    const dlg = document.querySelector('div[role="dialog"]');
    if (!dlg) return [];
    const out: Array<{ idx: number; kind: 'text' | 'checkbox'; question: string }> = [];
    const controls = Array.from(
      dlg.querySelectorAll('textarea, div[contenteditable="true"][role="textbox"], [role="checkbox"]'),
    );
    let i = 0;
    const questionFor = (el: Element): string => {
      // Leo lên tối đa 6 cấp, lấy đoạn text dài nhất KHÔNG nằm trong chính control.
      let node: HTMLElement | null = el as HTMLElement;
      for (let k = 0; k < 6 && node; k += 1) {
        node = node.parentElement;
        if (!node) break;
        const clone = node.cloneNode(true) as HTMLElement;
        // bỏ phần text của control để không lẫn giá trị đã nhập
        clone
          .querySelectorAll('textarea, input, [contenteditable="true"]')
          .forEach((c) => c.parentElement?.removeChild(c));
        const t = (clone.textContent ?? '').trim().replace(/\s+/g, ' ');
        if (t.length >= 6) return t.slice(0, 160);
      }
      const aria = (el.getAttribute('aria-label') ?? '').trim();
      return aria.slice(0, 160);
    };
    for (const el of controls) {
      const rect = (el as HTMLElement).getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      const role = el.getAttribute('role') ?? '';
      const tag = el.tagName.toLowerCase();
      const kind: 'text' | 'checkbox' = role === 'checkbox' ? 'checkbox' : 'text';
      el.setAttribute('data-bdsidx', String(i));
      out.push({ idx: i, kind, question: questionFor(el) });
      i += 1;
      void tag;
    }
    return out;
  });

  if (fields.length === 0) {
    // Có dialog nhưng không có ô trả lời -> có thể chỉ là xác nhận. Thử bấm Gửi.
    const submitted = await clickFirst(page, FACEBOOK.groupJoinSubmit, 2500);
    return { handled: true, submitted, answered: 0, checkedRules: 0, note: 'dialog_no_fields' };
  }

  let answered = 0;
  let checkedRules = 0;

  for (const f of fields) {
    const loc = page.locator(`[data-bdsidx="${f.idx}"]`).first();
    if (!(await loc.isVisible({ timeout: 1500 }).catch(() => false))) continue;

    if (f.kind === 'checkbox') {
      if (!agreeRules) continue;
      const checked = (await loc.getAttribute('aria-checked').catch(() => 'false')) === 'true';
      if (!checked) {
        await loc.scrollIntoViewIfNeeded().catch(() => undefined);
        await loc.click({ timeout: 3000 }).catch(() => undefined);
        checkedRules += 1;
        await humanPause(300, 800);
      }
      continue;
    }

    const answer = pickAnswer(f.question, rules, fallback, opts.phone);
    if (!answer) continue; // câu hỏi SĐT mà không có phone -> bỏ trống
    await loc.scrollIntoViewIfNeeded().catch(() => undefined);
    await loc.click({ timeout: 3000 }).catch(() => undefined);
    await humanPause(250, 600);
    await page.keyboard.type(answer, { delay: 12 });
    answered += 1;
    await humanPause(400, 900);
  }

  await humanPause(600, 1200);
  const submitted = await clickFirst(page, FACEBOOK.groupJoinSubmit, 3000);
  await humanPause(800, 1500);
  return { handled: true, submitted, answered, checkedRules };
}
