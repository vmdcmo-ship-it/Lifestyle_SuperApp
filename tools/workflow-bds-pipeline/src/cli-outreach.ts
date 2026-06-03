import { readFile, writeFile } from 'node:fs/promises';
import { Advisor } from './advisor/advisor.js';
import { loadPersona } from './advisor/persona.js';
import { loadAdvisorConfig, loadEmbeddingConfig, loadQdrantConfig } from './config.js';
import { parseCsv, toCsv } from './csv.js';
import { createEmbedder } from './embeddings/factory.js';
import { KbRetriever } from './kb/retriever.js';
import { ContentGenerator } from './outreach/contentGenerator.js';
import { createOutreachExecutor } from './executors/factory.js';
import { OutreachRunner, type OutreachOptions } from './outreach/orchestrator.js';
import type { OutreachAction, OutreachTask } from './outreach/types.js';
import { QuotaConfig } from './safety/configLoader.js';
import { QuotaManager } from './safety/quotaManager.js';
import { SafetyStateStore } from './safety/state.js';
import { QdrantStore } from './vectorstore/qdrant.js';

const RESULT_HEADERS = ['phone', 'account_id', 'action', 'status', 'reason', 'content'];
const VALID_ACTIONS: OutreachAction[] = ['add_friend', 'message', 'add_group'];

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

async function loadTasks(path: string): Promise<OutreachTask[]> {
  const records = parseCsv(await readFile(path, 'utf8'));
  return records
    .filter((r) => (r.phone ?? '').trim() !== '')
    .map((r) => {
      const action = (r.action ?? 'message').trim() as OutreachAction;
      return {
        phone: (r.phone ?? '').trim(),
        accountId: (r.account_id ?? 'zalo_acc01').trim(),
        action: VALID_ACTIONS.includes(action) ? action : 'message',
        projectId: (r.project_id ?? '').trim(),
        projectName: (r.project_name ?? '').trim(),
        leadName: (r.lead_name ?? '').trim(),
        leadNeed: (r.lead_need ?? '').trim(),
        groupId: (r.group_id ?? '').trim(),
        groupName: (r.group_name ?? '').trim(),
        approved: (r.approved ?? 'FALSE').trim().toUpperCase() === 'TRUE',
      };
    });
}

async function main(): Promise<void> {
  const flags = parseFlags(process.argv.slice(2));
  const queuePath = flags.get('queue');
  const configPath = flags.get('config');
  if (!queuePath || !configPath) {
    throw new Error('Cần --queue <OUTREACH.csv> và --config <CONFIG.csv>.');
  }
  const statePath = flags.get('state') ?? './safety-state.json';
  const outputPath = flags.get('output') ?? './outreach-results.csv';
  const fast = flags.get('fast') === 'true';
  const checkpointRate = Number(flags.get('checkpoint-rate') ?? '0');

  const advisorConfig = loadAdvisorConfig();
  const persona = await loadPersona(advisorConfig.personaPath);
  const embedder = createEmbedder(loadEmbeddingConfig());
  const store = new QdrantStore(loadQdrantConfig());
  const retriever = new KbRetriever(store, embedder);
  const advisor = new Advisor(advisorConfig, persona, retriever);
  const content = new ContentGenerator(persona, advisor);

  const quotaConfig = await QuotaConfig.fromCsv(configPath);
  const state = await SafetyStateStore.load(statePath);
  const quota = new QuotaManager(quotaConfig, state);
  const executor = createOutreachExecutor(flags.get('executor'), { checkpointRate });

  const options: Partial<OutreachOptions> = { applyDelay: true, onLog: (m) => process.stdout.write(`  ${m}\n`) };
  if (fast) {
    options.sleepFn = async () => undefined;
  }
  const runner = new OutreachRunner(quota, executor, content, options);

  const tasks = await loadTasks(queuePath);
  const report = await runner.run(tasks);
  await state.save();

  const rows = report.results.map((r) => ({
    phone: r.phone,
    account_id: r.accountId,
    action: r.action,
    status: r.status,
    reason: r.reason ?? '',
    content: r.content,
  }));
  await writeFile(outputPath, toCsv(RESULT_HEADERS, rows), 'utf8');

  process.stdout.write(
    [
      '',
      `Đã gửi: ${report.sent}`,
      `Chờ duyệt (draft): ${report.pendingApproval}`,
      `Bỏ qua: ${report.skipped}`,
      `Account bị phanh: ${report.pausedAccounts.join(', ') || '-'}`,
      `Kết quả (kèm nội dung): ${outputPath}`,
      '',
    ].join('\n'),
  );
}

main().catch((err: unknown) => {
  process.stderr.write(`Lỗi outreach: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exitCode = 1;
});
