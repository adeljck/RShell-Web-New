import { defineEventHandler, readBody } from 'h3';

import { editListener } from '~/utils/listener-data';
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
  const result = editListener(body);

  if (!result) {
    return {
      code: -1,
      message: 'listener not found',
      result: null,
      type: 'error',
    };
  }

  if ('error' in result) {
    return result.error;
  }

  return {
    ...useResultResponseSuccess(null),
    message: 'edit success',
    type: 'success',
  };
});
