<script setup lang="ts">
import { computed, ref } from 'vue';

import { ElDialog, ElMessage } from 'element-plus';

import { VbenButton } from '@vben/common-ui';

import { $t } from '#/locales';

defineOptions({ name: 'FileUploadModal' });

type UploadRowStatus = 'error' | 'pending' | 'success' | 'uploading';

interface UploadRow {
  file: File;
  id: string;
  path: string;
  progress: number;
  status: UploadRowStatus;
}

interface UploadSubmitContext {
  file: File;
  files: File[];
  index: number;
  setProgress: (value: number) => void;
  setStatus: (status: UploadRowStatus) => void;
}

const props = withDefaults(
  defineProps<{
    accept?: string;
    hint: string;
    maxCount?: number;
    maxSizeMb?: number;
    submitText?: string;
    title: string;
    onSubmit?: (context: UploadSubmitContext) => boolean | void | Promise<boolean | void>;
  }>(),
  {
    accept: '',
    maxCount: 6,
    maxSizeMb: 500,
    submitText: '',
  },
);

const visible = ref(false);
const fileRows = ref<UploadRow[]>([]);
const submitting = ref(false);
const fileInputRef = ref<HTMLInputElement>();

const resolvedSubmitText = computed(() => props.submitText || $t('page.uploadDialog.actions.start'));
const canSubmit = computed(
  () => !submitting.value && fileRows.value.some((item) => item.status !== 'success'),
);

function open() {
  visible.value = true;
}

function close() {
  visible.value = false;
}

function reset() {
  fileRows.value = [];
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
}

function formatSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function handlePickFiles() {
  fileInputRef.value?.click();
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = Array.from(target.files ?? []);
  if (!files.length) {
    return;
  }

  const remain = props.maxCount - fileRows.value.length;
  if (remain <= 0) {
    ElMessage.warning($t('page.uploadDialog.messages.maxCount', [String(props.maxCount)]));
    target.value = '';
    return;
  }

  const appendRows: UploadRow[] = [];
  for (const file of files.slice(0, remain)) {
    if (file.size > props.maxSizeMb * 1024 * 1024) {
      ElMessage.warning($t('page.uploadDialog.messages.maxSize', [file.name, String(props.maxSizeMb)]));
      continue;
    }

    const duplicated = fileRows.value.some(
      (item) => item.file.name === file.name && item.file.size === file.size,
    );
    if (duplicated) {
      continue;
    }

    appendRows.push({
      file,
      id: `${file.name}-${file.size}-${file.lastModified}`,
      path: file.webkitRelativePath || '-',
      progress: 0,
      status: 'pending',
    });
  }

  fileRows.value = [...fileRows.value, ...appendRows];
  target.value = '';
}

function handleRemove(id: string) {
  fileRows.value = fileRows.value.filter((item) => item.id !== id);
}

function updateRow(id: string, patch: Partial<UploadRow>) {
  fileRows.value = fileRows.value.map((item) => (item.id === id ? { ...item, ...patch } : item));
}

function getStatusLabel(item: UploadRow) {
  switch (item.status) {
    case 'uploading': {
      return `${$t('page.uploadDialog.status.uploading')} ${item.progress}%`;
    }
    case 'success': {
      return `${$t('page.uploadDialog.status.success')} ${item.progress}%`;
    }
    case 'error': {
      return $t('page.uploadDialog.status.error');
    }
    default: {
      return $t('page.uploadDialog.status.pending');
    }
  }
}

async function handleSubmit() {
  if (!canSubmit.value) {
    return;
  }

  submitting.value = true;
  const files = fileRows.value.map((item) => item.file);

  try {
    for (const [index, row] of fileRows.value.entries()) {
      if (row.status === 'success') {
        continue;
      }

      updateRow(row.id, { progress: 0, status: 'uploading' });

      try {
        await props.onSubmit?.({
          file: row.file,
          files,
          index,
          setProgress(value) {
            const progress = Math.max(0, Math.min(100, Math.round(value)));
            updateRow(row.id, { progress, status: progress >= 100 ? 'success' : 'uploading' });
          },
          setStatus(status) {
            updateRow(row.id, { status, progress: status === 'success' ? 100 : row.progress });
          },
        });

        const latest = fileRows.value.find((item) => item.id === row.id);
        if (latest && latest.status === 'uploading') {
          updateRow(row.id, { progress: 100, status: 'success' });
        }
      } catch {
        updateRow(row.id, { status: 'error' });
      }
    }
  } finally {
    submitting.value = false;
  }
}

function handleClosed() {
  reset();
}

defineExpose({
  close,
  open,
  reset,
});
</script>

