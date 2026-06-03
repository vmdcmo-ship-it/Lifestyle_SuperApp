import type { Embedder } from './embedder.js';

const VOYAGE_ENDPOINT = 'https://api.voyageai.com/v1/embeddings';

const MODEL_DIMENSIONS: Record<string, number> = {
  'voyage-3-lite': 512,
  'voyage-3': 1024,
  'voyage-3.5': 1024,
  'voyage-3.5-lite': 1024,
};

interface VoyageResponse {
  data: Array<{ embedding: number[]; index: number }>;
}

export class VoyageEmbedder implements Embedder {
  readonly dimensions: number;

  private readonly apiKey: string;

  private readonly model: string;

  constructor(apiKey: string, model: string) {
    this.apiKey = apiKey;
    this.model = model;
    this.dimensions = MODEL_DIMENSIONS[model] ?? 512;
  }

  async embed(texts: string[], inputType: 'document' | 'query'): Promise<number[][]> {
    if (texts.length === 0) {
      return [];
    }
    const response = await fetch(VOYAGE_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: texts, model: this.model, input_type: inputType }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Voyage API lỗi ${response.status}: ${detail}`);
    }

    const json = (await response.json()) as VoyageResponse;
    return json.data
      .sort((a, b) => a.index - b.index)
      .map((d) => d.embedding);
  }
}
