<script setup lang="ts">
import type {
  DllTarget,
  GeneratorListenerOption,
  StageTarget,
} from '../generator.shared';

import { computed, ref } from 'vue';

import { VbenButton } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { ElInput, ElMessage, ElOption, ElSelect, ElSwitch, ElTooltip } from 'element-plus';

import GeneratorPanelShell from './generator-panel-shell.vue';
import { $t } from '#/locales';

interface Props {
  compactTargets?: boolean;
  i18nKey: 'dllStageless' | 'stageless';
  listenerOptions: GeneratorListenerOption[];
  loadingListeners: boolean;
  showLoaderButton?: boolean;
  targetOptions: Array<DllTarget | StageTarget>;
}

const props = withDefaults(defineProps<Props>(), {
  compactTargets: false,
  showLoaderButton: false,
});

const target = ref<DllTarget | StageTarget>(
  props.targetOptions[0] ?? 'windows_amd64',
);
const listenerId = ref<number>();
const proxy = ref('');
const upx = ref(true);
const submitted = ref(false);

const showListenerError = computed(() => submitted.value && !listenerId.value);

function handleLoader() {
  submitted.value = true;
  if (!listenerId.value) {
    ElMessage.warning($t(`page.generator.${props.i18nKey}.validation.listenerRequired`));
    return;
  }
  ElMessage.info($t(`page.generator.${props.i18nKey}.pendingLoader`));
}

function handleGenerate() {
  submitted.value = true;
  if (!listenerId.value) {
    ElMessage.warning($t(`page.generator.${props.i18nKey}.validation.listenerRequired`));
    return;
  }
  ElMessage.info(
    $t(
      `page.generator.${props.i18nKey}.${props.showLoaderButton ? 'pendingGenerate' : 'pending'}`,
    ),
  );
}
</script>

<template>
  <GeneratorPanelShell
    :description="$t(`page.generator.${props.i18nKey}.description`)"
    :title="$t(`page.generator.${props.i18nKey}.title`)"
  >
    <div class="generator-form-row">
      <div class="generator-form-label generator-form-label--required">
        {{ $t(`page.generator.${props.i18nKey}.fields.target`) }}
      </div>
      <div :class="['generator-targets', { 'generator-targets--compact': props.compactTargets }]">
        <button
          v-for="item in props.targetOptions"
          :key="item"
          :class="[
            'generator-target',
            { 'generator-target--compact': props.compactTargets },
            { 'generator-target--active': target === item },
          ]"
          type="button"
          @click="target = item"
        >
          {{ item }}
        </button>
      </div>
    </div>

    <div class="generator-form-row">
      <div class="generator-form-label generator-form-label--required">
        {{ $t(`page.generator.${props.i18nKey}.fields.listener`) }}
      </div>
      <div class="generator-form-control">
        <ElSelect
          v-model="listenerId"
          :class="['generator-select', { 'generator-select--error': showListenerError }]"
          :loading="props.loadingListeners"
          :placeholder="$t(`page.generator.${props.i18nKey}.placeholder.listener`)"
          clearable
        >
          <ElOption
            v-for="option in props.listenerOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </ElSelect>
        <p v-if="showListenerError" class="generator-error-text">
          {{ $t(`page.generator.${props.i18nKey}.validation.listenerRequired`) }}
        </p>
      </div>
    </div>

    <div class="generator-form-row">
      <div class="generator-form-label generator-form-label--with-icon">
        <span>{{ $t(`page.generator.${props.i18nKey}.fields.proxy`) }}</span>
        <ElTooltip
          :content="$t(`page.generator.${props.i18nKey}.fields.proxyTip`)"
          effect="dark"
          placement="top"
          popper-class="generator-proxy-tooltip"
        >
          <IconifyIcon
            class="generator-info-icon"
            icon="ant-design:info-circle-outlined"
          />
        </ElTooltip>
      </div>
      <div class="generator-form-control generator-form-control--proxy">
        <ElInput
          v-model="proxy"
          :placeholder="$t(`page.generator.${props.i18nKey}.placeholder.proxy`)"
          class="generator-input"
          clearable
        />
      </div>
    </div>

    <div class="generator-form-row generator-form-row--switch">
      <div class="generator-form-label">
        {{ $t(`page.generator.${props.i18nKey}.fields.upx`) }}
      </div>
      <div class="generator-switch-wrap">
        <ElSwitch v-model="upx" />
      </div>
    </div>

    <div :class="['generator-actions', { 'generator-actions--split': props.showLoaderButton }]">
      <VbenButton
        v-if="props.showLoaderButton"
        class="generator-submit generator-submit--secondary"
        variant="outline"
        @click="handleLoader"
      >
        <IconifyIcon icon="ant-design:download-outlined" />
        <span>{{ $t(`page.generator.${props.i18nKey}.actions.loader`) }}</span>
      </VbenButton>

      <VbenButton class="generator-submit" @click="handleGenerate">
        <IconifyIcon icon="ant-design:download-outlined" />
        <span>{{ $t(`page.generator.${props.i18nKey}.actions.generate`) }}</span>
      </VbenButton>
    </div>
  </GeneratorPanelShell>
</template>
