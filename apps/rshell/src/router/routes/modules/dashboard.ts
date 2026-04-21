import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    component: () => import('#/views/dashboard/index.vue'),
    meta: {
      icon: 'mdi:gauge',
      order: -4,
      title: $t('page.dashboard.title'),
    },
  },
];

export default routes;
