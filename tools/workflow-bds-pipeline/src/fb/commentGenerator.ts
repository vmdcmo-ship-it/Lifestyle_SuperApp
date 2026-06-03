import Anthropic from '@anthropic-ai/sdk';
import type { Persona } from '../advisor/types.js';
import type { CommentDecision, FbPost } from './types.js';

interface GateResult {
  should_comment: boolean;
  reason: string;
}

interface WriteResult {
  comment: string;
  has_cta: boolean;
}

function extractJson<T>(raw: string | null): T | null {
  if (!raw) {
    return null;
  }
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1) {
    return null;
  }
  try {
    return JSON.parse(raw.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
}

/**
 * Hai bước, kiến trúc model phân tầng để tiết kiệm token:
 * 1. Cổng lọc (filterModel, vd Haiku): bài có phù hợp để comment không.
 * 2. Soạn comment (writerModel, vd Sonnet): chỉ chạy khi bước 1 đồng ý.
 */
export class CommentGenerator {
  private readonly client: Anthropic;

  private readonly filterModel: string;

  private readonly writerModel: string;

  private readonly persona: Persona;

  constructor(apiKey: string, filterModel: string, writerModel: string, persona: Persona) {
    this.client = new Anthropic({ apiKey });
    this.filterModel = filterModel;
    this.writerModel = writerModel;
    this.persona = persona;
  }

  async generate(post: FbPost): Promise<CommentDecision> {
    const gate = await this.gate(post);
    if (!gate || !gate.should_comment) {
      return { shouldComment: false, reason: gate?.reason ?? 'gate_failed', comment: '', hasCta: false };
    }
    const written = await this.write(post);
    if (!written || !written.comment) {
      return { shouldComment: false, reason: 'write_failed', comment: '', hasCta: false };
    }
    return { shouldComment: true, reason: gate.reason, comment: written.comment, hasCta: Boolean(written.has_cta) };
  }

  private async gate(post: FbPost): Promise<GateResult | null> {
    const system = [
      'Bạn là bộ lọc kiểm duyệt bình luận cho một chuyên viên BĐS/tài chính tham gia nhóm Facebook.',
      'Quyết định có nên bình luận vào bài không. CHỈ nên bình luận nếu bài liên quan BĐS/tài chính/mua nhà/đầu tư và có thể góp ý giá trị, tự nhiên.',
      'KHÔNG bình luận nếu: bài nhạy cảm, chính trị, tranh cãi, tang sự, rao bán của đối thủ, không liên quan, hoặc dễ bị coi là spam.',
      'Chỉ trả JSON: {"should_comment": boolean, "reason": string}',
    ].join('\n');
    const user = `Nhóm: ${post.groupName}\nBài đăng: """${post.content}"""`;
    const res = await this.client.messages.create({
      model: this.filterModel,
      max_tokens: 200,
      system,
      messages: [{ role: 'user', content: user }],
    });
    return extractJson<GateResult>(this.text(res));
  }

  private async write(post: FbPost): Promise<WriteResult | null> {
    const system = [
      `Bạn đóng vai ${this.persona.name}, ${this.persona.role}. Giọng điệu: ${this.persona.tone}.`,
      'Viết MỘT bình luận Facebook NGẮN (1-2 câu), tự nhiên như người thật, đúng ngữ cảnh bài đăng, mang tính góp ý/giá trị.',
      'Chống spam: không sao chép mẫu, không quảng cáo lộ liễu. Chỉ chèn gợi ý sản phẩm RẤT NHẸ và chỉ khi thực sự hợp ngữ cảnh.',
      'LẰN RANH ĐỎ:',
      ...this.persona.redlines_global.map((x) => `- ${x}`),
      'Trả JSON: {"comment": string, "has_cta": boolean}. has_cta=true nếu bình luận có mời chào/để lại liên hệ.',
    ].join('\n');
    const user = [
      `Nhóm: ${post.groupName}`,
      `Bài đăng: """${post.content}"""`,
      post.productBrief ? `Gợi ý sản phẩm (chỉ nhắc nếu hợp): ${post.productBrief}` : '',
      'Viết bình luận phù hợp.',
    ].join('\n');
    const res = await this.client.messages.create({
      model: this.writerModel,
      max_tokens: 300,
      system,
      messages: [{ role: 'user', content: user }],
    });
    return extractJson<WriteResult>(this.text(res));
  }

  private text(response: Anthropic.Message): string | null {
    const block = response.content.find((b) => b.type === 'text');
    return block && block.type === 'text' ? block.text : null;
  }
}
