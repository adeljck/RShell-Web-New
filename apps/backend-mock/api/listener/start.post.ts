import { defineEventHandler, readBody, setResponseStatus } from 'h3';

import { getListenerStore, updateListenerStatus } from '~/utils/listener-data';
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
  const currentListener = getListenerStore().find((item) => item.Id === listenerId);

  if (!currentListener) {
    setResponseStatus(event, 404);
    return {
      code: -1,
      message: 'listener not found',
      result: null,
      type: 'error',
    };
  }

  if (currentListener.Status) {
    return {
      code: -1,
      message: 'already start',
      result: null,
      type: 'error',
    };
  }

  updateListenerStatus(listenerId, true);

  return {
    ...useResultResponseSuccess(null),
    message: 'start success',
    type: 'success',
  };
});
