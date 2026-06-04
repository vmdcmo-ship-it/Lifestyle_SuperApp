import { loadAdvisorConfig, loadPipelineConfig } from './config.js';
import { loadPersona } from './advisor/persona.js';
import { OPS_TABS, createRecordStore } from './store/recordStore.js';
import { CommentGenerator } from './fb/commentGenerator.js';
import { createFbExecutor } from './executors/factory.js';
import { FbCommentRunner, type FbRunnerOptions } from './fb/runner.js';
import type { FbPost } from './fb/types.js';
import { QuotaConfig } from './safety/configLoader.js';
import { QuotaManager } from './safety/quotaManager.js';
import { SafetyStateStore } from './safety/state.js';

const RESULT_HEADERS = ['post_id', 'group_id', 'account_id', 'outcome', 'has_cta', 'reason', 'comment'];

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

function toPosts(records: Array<Record<string, string>>): FbPost[] {
  return records
    .filter((r) => (r.post_id ?? '').trim() !== '')
    .map((r) => ({
      postId: (r.post_id ?? '').trim(),
      groupId: (r.group_id ?? '').trim(),
      groupName: (r.group_name ?? '').trim(),
      authorName: (r.author_name ?? '').trim(),
      content: (r.content ?? '').trim(),
      accountId: (r.account_id ?? 'fb_acc01').trim(),
      productBrief: (r.product_brief ?? '').trim(),
      approved: (r.approved ?? 'FALSE').trim().toUpperCase() === 'TRUE',
    }));
}

async function main(): Promise<void> {
  const flags = parseFlags(process.argv.slice(2));
  const { store, mode } = createRecordStore(flags);

  let queueKey: string;
  let configKey: string;
  let outputKey: string;
  if (mode === 'sheets') {
    queueKey = flags.get('queue-tab') ?? OPS_TABS.fbPostsQueue;
    configKey = flags.get('config-tab') ?? OPS_TABS.config;
    outputKey = flags.get('result-tab') ?? OPS_TABS.fbCommentResults;
  } else {
    const queuePath = flags.get('queue');
    const configPath = flags.get('config');
    if (!queuePath || !configPath) {
      throw new Error('Chế độ csv cần --queue <FB_POSTS.csv> và --config <CONFIG.csv>.');
    }
    queueKey = queuePath;
    configKey = configPath;
    outputKey = flags.get('output') ?? './fb-comment-results.csv';
  }
  const statePath = flags.get('state') ?? './safety-state.json';
  const fast = flags.get('fast') === 'true';
  const checkpointRate = Number(flags.get('checkpoint-rate') ?? '0');

  const pipelineConfig = loadPipelineConfig();
  const advisorConfig = loadAdvisorConfig();
  if (!pipelineConfig.anthropicApiKey) {
    throw new Error('Thiếu ANTHROPIC_API_KEY.');
  }
  const persona = await loadPersona(advisorConfig.personaPath);
  const generator = new CommentGenerator(
    pipelineConfig.anthropicApiKey,
    pipelineConfig.claudeModel,
    advisorConfig.writerModel,
    persona,
  );

  const quotaConfig = QuotaConfig.fromRecords(await store.read(configKey));
  const state = await SafetyStateStore.load(statePath);
  const quota = new QuotaManager(quotaConfig, state);
  const executor = createFbExecutor(flags.get('executor'), { checkpointRate });

  const options: Partial<FbRunnerOptions> = { applyDelay: true, onLog: (m) => process.stdout.write(`  ${m}\n`) };
  if (fast) {
    options.sleepFn = async () => undefined;
  }
  const runner = new FbCommentRunner(quota, executor, generator, options);

  const posts = toPosts(await store.read(queueKey));
  const report = await runner.run(posts);
  await state.save();

  const rows = report.results.map((r) => ({
    post_id: r.postId,
    group_id: r.groupId,
    account_id: r.accountId,
    outcome: r.outcome,
    has_cta: String(r.hasCta).toUpperCase(),
    reason: r.reason ?? '',
    comment: r.comment,
  }));
  await store.overwrite(outputKey, RESULT_HEADERS, rows);

  process.stdout.write(
    [
      '',
      `Đã comment: ${report.commented}`,
      `Chờ duyệt (draft): ${report.pendingApproval}`,
      `Bỏ qua không phù hợp: ${report.notRelevant}`,
      `Bỏ qua (quota/giờ/nhóm): ${report.skipped}`,
      `Account bị phanh: ${report.pausedAccounts.join(', ') || '-'}`,
      `Kết quả (kèm comment): ${store.label(outputKey)}`,
      '',
    ].join('\n'),
  );
}

main().catch((err: unknown) => {
  process.stderr.write(`Lỗi fb-comment: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exitCode = 1;
});
