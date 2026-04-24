<script setup lang="ts">
import type { TunnelListRecord, TunnelUpsertPayload } from '#/api';
import type { VbenFormSchema } from '#/adapter/form';

import { computed, nextTick, reactive, ref } from 'vue';

import { useVbenForm, z } from '#/adapter/form';
import { getClientListApi, getMockClientList } from '#/api';
import { $t } from '#/locales';

import {
  createDefaultTunnelFormValues,
  createTunnelClientOptions,
  isCredentialTunnelMode,
  isTargetTunnelMode,
  type TunnelClientOption,
  type TunnelCreateFormValues,
} from './tunnel-shared';

defineOptions({ name: 'TunnelCreateDrawer' });

const CLIENT_REQUEST_TIMEOUT = 1500;
const requiredFormItemClass = 'tunnel-create-drawer__required';
const clientOptions = ref<TunnelClientOption[]>([]);
const loadingClients = ref(false);
const allClients = ref<import('#/api').ClientListRecord[]>([]);
const editingId = ref<number | null>(null);
const isEditing = computed(() => editingId.value !== null);

function requiredNumberRule(label: string) {
  return z.number({
    invalid_type_error: $t('ui.formRules.selectRequired', [label]),
  }).min(1, {
    message: $t('ui.formRules.selectRequired', [label]),
  });
}

function requiredStringRule(label: string, type: 'input' | 'select' = 'input') {
  return z.string().trim().min(1, {
    message: $t(
      type === 'select' ? 'ui.formRules.selectRequired' : 'ui.formRules.required',
      [label],
    ),
  });
}

function createSchema(defaultValues: TunnelCreateFormValues): VbenFormSchema[] {
  const clientLabel = $t('page.tunnel.drawer.fields.clientId');
  const modeLabel = $t('page.tunnel.drawer.fields.mode');
  const portLabel = $t('page.tunnel.drawer.fields.port');
  const targetLabel = $t('page.tunnel.drawer.fields.target');
  const modeOptions = [
    { label: $t('page.tunnel.drawer.modeOptions.socks5'), value: 'socks5' },
    { label: $t('page.tunnel.drawer.modeOptions.http'), value: 'http' },
    { label: $t('page.tunnel.drawer.modeOptions.tcp'), value: 'tcp' },
    { label: $t('page.tunnel.drawer.modeOptions.udp'), value: 'udp' },
  ] as const;

  return [
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        disabled: isEditing.value,
        loading: loadingClients.value,
        onVisibleChange: handleClientDropdownVisibleChange,
        options: clientOptions.value,
        placeholder: $t('page.tunnel.drawer.placeholder'),
        popperClass: 'tunnel-create-drawer-client-dropdown',
      },
      defaultValue: defaultValues.clientId,
      fieldName: 'clientId',
      formItemClass: requiredFormItemClass,
      label: clientLabel,
      rules: requiredNumberRule(clientLabel),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        class: 'tunnel-create-drawer__mode-group',
        isButton: true,
        options: modeOptions,
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
        placeholder: $t('page.tunnel.drawer.placeholder'),
      },
      defaultValue: defaultValues.remark,
      fieldName: 'remark',
      label: $t('page.tunnel.drawer.fields.remark'),
    },
    {
      component: 'InputNumber',
      componentProps: {
        controls: false,
        min: 1,
        placeholder: $t('page.tunnel.drawer.placeholder'),
      },
      defaultValue: defaultValues.port,
      fieldName: 'port',
      formItemClass: requiredFormItemClass,
      label: portLabel,
      rules: requiredNumberRule(portLabel),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('page.tunnel.drawer.placeholder'),
      },
      defaultValue: defaultValues.target,
      dependencies: {
        if: (values) => isTargetTunnelMode(values.mode),
        required: () => true,
        rules: () => requiredStringRule(targetLabel),
        triggerFields: ['mode'],
      },
      fieldName: 'target',
      formItemClass: requiredFormItemClass,
      label: targetLabel,
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('page.tunnel.drawer.placeholder'),
      },
      defaultValue: defaultValues.username,
      dependencies: {
        if: (values) => isCredentialTunnelMode(values.mode),
        triggerFields: ['mode'],
      },
      fieldName: 'username',
      label: $t('page.tunnel.drawer.fields.username'),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('page.tunnel.drawer.placeholder'),
      },
      defaultValue: defaultValues.password,
      dependencies: {
        if: (values) => isCredentialTunnelMode(values.mode),
        triggerFields: ['mode'],
      },
      fieldName: 'password',
      label: $t('page.tunnel.drawer.fields.password'),
    },
  ];
}

async function loadClientOptions() {
  loadingClients.value = true;
  try {
    const result = await Promise.race([
      getClientListApi({ page: 1, pageSize: 100 }),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('client option request timeout')), CLIENT_REQUEST_TIMEOUT);
      }),
    ]);
    allClients.value = result.items;
    clientOptions.value = createTunnelClientOptions(result.items);
  } catch {
    allClients.value = getMockClientList({ page: 1, pageSize: 100 }).items;
    clientOptions.value = createTunnelClientOptions(allClients.value);
  } finally {
    loadingClients.value = false;
  }
}

async function handleClientDropdownVisibleChange(visible: boolean) {
  if (!visible) {
    return;
  }

  await nextTick();
  document
    .querySelectorAll(
      '.tunnel-create-drawer-client-dropdown .el-select-dropdown__item, .tunnel-create-drawer-client-dropdown .el-select-dropdown__option-item',
    )
    .forEach((item) => {
      const text = item.textContent?.trim() ?? '';
      if (text) {
        item.setAttribute('title', text);
      }
    });
}

