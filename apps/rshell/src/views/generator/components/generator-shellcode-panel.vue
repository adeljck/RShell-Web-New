<script setup lang="ts">
import type {
  GeneratorListenerOption,
  ShellcodeFormat,
  ShellcodeTarget,
} from '../generator.shared';

import { computed, ref } from 'vue';

import { VbenButton } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { ElMessage, ElOption, ElSelect } from 'element-plus';

import GeneratorPanelShell from './generator-panel-shell.vue';
import { shellcodeFormats, shellcodeTargets } from '../generator.shared';
import { $t } from '#/locales';

const props = defineProps<{
  listenerOptions: GeneratorListenerOption[];
  loadingListeners: boolean;
}>();

const target = ref<ShellcodeTarget>('windows_amd64');
const listenerId = ref<number>();
const format = ref<ShellcodeFormat>('bin');
const submitted = ref(false);

const showListenerError = computed(() => submitted.value && !listenerId.value);

function handleGenerate() {
  submitted.value = true;
  if (!listenerId.value) {
    ElMessage.warning($t('page.generator.shellcode.validation.listenerRequired'));
    return;
  }
  ElMessage.info($t('page.generator.shellcode.pending'));
}
</script>

<template>
  <GeneratorPanelShell
    :description="$t('page.generator.shellcode.description')"
    :title="$t('page.generator.shellcode.title')"
  >
    <div class="generator-form-row">
      <div class="generator-form-label generator-form-label--required">
        {{ $t('page.generator.shellcode.fields.target') }}
      </div>
      <div class="generator-targets generator-targets--compact">
        <button
          v-for="item in shellcodeTargets"
          :key="item"
          :class="[
            'generator-target',
            'generator-target--compact',
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
        {{ $t('page.generator.shellcode.fields.listener') }}
      </div>
      <div class="generator-form-control">
        <ElSelect
          v-model="listenerId"
          :class="['generator-select', { 'generator-select--error': showListenerError }]"
          :loading="props.loadingListeners"
          :placeholder="$t('page.generator.shellcode.placeholder.listener')"
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
          {{ $t('page.generator.shellcode.validation.listenerRequired') }}
        </p>
      </div>
    </div>

    <div class="generator-form-row">
      <div class="generator-form-label generator-form-label--required">
        {{ $t('page.generator.shellcode.fields.format') }}
      </div>
      <div class="generator-targets generator-targets--compact">
        <button
          v-for="item in shellcodeFormats"
          :key="item"
          :class="[
            'generator-target',
            'generator-target--tiny',
            { 'generator-target--active': format === item },
          ]"
          type="button"
          @click="format = item"
        >
          {{ item }}
        </button>
      </div>
    </div>

    <div class="generator-actions">
      <VbenButton class="generator-submit" @click="handleGenerate">
        <IconifyIcon icon="ant-design:download-outlined" />
        <span>{{ $t('page.generator.shellcode.actions.generate') }}</span>
      </VbenButton>
    </div>
  </GeneratorPanelShell>
</template>
