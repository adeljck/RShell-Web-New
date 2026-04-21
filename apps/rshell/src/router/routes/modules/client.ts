import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'Client',
    path: '/client',
    component: () => import('#/views/client/index.vue'),
    meta: {
      icon: 'mdi:monitor',
      order: -3,
      title: '终端管理',
    },
  },
];

export default routes;
