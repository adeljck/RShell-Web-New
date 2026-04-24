export interface TunnelListQuery {
  ClientId: number;
  page: number;
  pageSize: number;
}

export interface TunnelRecord {
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

const tunnelItems: TunnelRecord[] = [
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
  ...Array.from({ length: 24 }, (_, index): TunnelRecord => {
    const id = 30 + index;
    const modes = ['socks5', 'http', 'tcp', 'udp'];
    const mode = modes[index % modes.length]!;
    return {
      ClientId: 100 + index,
      Id: id,
      IsConnect: index % 4 !== 0,
      Mode: mode,
      Password: mode === 'socks5' && index % 3 === 0 ? `pass${id}` : '',
      Port: 12000 + index * 173,
      Remark: index % 5 === 0 ? `Tunnel ${id}` : '',
      RunStatus: index % 3 === 0,
      Target: mode === 'tcp' || mode === 'udp' ? `10.0.${index}.8:${8000 + index}` : '',
      Username: mode === 'http' && index % 2 === 0 ? `user${id}` : '',
    };
  }),
];

export function queryTunnelList(query: TunnelListQuery) {
  const filtered = tunnelItems.filter((item) =>
    query.ClientId > 0 ? item.ClientId === query.ClientId : true,
  );
  const start = (query.page - 1) * query.pageSize;

  return {
    items: filtered.slice(start, start + query.pageSize),
    total: filtered.length,
  };
}

export function startTunnel(id: number) {
  const item = tunnelItems.find((current) => current.Id === id);
  if (!item) {
    return false;
  }
  item.RunStatus = true;
  return true;
}

export function stopTunnel(id: number) {
  const item = tunnelItems.find((current) => current.Id === id);
  if (!item) {
    return false;
  }
  item.RunStatus = false;
  return true;
}

export function deleteTunnel(id: number) {
  const index = tunnelItems.findIndex((current) => current.Id === id);
  if (index < 0) {
    return false;
  }
  tunnelItems.splice(index, 1);
  return true;
}

export function deleteTunnelList(ids: number[]) {
  let changed = false;
  for (const id of ids) {
    const index = tunnelItems.findIndex((current) => current.Id === id);
    if (index >= 0) {
      tunnelItems.splice(index, 1);
      changed = true;
    }
  }
  return changed;
}

export function addTunnel(payload: TunnelAddPayload) {
  const nextId =
    tunnelItems.reduce((max, current) => Math.max(max, current.Id), 0) + 1;

  tunnelItems.unshift({
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

export function editTunnel(payload: TunnelUpsertPayload) {
  const item = tunnelItems.find((current) => current.Id === payload.Id);
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
