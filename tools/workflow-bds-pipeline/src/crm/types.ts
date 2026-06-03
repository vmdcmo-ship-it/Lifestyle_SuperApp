import type { NeedCategory } from '../types.js';

export type InterestLevel = 'hot' | 'warm' | 'cold';

export type LeadStatus =
  | 'moi'
  | 'dang_tu_van'
  | 'hen_gap'
  | 'cho_phan_hoi'
  | 'chot'
  | 'tu_choi';

export interface ConversationInput {
  phone: string;
  name: string;
  projectId: string;
  source: string;
  log: string;
}

export interface CrmLead {
  phone: string;
  name: string;
  need: NeedCategory;
  budget: number;
  area: string;
  interestLevel: InterestLevel;
  status: LeadStatus;
  tags: string[];
  nextAction: string;
  summary: string;
  projectId: string;
  source: string;
  updatedAt: string;
}

export interface CrmReport {
  total: number;
  byInterest: Record<InterestLevel, number>;
  byStatus: Record<string, number>;
  byNeed: Record<string, number>;
  hotLeads: Array<{ phone: string; name: string; nextAction: string }>;
}
