import { resultRequestClient } from '../request';

export interface DashboardOverview {
  clientCount: number;
  clientNum: number | string;
  clientOnlineCount: number;
  cpu: number;
  disk: number;
  exportFlowCount: number;
  inletFlowCount: number;
  licTime: string;
  listenerCount: number;
  listenerOnlineCount: number;
  logLevel: string;
  logPath: string;
  tcpCount: number;
  udpCount: number;
  version: string;
  virtual_mem: number;
  swap_mem: number;
  web_basic_auth: boolean;
  web_port: string;
  vip: boolean;
}

/**
 * Dashboard overview data used by the home page summary cards.
 *
 * When a real backend is connected, keep this method stable and adapt any
 * response differences here instead of changing the page component.
 */
export async function getDashboardOverviewApi() {
  return resultRequestClient.get<DashboardOverview>('/dashboard/overview');
}

export function getMockDashboardOverview(): DashboardOverview {
  return {
    clientCount: 19,
    clientNum: '20',
    clientOnlineCount: 12,
    cpu: 1,
    disk: 18,
    exportFlowCount: 2211198669,
    inletFlowCount: 137528949,
    licTime: '20241101',
    listenerCount: 2,
    listenerOnlineCount: 1,
    logLevel: '7',
    logPath: '',
    tcpCount: 0,
    udpCount: 0,
    version: '4.9.3',
    virtual_mem: 19,
    swap_mem: 0,
    web_basic_auth: true,
    web_port: '39082',
    vip: true,
  };
}
