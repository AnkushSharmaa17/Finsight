'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { api, type ApiError } from './api';

export interface UseApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  /** Extra dependencies — request re-runs when these change. */
  deps?: unknown[];
}

export function useApi<T>(
  path: string | null,
  options: UseApiOptions = {},
) {
  const { method = 'GET', body, deps = [] } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(!!path);

  /* Serialise body so new object identities don't loop the effect. */
  const bodyKey = body === undefined ? '' : JSON.stringify(body);
  const bodyRef = useRef(body);
  bodyRef.current = body;

  const load = useCallback(async () => {
    if (!path) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      setData(await api<T>(path, { method, body: bodyRef.current }));
      setError(null);
    } catch (e) {
      setError(e as ApiError);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, method, bodyKey, ...deps]);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, error, loading, reload: load };
}