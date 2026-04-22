import { defineEventHandler, readBody } from 'h3';

import { deleteListenerList } from '~/utils/listener-data';
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

  const body = await readBody<{ id?: number[] }>(event);
  const ids = Array.isArray(body?.id)
    ? body.id.map((item) => Number(item)).filter((item) => item > 0)
    : [];

  deleteListenerList(ids);

  return {
    ...useResultResponseSuccess(null),
    message: 'delete success',
    type: 'success',
  };
});
