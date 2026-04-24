<script setup lang="ts">
import type {
  DllTarget,
  EbpfMode,
  EbpfTarget,
  ListenMode,
  StageTarget,
} from '../generator.shared';

import { onMounted, ref } from 'vue';

import { VbenButton } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { ElInput, ElMessage, ElSwitch, ElTooltip } from 'element-plus';

import GeneratorPanelShell from './generator-panel-shell.vue';
import { ensureSecretPair } from '../generator.shared';
import { $t } from '#/locales';

interface Props {
  compactTargets?: boolean;
  i18nKey: 'dllListen' | 'ebpfListen' | 'listen';
  modeOptions: Array<EbpfMode | ListenMode>;
  showHostPort?: boolean;
  showLoaderButton?: boolean;
  targetOptions: Array<DllTarget | EbpfTarget | StageTarget>;
}

const props = withDefaults(defineProps<Props>(), {
  compactTargets: false,
  showHostPort: false,
  showLoaderButton: false,
});

const target = ref<DllTarget | EbpfTarget | StageTarget>(
  props.targetOptions[0] ?? 'windows_amd64',
);
const mode = ref<EbpfMode | ListenMode>(props.modeOptions[0] ?? 'tcp');
const host = ref('0.0.0.0');
const port = ref('80');
const vkey = ref('');
const encryptSalt = ref('');
const upx = ref(true);

function ensureSecrets() {
  ensureSecretPair(vkey, encryptSalt);
}

function handleLoader() {
  ensureSecrets();
  ElMessage.info($t(`page.generator.${props.i18nKey}.pendingLoader`));
}

function handleGenerate() {
  ensureSecrets();
  ElMessage.info(
    $t(
      `page.generator.${props.i18nKey}.${props.showLoaderButton ? 'pendingGenerate' : 'pending'}`,
    ),
  );
}

onMounted(() => {
  ensureSecrets();
});
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
        {{ $t(`page.generator.${props.i18nKey}.fields.mode`) }}
      </div>
      <div class="generator-targets generator-targets--compact">
        <button
          v-for="item in props.modeOptions"
          :key="item"
          :class="[
            'generator-target',
            'generator-target--compact',
            { 'generator-target--active': mode === item },
          ]"
          type="button"
          @click="mode = item"
        >
          {{ $t(`page.generator.${props.i18nKey}.modeOptions.${item}`) }}
        </button>
      </div>
    </div>

    <template v-if="props.showHostPort">
      <div class="generator-form-row">
        <div class="generator-form-label generator-form-label--required">
          {{ $t(`page.generator.${props.i18nKey}.fields.listenHost`) }}
        </div>
        <div class="generator-form-control generator-form-control--narrow">
          <ElInput v-model="host" class="generator-input" clearable />
        </div>
      </div>

      <div class="generator-form-row">
        <div class="generator-form-label generator-form-label--required">
          {{ $t(`page.generator.${props.i18nKey}.fields.listenPort`) }}
        </div>
        <div class="generator-form-control generator-form-control--tiny">
          <ElInput v-model="port" class="generator-input" />
        </div>
      </div>
    </template>

    <div class="generator-form-row">
      <div class="generator-form-label generator-form-label--required generator-form-label--with-icon">
        <span>{{ $t(`page.generator.${props.i18nKey}.fields.key`) }}</span>
        <ElTooltip
          :content="$t(`page.generator.${props.i18nKey}.fields.keyTip`)"
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
      <div class="generator-form-control generator-form-control--small">
        <ElInput
          v-model="vkey"
          class="generator-input"
          clearable
          show-password
        />
      </div>
    </div>

    <div class="generator-form-row">
      <div class="generator-form-label generator-form-label--required">
        {{ $t(`page.generator.${props.i18nKey}.fields.encryptSalt`) }}
      </div>
      <div class="generator-form-control generator-form-control--small">
        <ElInput
          v-model="encryptSalt"
          class="generator-input"
          clearable
          show-password
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
