import { eventHandler, readMultipartFormData } from 'h3';

import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResponseError } from '~/utils/response';
import { addRunnerRecord } from '~/utils/runner-data';

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const files = await readMultipartFormData(event);
  const file = files?.find((item) => item.name === 'file');

  if (!file?.filename) {
    return useResponseError('file required');
  }

  addRunnerRecord(file.filename);

  return {
    code: 0,
    message: 'upload success',
    type: 'success',
  };
});
