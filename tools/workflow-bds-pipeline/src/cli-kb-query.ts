import { loadEmbeddingConfig, loadQdrantConfig } from './config.js';
import { createEmbedder } from './embeddings/factory.js';
import { KbRetriever } from './kb/retriever.js';
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

async function main(): Promise<void> {
  const flags = parseFlags(process.argv.slice(2));
  const projectId = flags.get('project');
  const query = flags.get('query');
  if (!projectId || !query) {
    throw new Error('Cần --project <project_id> và --query "<câu hỏi>". Tùy chọn --topk <N>.');
  }
  const topK = Number(flags.get('topk') ?? '4');

  const embedder = createEmbedder(loadEmbeddingConfig());
  const store = new QdrantStore(loadQdrantConfig());
  const chunks = await new KbRetriever(store, embedder).retrieve(projectId, query, topK);

  if (chunks.length === 0) {
    process.stdout.write(`Không tìm thấy tri thức cho dự án ${projectId}.\n`);
    return;
  }
  process.stdout.write(`Top ${chunks.length} kết quả cho "${query}" (dự án ${projectId}):\n\n`);
  chunks.forEach((c, i) => {
    process.stdout.write(
      `${i + 1}. [${c.score.toFixed(3)}] (${c.category}) ${c.question}\n   -> ${c.answer}\n\n`,
    );
  });
}

main().catch((err: unknown) => {
  process.stderr.write(`Lỗi kb-query: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exitCode = 1;
});
