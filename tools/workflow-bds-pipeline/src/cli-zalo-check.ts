import { readFile, writeFile } from 'node:fs/promises';
import { parseCsv, toCsv } from './csv.js';
import { QuotaConfig } from './safety/configLoader.js';
import { QuotaManager } from './safety/quotaManager.js';
import { SafetyStateStore } from './safety/state.js';
import { ZaloChecker, type CheckerOptions, type QueueItem } from './zalo/checker.js';
import { createZaloExecutor } from './executors/factory.js';

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

async function loadQueue(path: string): Promise<QueueItem[]> {
  const records = parseCsv(await readFile(path, 'utf8'));
  return records
    .filter((r) => (r.phone ?? '').trim() !== '' && (r.action ?? 'check_zalo').includes('check'))
    .map((r) => ({ phone: (r.phone ?? '').trim(), accountId: (r.account_id ?? 'zalo_acc01').trim() }));
}

async function main(): Promise<void> {
  const flags = parseFlags(process.argv.slice(2));
  const queuePath = flags.get('queue');
  const configPath = flags.get('config');
  if (!queuePath || !configPath) {
    throw new Error('Cần --queue <QUEUE.csv> và --config <CONFIG.csv>. Tùy chọn: --state, --output, --fast, --checkpoint-rate.');
  }
  const statePath = flags.get('state') ?? './safety-state.json';
  const outputPath = flags.get('output') ?? './zalo-check-results.csv';
  const fast = flags.get('fast') === 'true';
  const checkpointRate = Number(flags.get('checkpoint-rate') ?? '0');

  const config = await QuotaConfig.fromCsv(configPath);
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

  const items = await loadQueue(queuePath);
  const report = await checker.run(items);
  await state.save();

  const rows = report.results.map((r) => ({
    phone: r.phone,
    account_id: items.find((i) => i.phone === r.phone)?.accountId ?? '',
    outcome: r.outcome,
    display_name: r.displayName ?? '',
    message: r.message ?? '',
  }));
  await writeFile(outputPath, toCsv(RESULT_HEADERS, rows), 'utf8');

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
      `State: ${statePath} | Kết quả: ${outputPath}`,
      '',
    ].join('\n'),
  );
}

main().catch((err: unknown) => {
  process.stderr.write(`Lỗi zalo-check: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exitCode = 1;
});
