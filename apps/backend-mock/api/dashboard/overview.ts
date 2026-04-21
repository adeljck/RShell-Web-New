import { eventHandler } from 'h3';

import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResultResponseSuccess } from '~/utils/response';

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  return useResultResponseSuccess({
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
  });
});
