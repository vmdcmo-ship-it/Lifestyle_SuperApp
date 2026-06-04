import { readFile, writeFile } from 'node:fs/promises';
import { loadGoogleSheetsConfig, loadPipelineConfig } from './config.js';
import { parseCsv, toCsv } from './csv.js';
import { CrmExtractor } from './crm/extractor.js';
import { buildReport, renderReport } from './crm/report.js';
import type { ConversationInput, CrmLead } from './crm/types.js';
import { GoogleSheetsClient } from './sheets/googleSheets.js';
import { OPS_TABS, createRecordStore } from './store/recordStore.js';

const CRM_HEADERS = [
  'phone',
  'name',
  'need',
  'budget',
  'interest_level',
  'status',
  'tag',
  'project_id',
  'source',
  'assigned_to',
  'conversation_log',
  'first_contact_at',
  'updated_at',
  'next_action',
];
const OUTPUT_HEADERS = [...CRM_HEADERS, 'summary'];

function parseFlags(argv: string[]): Map<string, string> {
  const map = new Map<string, string>();
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg && arg.startsWith('--')) {
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        map.set(arg.slice(2), next);
        i += 1;
      } else {
        map.set(arg.slice(2), 'true');
      }
    }
  }
  return map;
}

function toConversations(records: Array<Record<string, string>>): ConversationInput[] {
  return records
    .filter((r) => (r.phone ?? '').trim() !== '')
    .map((r) => ({
      phone: (r.phone ?? '').trim(),
      name: (r.name ?? '').trim(),
      projectId: (r.project_id ?? '').trim(),
      source: (r.source ?? '').trim(),
      log: (r.conversation_log ?? '').trim(),
    }));
}

function leadToRecord(lead: CrmLead, log: string): Record<string, string> {
  return {
    phone: lead.phone,
    name: lead.name,
    need: lead.need,
    budget: String(lead.budget),
    interest_level: lead.interestLevel,
    status: lead.status,
    tag: lead.tags.join(';'),
    project_id: lead.projectId,
    source: lead.source,
    assigned_to: '',
    conversation_log: log,
    first_contact_at: '',
    updated_at: lead.updatedAt,
    next_action: lead.nextAction,
    summary: lead.summary,
  };
}

async function main(): Promise<void> {
  const flags = parseFlags(process.argv.slice(2));
  const { store, mode } = createRecordStore(flags);

  const config = loadPipelineConfig();
  if (!config.anthropicApiKey) {
    throw new Error('Thiếu ANTHROPIC_API_KEY.');
  }
  const extractor = new CrmExtractor(config.anthropicApiKey, config.claudeModel);

  let inputKey: string;
  if (mode === 'sheets') {
    inputKey = flags.get('input-tab') ?? OPS_TABS.conversations;
  } else {
    const input = flags.get('input');
    if (!input) {
      throw new Error('Chế độ csv cần --input <CONVERSATIONS.csv>. Tùy chọn: --output, --sheet-id.');
    }
    inputKey = input;
  }

  const conversations = toConversations(await store.read(inputKey));
  const leads: CrmLead[] = [];
  const records: Array<Record<string, string>> = [];
  for (const convo of conversations) {
    const lead = await extractor.extract(convo);
    leads.push(lead);
    records.push(leadToRecord(lead, convo.log));
  }

  if (mode === 'sheets') {
    const crmTab = flags.get('result-tab') ?? OPS_TABS.crm;
    await store.append(crmTab, CRM_HEADERS, records);
    process.stdout.write(`Đã thêm ${records.length} Lead vào tab ${crmTab}.\n`);
  } else {
    const outputPath = flags.get('output') ?? './crm-leads.csv';
    await writeFile(outputPath, toCsv(OUTPUT_HEADERS, records), 'utf8');
    process.stdout.write(`Đã ghi: ${outputPath}\n`);
    const sheetId = flags.get('sheet-id');
    if (sheetId) {
      const sheetsConfig = loadGoogleSheetsConfig();
      const client = new GoogleSheetsClient(sheetsConfig.serviceAccountJsonPath, sheetId);
      await client.appendRows('CRM', CRM_HEADERS, records);
      process.stdout.write(`Đã thêm ${records.length} Lead vào tab CRM của sheet ${sheetId}.\n`);
    }
  }

  process.stdout.write(`\n${renderReport(buildReport(leads))}\n`);
}

main().catch((err: unknown) => {
  process.stderr.write(`Lỗi crm: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exitCode = 1;
});
