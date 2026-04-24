import type { PagedResult } from './_shared';

export function normalizeOptionalString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export function safeArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

export function coercePagedResult<T>(value: Partial<PagedResult<T>> | null | undefined): PagedResult<T> {
  return {
    items: safeArray(value?.items),
    total: Number.isFinite(value?.total) ? Number(value?.total) : 0,
  };
}
