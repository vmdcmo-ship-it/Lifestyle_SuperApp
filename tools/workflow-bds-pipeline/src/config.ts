import 'dotenv/config';
import type { PipelineConfig } from './types.js';

export function loadPipelineConfig(): PipelineConfig {
  const useClaude = (process.env.USE_CLAUDE ?? 'true').toLowerCase() === 'true';
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const config: PipelineConfig = {
    useClaude: useClaude && Boolean(apiKey),
    claudeModel: process.env.CLAUDE_MODEL ?? 'claude-haiku-4-5-20251001',
    leadScoreMin: Number(process.env.LEAD_SCORE_MIN ?? '50'),
  };
  if (apiKey) {
    config.anthropicApiKey = apiKey;
  }
  return config;
}

export type EmbeddingProvider = 'voyage' | 'mock';

export interface EmbeddingConfig {
  provider: EmbeddingProvider;
  voyageApiKey?: string;
  voyageModel: string;
}

export function loadEmbeddingConfig(): EmbeddingConfig {
  const provider = (process.env.EMBEDDING_PROVIDER ?? 'voyage').toLowerCase() === 'mock' ? 'mock' : 'voyage';
  const config: EmbeddingConfig = {
    provider,
    voyageModel: process.env.VOYAGE_MODEL ?? 'voyage-3.5',
  };
  const key = process.env.VOYAGE_API_KEY;
  if (key) {
    config.voyageApiKey = key;
  }
  return config;
}

export interface QdrantConfig {
  url: string;
  apiKey?: string;
}

export function loadQdrantConfig(): QdrantConfig {
  const config: QdrantConfig = {
    url: process.env.QDRANT_URL ?? 'http://localhost:6333',
  };
  const key = process.env.QDRANT_API_KEY;
  if (key) {
    config.apiKey = key;
  }
  return config;
}

export interface AdvisorConfig {
  anthropicApiKey?: string;
  writerModel: string;
  personaPath: string;
  topK: number;
}

export function loadAdvisorConfig(): AdvisorConfig {
  const config: AdvisorConfig = {
    writerModel: process.env.CLAUDE_MODEL_WRITER ?? 'claude-sonnet-4-5',
    personaPath: process.env.PERSONA_PATH ?? './assets/persona.json',
    topK: Number(process.env.RAG_TOP_K ?? '4'),
  };
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (apiKey) {
    config.anthropicApiKey = apiKey;
  }
  return config;
}

export type ExecutorMode = 'mock' | 'openclaw';

export function loadExecutorMode(): ExecutorMode {
  return (process.env.EXECUTOR_MODE ?? 'mock').toLowerCase() === 'openclaw' ? 'openclaw' : 'mock';
}

export interface OpenclawConfig {
  runUrl: string;
  token?: string;
  timeoutMs: number;
}

export function loadOpenclawConfig(): OpenclawConfig {
  const config: OpenclawConfig = {
    runUrl: process.env.OPENCLAW_RUN_URL ?? 'http://127.0.0.1:5678/webhook/bds-action',
    timeoutMs: Number(process.env.OPENCLAW_TIMEOUT_MS ?? '120000'),
  };
  const token = process.env.OPENCLAW_TOKEN;
  if (token) {
    config.token = token;
  }
  return config;
}

export interface GoogleSheetsConfig {
  serviceAccountJsonPath: string;
  opsSheetId?: string;
}

export function loadGoogleSheetsConfig(): GoogleSheetsConfig {
  const config: GoogleSheetsConfig = {
    serviceAccountJsonPath: process.env.GOOGLE_SERVICE_ACCOUNT_JSON ?? './service-account.json',
  };
  const opsSheetId = process.env.OPS_SHEET_ID;
  if (opsSheetId) {
    config.opsSheetId = opsSheetId;
  }
  return config;
}
