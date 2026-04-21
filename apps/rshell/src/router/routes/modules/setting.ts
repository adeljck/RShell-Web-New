import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'Setting',
    path: '/setting',
    component: () => import('#/views/setting/index.vue'),
    meta: {
      icon: 'mdi:cog',
      order: 2,
      title: $t('page.setting.title'),
    },
  },
];

export default routes;
