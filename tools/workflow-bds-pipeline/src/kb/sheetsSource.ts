import type { GoogleSheetsClient } from '../sheets/googleSheets.js';
import type { KbMeta, KbRow, KbSource } from './types.js';

const META_TAB = 'META';
const KB_TAB = 'KB';

/**
 * Nguồn KB đọc trực tiếp từ Google Sheet KB Master của 1 dự án.
 * Mỗi dự án = 1 spreadsheet riêng (client đã gắn spreadsheetId tương ứng).
 */
export class SheetsKbSource implements KbSource {
  private readonly client: GoogleSheetsClient;

  constructor(client: GoogleSheetsClient) {
    this.client = client;
  }

  async readMeta(): Promise<KbMeta> {
    const records = await this.client.readTab(META_TAB);
    const first = records[0];
    if (!first) {
      throw new Error('Tab META rỗng');
    }
    const projectId = (first.project_id ?? '').trim();
    if (!projectId) {
      throw new Error('META thiếu project_id');
    }
    return {
      project_id: projectId,
      project_name: (first.project_name ?? '').trim(),
      version: Number(first.version ?? '1'),
      namespace: (first.namespace ?? `kb_project_${projectId}`).trim(),
    };
  }

  async readRows(): Promise<KbRow[]> {
    const records = await this.client.readTab(KB_TAB);
    return records
      .filter((r) => (r.id ?? '').trim() !== '')
      .map((r) => ({
        id: (r.id ?? '').trim(),
        category: (r.category ?? '').trim(),
        question: (r.question ?? '').trim(),
        answer: (r.answer ?? '').trim(),
        keywords: (r.keywords ?? '').trim(),
        priority: Number(r.priority ?? '1'),
        active: (r.active ?? 'TRUE').trim().toUpperCase() === 'TRUE',
      }));
  }
}
