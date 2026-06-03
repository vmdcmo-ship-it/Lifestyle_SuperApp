import { loadAdvisorConfig, loadEmbeddingConfig, loadQdrantConfig } from './config.js';
import { Advisor } from './advisor/advisor.js';
import { loadPersona } from './advisor/persona.js';
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
  const message = flags.get('message');
  if (!projectId || !message) {
    throw new Error('Cần --project <project_id> và --message "<tin nhắn khách>".');
  }

  const advisorConfig = loadAdvisorConfig();
  const persona = await loadPersona(advisorConfig.personaPath);
  const embedder = createEmbedder(loadEmbeddingConfig());
  const store = new QdrantStore(loadQdrantConfig());
  const retriever = new KbRetriever(store, embedder);
  const advisor = new Advisor(advisorConfig, persona, retriever);

  const result = await advisor.reply(projectId, message);

  process.stdout.write(
    [
      `--- ${persona.name} trả lời (dự án ${projectId}) ---`,
      result.reply,
      '',
      `[intent=${result.intent} | escalate=${result.escalate} | has_answer=${result.has_answer} | chunks=${result.used_chunk_ids.join(',') || '-'}]`,
      '',
    ].join('\n'),
  );
}

main().catch((err: unknown) => {
  process.stderr.write(`Lỗi advisor: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exitCode = 1;
});
