/**
 * Pagination & filter params - chuẩn hóa cho các trang danh sách
 */

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const LIMIT_OPTIONS = [10, 20, 50] as const;

export interface ListParams {
  page: number;
  limit: number;
  status?: string;
  search?: string;
}

export function parsePage(value: string | null): number {
  const n = value ? parseInt(value, 10) : NaN;
  return Number.isNaN(n) || n < 1 ? DEFAULT_PAGE : n;
}

export function parseLimit(value: string | null): number {
  const n = value ? parseInt(value, 10) : NaN;
  return Number.isNaN(n) || n < 1 ? DEFAULT_LIMIT : n;
}
