import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'Setting',
    path: '/setting',
    component: () => import('#/views/setting/index.vue'),
    meta: {
      icon: 'mdi:cog',
      order: -2,
      title: '系统设置',
    },
  },
];

export default routes;
