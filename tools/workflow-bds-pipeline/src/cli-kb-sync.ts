import { loadEmbeddingConfig, loadGoogleSheetsConfig, loadQdrantConfig } from './config.js';
import { createEmbedder } from './embeddings/factory.js';
import { CsvKbSource } from './kb/csvSource.js';
import { SheetsKbSource } from './kb/sheetsSource.js';
import { KbSyncService } from './kb/sync.js';
import type { KbSource } from './kb/types.js';
import { GoogleSheetsClient } from './sheets/googleSheets.js';
import { QdrantStore } from './vectorstore/qdrant.js';

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

function buildSource(flags: Map<string, string>): KbSource {
  const source = flags.get('source') ?? 'csv';
  if (source === 'sheets') {
    const sheetId = flags.get('sheet-id');
    if (!sheetId) {
      throw new Error('Chế độ sheets cần --sheet-id (ID của Google Sheet KB Master).');
    }
    const sheetsConfig = loadGoogleSheetsConfig();
    return new SheetsKbSource(new GoogleSheetsClient(sheetsConfig.serviceAccountJsonPath, sheetId));
  }
  const meta = flags.get('meta');
  const kb = flags.get('kb');
  if (!meta || !kb) {
    throw new Error('Chế độ csv cần --meta <META.csv> và --kb <KB.csv>.');
  }
  return new CsvKbSource(meta, kb);
}

async function main(): Promise<void> {
  const flags = parseFlags(process.argv.slice(2));
  const source = buildSource(flags);
  const embedder = createEmbedder(loadEmbeddingConfig());
  const store = new QdrantStore(loadQdrantConfig());
  const result = await new KbSyncService(store, embedder).sync(source);

  process.stdout.write(
    [
      `Namespace: ${result.namespace}`,
      `Version: ${result.version}`,
      `Embed mới/cập nhật: ${result.upserted}`,
      `Xóa (deactivate/gỡ): ${result.deleted}`,
      `Không đổi: ${result.unchanged}`,
      '',
    ].join('\n'),
  );
}

main().catch((err: unknown) => {
  process.stderr.write(`Lỗi kb-sync: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exitCode = 1;
});
