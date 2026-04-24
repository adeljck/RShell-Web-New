import { eventHandler, readBody } from 'h3';

import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResponseError } from '~/utils/response';
import { stopTunnel } from '~/utils/tunnel-data';

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const body = await readBody<{ id?: number }>(event);
  if (!body?.id || !stopTunnel(body.id)) {
    return useResponseError('stop failed');
  }

  return {
    code: 0,
    message: 'stop success',
    type: 'success',
  };
});
