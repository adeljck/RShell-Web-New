import { eventHandler, readBody } from 'h3';

import { verifyAccessToken } from '~/utils/jwt-utils';
import { queryTunnelList } from '~/utils/tunnel-data';
import { unAuthorizedResponse, useResultResponseSuccess } from '~/utils/response';

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const body = await readBody<{
    ClientId?: number;
    page?: number;
    pageSize?: number;
  }>(event);

  const result = queryTunnelList({
    ClientId: body?.ClientId ?? 0,
    page: body?.page ?? 1,
    pageSize: body?.pageSize ?? 10,
  });

  return useResultResponseSuccess(result);
});
