import { eventHandler } from 'h3';

import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResultResponseSuccess } from '~/utils/response';

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  return useResultResponseSuccess({
    dingding_access_token: '',
    dingding_key_word: '',
    wx_key: '1c726933-fc02-4290-88f8-40e836016f19',
  });
});
