import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'About',
    path: '/about',
    component: () => import('#/views/about/index.vue'),
    meta: {
      icon: 'mdi:information',
      order: -1,
      title: '关于',
    },
  },
];

export default routes;
