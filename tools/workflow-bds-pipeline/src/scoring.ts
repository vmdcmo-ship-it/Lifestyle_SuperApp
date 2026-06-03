import type { LeadAnalysis, NeedCategory } from './types.js';

interface KeywordRule {
  need: NeedCategory;
  patterns: RegExp[];
  weight: number;
}

const NEED_RULES: KeywordRule[] = [
  { need: 'mua_can_ho', patterns: [/căn hộ/i, /chung cư/i, /\b\d\s*pn\b/i, /\bcan ho\b/i], weight: 25 },
  { need: 'mua_dat_nen', patterns: [/đất nền/i, /lô đất/i, /\bdat nen\b/i, /nền dự án/i], weight: 25 },
  { need: 'mua_nha_pho', patterns: [/nhà phố/i, /nhà mặt tiền/i, /nha pho/i], weight: 25 },
  { need: 'thue', patterns: [/cho thuê/i, /thuê nhà/i, /thuê căn/i, /\bthue\b/i], weight: 15 },
  { need: 'dau_tu', patterns: [/đầu tư/i, /sinh lời/i, /lướt sóng/i, /dau tu/i], weight: 20 },
  { need: 'vay_mua_nha', patterns: [/vay mua/i, /lãi suất/i, /trả góp/i, /vay ngân hàng/i, /vay mua nha/i], weight: 20 },
];

const INTENT_BOOSTERS: RegExp[] = [
  /cần mua/i, /muốn mua/i, /đang tìm/i, /tư vấn/i, /ib mình/i, /inbox/i, /liên hệ/i, /báo giá/i, /xem nhà/i,
];

const BUDGET_REGEX = /(\d+(?:[.,]\d+)?)\s*(tỷ|ty|tr|triệu|trieu)/i;

const AREA_REGEX =
  /(quận\s*\d+|q\.?\s*\d+|thủ đức|thu duc|bình dương|binh duong|đồng nai|dong nai|long an|hà nội|ha noi|tp\.?\s*hcm|sài gòn|sai gon)/i;

export function detectNeed(text: string): NeedCategory {
  let best: { need: NeedCategory; weight: number } = { need: 'khac', weight: 0 };
  for (const rule of NEED_RULES) {
    if (rule.patterns.some((p) => p.test(text)) && rule.weight > best.weight) {
      best = { need: rule.need, weight: rule.weight };
    }
  }
  return best.need;
}

export function parseBudget(text: string): number {
  const m = text.match(BUDGET_REGEX);
  if (!m || m[1] === undefined) {
    return 0;
  }
  const value = Number(m[1].replace(',', '.'));
  if (Number.isNaN(value)) {
    return 0;
  }
  const unit = (m[2] ?? '').toLowerCase();
  if (unit.startsWith('t') && (unit.includes('ỷ') || unit === 'ty')) {
    return Math.round(value * 1_000_000_000);
  }
  return Math.round(value * 1_000_000);
}

export function parseArea(text: string): string {
  const m = text.match(AREA_REGEX);
  return m ? m[0].trim() : '';
}

/**
 * Chấm điểm Lead offline (0-100) dựa trên need, ý định, ngân sách, khu vực.
 * Dùng khi không gọi Claude hoặc làm sàn an toàn cho kết quả của Claude.
 */
export function scoreLead(text: string, need: NeedCategory, budget: number, area: string): number {
  let score = 30;
  const matchedRule = NEED_RULES.find((r) => r.need === need);
  if (matchedRule) {
    score += matchedRule.weight;
  }
  if (INTENT_BOOSTERS.some((p) => p.test(text))) {
    score += 20;
  }
  if (budget > 0) {
    score += 10;
  }
  if (area) {
    score += 10;
  }
  return Math.max(0, Math.min(100, score));
}

export function analyzeOffline(text: string): Omit<LeadAnalysis, 'phone'> {
  const need = detectNeed(text);
  const budget = parseBudget(text);
  const area = parseArea(text);
  const leadScore = scoreLead(text, need, budget, area);
  return { need, budget, area, lead_score: leadScore };
}
