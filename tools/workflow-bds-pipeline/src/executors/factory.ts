import { loadExecutorMode, loadOpenclawConfig, type ExecutorMode } from '../config.js';
import { MockZaloExecutor } from '../zalo/mockExecutor.js';
import type { ZaloExecutor } from '../zalo/types.js';
import { MockOutreachExecutor } from '../outreach/mockOutreachExecutor.js';
import type { OutreachExecutor } from '../outreach/types.js';
import { MockFbExecutor } from '../fb/mockFbExecutor.js';
import type { FbExecutor } from '../fb/types.js';
import { OpenclawClient } from './openclawClient.js';
import { OpenclawZaloExecutor } from './openclawZaloExecutor.js';
import { OpenclawOutreachExecutor } from './openclawOutreachExecutor.js';
import { OpenclawFbExecutor } from './openclawFbExecutor.js';

export interface ExecutorFactoryOptions {
  checkpointRate?: number;
}

function resolveMode(override?: string): ExecutorMode {
  if (override === 'openclaw' || override === 'mock') {
    return override;
  }
  return loadExecutorMode();
}

function client(): OpenclawClient {
  return new OpenclawClient(loadOpenclawConfig());
}

export function createZaloExecutor(override?: string, opts: ExecutorFactoryOptions = {}): ZaloExecutor {
  if (resolveMode(override) === 'openclaw') {
    return new OpenclawZaloExecutor(client());
  }
  return new MockZaloExecutor({ checkpointRate: opts.checkpointRate ?? 0 });
}

export function createOutreachExecutor(override?: string, opts: ExecutorFactoryOptions = {}): OutreachExecutor {
  if (resolveMode(override) === 'openclaw') {
    return new OpenclawOutreachExecutor(client());
  }
  return new MockOutreachExecutor({ checkpointRate: opts.checkpointRate ?? 0 });
}

export function createFbExecutor(override?: string, opts: ExecutorFactoryOptions = {}): FbExecutor {
  if (resolveMode(override) === 'openclaw') {
    return new OpenclawFbExecutor(client());
  }
  return new MockFbExecutor({ checkpointRate: opts.checkpointRate ?? 0 });
}
