/**
 * Tránh treo vô hạn khi `next build` / sitemap gọi API (host không phản hồi, firewall, v.v.).
 * Node 20 `fetch` mặc định có thể chờ rất lâu nếu không có signal.
 */
const DEFAULT_MS = 15_000;

export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs: number = DEFAULT_MS,
): Promise<Response> {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(id);
  }
}
