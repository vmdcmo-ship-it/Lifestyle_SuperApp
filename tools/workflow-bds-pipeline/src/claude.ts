import Anthropic from '@anthropic-ai/sdk';
import type { LeadAnalysis, NeedCategory } from './types.js';

const NEED_VALUES: NeedCategory[] = [
  'mua_can_ho',
  'mua_dat_nen',
  'mua_nha_pho',
  'thue',
  'dau_tu',
  'vay_mua_nha',
  'khac',
];

const SYSTEM_PROMPT = `Bạn là bộ trích xuất dữ liệu Lead bất động sản. Đọc nội dung do khách đăng trên Facebook và trả về JSON đúng schema.
Quy tắc:
- phone: chuẩn hóa về dạng 84xxxxxxxxx (bỏ số 0 đầu, bỏ dấu cách). Nếu số viết lóng bằng chữ (vd "không chín tám..."), hãy giải mã. Nếu không có số, trả null.
- need: chọn 1 trong [mua_can_ho, mua_dat_nen, mua_nha_pho, thue, dau_tu, vay_mua_nha, khac].
- budget: ngân sách theo VND (số nguyên). Không rõ thì 0.
- area: khu vực quan tâm (chuỗi ngắn). Không rõ thì "".
- lead_score: 0-100 theo mức độ tiềm năng (ý định mua rõ ràng + có ngân sách + có khu vực + có liên hệ = điểm cao).
Chỉ trả JSON, không giải thích.`;

interface ClaudeRawAnalysis {
  phone: string | null;
  need: string;
  budget: number;
  area: string;
  lead_score: number;
}

export class ClaudeAnalyzer {
  private readonly client: Anthropic;

  private readonly model: string;

  constructor(apiKey: string, model: string) {
    this.client = new Anthropic({ apiKey });
    this.model = model;
  }

  async analyze(text: string): Promise<LeadAnalysis | null> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Nội dung khách đăng:\n"""${text}"""\n\nTrả về JSON: {"phone": string|null, "need": string, "budget": number, "area": string, "lead_score": number}`,
        },
      ],
    });

    const raw = this.extractText(response);
    if (!raw) {
      return null;
    }
    return this.parse(raw);
  }

  private extractText(response: Anthropic.Message): string | null {
    const block = response.content.find((b) => b.type === 'text');
    return block && block.type === 'text' ? block.text : null;
  }

  private parse(raw: string): LeadAnalysis | null {
    const jsonStart = raw.indexOf('{');
    const jsonEnd = raw.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) {
      return null;
    }
    try {
      const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1)) as ClaudeRawAnalysis;
      const need: NeedCategory = NEED_VALUES.includes(parsed.need as NeedCategory)
        ? (parsed.need as NeedCategory)
        : 'khac';
      return {
        phone: parsed.phone ?? null,
        need,
        budget: Number.isFinite(parsed.budget) ? Math.round(parsed.budget) : 0,
        area: typeof parsed.area === 'string' ? parsed.area : '',
        lead_score: clampScore(parsed.lead_score),
      };
    } catch {
      return null;
    }
  }
}

function clampScore(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.min(100, Math.round(value)));
}
