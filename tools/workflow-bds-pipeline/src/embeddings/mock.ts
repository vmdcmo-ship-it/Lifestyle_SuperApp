import { createHash } from 'node:crypto';
import type { Embedder } from './embedder.js';

/**
 * Embedder giả lập tất định (deterministic) để test plumbing Qdrant mà không tốn API.
 * KHÔNG dùng cho production: vector không mang ngữ nghĩa thật.
 */
export class MockEmbedder implements Embedder {
  readonly dimensions: number;

  constructor(dimensions = 512) {
    this.dimensions = dimensions;
  }

  async embed(texts: string[], _inputType: 'document' | 'query'): Promise<number[][]> {
    return texts.map((t) => this.vectorFor(t));
  }

  private vectorFor(text: string): number[] {
    const vec = new Array<number>(this.dimensions).fill(0);
    const tokens = text.toLowerCase().split(/\s+/).filter(Boolean);
    for (const token of tokens) {
      const hash = createHash('sha256').update(token).digest();
      for (let i = 0; i < this.dimensions; i += 1) {
        const byte = hash[i % hash.length] ?? 0;
        vec[i] = (vec[i] ?? 0) + (byte / 255 - 0.5);
      }
    }
    return normalize(vec);
  }
}

function normalize(vec: number[]): number[] {
  const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0)) || 1;
  return vec.map((v) => v / norm);
}
