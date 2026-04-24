interface ClientFlowRecord {
  ExportFlow: number;
  FlowLimit: number;
  InletFlow: number;
}

interface ClientRateRecord {
  [key: string]: number;
}

interface ClientListRecord {
  Addr: string;
  Flow: ClientFlowRecord;
  HostName: string;
  Id: number;
  IsConnect: boolean;
  LocalIP: string;
  Location: string;
  MaxConn: number;
  NoDisplay: boolean;
  NoStore: boolean;
  NowConn: number;
  OsName: string;
  PingCheckTime: number;
  ProcessName: string;
  Rate: ClientRateRecord;
  RateLimit: number;
  Remark: string;
  Status: boolean;
  Tp: string;
  UserName: string;
  VerifyKey: string;
}

const CLIENT_LIST: ClientListRecord[] = [
  {
    Id: 10,
    IsConnect: true,
    VerifyKey: 'oSlgOPPLiR9UE4uP',
    Tp: 'ws',
    Addr: '220.176.210.23',
    Remark: '',
    Status: true,
    LocalIP: '192.168.0.2',
    UserName: 'root',
    HostName: 'ecm-lo104-0002.novalocal',
    Location: '\u6c5f\u897f\u7701\u4e0a\u9976\u5e02 \u7535\u4fe1',
    OsName: 'linux_amd64',
    ProcessName: '[kworker/0:2]',
    PingCheckTime: 0,
    RateLimit: 0,
    Flow: { ExportFlow: 162_173_896, InletFlow: 21_947_180, FlowLimit: 0 },
    Rate: { BA0waSTDf4S: 0 },
    NoStore: false,
    NoDisplay: false,
    MaxConn: 0,
    NowConn: 0,
  },
  {
    Id: 15,
    IsConnect: true,
    VerifyKey: 'mfopJkhkLTEUrP5N',
    Tp: 'ws',
    Addr: '182.110.69.73',
    Remark: '',
    Status: true,
    LocalIP: '172.17.0.80',
    UserName: 'root',
    HostName: 'ecm-u4yf0s',
    Location: '\u6c5f\u897f\u7701\u4e0a\u9976\u5e02 \u7535\u4fe1',
    OsName: 'linux_amd64',
    ProcessName: '[kworker/0:2]',
    PingCheckTime: 0,
    RateLimit: 0,
    Flow: { ExportFlow: 1_747_296_771, InletFlow: 112_111_569, FlowLimit: 0 },
    Rate: { BA0waSTDf4S: 0 },
    NoStore: false,
    NoDisplay: false,
    MaxConn: 0,
    NowConn: 0,
  },
  {
    Id: 30,
    IsConnect: true,
    VerifyKey: '4VEa7WvMau1VJv8S',
    Tp: 'ws',
    Addr: '182.110.69.73',
    Remark: '',
    Status: true,
    LocalIP: '10.175.128.42',
    UserName: 'root',
    HostName: 'master',
    Location: '\u6c5f\u897f\u7701\u4e0a\u9976\u5e02 \u7535\u4fe1',
    OsName: 'linux_amd64',
    ProcessName: '[kworker/0:2]',
    PingCheckTime: 0,
    RateLimit: 0,
    Flow: { ExportFlow: 97_325_357, InletFlow: 2_367_401, FlowLimit: 0 },
    Rate: { BA0waSTDf4S: 0 },
    NoStore: false,
    NoDisplay: false,
    MaxConn: 0,
    NowConn: 0,
  },
  {
    Id: 34,
    IsConnect: true,
    VerifyKey: 'POrmHpAyVYBWx9vi',
    Tp: 'ws',
    Addr: '182.110.69.226',
    Remark: '',
    Status: true,
    LocalIP: '172.17.0.92',
    UserName: 'ECM-OU9YLB\\Administrator',
    HostName: 'ecm-ou9ylb',
    Location: '\u6c5f\u897f\u7701\u4e0a\u9976\u5e02 \u7535\u4fe1',
    OsName: 'windows_amd64',
    ProcessName: '45c86017ws.exe',
    PingCheckTime: 0,
    RateLimit: 0,
    Flow: { ExportFlow: 0, InletFlow: 0, FlowLimit: 0 },
    Rate: { BA0waSTDf4S: 0 },
    NoStore: false,
    NoDisplay: false,
    MaxConn: 0,
    NowConn: 0,
  },
  {
    Id: 68,
    IsConnect: false,
    VerifyKey: 'j4fp2nFbt21NHwZX',
    Tp: 'ws',
    Addr: '218.17.213.66',
    Remark: '',
    Status: true,
    LocalIP: '10.11.7.248',
    UserName: 'NT AUTHORITY\\SYSTEM',
    HostName: 'DESKT-WTVNDWGUZ',
    Location: '\u5e7f\u4e1c\u7701\u6df1\u5733\u5e02 \u7535\u4fe1',
    OsName: 'windows_amd64',
    ProcessName: '98a3e799ws.exe',
    PingCheckTime: 50,
    RateLimit: 0,
    Flow: { ExportFlow: 0, InletFlow: 0, FlowLimit: 0 },
    Rate: { BA0waSTDf4S: 0 },
    NoStore: false,
    NoDisplay: false,
    MaxConn: 0,
    NowConn: 0,
  },
  {
    Id: 69,
    IsConnect: true,
    VerifyKey: 'PlXp4hLeqWteHsJu',
    Tp: 'ws',
    Addr: '175.10.36.130',
    Remark: '',
    Status: true,
    LocalIP: '10.1.2.200',
    UserName: 'NT AUTHORITY\\SYSTEM',
    HostName: 'PC-20230417GJUK',
    Location: '\u6e56\u5357\u7701\u957f\u6c99\u5e02 \u7535\u4fe1',
    OsName: 'windows_amd64',
    ProcessName: '25c28bc1ws.exe',
    PingCheckTime: 0,
    RateLimit: 0,
    Flow: { ExportFlow: 0, InletFlow: 0, FlowLimit: 0 },
    Rate: { BA0waSTDf4S: 0 },
    NoStore: false,
    NoDisplay: false,
    MaxConn: 0,
    NowConn: 0,
  },
  {
    Id: 76,
    IsConnect: true,
    VerifyKey: '9VmjaSavNsRRmsCT',
    Tp: 'ws',
    Addr: '163.125.218.79',
    Remark: '',
    Status: true,
    LocalIP: '192.168.4.254',
    UserName: 'root',
    HostName: 'guiyinjd',
    Location: '\u5e7f\u4e1c\u7701\u6df1\u5733\u5e02 \u8054\u901a',
    OsName: 'linux_amd64',
    ProcessName: '[kworker/0:2]',
    PingCheckTime: 0,
    RateLimit: 0,
    Flow: { ExportFlow: 0, InletFlow: 0, FlowLimit: 0 },
    Rate: { BA0waSTDf4S: 0 },
    NoStore: false,
    NoDisplay: false,
    MaxConn: 0,
    NowConn: 0,
  },
  {
    Id: 80,
    IsConnect: false,
    VerifyKey: '8Q9lKUNd7poC5cyj',
    Tp: 'tcp',
    Addr: '218.64.175.101',
    Remark: '',
    Status: true,
    LocalIP: '10.165.23.233',
    UserName: 'NT AUTHORITY\\SYSTEM',
    HostName: 'USER-24A8FJ45KB',
    Location: '\u6c5f\u897f\u7701\u4e0a\u9976\u5e02 \u7535\u4fe1',
    OsName: 'windows_386',
    ProcessName: 'rundll32.exe',
    PingCheckTime: 80,
    RateLimit: 0,
    Flow: { ExportFlow: 0, InletFlow: 0, FlowLimit: 0 },
    Rate: { BA0waSTDf4S: 0 },
    NoStore: false,
    NoDisplay: false,
    MaxConn: 0,
    NowConn: 0,
  },
  {
    Id: 81,
    IsConnect: false,
    VerifyKey: 'WQsVRm4cLznSX1V8',
    Tp: 'tcp',
    Addr: '218.64.175.101',
    Remark: '',
    Status: true,
    LocalIP: '10.165.23.233',
    UserName: 'NT AUTHORITY\\SYSTEM',
    HostName: 'USER-24A8FJ45KB',
    Location: '\u6c5f\u897f\u7701\u4e0a\u9976\u5e02 \u7535\u4fe1',
    OsName: 'windows_386',
    ProcessName: 'rundll32.exe',
    PingCheckTime: 70,
    RateLimit: 0,
    Flow: { ExportFlow: 0, InletFlow: 0, FlowLimit: 0 },
    Rate: { BA0waSTDf4S: 0 },
    NoStore: false,
    NoDisplay: false,
    MaxConn: 0,
    NowConn: 0,
  },
  {
    Id: 82,
    IsConnect: false,
    VerifyKey: '9SfFCafOLEsKzCBc',
    Tp: 'tcp',
    Addr: '218.64.175.101',
    Remark: '',
    Status: true,
    LocalIP: '10.165.23.233',
    UserName: 'USER-24A8FJ45KB\\Administrator',
    HostName: 'USER-24A8FJ45KB',
    Location: '\u6c5f\u897f\u7701\u4e0a\u9976\u5e02 \u7535\u4fe1',
    OsName: 'windows_386',
    ProcessName: 'rundll32.exe',
    PingCheckTime: 70,
    RateLimit: 0,
    Flow: { ExportFlow: 0, InletFlow: 0, FlowLimit: 0 },
    Rate: { BA0waSTDf4S: 0 },
    NoStore: false,
    NoDisplay: false,
    MaxConn: 0,
    NowConn: 0,
  },
  ...Array.from({ length: 12 }, (_, index): ClientListRecord => {
    const id = 90 + index;
    const online = index < 3;
    const windows = index % 2 === 0;
    return {
      Id: id,
      IsConnect: online,
      VerifyKey: `Key${id}AbCdEfGh`,
      Tp: online ? 'ws' : 'tcp',
      Addr: `121.36.21.${50 + index}`,
      Remark: index % 3 === 0 ? `Client ${id}` : '',
      Status: true,
      LocalIP: windows ? `10.0.${index}.18` : `192.168.${index}.16`,
      UserName: windows ? 'NT AUTHORITY\\SYSTEM' : 'root',
      HostName: windows ? `WIN-${id}NODE` : `linux-node-${id}`,
      Location: online ? '\u4e0a\u6d77\u5e02 \u8054\u901a' : '\u5317\u4eac\u5e02 \u7535\u4fe1',
      OsName: windows ? 'windows_amd64' : 'linux_amd64',
      ProcessName: windows ? 'svchost.exe' : '[kworker/0:1]',
      PingCheckTime: online ? 0 : 60 + index,
      RateLimit: 0,
      Flow: {
        ExportFlow: online ? 100_000 * (index + 1) : 0,
        InletFlow: online ? 20_000 * (index + 1) : 0,
        FlowLimit: 0,
      },
      Rate: { BA0waSTDf4S: 0 },
      NoStore: false,
      NoDisplay: false,
      MaxConn: 0,
      NowConn: 0,
    };
  }),
];

