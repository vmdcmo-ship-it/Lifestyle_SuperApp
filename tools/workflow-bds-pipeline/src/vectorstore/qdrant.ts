import { createHash } from 'node:crypto';
import { QdrantClient } from '@qdrant/js-client-rest';
import type { QdrantConfig } from '../config.js';

export interface KbPayload {
  chunk_id: string;
  project_id: string;
  category: string;
  question: string;
  answer: string;
  version: number;
  content_hash: string;
  [key: string]: unknown;
}

export interface UpsertPoint {
  chunkId: string;
  vector: number[];
  payload: KbPayload;
}

export interface SearchHit {
  score: number;
  payload: KbPayload;
}

/**
 * Chuyển chunk_id dạng "DA001-001" thành UUID tất định (Qdrant yêu cầu id là uint hoặc UUID).
 */
export function chunkIdToPointId(chunkId: string): string {
  const hex = createHash('md5').update(chunkId).digest('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

export class QdrantStore {
  private readonly client: QdrantClient;

  constructor(config: QdrantConfig) {
    this.client = config.apiKey
      ? new QdrantClient({ url: config.url, apiKey: config.apiKey })
      : new QdrantClient({ url: config.url });
  }

  async ensureCollection(namespace: string, dimensions: number): Promise<void> {
    const exists = await this.collectionExists(namespace);
    if (exists) {
      return;
    }
    await this.client.createCollection(namespace, {
      vectors: { size: dimensions, distance: 'Cosine' },
    });
  }

  async collectionExists(namespace: string): Promise<boolean> {
    const { collections } = await this.client.getCollections();
    return collections.some((c) => c.name === namespace);
  }

  async upsert(namespace: string, points: UpsertPoint[]): Promise<void> {
    if (points.length === 0) {
      return;
    }
    await this.client.upsert(namespace, {
      wait: true,
      points: points.map((p) => ({
        id: chunkIdToPointId(p.chunkId),
        vector: p.vector,
        payload: p.payload,
      })),
    });
  }

  async deleteByChunkIds(namespace: string, chunkIds: string[]): Promise<void> {
    if (chunkIds.length === 0) {
      return;
    }
    await this.client.delete(namespace, {
      wait: true,
      points: chunkIds.map(chunkIdToPointId),
    });
  }

  async search(namespace: string, vector: number[], topK: number): Promise<SearchHit[]> {
    if (!(await this.collectionExists(namespace))) {
      return [];
    }
    const result = await this.client.search(namespace, {
      vector,
      limit: topK,
      with_payload: true,
    });
    return result.map((r) => ({ score: r.score, payload: r.payload as KbPayload }));
  }

  async listChunkIds(namespace: string): Promise<Map<string, string>> {
    const map = new Map<string, string>();
    if (!(await this.collectionExists(namespace))) {
      return map;
    }
    let offset: string | number | undefined | null;
    do {
      const page = await this.client.scroll(namespace, {
        limit: 256,
        with_payload: true,
        with_vector: false,
        offset: offset ?? undefined,
      });
      for (const point of page.points) {
        const payload = point.payload as KbPayload | null;
        if (payload?.chunk_id) {
          map.set(payload.chunk_id, payload.content_hash);
        }
      }
      offset = page.next_page_offset as string | number | null;
    } while (offset !== null && offset !== undefined);
    return map;
  }
}
