import { randomUUID } from 'node:crypto';

import { defineConfig } from '@vben/vite-config';

import ElementPlus from 'unplugin-element-plus/vite';

export default defineConfig(async () => {
  const randomStoreSecureKey = randomUUID().replaceAll('-', '');

  return {
    application: {},
    vite: {
      define: {
        'import.meta.env.VITE_APP_STORE_SECURE_KEY': JSON.stringify(
          randomStoreSecureKey,
        ),
      },
      plugins: [
        ElementPlus({
          format: 'esm',
        }),
      ],
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: 'http://localhost:5320/api',
            ws: true,
          },
        },
      },
    },
  };
});
