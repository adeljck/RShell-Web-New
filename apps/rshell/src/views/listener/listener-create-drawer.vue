<script setup lang="ts">
import type { ListenerRecord, ListenerUpsertPayload } from '#/api';
import type { VbenFormSchema } from '#/adapter/form';

import { computed, h, reactive, ref } from 'vue';

import { IconifyIcon } from '@vben/icons';
import { ElTooltip } from 'element-plus';
import { useVbenForm, z } from '#/adapter/form';
import { $t } from '#/locales';

defineOptions({ name: 'ListenerCreateDrawer' });

interface ListenerCreateFormValues {
  connectAddr: string;
  disconnectTimeout: number;
  dnsDomain: string;
  encryptSalt: string;
  listenAddr: string;
  mode: string;
  ossUrl: string;
  pingInterval: number;
  publicDoh: string;
  publicDot: string;
  publicDns: string;
  remark: string;
  vkey: string;
  wsConnectAddr: string;
}

const MODE_OPTIONS = [
  { label: 'TCP', value: 'tcp' },
  { label: 'KCP/UDP', value: 'kcp' },
  { label: 'WebSocket', value: 'ws' },
  { label: 'DNS', value: 'dns' },
  { label: 'DOH', value: 'doh' },
  { label: 'DOT', value: 'dot' },
  { label: 'OSS', value: 'oss' },
];

const defaultPort = 8084;
const dnsPort = 53;
const defaultHost = '127.0.0.1';
const requiredFormItemClass = 'listener-create-drawer__required';

function isDnsLikeMode(mode?: string) {
  return ['dns', 'doh', 'dot'].includes(mode ?? '');
}

function isSocketMode(mode?: string) {
  return ['tcp', 'kcp', 'ws'].includes(mode ?? '');
}

function isWebsocketMode(mode?: string) {
  return mode === 'ws';
}

function isOssMode(mode?: string) {
  return mode === 'oss';
}

function generateRandomString(length = 16) {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';

  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.getRandomValues === 'function'
  ) {
    const values = crypto.getRandomValues(new Uint32Array(length));

    return Array.from(values, (value) => chars[value % chars.length]).join('');
  }

  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join('');
}

function extractPort(value: string) {
  const matched = value.match(/:(\d+)(?:\/.*)?$/);
  return matched?.[1] ?? '';
}

function formatSocketAddress(port?: number | string) {
  return `${defaultHost}:${port || defaultPort}`;
}

function formatWsAddress(port?: number | string) {
  return `ws://${defaultHost}:${port || defaultPort}/ws`;
}

function parseWsConnectAddr(value: string) {
  const matched = value.match(/^wss?:\/\/([^/]+)(?:\/.*)?$/i);
  return matched?.[1] ?? '';
}

function createDefaultFormValues(): ListenerCreateFormValues {
  return {
    connectAddr: '',
    disconnectTimeout: 30,
    dnsDomain: '',
    encryptSalt: generateRandomString(),
    listenAddr: '',
    mode: 'tcp',
    ossUrl: '',
    pingInterval: 10,
    publicDoh: '',
    publicDot: '',
    publicDns: '',
    remark: '',
    vkey: generateRandomString(),
    wsConnectAddr: '',
  };
}

function requiredStringRule(label: string, type: 'input' | 'select' = 'input') {
  return z.string().trim().min(1, {
    message: $t(
      type === 'select' ? 'ui.formRules.selectRequired' : 'ui.formRules.required',
      [label],
    ),
  });
}

function requiredNumberRule(label: string) {
  return z.number().min(1, {
    message: $t('ui.formRules.required', [label]),
  });
}

function renderLabelWithTooltip(label: string, content: string) {
  return () =>
    h('span', { class: 'listener-create-drawer__label-with-help' }, [
      h('span', label),
      h(
        ElTooltip,
        {
          content,
          effect: 'dark',
          placement: 'top',
          popperClass: 'listener-create-drawer-tooltip',
        },
        {
          default: () =>
            h(IconifyIcon, {
              class: 'listener-create-drawer__help-icon',
              icon: 'ant-design:info-circle-outlined',
            }),
        },
      ),
    ]);
}