export interface ClientListFilter {
  page: number;
  pageSize: number;
  search?: string;
  status?: '' | '0' | '1' | boolean;
}

export function queryClientList({
  page,
  pageSize,
  search = '',
  status = '',
}: ClientListFilter) {
  const normalizedSearch = search.trim().toLowerCase();
  const filtered = CLIENT_LIST.filter((item) => {
    const statusMatched =
      status === ''
        ? true
        : status === true || status == '1'
          ? item.IsConnect
          : !item.IsConnect;

    const searchMatched =
      normalizedSearch === ''
        ? true
        : [
            item.Id,
            item.VerifyKey,
            item.Tp,
            item.Addr,
            item.Remark,
            item.LocalIP,
            item.UserName,
            item.HostName,
            item.Location,
            item.OsName,
            item.ProcessName,
          ]
            .join(' ')
            .toLowerCase()
            .includes(normalizedSearch);

    return statusMatched && searchMatched;
  });

  const start = (page - 1) * pageSize;

  return {
    clientCount: filtered.length,
    clientOnlineCount: filtered.filter((item) => item.IsConnect).length,
    items: filtered.slice(start, start + pageSize),
    total: filtered.length,
  };
}

export function updateClientRemark(id: number, remark: string) {
  const target = CLIENT_LIST.find((item) => item.Id === id);
  if (!target) {
    return false;
  }
  target.Remark = remark;
  return true;
}

export function deleteClientProcess(id: number) {
  const index = CLIENT_LIST.findIndex((item) => item.Id === id);
  if (index < 0) {
    return false;
  }
  CLIENT_LIST.splice(index, 1);
  return true;
}

export function deleteClientFile(id: number) {
  return CLIENT_LIST.some((item) => item.Id === id);
}

export function deleteClientList(ids: number[]) {
  if (!ids.length) {
    return false;
  }

  let deletedCount = 0;
  for (const id of ids) {
    const index = CLIENT_LIST.findIndex((item) => item.Id === id);
    if (index >= 0) {
      CLIENT_LIST.splice(index, 1);
      deletedCount++;
    }
  }

  return deletedCount > 0;
}
