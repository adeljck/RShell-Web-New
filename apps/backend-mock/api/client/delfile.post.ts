import { eventHandler, readBody } from 'h3';

import { deleteClientFile } from '~/utils/client-data';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResponseError, useResultResponseSuccess } from '~/utils/response';

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const body = await readBody<{ id?: number }>(event);
  const id = body?.id ?? 0;

  if (!id || !deleteClientFile(id)) {
    return useResponseError('client not found');
  }

  return {
    ...useResultResponseSuccess(null),
    message: 'delete success',
    type: 'success',
  };
});
