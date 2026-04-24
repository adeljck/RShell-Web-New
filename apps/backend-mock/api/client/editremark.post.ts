import { eventHandler, readBody } from 'h3';

import { verifyAccessToken } from '~/utils/jwt-utils';
import { updateClientRemark } from '~/utils/client-data';
import {
  unAuthorizedResponse,
  useResponseError,
  useResultResponseSuccess,
} from '~/utils/response';

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const body = await readBody<{
    id?: number;
    remark?: string;
  }>(event);

  const id = body?.id ?? 0;
  const remark = body?.remark ?? '';

  if (!id || !updateClientRemark(id, remark)) {
    return useResponseError('client not found');
  }

  return {
    ...useResultResponseSuccess(null),
    message: 'save success',
    type: 'success',
  };
});
