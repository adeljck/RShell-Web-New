import { defineEventHandler, readBody } from 'h3';

import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResultResponseSuccess } from '~/utils/response';

export default defineEventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const body = await readBody(event);

  return useResultResponseSuccess({
    dingding_access_token: body?.dingding_access_token ?? '',
    dingding_key_word: body?.dingding_key_word ?? '',
    wx_key: body?.wx_key ?? '',
  });
});
