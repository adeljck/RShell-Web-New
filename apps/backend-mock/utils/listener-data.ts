interface ListenerRecord {
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

interface ListenerUpsertPayload {
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

const defaultHost = '123.57.106.8';
const MODE_SEQUENCE = ['tcp', 'kcp', 'ws', 'dns', 'doh', 'dot', 'oss'] as const;

function createSeedListener(
  id: number,
  mode: (typeof MODE_SEQUENCE)[number],
): ListenerRecord {
  const socketPort = 8083 + id;
  const dnsPort = 5300 + id;
  const online = id % 3 !== 0;
  const baseRecord: ListenerRecord = {
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
    Status: online,
    Vkey: `vkey${String(id).padStart(2, '0')}seed`,
    WsConnectAddr: '',
  };

  switch (mode) {
    case 'tcp':
    case 'kcp': {
      return {
        ...baseRecord,
        ConnectAddr: `${defaultHost}:${socketPort}`,
        ListenAddr: `0.0.0.0:${socketPort}`,
      };
    }
    case 'ws': {
      return {
        ...baseRecord,
        ConnectAddr: `${defaultHost}:${socketPort}`,
        ListenAddr: `0.0.0.0:${socketPort}`,
        WsConnectAddr: `ws://${defaultHost}:${socketPort}/ws`,
      };
    }
    case 'dns': {
      return {
        ...baseRecord,
        DNSDomain: `ns${id}.example.com`,
        ListenAddr: `0.0.0.0:${dnsPort}`,
        PublicDNS: '8.8.8.8:53',
      };
    }
    case 'doh': {
      return {
        ...baseRecord,
        DNSDomain: `ns${id}.example.com`,
        ListenAddr: `0.0.0.0:${dnsPort}`,
        PublicDNS: 'https://dns.alidns.com/dns-query',
      };
    }
    case 'dot': {
      return {
        ...baseRecord,
        DNSDomain: `ns${id}.example.com`,
        ListenAddr: `0.0.0.0:${dnsPort}`,
        PublicDNS: 'dns.ipv5dns.com:853',
      };
    }
    case 'oss': {
      return {
        ...baseRecord,
        OssUrl: `http://aws-bucket-${id}.example.com`,
      };
    }
    default: {
      return baseRecord;
    }
  }
}

const listenerSeedData: ListenerRecord[] = Array.from({ length: 42 }, (_, index) =>
  createSeedListener(index + 1, MODE_SEQUENCE[index % MODE_SEQUENCE.length]),
);

let listenerStore: ListenerRecord[] = listenerSeedData.map((item) => ({ ...item }));

export function getListenerStore() {
  return listenerStore;
}

export function resetListenerStore() {
  listenerStore = listenerSeedData.map((item) => ({ ...item }));
  return listenerStore;
}

export function updateListenerStatus(id: number, status: boolean) {
  const listener = listenerStore.find((item) => item.Id === id);
  if (!listener) {
    return null;
  }
  listener.Status = status;
  return listener;
}

export function deleteListener(id: number) {
  const index = listenerStore.findIndex((item) => item.Id === id);
  if (index < 0) {
    return null;
  }

  const [removed] = listenerStore.splice(index, 1);
  return removed ?? null;
}

export function deleteListenerList(ids: number[]) {
  const idSet = new Set(ids);
  const deletedIds: number[] = [];

  listenerStore = listenerStore.filter((item) => {
    const shouldDelete = idSet.has(item.Id);
    if (shouldDelete) {
      deletedIds.push(item.Id);
    }
    return !shouldDelete;
  });

  return deletedIds;
}

export function addListener(payload: ListenerUpsertPayload) {
  const nextId =
    listenerStore.reduce((max, item) => Math.max(max, item.Id), 0) + 1;

  const duplicated = listenerStore.some(
    (item) => payload.ListenAddr && item.ListenAddr === payload.ListenAddr,
  );

  if (duplicated) {
    const publicAddr = (payload.ListenAddr || '').replace('0.0.0.0', '123.57.106.8');
    return {
      error: {
        code: -1,
        message: `listener ${nextId} start error addr ${publicAddr} open failed`,
        result: null,
        type: 'error',
      },
    };
  }

  const record: ListenerRecord = {
    ConnectAddr: payload.ConnectAddr || '',
    DNSDomain: payload.DNSDomain || '',
    DisconnectTimeout: Number(payload.DisconnectTimeout || 0),
    EncryptSalt: payload.EncryptSalt,
    Id: nextId,
    ListenAddr: payload.ListenAddr || '',
    MaxDNSsize: 512,
    Mode: payload.Mode,
    OssUrl: payload.OssUrl || '',
    PingInterval: Number(payload.PingInterval || 0),
    PublicDNS: payload.PublicDNS || '',
    Remark: payload.Remark || '',
    Status: false,
    Vkey: payload.Vkey,
    WsConnectAddr: payload.WsConnectAddr || '',
  };

  listenerStore.push(record);

  return {
    record,
  };
}


export function editListener(payload: ListenerUpsertPayload) {
  const id = Number(payload.Id || 0);
  const listener = listenerStore.find((item) => item.Id === id);
  if (!listener) {
    return null;
  }

  const duplicated = listenerStore.some(
    (item) => item.Id !== id && payload.ListenAddr && item.ListenAddr === payload.ListenAddr,
  );

  if (duplicated) {
    const publicAddr = (payload.ListenAddr || '').replace('0.0.0.0', '123.57.106.8');
    return {
      error: {
        code: -1,
        message: `listener ${id} start error addr ${publicAddr} open failed`,
        result: null,
        type: 'error',
      },
    };
  }

  listener.ConnectAddr = payload.ConnectAddr || '';
  listener.DNSDomain = payload.DNSDomain || '';
  listener.DisconnectTimeout = Number(payload.DisconnectTimeout || 0);
  listener.EncryptSalt = payload.EncryptSalt;
  listener.ListenAddr = payload.ListenAddr || '';
  listener.Mode = payload.Mode;
  listener.OssUrl = payload.OssUrl || '';
  listener.PingInterval = Number(payload.PingInterval || 0);
  listener.PublicDNS = payload.PublicDNS || '';
  listener.Remark = payload.Remark || '';
  listener.Vkey = payload.Vkey;
  listener.WsConnectAddr = payload.WsConnectAddr || '';

  return {
    record: listener,
  };
}
