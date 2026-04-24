<script setup lang="ts">
import type { VbenFormSchema } from '#/adapter/form';

import { computed, h, reactive } from 'vue';

import { VbenButton } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { ElTooltip } from 'element-plus';

import { useVbenForm, z } from '#/adapter/form';
import { $t } from '#/locales';

defineOptions({ name: 'ClientForwardDrawer' });
const emit = defineEmits<{
  submit: [values: ClientForwardFormValues];
}>();

interface ClientForwardFormValues {
  ebpfClient: '0' | '1';
  encryptSalt: string;
  mode: 'kcp' | 'tcp' | 'ws';
  proxy: string;
  serverHost: string;
  serverPort: string;
  vkey: string;
  wsAddr: string;
}

const requiredFormItemClass = 'client-forward-drawer__required';
const EBPf_OPTIONS = [
  { label: '\u662f', value: '1' },
  { label: '\u5426', value: '0' },
];

const SOCKET_MODE_OPTIONS = [
  { label: 'TCP', value: 'tcp' },
  { label: 'KCP/UDP', value: 'kcp' },
  { label: 'WebSocket', value: 'ws' },
];

const EBPF_SOCKET_MODE_OPTIONS = [
  { label: 'TCP', value: 'tcp' },
  { label: 'WebSocket', value: 'ws' },
];

function createDefaultValues(): ClientForwardFormValues {
  return {
    ebpfClient: '0',
    encryptSalt: '',
    mode: 'tcp',
    proxy: '',
    serverHost: '',
    serverPort: '',
    vkey: '',
    wsAddr: '',
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

function renderLabelWithTooltip(label: string, content: string) {
  return () =>
    h('span', { class: 'client-forward-drawer__label-with-help' }, [
      h('span', label),
      h(
        ElTooltip,
        {
          content,
          effect: 'dark',
          placement: 'top',
          popperClass: 'client-forward-drawer-tooltip',
        },
        {
          default: () =>
            h(IconifyIcon, {
              class: 'client-forward-drawer__help-icon',
              icon: 'ant-design:info-circle-outlined',
            }),
        },
      ),
    ]);
}

function createSchema(defaultValues: ClientForwardFormValues): VbenFormSchema[] {
  const ebpfClientLabel = $t('page.client.forwardDrawer.fields.ebpfClient');
  const modeLabel = $t('page.client.forwardDrawer.fields.mode');
  const serverHostLabel = $t('page.client.forwardDrawer.fields.serverHost');
  const serverPortLabel = $t('page.client.forwardDrawer.fields.serverPort');
  const wsAddrLabel = $t('page.client.forwardDrawer.fields.wsAddr');
  const vkeyLabel = $t('page.client.forwardDrawer.fields.vkey');
  const vkeyTip = $t('page.client.forwardDrawer.fields.vkeyTip');
  const encryptSaltLabel = $t('page.client.forwardDrawer.fields.encryptSalt');
  const proxyLabel = $t('page.client.forwardDrawer.fields.proxy');
  const proxyTip = $t('page.client.forwardDrawer.fields.proxyTip');

  return [
    {
      component: 'RadioGroup',
      componentProps: {
        class: 'client-forward-drawer__toggle-group',
        isButton: true,
        options: EBPf_OPTIONS,
      },
      defaultValue: defaultValues.ebpfClient,
      fieldName: 'ebpfClient',
      formItemClass: requiredFormItemClass,
      label: ebpfClientLabel,
      rules: requiredStringRule(ebpfClientLabel, 'select'),
    },
    {
      component: 'RadioGroup',
      componentProps: (values: ClientForwardFormValues) => ({
        class: 'client-forward-drawer__mode-group',
        isButton: true,
        options: values.ebpfClient === '1' ? EBPF_SOCKET_MODE_OPTIONS : SOCKET_MODE_OPTIONS,
      }),
      defaultValue: defaultValues.mode,
      dependencies: {
        triggerFields: ['ebpfClient'],
      },
      fieldName: 'mode',
      formItemClass: requiredFormItemClass,
      label: modeLabel,
      rules: requiredStringRule(modeLabel, 'select'),
    },
    {
      component: 'Input',
      componentProps: {
        class: 'client-forward-drawer__port-input',
        placeholder: $t('page.client.forwardDrawer.placeholder'),
      },
      defaultValue: defaultValues.serverHost,
      dependencies: {
        if: (values) => values.mode !== 'ws',
        required: () => true,
        rules: () => requiredStringRule(serverHostLabel),
        triggerFields: ['mode'],
      },
      fieldName: 'serverHost',
      formItemClass: requiredFormItemClass,
      label: serverHostLabel,
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('page.client.forwardDrawer.placeholder'),
      },
      defaultValue: defaultValues.serverPort,
      dependencies: {
        if: (values) => values.mode !== 'ws',
        required: () => true,
        rules: () => requiredStringRule(serverPortLabel),
        triggerFields: ['mode'],
      },
      fieldName: 'serverPort',
      formItemClass: requiredFormItemClass,
      label: serverPortLabel,
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('page.client.forwardDrawer.placeholder'),
      },
      defaultValue: defaultValues.wsAddr,
      dependencies: {
        if: (values) => values.mode === 'ws',
        required: () => true,
        rules: () => requiredStringRule(wsAddrLabel),
        triggerFields: ['mode'],
      },
      fieldName: 'wsAddr',
      formItemClass: requiredFormItemClass,
      help: $t('page.client.forwardDrawer.fields.wsAddrHelp'),
      label: renderLabelWithTooltip(wsAddrLabel, $t('page.client.forwardDrawer.fields.wsAddrTip')),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('page.client.forwardDrawer.placeholder'),
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
        placeholder: $t('page.client.forwardDrawer.placeholder'),
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
        placeholder: $t('page.client.forwardDrawer.fields.proxyPlaceholder'),
      },
      defaultValue: defaultValues.proxy,
      fieldName: 'proxy',
      label: renderLabelWithTooltip(proxyLabel, proxyTip),
    },
  ];
}

