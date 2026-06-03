import { createHash } from 'node:crypto';
import type { Embedder } from '../embeddings/embedder.js';
import type { KbPayload, QdrantStore, UpsertPoint } from '../vectorstore/qdrant.js';
import type { KbRow, KbSource, KbSyncResult } from './types.js';

function contentHash(row: KbRow): string {
  return createHash('sha256')
    .update(`${row.id}|${row.category}|${row.question}|${row.answer}`)
    .digest('hex');
}

function embeddingText(row: KbRow): string {
  return [row.category, row.question, row.answer, row.keywords].filter(Boolean).join('\n');
}

export class KbSyncService {
  private readonly store: QdrantStore;

  private readonly embedder: Embedder;

  constructor(store: QdrantStore, embedder: Embedder) {
    this.store = store;
    this.embedder = embedder;
  }

  /**
   * Đồng bộ KB của 1 dự án vào namespace riêng:
   * - Chỉ embed lại dòng có nội dung thay đổi (so theo content_hash).
   * - Xóa vector của dòng active=FALSE hoặc đã bị gỡ khỏi nguồn.
   */
  async sync(source: KbSource): Promise<KbSyncResult> {
    const meta = await source.readMeta();
    const rows = await source.readRows();
    const activeRows = rows.filter((r) => r.active && r.question && r.answer);

    await this.store.ensureCollection(meta.namespace, this.embedder.dimensions);
    const existing = await this.store.listChunkIds(meta.namespace);

    const toUpsert: KbRow[] = [];
    let unchanged = 0;
    for (const row of activeRows) {
      const hash = contentHash(row);
      if (existing.get(row.id) === hash) {
        unchanged += 1;
      } else {
        toUpsert.push(row);
      }
    }

    const activeIds = new Set(activeRows.map((r) => r.id));
    const toDelete = [...existing.keys()].filter((id) => !activeIds.has(id));

    if (toUpsert.length > 0) {
      const vectors = await this.embedder.embed(toUpsert.map(embeddingText), 'document');
      const points: UpsertPoint[] = toUpsert.map((row, idx) => {
        const vector = vectors[idx];
        if (!vector) {
          throw new Error(`Thiếu embedding cho chunk ${row.id}`);
        }
        const payload: KbPayload = {
          chunk_id: row.id,
          project_id: meta.project_id,
          category: row.category,
          question: row.question,
          answer: row.answer,
          version: meta.version,
          content_hash: contentHash(row),
        };
        return { chunkId: row.id, vector, payload };
      });
      await this.store.upsert(meta.namespace, points);
    }

    await this.store.deleteByChunkIds(meta.namespace, toDelete);

    return {
      namespace: meta.namespace,
      version: meta.version,
      upserted: toUpsert.length,
      deleted: toDelete.length,
      unchanged,
    };
  }
}
