import { eventHandler } from 'h3';

import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResultResponseSuccess } from '~/utils/response';

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  return useResultResponseSuccess({
    list: [
      { name: 'WS-001', owner: '研发部', status: '在线', ip: '192.168.10.21' },
      { name: 'WS-002', owner: '财务部', status: '离线', ip: '192.168.10.34' },
      { name: 'WS-003', owner: '运维部', status: '在线', ip: '192.168.10.56' },
      { name: 'WS-004', owner: '测试部', status: '告警', ip: '192.168.10.77' },
    ],
    stats: [
      { label: '终端总数', value: '128' },
      { label: '在线终端', value: '96' },
      { label: '离线终端', value: '21' },
      { label: '待处理告警', value: '11' },
    ],
  });
});
