export interface UserInfo {
  id: number;
  password: string;
  realName: string;
  roles: string[];
  username: string;
  homePath?: string;
}

export const MOCK_USERS: UserInfo[] = [
  {
    id: 0,
    password: '123456',
    realName: 'Vben',
    roles: ['super'],
    username: 'vben',
  },
  {
    id: 1,
    password: '123456',
    realName: 'Admin',
    roles: ['admin'],
    username: 'admin',
    homePath: '/dashboard',
  },
  {
    id: 2,
    password: '123456',
    realName: 'Jack',
    roles: ['user'],
    username: 'jack',
    homePath: '/dashboard',
  },
];

export const MOCK_CODES = [
  // super
  {
    codes: ['AC_100100', 'AC_100110', 'AC_100120', 'AC_100010'],
    username: 'vben',
  },
  {
    // admin
    codes: ['AC_100010', 'AC_100020', 'AC_100030'],
    username: 'admin',
  },
  {
    // user
    codes: ['AC_1000001', 'AC_1000002'],
    username: 'jack',
  },
];

const dashboardMenus = [
  {
    meta: {
      affixTab: true,
      icon: 'mdi:gauge',
      order: -4,
      title: '仪表盘',
    },
    name: 'Dashboard',
    path: '/dashboard',
    component: '/dashboard/index',
  },
  {
    meta: {
      icon: 'mdi:monitor',
      order: -3,
      title: '终端管理',
    },
    name: 'Client',
    path: '/client',
    component: '/client/index',
  },
  {
    meta: {
      icon: 'mdi:cog',
      order: -2,
      title: '系统设置',
    },
    name: 'Setting',
    path: '/setting',
    component: '/setting/index',
  },
  {
    meta: {
      icon: 'mdi:information',
      order: -1,
      title: '关于',
    },
    name: 'About',
    path: '/about',
    component: '/about/index',
  },
];

export const MOCK_MENUS = [
  {
    menus: [...dashboardMenus],
    username: 'vben',
  },
  {
    menus: [...dashboardMenus],
    username: 'admin',
  },
  {
    menus: [...dashboardMenus],
    username: 'jack',
  },
];
