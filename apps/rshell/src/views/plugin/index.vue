<script setup lang="ts">
import type { ClientListRecord, PluginRunnerRecord } from '#/api';

import { computed, onMounted, ref } from 'vue';

import { ElInput, ElOption, ElSelect } from 'element-plus';

import { VbenButton } from '@vben/common-ui';

import { getPluginClientOptionsApi, getPluginRunnerListApi, uploadPluginFileApi } from '#/api';
import { $t } from '#/locales';

import FileUploadModal from '../_shared/file-upload-modal.vue';
import { decorateSelectOptionTitles, formatClientDisplayLabel } from '../_shared/client-display';
import '../_shared/workspace-page.css';

defineOptions({ name: 'Plugin' });

const loadingClients = ref(false);
const loadingPlugins = ref(false);
const clientId = ref<number | null>(null);
const pluginId = ref<number | null>(null);
const params = ref('');
const output = ref('');
const clientOptions = ref<ClientListRecord[]>([]);
const pluginOptions = ref<PluginRunnerRecord[]>([]);
const uploadModalRef = ref<InstanceType<typeof FileUploadModal>>();

const selectedPlugin = computed(() =>
  pluginOptions.value.find((item) => item.id === pluginId.value)?.name ?? '',
);

async function loadClients() {
  loadingClients.value = true;
  try {
    const result = await getPluginClientOptionsApi();
    clientOptions.value = result.items;
  } finally {
    loadingClients.value = false;
  }
}

async function loadPlugins() {
  loadingPlugins.value = true;
  try {
    pluginOptions.value = await getPluginRunnerListApi();
  } finally {
    loadingPlugins.value = false;
  }
}

function handleClientVisibleChange(visible: boolean) {
  if (!visible) return;
  decorateSelectOptionTitles('.plugin-page__client-dropdown');
}

function handleRun() {
  output.value = `${$t('page.plugin.outputPrefix')}: ${selectedPlugin.value || '-'}
${$t('page.plugin.pending.run')}`;
}

function handleUpload() {
  uploadModalRef.value?.open();
}

async function handleUploadSubmit({ file, setProgress }: {
  file: File;
  setProgress: (value: number) => void;
}) {
  output.value = `${$t('page.plugin.outputPrefix')}: ${file.name}
${$t('page.plugin.pending.upload')}`;

  await uploadPluginFileApi(file, setProgress);
  output.value += `
${file.name} ${$t('page.plugin.pending.uploadSuccess')}`;
  await loadPlugins();

  return true;
}

onMounted(async () => {
  await Promise.all([loadClients(), loadPlugins()]);
});
</script>

<template>
  <div class="plugin-page workspace-page">
    <div class="workspace-page__header">
      <h2 class="workspace-page__title">{{ $t('page.plugin.title') }}</h2>
      <p class="workspace-page__description">{{ $t('page.plugin.description') }}</p>
    </div>

    <section class="workspace-page__surface">
      <div class="workspace-page__section">
        <div class="workspace-page__field-row workspace-page__field-row--required">
          <label class="workspace-page__field-label">{{ $t('page.plugin.fields.clientId') }}</label>
          <div class="workspace-page__field-control">
            <ElSelect
              v-model="clientId"
              :loading="loadingClients"
              :placeholder="$t('page.plugin.selectPlaceholder')"
              class="workspace-page__field-select"
              popper-class="plugin-page__client-dropdown"
              @visible-change="handleClientVisibleChange"
            >
              <ElOption
                v-for="item in clientOptions"
                :key="item.Id"
                :label="formatClientDisplayLabel(item)"
                :value="item.Id"
              />
            </ElSelect>
          </div>
        </div>

        <div class="workspace-page__field-row workspace-page__field-row--required">
          <label class="workspace-page__field-label">{{ $t('page.plugin.fields.pluginId') }}</label>
          <div class="workspace-page__field-control">
            <ElSelect
              v-model="pluginId"
              :loading="loadingPlugins"
              :placeholder="$t('page.plugin.selectPlaceholder')"
              class="workspace-page__field-select"
            >
              <ElOption
                v-for="item in pluginOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </ElSelect>
          </div>
        </div>

        <div class="workspace-page__field-row">
          <label class="workspace-page__field-label">{{ $t('page.plugin.fields.params') }}</label>
          <div class="workspace-page__field-control">
            <ElInput
              v-model="params"
              :placeholder="$t('page.plugin.placeholder')"
              class="workspace-page__field-input"
            />
          </div>
        </div>

        <div class="plugin-page__output-wrap workspace-page__field-control--wide">
          <textarea
            v-model="output"
            class="plugin-page__output"
            :placeholder="$t('page.plugin.outputPlaceholder')"
            readonly
          />
        </div>

        <div class="workspace-page__actions">
          <VbenButton @click="handleRun">
            {{ $t('page.plugin.actions.run') }}
          </VbenButton>
          <VbenButton variant="outline" @click="handleUpload">
            {{ $t('page.plugin.actions.upload') }}
          </VbenButton>
        </div>
      </div>
    </section>

    <FileUploadModal
      ref="uploadModalRef"
      accept=".exe,.net,.elf,.dll,.so,.dylib"
      :hint="$t('page.plugin.uploadHint')"
      :on-submit="handleUploadSubmit"
      :submit-text="$t('page.uploadDialog.actions.start')"
      :title="$t('page.plugin.uploadTitle')"
    />
  </div>
</template>

<style scoped>
.plugin-page__output-wrap {
  margin: 22px 0 20px 140px;
}

.plugin-page__output {
  width: 100%;
  min-height: 560px;
  padding: 10px 12px;
  color: var(--el-text-color-primary);
  background: transparent;
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  resize: vertical;
  outline: none;
  font-size: 13px;
  line-height: 1.6;
}

.plugin-page__output::placeholder {
  color: var(--el-text-color-placeholder);
}
</style>

<style>
.plugin-page__client-dropdown .el-select-dropdown__item {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
