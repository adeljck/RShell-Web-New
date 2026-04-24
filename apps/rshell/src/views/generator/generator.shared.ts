import type { ListenerListResult, ListenerRecord } from '#/api';

import { computed, ref } from 'vue';

import { getListenerListApi, getMockListenerList } from '#/api';

const GENERATOR_REQUEST_TIMEOUT = 1500;

export const generatorTabs = [
  'stage',
  'shellcode',
  'stageless',
  'dllStageless',
  'listen',
  'dllListen',
  'ebpfListen',
] as const;

export type GeneratorTab = (typeof generatorTabs)[number];

export type StageTarget =
  | 'darwin_amd64'
  | 'darwin_arm64'
  | 'linux_amd64'
  | 'linux_i386'
  | 'linux_arm64'
  | 'linux_arm'
  | 'windows_amd64'
  | 'windows_i386';

export type ShellcodeTarget = 'windows_amd64' | 'windows_i386';
export type ShellcodeFormat = 'bin' | 'c' | 'raw';
export type DllTarget = 'windows_amd64' | 'windows_i386';
export type ListenMode = 'tcp' | 'kcp' | 'ws';
export type EbpfTarget = 'linux_amd64' | 'linux_arm64';
export type EbpfMode = 'tcp' | 'ws';

export interface GeneratorListenerOption {
  label: string;
  value: number;
}

export const stageTargets: StageTarget[] = [
  'darwin_amd64',
  'darwin_arm64',
  'linux_amd64',
  'linux_i386',
  'linux_arm64',
  'linux_arm',
  'windows_amd64',
  'windows_i386',
];

export const shellcodeTargets: ShellcodeTarget[] = ['windows_amd64', 'windows_i386'];
export const shellcodeFormats: ShellcodeFormat[] = ['bin', 'c', 'raw'];
export const dllTargets: DllTarget[] = ['windows_amd64', 'windows_i386'];
export const listenModes: ListenMode[] = ['tcp', 'kcp', 'ws'];
export const ebpfTargets: EbpfTarget[] = ['linux_amd64', 'linux_arm64'];
export const ebpfModes: EbpfMode[] = ['tcp', 'ws'];

const tabLabels: Record<GeneratorTab, string> = {
  stage: 'stage',
  shellcode: 'shellcode',
  stageless: 'stageless',
  dllStageless: 'dll stageless',
  listen: 'listen',
  dllListen: 'dll listen',
  ebpfListen: 'ebpf listen',
};

export function getTabLabel(tab: GeneratorTab) {
  return tabLabels[tab];
}

export function getExternalAddr(item: ListenerRecord) {
  return item.WsConnectAddr || item.ConnectAddr || '-';
}

export function generateRandomString(length = 16) {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';

  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const values = crypto.getRandomValues(new Uint32Array(length));
    return Array.from(values, (value) => chars[value % chars.length]).join('');
  }

  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join('');
}

export function ensureSecretPair(
  keyRef: { value: string },
  saltRef: { value: string },
) {
  if (!keyRef.value) {
    keyRef.value = generateRandomString();
  }

  if (!saltRef.value) {
    saltRef.value = generateRandomString();
  }
}

async function getListenerResult(): Promise<ListenerListResult> {
  try {
    return await Promise.race([
      getListenerListApi(),
      new Promise<ListenerListResult>((_, reject) => {
        setTimeout(() => {
          reject(new Error('generator listener request timeout'));
        }, GENERATOR_REQUEST_TIMEOUT);
      }),
    ]);
  } catch {
    return getMockListenerList();
  }
}

export function useGeneratorListeners() {
  const loadingListeners = ref(false);
  const listeners = ref<ListenerRecord[]>([]);

  const listenerOptions = computed<GeneratorListenerOption[]>(() =>
    listeners.value.map((item) => ({
      label: `${item.Id} · ${item.Mode.toUpperCase()} · ${getExternalAddr(item)}`,
      value: item.Id,
    })),
  );

  async function loadListeners() {
    loadingListeners.value = true;
    try {
      const result = await getListenerResult();
      listeners.value = result.items.filter((item) => ['tcp', 'ws'].includes(item.Mode));
    } finally {
      loadingListeners.value = false;
    }
  }

  return {
    listenerOptions,
    listeners,
    loadListeners,
    loadingListeners,
  };
}
