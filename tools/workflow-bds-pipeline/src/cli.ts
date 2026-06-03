import { readFile, writeFile } from 'node:fs/promises';
import { loadGoogleSheetsConfig, loadPipelineConfig } from './config.js';
import { parseCsv, toCsv } from './csv.js';
import { LeadPipeline } from './pipeline.js';
import { GoogleSheetsClient } from './sheets/googleSheets.js';
import type { CleanRow, RawRow } from './types.js';

const CLEAN_HEADERS = [
  'phone',
  'name',
  'need',
  'budget',
  'area',
  'lead_score',
  'project_id',
  'source_group',
  'fb_id',
  'is_duplicate',
  'in_crm',
  'cleaned_at',
];

function parseFlags(argv: string[]): Map<string, string> {
  const map = new Map<string, string>();
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg && arg.startsWith('--')) {
      map.set(arg.slice(2), argv[i + 1] ?? '');
      i += 1;
    }
  }
  return map;
}

function toRawRows(records: Array<Record<string, string>>): RawRow[] {
  return records.map((r) => ({
    uid: r.uid ?? '',
    fb_id: r.fb_id ?? '',
    name_fb: r.name_fb ?? '',
    raw_text: r.raw_text ?? '',
    phone_raw: r.phone_raw ?? '',
    source_group: r.source_group ?? '',
    project_id: r.project_id ?? '',
    collected_by: r.collected_by ?? '',
    created_at: r.created_at ?? '',
    note: r.note ?? '',
  }));
}

function cleanRowToRecord(row: CleanRow): Record<string, string> {
  return {
    phone: row.phone,
    name: row.name,
    need: row.need,
    budget: String(row.budget),
    area: row.area,
    lead_score: String(row.lead_score),
    project_id: row.project_id,
    source_group: row.source_group,
    fb_id: row.fb_id,
    is_duplicate: String(row.is_duplicate).toUpperCase(),
    in_crm: String(row.in_crm).toUpperCase(),
    cleaned_at: row.cleaned_at,
  };
}

async function readRawCsv(path: string): Promise<RawRow[]> {
  return toRawRows(parseCsv(await readFile(path, 'utf8')));
}

async function readCrmPhonesCsv(path: string | undefined): Promise<Set<string>> {
  if (!path) {
    return new Set();
  }
  const records = parseCsv(await readFile(path, 'utf8'));
  return new Set(records.map((r) => (r.phone ?? '').trim()).filter(Boolean));
}

async function runCsv(flags: Map<string, string>): Promise<void> {
  const input = flags.get('input');
  const output = flags.get('output');
  if (!input || !output) {
    throw new Error('Chế độ csv cần --input và --output.');
  }
  const config = loadPipelineConfig();
  const rawRows = await readRawCsv(input);
  const crmPhones = await readCrmPhonesCsv(flags.get('crm'));
  const result = await new LeadPipeline(config).run(rawRows, crmPhones);
  await writeFile(output, toCsv(CLEAN_HEADERS, result.kept.map(cleanRowToRecord)), 'utf8');
  printStats(`Đã ghi: ${output}`, config.leadScoreMin, config.useClaude, config.claudeModel, result);
}

async function runSheets(flags: Map<string, string>): Promise<void> {
  const config = loadPipelineConfig();
  const sheetsConfig = loadGoogleSheetsConfig();
  const sheetId = flags.get('sheet-id') ?? sheetsConfig.opsSheetId;
  if (!sheetId) {
    throw new Error('Chế độ sheets cần --sheet-id hoặc OPS_SHEET_ID.');
  }
  const client = new GoogleSheetsClient(sheetsConfig.serviceAccountJsonPath, sheetId);
  const rawRows = toRawRows(await client.readTab('RAW'));
  const crmRecords = await client.readTab('CRM').catch(() => []);
  const crmPhones = new Set(crmRecords.map((r) => (r.phone ?? '').trim()).filter(Boolean));
  const result = await new LeadPipeline(config).run(rawRows, crmPhones);
  await client.overwriteTab('CLEAN', CLEAN_HEADERS, result.kept.map(cleanRowToRecord));
  printStats(`Đã ghi tab CLEAN của sheet ${sheetId}`, config.leadScoreMin, config.useClaude, config.claudeModel, result);
}

function printStats(
  target: string,
  leadScoreMin: number,
  useClaude: boolean,
  model: string,
  result: { total: number; kept: unknown[]; droppedNoPhone: number; duplicates: number; droppedLowScore: number },
): void {
  process.stdout.write(
    [
      `Tổng RAW: ${result.total}`,
      `Giữ lại (CLEAN): ${result.kept.length}`,
      `Loại - không có SĐT: ${result.droppedNoPhone}`,
      `Loại - trùng: ${result.duplicates}`,
      `Loại - điểm thấp (< ${leadScoreMin}): ${result.droppedLowScore}`,
      `Chế độ Claude: ${useClaude ? `BẬT (${model})` : 'TẮT (offline)'}`,
      target,
      '',
    ].join('\n'),
  );
}

async function main(): Promise<void> {
  const flags = parseFlags(process.argv.slice(2));
  const source = flags.get('source') ?? 'csv';
  if (source === 'sheets') {
    await runSheets(flags);
  } else {
    await runCsv(flags);
  }
}

main().catch((err: unknown) => {
  process.stderr.write(`Lỗi pipeline: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exitCode = 1;
});
