import { QuotaConfig } from './safety/configLoader.js';
import { QuotaManager } from './safety/quotaManager.js';
import { SafetyStateStore } from './safety/state.js';
import { ZaloChecker, type CheckerOptions, type QueueItem } from './zalo/checker.js';
import { createZaloExecutor } from './executors/factory.js';
import { OPS_TABS, createRecordStore } from './store/recordStore.js';

const RESULT_HEADERS = ['phone', 'account_id', 'outcome', 'display_name', 'message'];

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

function toQueue(records: Array<Record<string, string>>): QueueItem[] {
  return records
    .filter((r) => (r.phone ?? '').trim() !== '' && (r.action ?? 'check_zalo').includes('check'))
    .map((r) => ({ phone: (r.phone ?? '').trim(), accountId: (r.account_id ?? 'zalo_acc01').trim() }));
}

async function main(): Promise<void> {
  const flags = parseFlags(process.argv.slice(2));
  const { store, mode } = createRecordStore(flags);

  let queueKey: string;
  let configKey: string;
  let outputKey: string;
  if (mode === 'sheets') {
    queueKey = flags.get('queue-tab') ?? OPS_TABS.queueToday;
    configKey = flags.get('config-tab') ?? OPS_TABS.config;
    outputKey = flags.get('result-tab') ?? OPS_TABS.zaloCheckResults;
  } else {
    const queuePath = flags.get('queue');
    const configPath = flags.get('config');
    if (!queuePath || !configPath) {
      throw new Error('Chế độ csv cần --queue <QUEUE.csv> và --config <CONFIG.csv>. Tùy chọn: --state, --output, --fast, --checkpoint-rate.');
    }
    queueKey = queuePath;
    configKey = configPath;
    outputKey = flags.get('output') ?? './zalo-check-results.csv';
  }
  const statePath = flags.get('state') ?? './safety-state.json';
  const fast = flags.get('fast') === 'true';
  const checkpointRate = Number(flags.get('checkpoint-rate') ?? '0');

  const config = QuotaConfig.fromRecords(await store.read(configKey));
  const state = await SafetyStateStore.load(statePath);
  const quota = new QuotaManager(config, state);
  const executor = createZaloExecutor(flags.get('executor'), { checkpointRate });
  const checkerOptions: Partial<CheckerOptions> = {
    applyDelay: true,
    onLog: (m: string) => process.stdout.write(`  ${m}\n`),
  };
  if (fast) {
    checkerOptions.sleepFn = async () => undefined;
  }
  const checker = new ZaloChecker(quota, executor, checkerOptions);

  const items = toQueue(await store.read(queueKey));
  const report = await checker.run(items);
  await state.save();

  const rows = report.results.map((r) => ({
    phone: r.phone,
    account_id: items.find((i) => i.phone === r.phone)?.accountId ?? '',
    outcome: r.outcome,
    display_name: r.displayName ?? '',
    message: r.message ?? '',
  }));
  await store.overwrite(outputKey, RESULT_HEADERS, rows);

  const hasZalo = report.results.filter((r) => r.outcome === 'has_zalo').length;
  process.stdout.write(
    [
      '',
      `Đã xử lý: ${report.processed}`,
      `Có Zalo: ${hasZalo}`,
      `Không Zalo: ${report.results.filter((r) => r.outcome === 'no_zalo').length}`,
      `Checkpoint: ${report.results.filter((r) => r.outcome === 'checkpoint').length}`,
      `Bỏ qua: ${report.skipped.length}`,
      `Account bị phanh: ${report.pausedAccounts.join(', ') || '-'}`,
      `State: ${statePath} | Kết quả: ${store.label(outputKey)}`,
      '',
    ].join('\n'),
  );
}

main().catch((err: unknown) => {
  process.stderr.write(`Lỗi zalo-check: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exitCode = 1;
});
