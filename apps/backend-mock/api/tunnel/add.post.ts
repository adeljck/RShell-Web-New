import { eventHandler, readBody } from 'h3';

import { verifyAccessToken } from '~/utils/jwt-utils';
import { addTunnel } from '~/utils/tunnel-data';
import { unAuthorizedResponse, useResponseError } from '~/utils/response';

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const body = await readBody<{
    ClientId?: number;
    Mode?: 'http' | 'socks5' | 'tcp' | 'udp';
    Password?: string;
    Port?: number;
    Remark?: string;
    Target?: string;
    Username?: string;
  }>(event);

  if (!body?.ClientId || !body?.Mode || !body?.Port) {
    return useResponseError('invalid payload');
  }

  if ((body.Mode === 'tcp' || body.Mode === 'udp') && !body.Target) {
    return useResponseError('target required');
  }

  addTunnel({
    ClientId: body.ClientId,
    Mode: body.Mode,
    Password: body.Password,
    Port: body.Port,
    Remark: body.Remark,
    Target: body.Target,
    Username: body.Username,
  });

  return {
    code: 0,
    message: 'add success',
    type: 'success',
  };
});
