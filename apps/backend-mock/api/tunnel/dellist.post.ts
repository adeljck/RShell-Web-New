import { eventHandler, readBody } from 'h3';

import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResponseError } from '~/utils/response';
import { deleteTunnelList } from '~/utils/tunnel-data';

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const body = await readBody<{ id?: number[] }>(event);
  if (!body?.id?.length || !deleteTunnelList(body.id)) {
    return useResponseError('delete failed');
  }

  return {
    code: 0,
    message: 'delete success',
    type: 'success',
  };
});
