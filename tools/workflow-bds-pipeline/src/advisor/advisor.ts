import Anthropic from '@anthropic-ai/sdk';
import type { KbRetriever, RetrievedChunk } from '../kb/retriever.js';
import type { AdvisorConfig } from '../config.js';
import type { AdvisorReply, ConversationTurn, CustomerIntent, Persona } from './types.js';

const INTENT_VALUES: CustomerIntent[] = ['quan_tam', 'tu_choi', 'hoi_gia', 'hoi_thong_tin', 'khac'];

export class Advisor {
  private readonly client: Anthropic;

  private readonly model: string;

  private readonly persona: Persona;

  private readonly retriever: KbRetriever;

  private readonly topK: number;

  constructor(config: AdvisorConfig, persona: Persona, retriever: KbRetriever) {
    if (!config.anthropicApiKey) {
      throw new Error('Thiếu ANTHROPIC_API_KEY cho Advisor.');
    }
    this.client = new Anthropic({ apiKey: config.anthropicApiKey });
    this.model = config.writerModel;
    this.persona = persona;
    this.retriever = retriever;
    this.topK = config.topK;
  }

  async reply(projectId: string, message: string, history: ConversationTurn[] = []): Promise<AdvisorReply> {
    const chunks = await this.retriever.retrieve(projectId, message, this.topK);

    if (chunks.length === 0) {
      return {
        reply: this.persona.no_data_reply,
        intent: 'hoi_thong_tin',
        escalate: true,
        has_answer: false,
        used_chunk_ids: [],
      };
    }

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 700,
      system: this.buildSystemPrompt(),
      messages: [{ role: 'user', content: this.buildUserPrompt(chunks, history, message) }],
    });

    const raw = this.extractText(response);
    const parsed = raw ? this.parse(raw) : null;
    if (!parsed) {
      return {
        reply: this.persona.no_data_reply,
        intent: 'khac',
        escalate: true,
        has_answer: false,
        used_chunk_ids: chunks.map((c) => c.chunkId),
      };
    }
    return { ...parsed, used_chunk_ids: chunks.map((c) => c.chunkId) };
  }

  /**
   * Soạn tin nhắn giới thiệu CHỦ ĐỘNG (outbound) cho 1 lead, grounded theo KB dự án.
   * Trả về plain text (1-3 câu), không JSON. Nếu không có dữ liệu dự án -> trả null.
   */
  async composeOutreach(projectId: string, brief: string, leadName: string): Promise<string | null> {
    const chunks = await this.retriever.retrieve(projectId, brief || 'giới thiệu dự án', this.topK);
    if (chunks.length === 0) {
      return null;
    }
    const context = chunks.map((c, i) => `(${i + 1}) [${c.category}] ${c.question}\n${c.answer}`).join('\n\n');
    const system = [
      `Bạn đóng vai ${this.persona.name}, ${this.persona.role}. Giọng điệu: ${this.persona.tone}.`,
      `Xưng "${this.persona.address.self}", gọi khách là "${this.persona.address.customer}".`,
      'Soạn MỘT tin nhắn giới thiệu chủ động, ngắn (2-3 câu), tự nhiên như người thật, mở đầu thân thiện và kết bằng 1 câu hỏi mở.',
      'VĂN PHONG:',
      ...this.persona.style_rules.map((x) => `- ${x}`),
      'LẰN RANH ĐỎ:',
      ...this.persona.redlines_global.map((x) => `- ${x}`),
      'Chỉ dùng thông tin dự án được cung cấp; không bịa số liệu. Chỉ trả về nội dung tin nhắn, không thêm chú thích.',
    ].join('\n');
    const user = [
      `THÔNG TIN DỰ ÁN (chỉ dùng nội dung này):\n${context}`,
      `\nKhách hàng: ${leadName || 'anh/chị'}. Nhu cầu: ${brief || 'chưa rõ'}.`,
      '\nHãy soạn tin nhắn giới thiệu phù hợp nhu cầu trên.',
    ].join('\n');

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 400,
      system,
      messages: [{ role: 'user', content: user }],
    });
    const text = this.extractText(response);
    return text ? text.trim() : null;
  }

  private buildSystemPrompt(): string {
    const p = this.persona;
    return [
      `Bạn đóng vai ${p.name}, ${p.role}. Giọng điệu: ${p.tone}.`,
      `Xưng "${p.address.self}", gọi khách là "${p.address.customer}".`,
      '',
      'NGUYÊN TẮC TƯ VẤN:',
      ...p.principles.map((x) => `- ${x}`),
      '',
      'VĂN PHONG:',
      ...p.style_rules.map((x) => `- ${x}`),
      '',
      'LẰN RANH ĐỎ (TUYỆT ĐỐI KHÔNG VI PHẠM):',
      ...p.redlines_global.map((x) => `- ${x}`),
      '',
      'QUY TẮC DỮ LIỆU (QUAN TRỌNG):',
      '- Chỉ trả lời dựa trên THÔNG TIN DỰ ÁN được cung cấp bên dưới.',
      '- Nếu thông tin khách hỏi KHÔNG có trong dữ liệu, đặt has_answer=false và trả lời theo hướng hẹn xác nhận, KHÔNG bịa.',
      '- Nếu khách cần gặp người thật / vấn đề ngoài phạm vi, đặt escalate=true.',
      '',
      'Chỉ trả về JSON đúng schema, không thêm chữ nào ngoài JSON:',
      '{"reply": string, "intent": "quan_tam|tu_choi|hoi_gia|hoi_thong_tin|khac", "escalate": boolean, "has_answer": boolean}',
    ].join('\n');
  }

  private buildUserPrompt(chunks: RetrievedChunk[], history: ConversationTurn[], message: string): string {
    const context = chunks
      .map((c, i) => `(${i + 1}) [${c.category}] ${c.question}\n${c.answer}`)
      .join('\n\n');
    const convo = history
      .map((t) => `${t.role === 'customer' ? 'Khách' : this.persona.name}: ${t.text}`)
      .join('\n');
    return [
      'THÔNG TIN DỰ ÁN (chỉ được dùng nội dung này):',
      context,
      '',
      convo ? `LỊCH SỬ HỘI THOẠI:\n${convo}\n` : '',
      `TIN NHẮN MỚI CỦA KHÁCH:\n${message}`,
      '',
      'Hãy soạn câu trả lời tự nhiên như người thật theo đúng văn phong, rồi trả JSON.',
    ].join('\n');
  }

  private extractText(response: Anthropic.Message): string | null {
    const block = response.content.find((b) => b.type === 'text');
    return block && block.type === 'text' ? block.text : null;
  }

  private parse(raw: string): Omit<AdvisorReply, 'used_chunk_ids'> | null {
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start === -1 || end === -1) {
      return null;
    }
    try {
      const obj = JSON.parse(raw.slice(start, end + 1)) as {
        reply?: string;
        intent?: string;
        escalate?: boolean;
        has_answer?: boolean;
      };
      if (typeof obj.reply !== 'string') {
        return null;
      }
      const intent: CustomerIntent = INTENT_VALUES.includes(obj.intent as CustomerIntent)
        ? (obj.intent as CustomerIntent)
        : 'khac';
      return {
        reply: obj.reply,
        intent,
        escalate: Boolean(obj.escalate),
        has_answer: obj.has_answer !== false,
      };
    } catch {
      return null;
    }
  }
}
