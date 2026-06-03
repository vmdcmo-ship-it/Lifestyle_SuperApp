export interface KbMeta {
  project_id: string;
  project_name: string;
  version: number;
  namespace: string;
}

export interface KbRow {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords: string;
  priority: number;
  active: boolean;
}

export interface KbSource {
  readMeta(): Promise<KbMeta>;
  readRows(): Promise<KbRow[]>;
}

export interface KbSyncResult {
  namespace: string;
  version: number;
  upserted: number;
  deleted: number;
  unchanged: number;
}
