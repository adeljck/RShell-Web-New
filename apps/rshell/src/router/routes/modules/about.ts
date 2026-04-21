import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'About',
    path: '/about',
    component: () => import('#/views/about/index.vue'),
    meta: {
      icon: 'mdi:information',
      order: 3,
      title: $t('page.about.title'),
    },
  },
];

export default routes;
