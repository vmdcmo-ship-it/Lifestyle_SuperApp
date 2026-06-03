import type { Embedder } from '../embeddings/embedder.js';
import type { QdrantStore, SearchHit } from '../vectorstore/qdrant.js';

export interface RetrievedChunk {
  chunkId: string;
  category: string;
  question: string;
  answer: string;
  score: number;
}

export class KbRetriever {
  private readonly store: QdrantStore;

  private readonly embedder: Embedder;

  constructor(store: QdrantStore, embedder: Embedder) {
    this.store = store;
    this.embedder = embedder;
  }

  /**
   * Truy xuất tri thức CHỈ trong namespace của 1 dự án -> chống nhầm dữ liệu dự án khác.
   */
  async retrieve(projectId: string, query: string, topK = 4): Promise<RetrievedChunk[]> {
    const namespace = `kb_project_${projectId}`;
    const vectors = await this.embedder.embed([query], 'query');
    const vector = vectors[0];
    if (!vector) {
      return [];
    }
    const hits = await this.store.search(namespace, vector, topK);
    return hits.map(toChunk);
  }
}

function toChunk(hit: SearchHit): RetrievedChunk {
  return {
    chunkId: hit.payload.chunk_id,
    category: hit.payload.category,
    question: hit.payload.question,
    answer: hit.payload.answer,
    score: hit.score,
  };
}