<template>
  <ElDialog
    v-model="visible"
    :append-to-body="true"
    :close-on-click-modal="false"
    :show-close="true"
    class="file-upload-modal"
    destroy-on-close
    width="760px"
    @closed="handleClosed"
  >
    <template #header>
      <div class="file-upload-modal__header">
        <span class="file-upload-modal__title">{{ title }}</span>
      </div>
    </template>

    <div class="file-upload-modal__content">
      <div class="file-upload-modal__hint-row">
        <div class="file-upload-modal__hint">
          <span class="file-upload-modal__hint-icon">i</span>
          <span>{{ hint }}</span>
        </div>
        <VbenButton @click="handlePickFiles">
          {{ $t('page.uploadDialog.actions.pick') }}
        </VbenButton>
      </div>

      <input
        ref="fileInputRef"
        :accept="accept"
        class="file-upload-modal__input"
        multiple
        type="file"
        @change="handleFileChange"
      />

      <div class="file-upload-modal__table-wrap">
        <table class="file-upload-modal__table">
          <thead>
            <tr>
              <th>{{ $t('page.uploadDialog.columns.path') }}</th>
              <th>{{ $t('page.uploadDialog.columns.name') }}</th>
              <th>{{ $t('page.uploadDialog.columns.size') }}</th>
              <th>{{ $t('page.uploadDialog.columns.status') }}</th>
              <th>{{ $t('page.uploadDialog.columns.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="fileRows.length === 0">
              <td class="file-upload-modal__empty" colspan="5"></td>
            </tr>
            <tr v-for="item in fileRows" :key="item.id">
              <td :title="item.path">{{ item.path }}</td>
              <td :title="item.file.name">{{ item.file.name }}</td>
              <td>{{ formatSize(item.file.size) }}</td>
              <td>
                <div class="file-upload-modal__status-cell">
                  <span
                    class="file-upload-modal__status-text"
                    :class="`is-${item.status}`"
                  >
                    {{ getStatusLabel(item) }}
                  </span>
                  <div v-if="item.status === 'uploading' || item.status === 'success'" class="file-upload-modal__progress-track">
                    <span class="file-upload-modal__progress-bar" :style="{ width: `${item.progress}%` }"></span>
                  </div>
                </div>
              </td>
              <td>
                <button
                  class="file-upload-modal__remove"
                  type="button"
                  :disabled="submitting"
                  @click="handleRemove(item.id)"
                >
                  {{ $t('page.uploadDialog.actions.remove') }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <template #footer>
      <div class="file-upload-modal__footer">
        <VbenButton variant="ghost" @click="close">
          {{ $t('page.uploadDialog.actions.close') }}
        </VbenButton>
        <VbenButton :disabled="!canSubmit" :loading="submitting" @click="handleSubmit">
          {{ resolvedSubmitText }}
        </VbenButton>
      </div>
    </template>
  </ElDialog>
</template>

<style scoped>
:deep(.file-upload-modal .el-dialog) {
  overflow: hidden;
  background: var(--el-bg-color-overlay);
  border-radius: 12px;
  box-shadow: 0 18px 48px rgb(0 0 0 / 22%);
}

:deep(.file-upload-modal .el-dialog__header) {
  margin: 0;
  padding: 18px 20px 14px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

:deep(.file-upload-modal .el-dialog__headerbtn) {
  top: 20px;
  right: 18px;
}

:deep(.file-upload-modal .el-dialog__close) {
  color: var(--el-text-color-placeholder);
  font-size: 18px;
}

:deep(.file-upload-modal .el-dialog__close:hover) {
  color: var(--el-text-color-regular);
}

:deep(.file-upload-modal .el-dialog__body) {
  padding: 18px 12px 16px;
}

:deep(.file-upload-modal .el-dialog__footer) {
  padding: 0 12px 12px;
}

.file-upload-modal__header {
  display: flex;
  align-items: center;
  min-height: 42px;
}

.file-upload-modal__title {
  color: var(--el-text-color-primary);
  font-size: 18px;
  font-weight: 600;
  line-height: 1.2;
}

.file-upload-modal__content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.file-upload-modal__hint-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 2px;
}

.file-upload-modal__hint {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  flex: 1;
  padding: 0 12px;
  color: var(--el-text-color-primary);
  background: color-mix(in srgb, var(--el-color-primary-light-9) 88%, var(--el-bg-color-overlay) 12%);
  border-radius: 0;
  font-size: 14px;
  line-height: 1.4;
  border: 1px solid color-mix(in srgb, var(--el-color-primary-light-7) 78%, transparent);
}

.file-upload-modal__hint-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: #fff;
  background: #1677ff;
  border-radius: 50%;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
}

.file-upload-modal__input {
  display: none;
}

.file-upload-modal__table-wrap {
  min-height: 230px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 0 0 6px 6px;
  overflow: hidden;
  background: var(--el-bg-color);
}

.file-upload-modal__table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.file-upload-modal__table th,
.file-upload-modal__table td {
  padding: 11px 12px;
  text-align: left;
  color: var(--el-text-color-regular);
  border-bottom: 1px solid var(--el-border-color-lighter);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
}

.file-upload-modal__table th {
  color: var(--el-text-color-primary);
  background: var(--el-fill-color-light);
  font-weight: 600;
  border-right: 1px solid var(--el-border-color-lighter);
}

.file-upload-modal__table th:last-child {
  border-right: none;
}

.file-upload-modal__empty {
  height: 142px;
  text-align: center !important;
  padding: 0 !important;
  background: var(--el-bg-color);
}

.file-upload-modal__status-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.file-upload-modal__status-text.is-error {
  color: var(--el-color-danger);
}

.file-upload-modal__status-text.is-success {
  color: var(--el-color-success);
}

.file-upload-modal__status-text.is-uploading {
  color: var(--el-color-primary);
}

.file-upload-modal__progress-track {
  width: 100%;
  height: 4px;
  background: var(--el-fill-color-light);
  border-radius: 999px;
  overflow: hidden;
}

.file-upload-modal__progress-bar {
  display: block;
  height: 100%;
  background: var(--el-color-primary);
  border-radius: inherit;
  transition: width 0.2s ease;
}

.file-upload-modal__remove {
  padding: 0;
  color: var(--el-color-danger);
  background: transparent;
  border: none;
  cursor: pointer;
}

.file-upload-modal__remove:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.file-upload-modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 2px;
}
</style>
