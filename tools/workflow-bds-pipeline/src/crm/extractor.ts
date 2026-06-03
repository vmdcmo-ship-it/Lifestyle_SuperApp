import Anthropic from '@anthropic-ai/sdk';
import type { NeedCategory } from '../types.js';
import type { ConversationInput, CrmLead, InterestLevel, LeadStatus } from './types.js';

const NEED_VALUES: NeedCategory[] = [
  'mua_can_ho',
  'mua_dat_nen',
  'mua_nha_pho',
  'thue',
  'dau_tu',
  'vay_mua_nha',
  'khac',
];
const INTEREST_VALUES: InterestLevel[] = ['hot', 'warm', 'cold'];
const STATUS_VALUES: LeadStatus[] = ['moi', 'dang_tu_van', 'hen_gap', 'cho_phan_hoi', 'chot', 'tu_choi'];

const SYSTEM = `Bạn là bộ trích xuất CRM cho sale bất động sản. Đọc lịch sử hội thoại với khách và trả về JSON.
Quy tắc:
- need: 1 trong [mua_can_ho, mua_dat_nen, mua_nha_pho, thue, dau_tu, vay_mua_nha, khac].
- budget: VND (số nguyên), không rõ = 0.
- area: khu vực quan tâm, không rõ = "".
- interest_level: hot (sẵn sàng gặp/chốt), warm (quan tâm, cần chăm), cold (hờ hững/từ chối).
- status: 1 trong [moi, dang_tu_van, hen_gap, cho_phan_hoi, chot, tu_choi].
- tags: mảng nhãn ngắn (vd ["2pn","quan9","can_vay"]).
- next_action: hành động tiếp theo gợi ý cho sale (ngắn).
- summary: tóm tắt 1 câu chân dung khách.
Chỉ trả JSON, không giải thích.`;

interface RawLead {
  need?: string;
  budget?: number;
  area?: string;
  interest_level?: string;
  status?: string;
  tags?: string[];
  next_action?: string;
  summary?: string;
}

export class CrmExtractor {
  private readonly client: Anthropic;

  private readonly model: string;

  constructor(apiKey: string, model: string) {
    this.client = new Anthropic({ apiKey });
    this.model = model;
  }

  async extract(input: ConversationInput): Promise<CrmLead> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 500,
      system: SYSTEM,
      messages: [
        {
          role: 'user',
          content: `Khách: ${input.name || 'chưa rõ'} (${input.phone}).\nHội thoại:\n"""${input.log}"""\n\nTrả JSON: {"need":string,"budget":number,"area":string,"interest_level":string,"status":string,"tags":string[],"next_action":string,"summary":string}`,
        },
      ],
    });
    const parsed = this.parse(this.text(response));
    return this.toLead(input, parsed);
  }

  private toLead(input: ConversationInput, raw: RawLead | null): CrmLead {
    const need: NeedCategory = raw && NEED_VALUES.includes(raw.need as NeedCategory) ? (raw.need as NeedCategory) : 'khac';
    const interestLevel: InterestLevel =
      raw && INTEREST_VALUES.includes(raw.interest_level as InterestLevel) ? (raw.interest_level as InterestLevel) : 'cold';
    const status: LeadStatus =
      raw && STATUS_VALUES.includes(raw.status as LeadStatus) ? (raw.status as LeadStatus) : 'moi';
    return {
      phone: input.phone,
      name: input.name,
      need,
      budget: raw && Number.isFinite(raw.budget) ? Math.round(raw.budget ?? 0) : 0,
      area: raw?.area ?? '',
      interestLevel,
      status,
      tags: Array.isArray(raw?.tags) ? raw!.tags : [],
      nextAction: raw?.next_action ?? '',
      summary: raw?.summary ?? '',
      projectId: input.projectId,
      source: input.source,
      updatedAt: new Date().toISOString(),
    };
  }

  private text(response: Anthropic.Message): string | null {
    const block = response.content.find((b) => b.type === 'text');
    return block && block.type === 'text' ? block.text : null;
  }

  private parse(raw: string | null): RawLead | null {
    if (!raw) {
      return null;
    }
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start === -1 || end === -1) {
      return null;
    }
    try {
      return JSON.parse(raw.slice(start, end + 1)) as RawLead;
    } catch {
      return null;
    }
  }
}
