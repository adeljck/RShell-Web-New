import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'Tunnel',
    path: '/tunnel',
    component: () => import('#/views/tunnel/index.vue'),
    meta: {
      icon: 'mdi:web',
      order: 1,
      title: $t('page.tunnel.title'),
    },
  },
];

export default routes;
