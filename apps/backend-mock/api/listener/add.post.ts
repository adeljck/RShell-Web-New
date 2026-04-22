import { defineEventHandler, readBody } from 'h3';

import { addListener } from '~/utils/listener-data';
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

  const body = await readBody(event);
  const result = addListener(body);

  if ('error' in result) {
    return result.error;
  }

  return {
    ...useResultResponseSuccess(null),
    message: 'add success',
    type: 'success',
  };
});
