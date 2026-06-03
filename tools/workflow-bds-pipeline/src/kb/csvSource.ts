import { readFile } from 'node:fs/promises';
import { parseCsv } from '../csv.js';
import type { KbMeta, KbRow, KbSource } from './types.js';

export class CsvKbSource implements KbSource {
  private readonly metaPath: string;

  private readonly kbPath: string;

  constructor(metaPath: string, kbPath: string) {
    this.metaPath = metaPath;
    this.kbPath = kbPath;
  }

  async readMeta(): Promise<KbMeta> {
    const records = parseCsv(await readFile(this.metaPath, 'utf8'));
    const first = records[0];
    if (!first) {
      throw new Error(`META rỗng: ${this.metaPath}`);
    }
    const projectId = (first.project_id ?? '').trim();
    if (!projectId) {
      throw new Error('META thiếu project_id');
    }
    return {
      project_id: projectId,
      project_name: (first.project_name ?? '').trim(),
      version: Number(first.version ?? '1'),
      namespace: (first.namespace ?? `kb_project_${projectId}`).trim(),
    };
  }

  async readRows(): Promise<KbRow[]> {
    const records = parseCsv(await readFile(this.kbPath, 'utf8'));
    return records
      .filter((r) => (r.id ?? '').trim() !== '')
      .map((r) => ({
        id: (r.id ?? '').trim(),
        category: (r.category ?? '').trim(),
        question: (r.question ?? '').trim(),
        answer: (r.answer ?? '').trim(),
        keywords: (r.keywords ?? '').trim(),
        priority: Number(r.priority ?? '1'),
        active: (r.active ?? 'TRUE').trim().toUpperCase() === 'TRUE',
      }));
  }
}
