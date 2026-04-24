import type { ClientListRecord } from '#/api';

import { buildOnlineClientOptions, formatClientDisplayLabel } from '../_shared/client-display';

export type TunnelDrawerMode = 'create' | 'edit';

export interface TunnelCreateFormValues {
  clientId: number | null;
  mode: 'http' | 'socks5' | 'tcp' | 'udp';
  password: string;
  port: number | null;
  remark: string;
  target: string;
  username: string;
}

export interface TunnelClientOption {
  label: string;
  value: number;
}

export function createDefaultTunnelFormValues(): TunnelCreateFormValues {
  return {
    clientId: null,
    mode: 'socks5',
    password: '',
    port: null,
    remark: '',
    target: '',
    username: '',
  };
}

export function isTargetTunnelMode(mode?: string) {
  return mode === 'tcp' || mode === 'udp';
}

export function isCredentialTunnelMode(mode?: string) {
  return mode === 'socks5' || mode === 'http';
}

export function formatTunnelClientOptionLabel(item: ClientListRecord) {
  return formatClientDisplayLabel(item);
}

export function createTunnelClientOptions(
  items: ClientListRecord[],
  selectedClientId?: number | null,
) {
  return buildOnlineClientOptions(items, selectedClientId)
    .map((item): TunnelClientOption => ({
      label: formatTunnelClientOptionLabel(item),
      value: item.Id,
    }));
}
