import { defineEventHandler, readBody, setResponseStatus } from 'h3';

import { deleteListener } from '~/utils/listener-data';
import { verifyAccessToken } from '~/utils/jwt-utils';
import {
  unAuthorizedResponse,
  useResultResponseSuccess,
} from '~/utils/response';

export default defineEventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const body = await readBody<{ id?: number }>(event);
  const listenerId = Number(body?.id);
  const removedListener = deleteListener(listenerId);

  if (!removedListener) {
    setResponseStatus(event, 404);
    return {
      code: -1,
      message: 'listener not found',
      result: null,
      type: 'error',
    };
  }

  return {
    ...useResultResponseSuccess(null),
    message: 'delete success',
    type: 'success',
  };
});