const [Form, formApi] = useVbenForm(
  reactive({
    commonConfig: {
      componentProps: {
        class: 'w-full',
      },
    },
    layout: 'horizontal',
    labelWidth: 84,
    schema: computed(() => createSchema(createDefaultTunnelFormValues())),
    showDefaultActions: false,
  }),
);

async function submit() {
  const { valid } = await formApi.validate();
  if (!valid) {
    return null;
  }

  const values = await formApi.getValues<TunnelCreateFormValues>();
  if (!values.clientId || !values.port) {
    return null;
  }

  const payload: TunnelUpsertPayload = {
    ClientId: values.clientId,
    Mode: values.mode,
    Port: values.port,
  };

  if (editingId.value !== null) {
    payload.Id = editingId.value;
  }

  if (values.remark.trim()) {
    payload.Remark = values.remark.trim();
  }

  if (isTargetTunnelMode(values.mode)) {
    payload.Target = values.target.trim();
  }

  if (isCredentialTunnelMode(values.mode)) {
    if (values.username.trim()) {
      payload.Username = values.username.trim();
    }
    if (values.password.trim()) {
      payload.Password = values.password.trim();
    }
  }

  return payload;
}

async function reset() {
  editingId.value = null;
  await loadClientOptions();
  await formApi.resetForm({
    values: createDefaultTunnelFormValues(),
  });
  await formApi.resetValidate();
}

async function setValues(record: TunnelListRecord) {
  editingId.value = record.Id;

  if (allClients.value.length === 0) {
    await loadClientOptions();
  }

  clientOptions.value = createTunnelClientOptions(allClients.value, record.ClientId);

  await formApi.resetForm({
    values: {
      clientId: record.ClientId,
      mode: record.Mode as TunnelCreateFormValues['mode'],
      password: record.Password || '',
      port: record.Port,
      remark: record.Remark || '',
      target: record.Target || '',
      username: record.Username || '',
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
  <div class="tunnel-create-drawer">
    <Form class="tunnel-create-drawer__form" />
  </div>
</template>

<style scoped>
.tunnel-create-drawer {
  padding: 6px 8px 6px 4px;
}

.tunnel-create-drawer :deep(.tunnel-create-drawer__mode-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
}

.tunnel-create-drawer :deep(.el-radio-button) {
  margin: 0;
  line-height: 1;
}

.tunnel-create-drawer :deep(.el-radio-button__inner) {
  min-width: 78px;
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

.tunnel-create-drawer :deep(.el-radio-button:first-child .el-radio-button__inner) {
  border-top-left-radius: 6px !important;
  border-bottom-left-radius: 6px !important;
}

.tunnel-create-drawer :deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-top-right-radius: 6px !important;
  border-bottom-right-radius: 6px !important;
}

.tunnel-create-drawer :deep(.el-radio-button + .el-radio-button) {
  margin-left: -1px !important;
}

.tunnel-create-drawer :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  z-index: 1;
  border-color: var(--el-color-primary) !important;
  color: #fff !important;
  background: var(--el-color-primary) !important;
  box-shadow: none !important;
}

.tunnel-create-drawer :deep(.el-radio-button__inner:hover) {
  border-color: var(--el-color-primary-light-5) !important;
}

.tunnel-create-drawer :deep(.tunnel-create-drawer__required .el-form-item__label::before) {
  margin-right: 4px;
  color: var(--el-color-danger);
  content: '*';
}

.tunnel-create-drawer :deep(.el-form-item__label) {
  align-items: center;
  min-height: 32px;
  padding-bottom: 0;
  line-height: 32px;
}

.tunnel-create-drawer :deep(.el-form-item) {
  margin-bottom: 16px;
}

.tunnel-create-drawer :deep(.el-form-item__content) {
  max-width: 360px;
}

.tunnel-create-drawer :deep(.el-input__wrapper),
.tunnel-create-drawer :deep(.el-input-number__wrapper),
.tunnel-create-drawer :deep(.el-select__wrapper) {
  min-height: 32px;
  border-radius: 6px;
}

.tunnel-create-drawer :deep(.el-form-item.is-error .el-input__wrapper),
.tunnel-create-drawer :deep(.el-form-item.is-error .el-input-number__wrapper),
.tunnel-create-drawer :deep(.el-form-item.is-error .el-select__wrapper) {
  box-shadow: 0 0 0 1px var(--el-color-danger) inset;
}

.tunnel-create-drawer :deep(.el-input-number) {
  width: 100%;
}

.tunnel-create-drawer :deep(.el-input__inner) {
  font-size: 13px;
}

.tunnel-create-drawer :deep([data-field-name='port']) {
  max-width: 148px;
}

.tunnel-create-drawer :deep([data-field-name='port'] .el-input__inner) {
  text-align: left;
}

.tunnel-create-drawer :deep(.el-form-item__label-wrap) {
  margin-right: 0 !important;
}
</style>

<style>
.tunnel-create-drawer-client-dropdown {
  max-width: 430px;
}

.tunnel-create-drawer-client-dropdown .el-select-dropdown__item,
.tunnel-create-drawer-client-dropdown .el-select-dropdown__option-item {
  padding-right: 12px;
  padding-left: 12px;
  line-height: 34px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
