import { ClaudeAnalyzer } from './claude.js';
import { extractPhoneFromText, normalizePhone } from './phone.js';
import { analyzeOffline } from './scoring.js';
import type { CleanRow, LeadAnalysis, PipelineConfig, PipelineResult, RawRow } from './types.js';

export class LeadPipeline {
  private readonly config: PipelineConfig;

  private readonly analyzer: ClaudeAnalyzer | null;

  constructor(config: PipelineConfig) {
    this.config = config;
    if (config.useClaude && config.anthropicApiKey) {
      this.analyzer = new ClaudeAnalyzer(config.anthropicApiKey, config.claudeModel);
    } else {
      this.analyzer = null;
    }
  }

  /**
   * Lọc RAW -> CLEAN: bóc & chuẩn hóa SĐT, khử trùng, đối chiếu CRM, chấm điểm.
   * @param crmPhones tập SĐT đã có trong CRM (dạng 84xxxxxxxxx) để gắn cờ in_crm.
   */
  async run(rawRows: RawRow[], crmPhones: Set<string> = new Set()): Promise<PipelineResult> {
    const seen = new Set<string>();
    const kept: CleanRow[] = [];
    let droppedLowScore = 0;
    let droppedNoPhone = 0;
    let duplicates = 0;

    for (const raw of rawRows) {
      const analysis = await this.analyzeRow(raw);
      const phone = this.resolvePhone(raw, analysis);

      if (!phone) {
        droppedNoPhone += 1;
        continue;
      }

      const isDuplicate = seen.has(phone);
      if (isDuplicate) {
        duplicates += 1;
        continue;
      }
      seen.add(phone);

      if (analysis.lead_score < this.config.leadScoreMin) {
        droppedLowScore += 1;
        continue;
      }

      kept.push({
        phone,
        name: raw.name_fb,
        need: analysis.need,
        budget: analysis.budget,
        area: analysis.area,
        lead_score: analysis.lead_score,
        project_id: raw.project_id,
        source_group: raw.source_group,
        fb_id: raw.fb_id,
        is_duplicate: false,
        in_crm: crmPhones.has(phone),
        cleaned_at: new Date().toISOString(),
      });
    }

    return { total: rawRows.length, kept, droppedLowScore, droppedNoPhone, duplicates };
  }

  private async analyzeRow(raw: RawRow): Promise<LeadAnalysis> {
    const offline = analyzeOffline(raw.raw_text);
    if (!this.analyzer) {
      return { phone: null, ...offline };
    }
    try {
      const result = await this.analyzer.analyze(raw.raw_text);
      if (result) {
        return {
          ...result,
          lead_score: Math.max(result.lead_score, offline.lead_score),
        };
      }
    } catch {
      // Lỗi gọi Claude -> dùng kết quả offline để pipeline không gãy.
    }
    return { phone: null, ...offline };
  }

  private resolvePhone(raw: RawRow, analysis: LeadAnalysis): string | null {
    return (
      normalizePhone(raw.phone_raw) ??
      (analysis.phone ? normalizePhone(analysis.phone) : null) ??
      extractPhoneFromText(raw.phone_raw) ??
      extractPhoneFromText(raw.raw_text)
    );
  }
}