function buildSchema(defaultValues: ListenerCreateFormValues): VbenFormSchema[] {
  const modeLabel = $t('page.listener.drawer.fields.mode');
  const listenAddrLabel = $t('page.listener.drawer.fields.listenAddr');
  const connectAddrLabel = $t('page.listener.drawer.fields.connectAddr');
  const wsConnectAddrLabel = $t('page.listener.drawer.fields.wsConnectAddr');
  const dnsDomainLabel = $t('page.listener.drawer.fields.dnsDomain');
  const publicDnsLabel = $t('page.listener.drawer.fields.publicDns');
  const publicDohLabel = $t('page.listener.drawer.fields.publicDoh');
  const publicDotLabel = $t('page.listener.drawer.fields.publicDot');
  const disconnectTimeoutLabel = $t('page.listener.drawer.fields.disconnectTimeout');
  const pingIntervalLabel = $t('page.listener.drawer.fields.pingInterval');
  const vkeyLabel = $t('page.listener.drawer.fields.vkey');
  const vkeyTip = $t('page.listener.drawer.fields.vkeyTip');
  const encryptSaltLabel = $t('page.listener.drawer.fields.encryptSalt');
  const ossUrlLabel = $t('page.listener.drawer.fields.ossUrl');

  return [
    {
      component: 'RadioGroup',
      componentProps: {
        class: 'listener-mode-group',
        isButton: true,
        options: MODE_OPTIONS,
      },
      defaultValue: defaultValues.mode,
      fieldName: 'mode',
      formItemClass: requiredFormItemClass,
      label: modeLabel,
      rules: requiredStringRule(modeLabel, 'select'),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('page.listener.drawer.placeholder'),
      },
      defaultValue: defaultValues.remark,
      fieldName: 'remark',
      label: $t('page.listener.drawer.fields.remark'),
    },
    {
      component: 'Input',
      defaultValue: defaultValues.listenAddr,
      dependencies: {
        if: (values) => !isOssMode(values.mode),
        required: () => true,
        rules: () => requiredStringRule(listenAddrLabel),
        triggerFields: ['mode'],
        componentProps: (values) => ({
          placeholder: isDnsLikeMode(values.mode)
            ? `0.0.0.0:${dnsPort}`
            : `0.0.0.0:${defaultPort}`,
        }),
      },
      fieldName: 'listenAddr',
      formItemClass: requiredFormItemClass,
      label: listenAddrLabel,
    },
    {
      component: 'Input',
      defaultValue: defaultValues.connectAddr,
      dependencies: {
        if: (values) => ['tcp', 'kcp'].includes(values.mode ?? ''),
        required: () => true,
        rules: () => requiredStringRule(connectAddrLabel),
        triggerFields: ['mode'],
        componentProps: () => ({
          placeholder: formatSocketAddress(),
        }),
      },
      fieldName: 'connectAddr',
      formItemClass: requiredFormItemClass,
      label: connectAddrLabel,
    },
    {
      component: 'Input',
      defaultValue: defaultValues.wsConnectAddr,
      dependencies: {
        if: (values) => isWebsocketMode(values.mode),
        required: () => true,
        rules: () => requiredStringRule(wsConnectAddrLabel),
        triggerFields: ['mode'],
        componentProps: () => ({
          placeholder: formatWsAddress(),
        }),
      },
      fieldName: 'wsConnectAddr',
      formItemClass: requiredFormItemClass,
      label: wsConnectAddrLabel,
    },
    {
      component: 'Input',
      defaultValue: defaultValues.dnsDomain,
      dependencies: {
        if: (values) => isDnsLikeMode(values.mode),
        required: () => true,
        rules: () => requiredStringRule(dnsDomainLabel),
        triggerFields: ['mode'],
        componentProps: () => ({
          placeholder: 'ns.example.com',
        }),
      },
      fieldName: 'dnsDomain',
      formItemClass: requiredFormItemClass,
      label: dnsDomainLabel,
    },
    {
      component: 'Input',
      defaultValue: defaultValues.publicDns,
      dependencies: {
        if: (values) => values.mode === 'dns',
        required: () => true,
        rules: () => requiredStringRule(publicDnsLabel),
        triggerFields: ['mode'],
        componentProps: () => {
          return {
            placeholder: '8.8.8.8:53',
          };
        },
      },
      fieldName: 'publicDns',
      formItemClass: requiredFormItemClass,
      label: publicDnsLabel,
    },
    {
      component: 'Input',
      defaultValue: defaultValues.publicDoh,
      dependencies: {
        if: (values) => values.mode === 'doh',
        required: () => true,
        rules: () => requiredStringRule(publicDohLabel),
        triggerFields: ['mode'],
        componentProps: () => ({
          placeholder: 'https://dns.alidns.com/dns-query',
        }),
      },
      fieldName: 'publicDoh',
      formItemClass: requiredFormItemClass,
      label: publicDohLabel,
    },
    {
      component: 'Input',
      defaultValue: defaultValues.publicDot,
      dependencies: {
        if: (values) => values.mode === 'dot',
        required: () => true,
        rules: () => requiredStringRule(publicDotLabel),
        triggerFields: ['mode'],
        componentProps: () => ({
          placeholder: 'dns.ipv5dns.com:853',
        }),
      },
      fieldName: 'publicDot',
      formItemClass: requiredFormItemClass,
      label: publicDotLabel,
    },
    {
      component: 'InputNumber',
      componentProps: {
        controls: false,
        min: 1,
      },
      defaultValue: defaultValues.disconnectTimeout,
      fieldName: 'disconnectTimeout',
      formItemClass: requiredFormItemClass,
      label: disconnectTimeoutLabel,
      rules: requiredNumberRule(disconnectTimeoutLabel),
    },
    {
      component: 'InputNumber',
      componentProps: {
        controls: false,
        min: 1,
      },
      defaultValue: defaultValues.pingInterval,
      fieldName: 'pingInterval',
      formItemClass: requiredFormItemClass,
      label: pingIntervalLabel,
      rules: requiredNumberRule(pingIntervalLabel),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('page.listener.drawer.placeholder'),
        showPassword: true,
      },
      defaultValue: defaultValues.vkey,
      fieldName: 'vkey',
      formItemClass: requiredFormItemClass,
      label: renderLabelWithTooltip(vkeyLabel, vkeyTip),
      rules: requiredStringRule(vkeyLabel),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('page.listener.drawer.placeholder'),
        showPassword: true,
      },
      defaultValue: defaultValues.encryptSalt,
      fieldName: 'encryptSalt',
      formItemClass: requiredFormItemClass,
      label: encryptSaltLabel,
      rules: requiredStringRule(encryptSaltLabel),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('page.listener.drawer.placeholder'),
      },
      defaultValue: defaultValues.ossUrl,
      dependencies: {
        if: (values) => isOssMode(values.mode),
        required: () => true,
        rules: () => requiredStringRule(ossUrlLabel),
        triggerFields: ['mode'],
      },
      fieldName: 'ossUrl',
      formItemClass: requiredFormItemClass,
      label: ossUrlLabel,
    },
  ];
}

