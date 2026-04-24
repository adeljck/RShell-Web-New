import { eventHandler } from 'h3';

import { verifyAccessToken } from '~/utils/jwt-utils';
import { useResultResponseSuccess, unAuthorizedResponse } from '~/utils/response';
import { listRunnerRecords } from '~/utils/runner-data';

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  return useResultResponseSuccess(listRunnerRecords());
});
