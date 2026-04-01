const base = () => process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3020/api/v1';

export type HousingProject = {
  id: string;
  name: string;
  slug: string;
  province: string | null;
  district: string | null;
  pricePerM2: number;
  typicalAreaM2: number;
  status: string;
  kind: string;
};

export type ProjectListFilters = {
  kind?: string;
  province?: string;
  district?: string;
};

/** Gọi GET /projects — hỗ trợ `kind` dạng string (tương thích cũ) hoặc object lọc. */
export async function fetchProjects(
  kindOrFilters?: string | ProjectListFilters,
): Promise<HousingProject[]> {
  const params = new URLSearchParams();
  if (typeof kindOrFilters === 'string') {
    params.set('kind', kindOrFilters);
  } else if (kindOrFilters && typeof kindOrFilters === 'object') {
    if (kindOrFilters.kind) {
      params.set('kind', kindOrFilters.kind);
    }
    if (kindOrFilters.province) {
      params.set('province', kindOrFilters.province);
    }
    if (kindOrFilters.district) {
      params.set('district', kindOrFilters.district);
    }
  }
  const qs = params.toString();
  const res = await fetch(`${base()}/projects${qs ? `?${qs}` : ''}`, { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error('Không tải được danh sách dự án');
  }
  return res.json() as Promise<HousingProject[]>;
}

export type EligibilityResponse = {
  segment: string;
  score: number;
  userMessage: string;
  recommendedProjectIds: string[];
  userId: string;
  quizId: string;
  dashboardToken: string;
};

export async function submitEligibility(body: Record<string, unknown>): Promise<EligibilityResponse> {
  const res = await fetch(`${base()}/ai/eligibility-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as
    | EligibilityResponse
    | { message?: string | string[]; error?: string };
  if (!res.ok) {
    const m = 'message' in data ? data.message : undefined;
    const msg = Array.isArray(m) ? m.join(', ') : m ?? ('error' in data ? data.error : undefined);
    throw new Error(msg ?? 'Gửi thất bại');
  }
  return data as EligibilityResponse;
}

export type DashboardUser = {
  id: string;
  email: string;
  phoneNumber: string;
  fullName: string | null;
  salutation: 'anh' | 'chi' | null;
  leadSegment: string | null;
  profileScore: number | null;
};

export type DashboardQuiz = {
  id: string;
  createdAt: string;
  calculatedScore: number;
  recommendedProjectIds: string[];
  rawData: Record<string, unknown>;
};

export type DashboardProject = {
  id: string;
  name: string;
  slug: string;
  province: string | null;
  district: string | null;
  kind: string;
  pricePerM2: number;
  typicalAreaM2: number;
};

export type DashboardPayload = {
  user: DashboardUser;
  quiz: DashboardQuiz;
  recommendedProjects: DashboardProject[];
};

export async function fetchDashboard(dashboardToken: string): Promise<DashboardPayload> {
  const res = await fetch(`${base()}/user/dashboard`, {
    headers: { Authorization: `Bearer ${dashboardToken}` },
    cache: 'no-store',
  });
  const data = (await res.json().catch(() => ({}))) as DashboardPayload & {
    message?: string | string[];
    error?: string;
  };
  if (res.status === 401) {
    throw new Error('Phiên đã hết hạn. Vui lòng làm lại trắc nghiệm.');
  }
  if (!res.ok) {
    let msg = 'Không tải được dashboard';
    const m = 'message' in data ? data.message : undefined;
    if (Array.isArray(m)) {
      msg = m.join(', ');
    } else if (typeof m === 'string') {
      msg = m;
    } else if ('error' in data && typeof data.error === 'string') {
      msg = data.error;
    }
    throw new Error(msg);
  }
  return data as DashboardPayload;
}

export type BudgetMatchRequest = {
  maxTotalPriceVnd: number;
  province?: string;
  district?: string;
  limit?: number;
  ownCapitalVnd?: number;
  maxMonthlyPaymentVnd?: number;
};

export type BudgetMatchCatalogRange = {
  minEstimatedTotalVnd: number;
  maxEstimatedTotalVnd: number;
};

export type BudgetMatchLoanAssumptions = {
  termMonths: number;
  annualRatePercent: number;
};

export type BudgetMatchItem = {
  id: string;
  name: string;
  slug: string;
  province: string | null;
  district: string | null;
  pricePerM2: number;
  typicalAreaM2: number;
  estimatedTotalVnd: number;
  loanNeededVnd?: number;
  estimatedMonthlyPaymentVnd?: number;
  status: string;
  kind: string;
};

export type BudgetMatchResponse = {
  catalogRange: BudgetMatchCatalogRange | null;
  loanAssumptions?: BudgetMatchLoanAssumptions;
  items: BudgetMatchItem[];
};

export type BudgetMatchSegment = 'noxh' | 'affordable_commercial';

export async function postBudgetMatch(
  segment: BudgetMatchSegment,
  body: BudgetMatchRequest,
): Promise<BudgetMatchResponse> {
  const path =
    segment === 'noxh'
      ? `${base()}/projects/noxh/match-budget`
      : `${base()}/projects/affordable-commercial/match-budget`;
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as BudgetMatchResponse & {
    message?: string | string[];
    error?: string;
  };
  if (!res.ok) {
    const m = 'message' in data ? data.message : undefined;
    const msg = Array.isArray(m) ? m.join(', ') : m ?? ('error' in data ? data.error : undefined);
    throw new Error(msg ?? 'Không gợi ý được dự án');
  }
  return data as BudgetMatchResponse;
}

export async function convertLead(
  dashboardToken: string,
  body: { note?: string } = {},
): Promise<{ ok: boolean; larkRecorded: boolean }> {
  const res = await fetch(`${base()}/leads/convert`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${dashboardToken}`,
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (res.status === 401) {
    throw new Error('Phiên đã hết hạn. Vui lòng làm lại trắc nghiệm.');
  }
  if (!res.ok) {
    let msg = 'Gửi yêu cầu thất bại';
    const m = data.message;
    if (Array.isArray(m) && m.every((x): x is string => typeof x === 'string')) {
      msg = m.join(', ');
    } else if (typeof m === 'string') {
      msg = m;
    } else if (typeof data.error === 'string') {
      msg = data.error;
    }
    throw new Error(msg);
  }
  return {
    ok: Boolean(data.ok),
    larkRecorded: Boolean(data.larkRecorded),
  };
}