const initialValues = createDefaultFormValues();
const editingId = ref('0');
let syncing = false;

const [Form, formApi] = useVbenForm(
  reactive({
    commonConfig: {
      componentProps: {
        class: 'w-full',
      },
    },
    handleValuesChange: async (
      values: Record<string, any>,
      fieldsChanged: string[],
    ) => {
      if (syncing) {
        return;
      }

      const mode = String(values.mode ?? '');
      const changedMode = fieldsChanged.includes('mode');
      const changedListen = fieldsChanged.includes('listenAddr');

      if (!changedMode && !changedListen) {
        return;
      }

      const nextValues: Partial<ListenerCreateFormValues> = {};

      if (isSocketMode(mode)) {
        const port =
          extractPort(String(values.listenAddr ?? '')) ||
          extractPort(String(values.connectAddr ?? '')) ||
          extractPort(String(values.wsConnectAddr ?? '')) ||
          defaultPort;

        if (mode === 'ws') {
          if (changedMode) {
            if (values.wsConnectAddr || values.connectAddr || values.listenAddr) {
              nextValues.wsConnectAddr = formatWsAddress(port);
            }
          } else if (changedListen && values.wsConnectAddr) {
            nextValues.wsConnectAddr = formatWsAddress(port);
          }
        } else if (changedMode) {
          if (values.connectAddr || values.wsConnectAddr || values.listenAddr) {
            nextValues.connectAddr = formatSocketAddress(port);
          }
        } else if (changedListen && values.connectAddr) {
          nextValues.connectAddr = formatSocketAddress(port);
        }
      }

      if (Object.keys(nextValues).length === 0) {
        return;
      }

      syncing = true;
      try {
        await formApi.setValues(nextValues, false);
      } finally {
        syncing = false;
      }
    },
    layout: 'vertical',
    schema: computed(() => buildSchema(initialValues)),
    showDefaultActions: false,
  }),
);