const defaultValues = createDefaultValues();
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
      if (syncing || !fieldsChanged.includes('ebpfClient')) {
        return;
      }

      if (values.ebpfClient === '1' && values.mode === 'kcp') {
        syncing = true;
        try {
          await formApi.setValues({ mode: 'tcp' }, false);
        } finally {
          syncing = false;
        }
      }
    },
    layout: 'horizontal',
    labelWidth: 92,
    schema: computed(() => createSchema(defaultValues)),
    showDefaultActions: false,
  }),
);

async function submit() {
  const { valid } = await formApi.validate();
  if (!valid) {
    return null;
  }

  return await formApi.getValues<ClientForwardFormValues>();
}

async function handleConnect() {
  const values = await submit();
  if (!values) {
    return;
  }
  emit('submit', values);
}

async function reset() {
  await formApi.resetForm({
    values: createDefaultValues(),
  });
  await formApi.resetValidate();
}

defineExpose({
  reset,
  submit,
});
</script>

<template>
  <div class="client-forward-drawer">
    <Form class="client-forward-drawer__form" />
    <div class="client-forward-drawer__actions">
      <VbenButton @click="handleConnect">
        {{ $t('page.client.forwardDrawer.actions.connect') }}
      </VbenButton>
    </div>
  </div>
</template>

<style scoped>
.client-forward-drawer {
  padding: 8px 10px 4px;
}

.client-forward-drawer__actions {
  display: flex;
  justify-content: flex-start;
  margin-top: 8px;
  padding-left: 92px;
}

.client-forward-drawer__actions :deep(button) {
  min-height: 30px;
  padding: 0 16px;
  border-radius: 6px;
}

.client-forward-drawer :deep(.client-forward-drawer__toggle-group),
.client-forward-drawer :deep(.client-forward-drawer__mode-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
}

.client-forward-drawer :deep(.el-radio-button) {
  margin: 0;
  line-height: 1;
}

.client-forward-drawer :deep(.el-radio-button__inner) {
  min-width: 52px;
  min-height: 32px;
  padding: 0 14px;
  font-size: 13px;
  line-height: 30px;
  border: 1px solid var(--el-border-color) !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background-color 0.2s ease;
}

.client-forward-drawer :deep(.client-forward-drawer__mode-group .el-radio-button__inner) {
  min-width: 78px;
}

.client-forward-drawer :deep(.el-radio-button:first-child .el-radio-button__inner) {
  border-top-left-radius: 6px !important;
  border-bottom-left-radius: 6px !important;
}

.client-forward-drawer :deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-top-right-radius: 6px !important;
  border-bottom-right-radius: 6px !important;
}

.client-forward-drawer :deep(.el-radio-button + .el-radio-button) {
  margin-left: -1px !important;
}

.client-forward-drawer :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  z-index: 1;
  border-color: var(--el-color-primary) !important;
  color: #fff !important;
  background: var(--el-color-primary) !important;
  box-shadow: none !important;
}

.client-forward-drawer :deep(.el-radio-button__inner:hover) {
  border-color: var(--el-color-primary-light-5) !important;
}

.client-forward-drawer :deep(.client-forward-drawer__label-with-help) {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.client-forward-drawer :deep(.client-forward-drawer__help-icon) {
  color: var(--el-text-color-secondary);
  font-size: 14px;
  cursor: help;
}

.client-forward-drawer :deep(.client-forward-drawer__required .el-form-item__label::before) {
  margin-right: 4px;
  color: var(--el-color-danger);
  content: '*';
}

.client-forward-drawer :deep(.el-form-item__label) {
  align-items: center;
  min-height: 32px;
  padding-bottom: 0;
  line-height: 32px;
}

.client-forward-drawer :deep(.el-form-item__description) {
  margin-top: 6px;
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.client-forward-drawer :deep(.el-form-item) {
  margin-bottom: 18px;
}

.client-forward-drawer :deep(.el-form-item__content) {
  max-width: 372px;
}

.client-forward-drawer :deep(.el-input__wrapper),
.client-forward-drawer :deep(.el-input-number__wrapper) {
  min-height: 32px;
  border-radius: 6px;
}

.client-forward-drawer :deep(.el-input__inner) {
  font-size: 13px;
}

.client-forward-drawer :deep(.client-forward-drawer__port-input) {
  max-width: 160px;
}

.client-forward-drawer :deep(.client-forward-drawer__toggle-group + .el-form-item__error),
.client-forward-drawer :deep(.client-forward-drawer__mode-group + .el-form-item__error) {
  padding-top: 4px;
}
</style>

<style>
.client-forward-drawer-tooltip.el-popper.is-dark {
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

.client-forward-drawer-tooltip.el-popper.is-dark .el-popper__arrow::before {
  background: #4a4a4a;
  border: none;
}
</style>
