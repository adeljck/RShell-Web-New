import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'Client',
    path: '/client',
    component: () => import('#/views/client/index.vue'),
    meta: {
      icon: 'mdi:monitor',
      order: -3,
      title: $t('page.client.title'),
    },
  },
];

export default routes;
