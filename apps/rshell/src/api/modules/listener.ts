import { resultRequestClient } from '../request';

export interface ListenerRecord {
  ConnectAddr: string;
  DNSDomain: string;
  DisconnectTimeout: number;
  EncryptSalt: string;
  Id: number;
  ListenAddr: string;
  MaxDNSsize: number;
  Mode: string;
  OssUrl: string;
  PingInterval: number;
  PublicDNS: string;
  Remark: string;
  Status: boolean;
  Vkey: string;
  WsConnectAddr?: string;
}

export interface ListenerListResult {
  items: ListenerRecord[];
  total: number;
}

export async function getListenerListApi() {
  return resultRequestClient.get<ListenerListResult>('/listener');
}

export function getMockListenerList(): ListenerListResult {
  return {
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
  };
}
