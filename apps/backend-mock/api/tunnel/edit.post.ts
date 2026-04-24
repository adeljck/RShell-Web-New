import { eventHandler, readBody } from 'h3';

import { verifyAccessToken } from '~/utils/jwt-utils';
import { editTunnel } from '~/utils/tunnel-data';
import { unAuthorizedResponse, useResponseError } from '~/utils/response';

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const body = await readBody<{
    ClientId?: number;
    Id?: number;
    Mode?: 'http' | 'socks5' | 'tcp' | 'udp';
    Password?: string;
    Port?: number;
    Remark?: string;
    Target?: string;
    Username?: string;
  }>(event);

  if (!body?.Id || !body?.ClientId || !body?.Mode || !body?.Port) {
    return useResponseError('invalid payload');
  }

  if ((body.Mode === 'tcp' || body.Mode === 'udp') && !body.Target) {
    return useResponseError('target required');
  }

  const updated = editTunnel({
    ClientId: body.ClientId,
    Id: body.Id,
    Mode: body.Mode,
    Password: body.Password,
    Port: body.Port,
    Remark: body.Remark,
    Target: body.Target,
    Username: body.Username,
  });

  if (!updated) {
    return useResponseError('tunnel not found');
  }

  return {
    code: 0,
    message: 'save success',
    type: 'success',
  };
});
