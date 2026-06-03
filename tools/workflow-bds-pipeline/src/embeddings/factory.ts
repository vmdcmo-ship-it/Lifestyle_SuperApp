import type { EmbeddingConfig } from '../config.js';
import type { Embedder } from './embedder.js';
import { MockEmbedder } from './mock.js';
import { VoyageEmbedder } from './voyage.js';

export function createEmbedder(config: EmbeddingConfig): Embedder {
  if (config.provider === 'mock') {
    return new MockEmbedder();
  }
  if (!config.voyageApiKey) {
    throw new Error('Thiếu VOYAGE_API_KEY. Đặt EMBEDDING_PROVIDER=mock để test không cần key.');
  }
  return new VoyageEmbedder(config.voyageApiKey, config.voyageModel);
}
