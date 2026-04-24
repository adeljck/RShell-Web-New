import type { BatchIdsPayload, IdPayload, PagedResult } from './_shared';

import { resultRequestClient } from '../request';
import { coercePagedResult } from './adapters';

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

export interface ListenerListResult extends PagedResult<ListenerRecord> {}

export interface ListenerListQuery {
  ListenerId?: number;
  page?: number;
  pageSize?: number;
}

export interface ListenerUpsertPayload {
  ConnectAddr?: string;
  DNSDomain?: string;
  DisconnectTimeout: string;
  EncryptSalt: string;
  Id: string;
  ListenAddr?: string;
  Mode: string;
  OssUrl?: string;
  PingInterval: string;
  PublicDNS?: string;
  Remark?: string;
  Vkey: string;
  WsConnectAddr?: string;
}

export async function getListenerListApi(params?: ListenerListQuery) {
  const result = await resultRequestClient.get<ListenerListResult>('/listener', { params });
  return coercePagedResult(result) as ListenerListResult;
}

export async function startListenerApi(data: IdPayload) {
  return resultRequestClient.post<null>('/listener/start', data);
}

export async function stopListenerApi(data: IdPayload) {
  return resultRequestClient.post<null>('/listener/stop', data);
}

export async function deleteListenerApi(data: IdPayload) {
  return resultRequestClient.post<null>('/listener/del', data);
}

export async function deleteListenerListApi(data: BatchIdsPayload) {
  return resultRequestClient.post<null>('/listener/dellist', data);
}

export async function addListenerApi(data: ListenerUpsertPayload) {
  return resultRequestClient.post<null>('/listener/add', data);
}

export async function editListenerApi(data: ListenerUpsertPayload) {
  return resultRequestClient.post<null>('/listener/edit', data);
}

export function getMockListenerList(): ListenerListResult {
  const modes = ['tcp', 'kcp', 'ws', 'dns', 'doh', 'dot', 'oss'] as const;
  const items: ListenerRecord[] = Array.from({ length: 42 }, (_, index) => {
    const id = index + 1;
    const mode = modes[index % modes.length]!;
    const socketPort = 8083 + id;
    const dnsPort = 5300 + id;
    const base: ListenerRecord = {
      ConnectAddr: '',
      DNSDomain: '',
      DisconnectTimeout: 20 + (id % 4) * 10,
      EncryptSalt: `salt${String(id).padStart(2, '0')}key`,
      Id: id,
      ListenAddr: '',
      MaxDNSsize: 512,
      Mode: mode,
      OssUrl: '',
      PingInterval: 5 + (id % 4) * 5,
      PublicDNS: '',
      Remark: `${mode.toUpperCase()} Listener ${id}`,
      Status: id % 3 !== 0,
      Vkey: `vkey${String(id).padStart(2, '0')}seed`,
      WsConnectAddr: '',
    };

    switch (mode) {
      case 'tcp':
      case 'kcp': {
        return {
          ...base,
          ConnectAddr: `123.57.106.8:${socketPort}`,
          ListenAddr: `0.0.0.0:${socketPort}`,
        };
      }
      case 'ws': {
        return {
          ...base,
          ConnectAddr: `123.57.106.8:${socketPort}`,
          ListenAddr: `0.0.0.0:${socketPort}`,
          WsConnectAddr: `ws://123.57.106.8:${socketPort}/ws`,
        };
      }
      case 'dns': {
        return {
          ...base,
          DNSDomain: `ns${id}.example.com`,
          ListenAddr: `0.0.0.0:${dnsPort}`,
          PublicDNS: '8.8.8.8:53',
        };
      }
      case 'doh': {
        return {
          ...base,
          DNSDomain: `ns${id}.example.com`,
          ListenAddr: `0.0.0.0:${dnsPort}`,
          PublicDNS: 'https://dns.alidns.com/dns-query',
        };
      }
      case 'dot': {
        return {
          ...base,
          DNSDomain: `ns${id}.example.com`,
          ListenAddr: `0.0.0.0:${dnsPort}`,
          PublicDNS: 'dns.ipv5dns.com:853',
        };
      }
      case 'oss': {
        return {
          ...base,
          OssUrl: `http://aws-bucket-${id}.example.com`,
        };
      }
      default: {
        return base;
      }
    }
  });

  return {
    total: items.length,
    items,
  };
}
