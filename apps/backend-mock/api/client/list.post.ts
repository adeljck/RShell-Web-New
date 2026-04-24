import { eventHandler, readBody } from 'h3';

import { verifyAccessToken } from '~/utils/jwt-utils';
import { queryClientList } from '~/utils/client-data';
import { unAuthorizedResponse, useResultResponseSuccess } from '~/utils/response';

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const body = await readBody<{
    page?: number;
    pageSize?: number;
    search?: string;
    status?: '' | '0' | '1' | boolean;
  }>(event);

  const result = queryClientList({
    page: body?.page ?? 1,
    pageSize: body?.pageSize ?? 10,
    search: body?.search ?? '',
    status: body?.status ?? '',
  });

  return useResultResponseSuccess(result);
});
