import { eventHandler } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import {
  unAuthorizedResponse,
  useResultResponseSuccess,
} from '~/utils/response';

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  return useResultResponseSuccess({
    total: 2,
    items: [
      {
        ConnectAddr: 'ws://123.57.106.8:33972/ms_defender',
        DNSDomain: '',
        DisconnectTimeout: 30,
        EncryptSalt: 'FuckY0u@33H0le',
        Id: 1,
        ListenAddr: '0.0.0.0:33972',
        MaxDNSsize: 512,
        Mode: 'ws',
        OssUrl: '',
        PingInterval: 10,
        PublicDNS: '',
        Remark: '',
        Status: false,
        Vkey: 'FuckY0u@33H0le',
        WsConnectAddr: 'ws://123.57.106.8:33972/ms_defender',
      },
      {
        ConnectAddr: '123.57.106.8:33971',
        DNSDomain: '',
        DisconnectTimeout: 30,
        EncryptSalt: 'qwe123qwe',
        Id: 2,
        ListenAddr: '0.0.0.0:33971',
        MaxDNSsize: 512,
        Mode: 'tcp',
        OssUrl: '',
        PingInterval: 10,
        PublicDNS: '',
        Remark: '',
        Status: true,
        Vkey: 'qwe123qwe',
      },
    ],
  });
});
