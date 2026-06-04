import { readFile, writeFile } from 'node:fs/promises';
import { parseCsv, toCsv } from '../csv.js';
import { loadGoogleSheetsConfig } from '../config.js';
import { GoogleSheetsClient } from '../sheets/googleSheets.js';

export type StoreMode = 'csv' | 'sheets';

/**
 * Trừu tượng đọc/ghi record dùng chung cho CSV (file) và Google Sheets (tab).
 * - CSV: `key` là đường dẫn file.
 * - Sheets: `key` là tên tab.
 */
export interface RecordStore {
  read(key: string): Promise<Array<Record<string, string>>>;
  overwrite(key: string, headers: string[], rows: Array<Record<string, string>>): Promise<void>;
  append(key: string, headers: string[], rows: Array<Record<string, string>>): Promise<void>;
  label(key: string): string;
}

export class CsvRecordStore implements RecordStore {
  async read(path: string): Promise<Array<Record<string, string>>> {
    return parseCsv(await readFile(path, 'utf8'));
  }

  async overwrite(path: string, headers: string[], rows: Array<Record<string, string>>): Promise<void> {
    await writeFile(path, toCsv(headers, rows), 'utf8');
  }

  async append(path: string, headers: string[], rows: Array<Record<string, string>>): Promise<void> {
    let existing: Array<Record<string, string>> = [];
    try {
      existing = parseCsv(await readFile(path, 'utf8'));
    } catch {
      existing = [];
    }
    await writeFile(path, toCsv(headers, [...existing, ...rows]), 'utf8');
  }

  label(key: string): string {
    return key;
  }
}

export class SheetsRecordStore implements RecordStore {
  private readonly client: GoogleSheetsClient;

  private readonly sheetId: string;

  constructor(client: GoogleSheetsClient, sheetId: string) {
    this.client = client;
    this.sheetId = sheetId;
  }

  async read(tab: string): Promise<Array<Record<string, string>>> {
    return this.client.readTab(tab);
  }

  async overwrite(tab: string, headers: string[], rows: Array<Record<string, string>>): Promise<void> {
    await this.client.overwriteTab(tab, headers, rows);
  }

  async append(tab: string, headers: string[], rows: Array<Record<string, string>>): Promise<void> {
    await this.client.appendRows(tab, headers, rows);
  }

  label(tab: string): string {
    return `sheet:${this.sheetId}!${tab}`;
  }
}

export function resolveStoreMode(flags: Map<string, string>): StoreMode {
  return (flags.get('source') ?? 'csv').toLowerCase() === 'sheets' ? 'sheets' : 'csv';
}

/**
 * Tạo store theo flag `--source`. Sheets cần `--sheet-id` hoặc `OPS_SHEET_ID`.
 * Trả về store + mode để CLI tự chọn key (đường dẫn file hay tên tab).
 */
export function createRecordStore(flags: Map<string, string>): { store: RecordStore; mode: StoreMode } {
  const mode = resolveStoreMode(flags);
  if (mode === 'csv') {
    return { store: new CsvRecordStore(), mode };
  }
  const cfg = loadGoogleSheetsConfig();
  const sheetId = flags.get('sheet-id') ?? cfg.opsSheetId;
  if (!sheetId) {
    throw new Error('Chế độ sheets cần --sheet-id hoặc OPS_SHEET_ID trong .env.');
  }
  const client = new GoogleSheetsClient(cfg.serviceAccountJsonPath, sheetId);
  return { store: new SheetsRecordStore(client, sheetId), mode };
}

/** Tên tab chuẩn của file vận hành WORKFLOW_BDS_OPS (khớp templates). */
export const OPS_TABS = {
  raw: 'RAW',
  clean: 'CLEAN',
  queueToday: 'QUEUE_TODAY',
  crm: 'CRM',
  config: 'CONFIG',
  outreachQueue: 'OUTREACH_QUEUE',
  fbPostsQueue: 'FB_POSTS_QUEUE',
  conversations: 'CONVERSATIONS',
  zaloCheckResults: 'ZALO_CHECK_RESULTS',
  outreachResults: 'OUTREACH_RESULTS',
  fbCommentResults: 'FB_COMMENT_RESULTS',
} as const;
