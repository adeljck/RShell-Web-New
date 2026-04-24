import type { BatchIdsPayload, IdPayload, PagedQuery, PagedResult } from './_shared';

import { resultRequestClient } from '../request';
import { coercePagedResult } from './adapters';

export interface TunnelListQuery extends PagedQuery {
  ClientId?: number;
}

export interface TunnelListRecord {
  ClientId: number;
  Id: number;
  IsConnect: boolean;
  Mode: string;
  Password: string;
  Port: number;
  Remark: string;
  RunStatus: boolean;
  Target: string;
  Username: string;
}

export interface TunnelListResult extends PagedResult<TunnelListRecord> {}

export interface TunnelUpsertPayload {
  ClientId: number;
  Id?: number;
  Mode: 'http' | 'socks5' | 'tcp' | 'udp';
  Password?: string;
  Port: number;
  Remark?: string;
  Target?: string;
  Username?: string;
}

export interface TunnelAddPayload {
  ClientId: number;
  Mode: 'http' | 'socks5' | 'tcp' | 'udp';
  Password?: string;
  Port: number;
  Remark?: string;
  Target?: string;
  Username?: string;
}

export async function getTunnelListApi(data: TunnelListQuery) {
  const result = await resultRequestClient.post<TunnelListResult>('/tunnel/list', data);
  return coercePagedResult(result) as TunnelListResult;
}

export async function startTunnelApi(data: IdPayload) {
  return resultRequestClient.post('/tunnel/start', data);
}

export async function stopTunnelApi(data: IdPayload) {
  return resultRequestClient.post('/tunnel/stop', data);
}

export async function deleteTunnelApi(data: IdPayload) {
  return resultRequestClient.post('/tunnel/del', data);
}

export async function deleteTunnelListApi(data: BatchIdsPayload) {
  return resultRequestClient.post('/tunnel/dellist', data);
}

export async function addTunnelApi(data: TunnelAddPayload) {
  return resultRequestClient.post('/tunnel/add', data);
}

export async function editTunnelApi(data: TunnelUpsertPayload) {
  return resultRequestClient.post('/tunnel/edit', data);
}

const MOCK_TUNNEL_LIST: TunnelListRecord[] = [

  {
    ClientId: 10,
    Id: 5,
    IsConnect: true,
    Mode: 'socks5',
    Password: '',
    Port: 17352,
    Remark: '',
    RunStatus: false,
    Target: '',
    Username: '',
  },
  {
    ClientId: 15,
    Id: 10,
    IsConnect: true,
    Mode: 'socks5',
    Password: '',
    Port: 13889,
    Remark: '',
    RunStatus: false,
    Target: '',
    Username: '',
  },
  {
    ClientId: 30,
    Id: 16,
    IsConnect: true,
    Mode: 'socks5',
    Password: '',
    Port: 43210,
    Remark: '',
    RunStatus: false,
    Target: '',
    Username: '',
  },
  {
    ClientId: 86,
    Id: 21,
    IsConnect: true,
    Mode: 'socks5',
    Password: '',
    Port: 39281,
    Remark: '',
    RunStatus: true,
    Target: '',
    Username: '',
  },
  ...Array.from({ length: 20 }, (_, index): TunnelListRecord => {
    const id = 30 + index;
    const modes = ['socks5', 'http', 'tcp', 'udp'];
    const mode = modes[index % modes.length]!;
    return {
      ClientId: 90 + index,
      Id: id,
      IsConnect: index % 4 !== 0,
      Mode: mode,
      Password: mode === 'socks5' && index % 3 === 0 ? `pass${id}` : '',
      Port: 12000 + index * 137,
      Remark: index % 5 === 0 ? `Tunnel ${id}` : '',
      RunStatus: index % 3 === 0,
      Target: mode === 'tcp' || mode === 'udp' ? `10.0.${index}.8:${8000 + index}` : '',
      Username: mode === 'http' && index % 2 === 0 ? `user${id}` : '',
    };
  }),
];

export function getMockTunnelList(query: TunnelListQuery): TunnelListResult {
  const clientId = Number(query.ClientId ?? 0);
  const filtered = MOCK_TUNNEL_LIST.filter((item) =>
    clientId > 0 ? item.ClientId === clientId : true,
  );
  const start = (query.page - 1) * query.pageSize;
  return {
    items: filtered.slice(start, start + query.pageSize),
    total: filtered.length,
  };
}

export function addMockTunnel(payload: TunnelAddPayload) {
  const nextId =
    MOCK_TUNNEL_LIST.reduce((max, item) => Math.max(max, item.Id), 0) + 1;

  MOCK_TUNNEL_LIST.unshift({
    ClientId: payload.ClientId,
    Id: nextId,
    IsConnect: true,
    Mode: payload.Mode,
    Password: payload.Password ?? '',
    Port: payload.Port,
    Remark: payload.Remark ?? '',
    RunStatus: false,
    Target: payload.Target ?? '',
    Username: payload.Username ?? '',
  });

  return nextId;
}

export function editMockTunnel(payload: TunnelUpsertPayload) {
  const item = MOCK_TUNNEL_LIST.find((current) => current.Id === payload.Id);
  if (!item) {
    return false;
  }

  item.ClientId = payload.ClientId;
  item.Mode = payload.Mode;
  item.Port = payload.Port;
  item.Remark = payload.Remark ?? '';
  item.Target = payload.Target ?? '';
  item.Username = payload.Username ?? '';
  item.Password = payload.Password ?? '';

  return true;
}
