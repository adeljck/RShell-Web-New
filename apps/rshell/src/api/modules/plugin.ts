import type { ClientListRecord } from './client';
import type { PagedResult, UploadMutationResult, UploadProgressHandler } from './_shared';

import { preferences } from '@vben/preferences';
import { useAccessStore } from '@vben/stores';

import { resultRequestClient } from '../request';
import { coercePagedResult, safeArray } from './adapters';

export interface PluginRunnerRecord {
  id: number;
  name: string;
}

export interface PluginClientOptionsResult extends PagedResult<ClientListRecord> {
  clientCount: number;
  clientOnlineCount: number;
}

export async function getPluginClientOptionsApi() {
  const result = await resultRequestClient.post<PluginClientOptionsResult>('/client/list', {
    page: 1,
    pageSize: 9999,
    status: true,
  });

  return {
    ...coercePagedResult(result),
    clientCount: Number.isFinite(result?.clientCount) ? Number(result.clientCount) : 0,
    clientOnlineCount: Number.isFinite(result?.clientOnlineCount)
      ? Number(result.clientOnlineCount)
      : 0,
  } satisfies PluginClientOptionsResult;
}

export async function getPluginRunnerListApi() {
  const result = await resultRequestClient.get<PluginRunnerRecord[]>('/runner/list');
  return safeArray(result);
}

export async function uploadPluginFileApi(
  file: File,
  onProgress?: UploadProgressHandler,
) {
  const accessStore = useAccessStore();

  return await new Promise<UploadMutationResult>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/runner/upload');

    if (accessStore.accessToken) {
      xhr.setRequestHeader('Authorization', `Bearer ${accessStore.accessToken}`);
    }
    xhr.setRequestHeader('Accept-Language', preferences.app.locale);

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) {
        return;
      }
      onProgress?.(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onload = () => {
      try {
        const response = JSON.parse(xhr.responseText || '{}');
        if (xhr.status >= 200 && xhr.status < 300 && response?.code === 0) {
          resolve(response);
          return;
        }
        reject(new Error(response?.message || 'upload failed'));
      } catch (error) {
        reject(error);
      }
    };

    xhr.onerror = () => reject(new Error('upload failed'));

    const formData = new FormData();
    formData.append('file', file);
    xhr.send(formData);
  });
}
