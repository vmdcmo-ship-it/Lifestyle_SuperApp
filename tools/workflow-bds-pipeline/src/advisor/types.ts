export interface Persona {
  name: string;
  role: string;
  tone: string;
  address: { self: string; customer: string };
  principles: string[];
  style_rules: string[];
  redlines_global: string[];
  scripts: {
    opening: string[];
    handle_rejection: string[];
    closing: string[];
    follow_up: string[];
  };
  no_data_reply: string;
  escalate_reply: string;
}

export type ConversationRole = 'customer' | 'advisor';

export interface ConversationTurn {
  role: ConversationRole;
  text: string;
}

export type CustomerIntent = 'quan_tam' | 'tu_choi' | 'hoi_gia' | 'hoi_thong_tin' | 'khac';

export interface AdvisorReply {
  reply: string;
  intent: CustomerIntent;
  escalate: boolean;
  has_answer: boolean;
  used_chunk_ids: string[];
}
