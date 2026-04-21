import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'Plugin',
    path: '/plugin',
    component: () => import('#/views/plugin/index.vue'),
    meta: {
      icon: 'mdi:link-variant',
      order: 0,
      title: $t('page.plugin.title'),
    },
  },
];

export default routes;
