export class ApiError extends Error {
  constructor(public code: string, message: string, public details?: Record<string, string[]>) { super(message); }
}
export async function api<T = any>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const res = await fetch(`/api/${path.replace(/^\//, '')}`, {
    method: init.method ?? 'GET', credentials: 'include',
    headers: init.body ? { 'Content-Type': 'application/json' } : undefined,
    body: init.body ? JSON.stringify(init.body) : undefined,
  });
  const json = await res.json().catch(() => null);
  if (!json?.success) throw new ApiError(json?.error?.code ?? 'NETWORK', json?.error?.message ?? 'Could not reach the server.', json?.error?.details);
  return json.data as T;
}
