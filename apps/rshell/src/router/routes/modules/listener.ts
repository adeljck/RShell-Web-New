import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'Listener',
    path: '/listener',
    component: () => import('#/views/listener/index.vue'),
    meta: {
      icon: 'mdi:headphones',
      order: -2,
      title: $t('page.listener.title'),
    },
  },
];

export default routes;
