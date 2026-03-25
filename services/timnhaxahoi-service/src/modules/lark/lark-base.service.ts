import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/** Lark/Feishu Open API — Base URL (VN thường dùng larksuite). */
const DEFAULT_OPEN_API_BASE = 'https://open.larksuite.com/open-apis';

export interface QuizLeadLarkPayload {
  userId: string;
  quizId: string;
  phone: string;
  email: string;
  leadSegment: string;
  score: number;
  quizJson: string;
  source: string;
}

export interface DeepConsultLarkPayload {
  userId: string;
  quizId: string;
  phone: string;
  email: string;
  leadSegment: string | null;
  score: number | null;
  note: string | null;
}

@Injectable()
export class LarkBaseService {
  private readonly logger = new Logger(LarkBaseService.name);
  private cachedTenantToken: { value: string; expiresAtMs: number } | null = null;

  constructor(private readonly config: ConfigService) {}

  get isEnabled(): boolean {
    return Boolean(
      this.config.get('LARK_APP_ID') &&
        this.config.get('LARK_APP_SECRET') &&
        this.config.get('LARK_BASE_APP_TOKEN') &&
        this.config.get('LARK_BASE_TABLE_ID'),
    );
  }

  private apiBase(): string {
    return (this.config.get<string>('LARK_OPEN_API_BASE') ?? DEFAULT_OPEN_API_BASE).replace(/\/$/, '');
  }

  /** Map key nội bộ → field_id Bitable (JSON object). Hoặc dùng LARK_BASE_SINGLE_TEXT_FIELD_ID để gửi một ô text. */
  private buildBitableFields(flat: Record<string, string | number | null>): Record<string, unknown> {
    const singleId = this.config.get<string>('LARK_BASE_SINGLE_TEXT_FIELD_ID');
    const mapJson = this.config.get<string>('LARK_BASE_FIELD_MAP');
    if (mapJson) {
      try {
        const map = JSON.parse(mapJson) as Record<string, string>;
        const fields: Record<string, unknown> = {};
        for (const [logicalKey, fieldId] of Object.entries(map)) {
          const v = flat[logicalKey];
          if (v !== undefined && v !== null && v !== '') {
            fields[fieldId] = v;
          }
        }
        return fields;
      } catch {
        this.logger.error('LARK_BASE_FIELD_MAP không phải JSON hợp lệ.');
        return {};
      }
    }
    if (singleId) {
      return { [singleId]: JSON.stringify(flat) };
    }
    this.logger.warn(
      'Lark Base: thiếu LARK_BASE_FIELD_MAP hoặc LARK_BASE_SINGLE_TEXT_FIELD_ID — không ghi được record.',
    );
    return {};
  }

  private async getTenantAccessToken(): Promise<string> {
    const now = Date.now();
    if (this.cachedTenantToken && this.cachedTenantToken.expiresAtMs > now + 60_000) {
      return this.cachedTenantToken.value;
    }
    const appId = this.config.getOrThrow<string>('LARK_APP_ID');
    const appSecret = this.config.getOrThrow<string>('LARK_APP_SECRET');
    const res = await fetch(`${this.apiBase()}/auth/v3/tenant_access_token/internal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
    });
    const json = (await res.json()) as {
      code?: number;
      tenant_access_token?: string;
      expire?: number;
      msg?: string;
    };
    if (!res.ok || json.code !== 0 || !json.tenant_access_token) {
      throw new Error(`Lark tenant token failed: ${json.msg ?? res.statusText}`);
    }
    const ttlSec = json.expire ?? 7200;
    this.cachedTenantToken = {
      value: json.tenant_access_token,
      expiresAtMs: now + ttlSec * 1000,
    };
    return json.tenant_access_token;
  }

  private async createRecord(fields: Record<string, unknown>): Promise<void> {
    if (Object.keys(fields).length === 0) {
      return;
    }
    const appToken = this.config.getOrThrow<string>('LARK_BASE_APP_TOKEN');
    const tableId = this.config.getOrThrow<string>('LARK_BASE_TABLE_ID');
    const token = await this.getTenantAccessToken();
    const res = await fetch(
      `${this.apiBase()}/bitable/v1/apps/${appToken}/tables/${tableId}/records`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fields }),
      },
    );
    const json = (await res.json()) as { code?: number; msg?: string };
    if (!res.ok || json.code !== 0) {
      throw new Error(`Lark Bitable create record failed: ${json.msg ?? res.statusText}`);
    }
  }

  async pushQuizLead(payload: QuizLeadLarkPayload): Promise<void> {
    if (!this.isEnabled) {
      return;
    }
    try {
      const flat: Record<string, string | number | null> = {
        lead_segment: payload.leadSegment,
        phone: payload.phone,
        email: payload.email,
        score: payload.score,
        quiz_json: payload.quizJson,
        user_id: payload.userId,
        quiz_id: payload.quizId,
        source: payload.source,
      };
      await this.createRecord(this.buildBitableFields(flat));
    } catch (e) {
      this.logger.warn(`Lark pushQuizLead: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  async notifyDeepConsultation(payload: DeepConsultLarkPayload): Promise<void> {
    if (!this.isEnabled) {
      return;
    }
    try {
      const flat: Record<string, string | number | null> = {
        event: 'deep_consult',
        user_id: payload.userId,
        quiz_id: payload.quizId,
        phone: payload.phone,
        email: payload.email,
        lead_segment: payload.leadSegment,
        score: payload.score,
        note: payload.note,
      };
      await this.createRecord(this.buildBitableFields(flat));
    } catch (e) {
      this.logger.warn(`Lark notifyDeepConsultation: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
}
