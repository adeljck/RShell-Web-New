export interface IdPayload {
  id: number;
}

export interface BatchIdsPayload {
  id: number[];
}

export interface PagedQuery {
  page: number;
  pageSize: number;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
}

export type BooleanStatusQuery = '' | '0' | '1' | boolean;

export interface UploadMutationResult {
  code: number;
  message: string;
  type: string;
}

export interface UploadProgressHandler {
  (progress: number): void;
}