async function submit() {
  const { valid } = await formApi.validate();
  if (!valid) {
    return null;
  }

  const values = await formApi.getValues<ListenerCreateFormValues>();
  const payload: ListenerUpsertPayload = {
    ConnectAddr: '',
    DNSDomain: '',
    DisconnectTimeout: String(values.disconnectTimeout),
    EncryptSalt: values.encryptSalt,
    Id: editingId.value,
    ListenAddr: '',
    Mode: values.mode,
    OssUrl: '',
    PingInterval: String(values.pingInterval),
    PublicDNS: '',
    Remark: values.remark,
    Vkey: values.vkey,
    WsConnectAddr: '',
  };

  if (!isOssMode(values.mode)) {
    payload.ListenAddr = values.listenAddr;
  }

  if (['tcp', 'kcp'].includes(values.mode)) {
    payload.ConnectAddr = values.connectAddr;
  }

  if (isWebsocketMode(values.mode)) {
    payload.ConnectAddr = parseWsConnectAddr(values.wsConnectAddr);
    payload.WsConnectAddr = values.wsConnectAddr;
  }

  if (isDnsLikeMode(values.mode)) {
    payload.DNSDomain = values.dnsDomain;
    payload.PublicDNS =
      values.mode === 'doh'
        ? values.publicDoh
        : values.mode === 'dot'
          ? values.publicDot
          : values.publicDns;
  }

  if (isOssMode(values.mode)) {
    payload.OssUrl = values.ossUrl;
  }

  return payload;
}

async function reset() {
  editingId.value = '0';
  await formApi.resetForm({
    values: createDefaultFormValues(),
  });
  await formApi.resetValidate();
}

async function setValues(record: ListenerRecord) {
  editingId.value = String(record.Id);
  await formApi.resetForm({
    values: {
      connectAddr: record.ConnectAddr || '',
      disconnectTimeout: Number(record.DisconnectTimeout || 0),
      dnsDomain: record.DNSDomain || '',
      encryptSalt: record.EncryptSalt || '',
      listenAddr: record.ListenAddr || '',
      mode: record.Mode || 'tcp',
      ossUrl: record.OssUrl || '',
      pingInterval: Number(record.PingInterval || 0),
      publicDoh: record.Mode === 'doh' ? record.PublicDNS || '' : '',
      publicDot: record.Mode === 'dot' ? record.PublicDNS || '' : '',
      publicDns: record.Mode === 'dns' ? record.PublicDNS || '' : '',
      remark: record.Remark || '',
      vkey: record.Vkey || '',
      wsConnectAddr: record.WsConnectAddr || '',
    },
  });
  await formApi.resetValidate();
}

defineExpose({
  reset,
  setValues,
  submit,
});
</script>

<template>
  <div class="listener-create-drawer">
    <Form class="listener-create-form" />
  </div>
</template>

<style scoped>
.listener-create-drawer {
  padding: 4px 8px;
}

.listener-create-drawer :deep(.listener-mode-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.listener-create-drawer :deep(.listener-mode-group .el-radio-button) {
  margin: 0;
  line-height: 1;
}

.listener-create-drawer :deep(.listener-mode-group .el-radio-button__inner) {
  min-width: 88px;
  min-height: 34px;
  padding: 0 14px;
  font-size: 13px;
  line-height: 32px;
  border: 1px solid var(--el-border-color) !important;
  border-radius: 6px !important;
  box-shadow: none !important;
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background-color 0.2s ease;
}

.listener-create-drawer
  :deep(.listener-mode-group .el-radio-button:first-child .el-radio-button__inner),
.listener-create-drawer
  :deep(.listener-mode-group .el-radio-button:last-child .el-radio-button__inner) {
  border-radius: 6px !important;
}

.listener-create-drawer
  :deep(.listener-mode-group .el-radio-button__original-radio:checked + .el-radio-button__inner) {
  border-color: var(--el-color-primary) !important;
  color: var(--el-color-primary) !important;
  background: rgb(22 119 255 / 8%) !important;
  box-shadow: none !important;
}

.listener-create-drawer
  :deep(.listener-mode-group .el-radio-button + .el-radio-button) {
  margin-left: 0 !important;
}

.listener-create-drawer
  :deep(.listener-mode-group .el-radio-button__inner:hover) {
  border-color: var(--el-color-primary-light-5) !important;
}

.listener-create-drawer :deep(.el-input-number) {
  width: 100%;
}

.listener-create-drawer :deep(.listener-create-drawer__label-with-help) {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.listener-create-drawer :deep(.listener-create-drawer__help-icon) {
  color: var(--el-text-color-secondary);
  font-size: 14px;
  cursor: help;
}

.listener-create-drawer
  :deep(.listener-create-drawer__required .el-form-item__label::before) {
  margin-right: 4px;
  color: var(--el-color-danger);
  content: '*';
}
</style>

<style>
.listener-create-drawer-tooltip.el-popper.is-dark {
  max-width: 620px;
  padding: 14px 18px;
  color: #fff;
  background: #4a4a4a;
  border: none;
  border-radius: 10px;
  box-shadow: 0 12px 24px rgb(0 0 0 / 22%);
  font-size: 14px;
  line-height: 1.6;
}

.listener-create-drawer-tooltip.el-popper.is-dark .el-popper__arrow::before {
  background: #4a4a4a;
  border: none;
}
</style>
