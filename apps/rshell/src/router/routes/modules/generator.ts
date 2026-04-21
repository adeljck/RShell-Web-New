import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'Generator',
    path: '/generator',
    component: () => import('#/views/generator/index.vue'),
    meta: {
      icon: 'mdi:download',
      order: -1,
      title: $t('page.generator.title'),
    },
  },
];

export default routes;
