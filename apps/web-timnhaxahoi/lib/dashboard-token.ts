const KEY = 'timnhaxahoi_dashboard_jwt';

export function saveDashboardToken(token: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY, token);
  } catch {
    /* quota / private mode */
  }
}

export function readDashboardToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function clearDashboardToken(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
