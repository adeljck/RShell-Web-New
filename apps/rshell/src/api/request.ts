/**
 * Shared request clients for the RShell application.
 *
 * Keep business-specific response handling in module APIs and leave
 * authentication / refresh-token logic centralized here.
 */
import type { RequestClientOptions } from '@vben/request';

import { useAppConfig } from '@vben/hooks';
import { preferences } from '@vben/preferences';
import {
  authenticateResponseInterceptor,
  defaultResponseInterceptor,
  errorMessageResponseInterceptor,
  RequestClient,
} from '@vben/request';
import { useAccessStore } from '@vben/stores';

import { ElMessage } from 'element-plus';

import { useAuthStore } from '#/store';

import { refreshTokenApi } from './core';

type ResponseDataField = 'data' | 'result';

const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);

function createRequestClient(
  baseURL: string,
  dataField: ResponseDataField = 'data',
  options?: RequestClientOptions,
) {
  const client = new RequestClient({
    ...options,
    baseURL,
  });

  /**
   * Reset the current session when both access and refresh tokens are invalid.
   */
  async function doReAuthenticate() {
    console.warn('Access token or refresh token is invalid or expired. ');
    const accessStore = useAccessStore();
    const authStore = useAuthStore();
    accessStore.setAccessToken(null);
    if (
      preferences.app.loginExpiredMode === 'modal' &&
      accessStore.isAccessChecked
    ) {
      accessStore.setLoginExpired(true);
    } else {
      await authStore.logout();
    }
  }

  /**
   * Refresh the access token and return the new bearer token.
   */
  async function doRefreshToken() {
    const accessStore = useAccessStore();
    const resp = await refreshTokenApi();
    const newToken = resp.data;
    accessStore.setAccessToken(newToken);
    return newToken;
  }

  function formatToken(token: null | string) {
    return token ? `Bearer ${token}` : null;
  }

  // Attach auth and locale headers before every request.
  client.addRequestInterceptor({
    fulfilled: async (config) => {
      const accessStore = useAccessStore();

      config.headers.Authorization = formatToken(accessStore.accessToken);
      config.headers['Accept-Language'] = preferences.app.locale;
      return config;
    },
  });

  // Normalize the common API envelope.
  client.addResponseInterceptor(
    defaultResponseInterceptor({
      codeField: 'code',
      dataField,
      successCode: 0,
    }),
  );

  // Handle token expiration and refresh automatically.
  client.addResponseInterceptor(
    authenticateResponseInterceptor({
      client,
      doReAuthenticate,
      doRefreshToken,
      enableRefreshToken: preferences.app.enableRefreshToken,
      formatToken,
    }),
  );

  // Fallback error messaging for requests that do not match custom logic.
  client.addResponseInterceptor(
    errorMessageResponseInterceptor((msg: string, error) => {
      const responseData = error?.response?.data ?? {};
      const errorMessage = responseData?.error ?? responseData?.message ?? '';
      ElMessage.error(errorMessage || msg);
    }),
  );

  return client;
}

export const requestClient = createRequestClient(apiURL, 'data', {
  responseReturn: 'data',
});

export const resultRequestClient = createRequestClient(apiURL, 'result', {
  responseReturn: 'data',
});

export const baseRequestClient = new RequestClient({ baseURL: apiURL });
