export interface Embedder {
  readonly dimensions: number;
  embed(texts: string[], inputType: 'document' | 'query'): Promise<number[][]>;
}
