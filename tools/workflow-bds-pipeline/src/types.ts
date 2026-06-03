export interface RawRow {
  uid: string;
  fb_id: string;
  name_fb: string;
  raw_text: string;
  phone_raw: string;
  source_group: string;
  project_id: string;
  collected_by: string;
  created_at: string;
  note: string;
}

export type NeedCategory =
  | 'mua_can_ho'
  | 'mua_dat_nen'
  | 'mua_nha_pho'
  | 'thue'
  | 'dau_tu'
  | 'vay_mua_nha'
  | 'khac';

export interface CleanRow {
  phone: string;
  name: string;
  need: NeedCategory;
  budget: number;
  area: string;
  lead_score: number;
  project_id: string;
  source_group: string;
  fb_id: string;
  is_duplicate: boolean;
  in_crm: boolean;
  cleaned_at: string;
}

export interface LeadAnalysis {
  phone: string | null;
  need: NeedCategory;
  budget: number;
  area: string;
  lead_score: number;
}

export interface PipelineConfig {
  useClaude: boolean;
  claudeModel: string;
  anthropicApiKey?: string;
  leadScoreMin: number;
}

export interface PipelineResult {
  total: number;
  kept: CleanRow[];
  droppedLowScore: number;
  droppedNoPhone: number;
  duplicates: number;
}
