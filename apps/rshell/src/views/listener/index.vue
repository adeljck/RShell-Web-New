<script setup lang="ts">
import type { ListenerAddPayload, ListenerListResult, ListenerRecord } from '#/api';

import { computed, ref } from 'vue';
import { IconifyIcon } from '@vben/icons';
import {
  confirm,
  useVbenDrawer,
  VbenButton,
  VbenIconButton,
} from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  addListenerApi,
  deleteListenerApi,
  deleteListenerListApi,
  getListenerListApi,
  getMockListenerList,
  startListenerApi,
  stopListenerApi,
} from '#/api';
import { $t } from '#/locales';

import {
  createListenerGridOptions,
  type ListenerActionType,
} from './listener-table';
import ListenerCreateDrawer from './listener-create-drawer.vue';

defineOptions({ name: 'Listener' });

const LISTENER_REQUEST_TIMEOUT = 1500;
const batchSelectionEnabled = ref(false);
const selectedRows = ref<ListenerRecord[]>([]);
const listenerCreateDrawerRef = ref<{
  reset: () => void;
  submit: () => Promise<ListenerAddPayload | null>;
} | null>(null);

const selectedCount = computed(() => selectedRows.value.length);
const hasSelection = computed(() => selectedCount.value > 0);
const batchDeleteIds = computed(() => selectedRows.value.map((item) => item.Id));

function handlePending(action: string) {
  ElMessage.info(`${action}${$t('page.listener.pending')}`);
}

function getGridOptions(showCheckboxColumn = batchSelectionEnabled.value) {
  return createListenerGridOptions({
    getListenerResult,
    onAction: handleRowAction,
    showCheckboxColumn,
    t: $t,
  });
}

async function handleRowAction(
  action: ListenerActionType,
  row: ListenerRecord,
) {
  switch (action) {
    case 'enable': {
      try {
        await startListenerApi({ id: row.Id });
        ElMessage.success($t('page.listener.messages.startSuccess'));
        await gridApi.reload();
        syncSelectedRows();
      } catch {}
      return;
    }
    case 'disable': {
      try {
        await stopListenerApi({ id: row.Id });
        ElMessage.success($t('page.listener.messages.stopSuccess'));
        await gridApi.reload();
        syncSelectedRows();
      } catch {}
      return;
    }
    case 'delete': {
      try {
        await confirm({
          cancelText: $t('page.listener.confirm.cancel'),
          confirmText: $t('page.listener.confirm.confirm'),
          content: $t('page.listener.confirm.deleteDescription'),
          title: $t('page.listener.confirm.deleteTitle'),
        });
        await deleteListenerApi({ id: row.Id });
        ElMessage.success($t('page.listener.messages.deleteSuccess'));
        await gridApi.reload();
        syncSelectedRows();
      } catch {}
      return;
    }
    default: {
      const actionLabelMap: Record<Exclude<ListenerActionType, 'delete' | 'disable' | 'enable'>, string> = {
        command: $t('page.listener.actions.command'),
        edit: $t('page.listener.actions.edit'),
      };
      handlePending(actionLabelMap[action]);
    }
  }
}

async function handleCreateConfirm() {
  const payload = await listenerCreateDrawerRef.value?.submit();
  if (!payload) {
    return;
  }

  createDrawerApi.lock();
  try {
    await addListenerApi(payload);
    ElMessage.success($t('page.listener.messages.addSuccess'));
    createDrawerApi.close();
    await gridApi.reload();
    syncSelectedRows();
  } catch {
  } finally {
    createDrawerApi.unlock();
  }
}

async function getListenerResult(): Promise<ListenerListResult> {
  try {
    return await Promise.race([
      getListenerListApi(),
      new Promise<ListenerListResult>((_, reject) => {
        setTimeout(() => {
          reject(new Error('listener request timeout'));
        }, LISTENER_REQUEST_TIMEOUT);
      }),
    ]);
  } catch {
    return getMockListenerList();
  }
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridClass: 'listener-grid',
  gridEvents: {
    checkboxAll: syncSelectedRows,
    checkboxChange: syncSelectedRows,
  },
  gridOptions: getGridOptions(false),
});

const [CreateDrawer, createDrawerApi] = useVbenDrawer({
  confirmText: $t('page.listener.drawer.create'),
  destroyOnClose: true,
  onConfirm: handleCreateConfirm,
  placement: 'right',
  title: $t('page.listener.drawer.title'),
});

function handleBatchSelect() {
  const table = gridApi.grid as any;
  if (batchSelectionEnabled.value) {
    table?.clearCheckboxRow?.();
    selectedRows.value = [];
    batchSelectionEnabled.value = false;
    gridApi.setGridOptions({
      columns: getGridOptions(false).columns,
    });
    return;
  }

  batchSelectionEnabled.value = true;
  gridApi.setGridOptions({
    columns: getGridOptions(true).columns,
  });
}

function handleOpenCreateDrawer() {
  listenerCreateDrawerRef.value?.reset?.();
  createDrawerApi.open();
}

function handleClearSelection() {
  const table = gridApi.grid as any;
  table?.clearCheckboxRow?.();
  syncSelectedRows();
}

function handleBatchDelete() {
  if (!hasSelection.value) {
    return;
  }
  handleConfirmBatchDelete();
}

async function handleConfirmBatchDelete() {
  try {
    await confirm({
      cancelText: $t('page.listener.confirm.cancel'),
      confirmText: $t('page.listener.confirm.confirm'),
      content: $t('page.listener.confirm.batchDeleteDescription'),
      title: $t('page.listener.confirm.batchDeleteTitle'),
    });
    await deleteListenerListApi({ id: batchDeleteIds.value });
    ElMessage.success($t('page.listener.messages.deleteSuccess'));
    const table = gridApi.grid as any;
    table?.clearCheckboxRow?.();
    selectedRows.value = [];
    await gridApi.reload();
  } catch {}
}

function syncSelectedRows() {
  const table = gridApi.grid as any;
  selectedRows.value = table?.getCheckboxRecords?.() ?? [];
}
</script>

<template>
  <div class="listener-page">
    <h1 class="listener-title">{{ $t('page.listener.title') }}</h1>

    <div class="listener-panel">
      <CreateDrawer>
        <ListenerCreateDrawer ref="listenerCreateDrawerRef" />
      </CreateDrawer>

      <Grid>
        <template #toolbar-actions>
          <div class="listener-toolbar-actions">
            <div
              v-if="batchSelectionEnabled && hasSelection"
              class="listener-selection-info"
            >
              <IconifyIcon icon="ant-design:info-circle-filled" />
              <span>
                {{ $t('page.listener.selectedPrefix') }}{{ selectedCount
                }}{{ $t('page.listener.selectedSuffix') }}
              </span>
              <VbenButton size="xs" variant="link" @click="handleClearSelection">
                {{ $t('page.listener.clear') }}
              </VbenButton>
            </div>

            <VbenButton variant="outline" @click="handleBatchSelect">
              <IconifyIcon icon="ant-design:select-outlined" />
              <span>{{ $t('page.listener.batchSelect') }}</span>
            </VbenButton>

            <VbenButton
              v-if="batchSelectionEnabled"
              :disabled="!hasSelection"
              variant="destructive"
              @click="handleBatchDelete"
            >
              <IconifyIcon icon="ant-design:delete-outlined" />
              <span>{{ $t('page.listener.batchDelete') }}</span>
            </VbenButton>
          </div>
        </template>

        <template #toolbar-tools>
          <div class="listener-toolbar-tools">
            <VbenIconButton
              :title="$t('page.listener.tools.refresh')"
              @click="gridApi.reload()"
            >
              <IconifyIcon icon="ant-design:redo-outlined" />
            </VbenIconButton>

            <VbenButton @click="handleOpenCreateDrawer">
              <IconifyIcon icon="ant-design:plus-outlined" />
              <span>{{ $t('page.listener.add') }}</span>
            </VbenButton>
          </div>
        </template>
      </Grid>
    </div>
  </div>
</template>

<style scoped>
.listener-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 12px 8px 0;
}

.listener-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.25;
  color: var(--el-text-color-primary);
}

.listener-panel {
  height: calc(100vh - 210px);
  min-height: calc(100vh - 210px);
}

.listener-toolbar-tools {
  display: flex;
  gap: 10px;
  align-items: center;
}

.listener-toolbar-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.listener-selection-info {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 28px;
  padding: 0 10px;
  color: #91caff;
  background: rgb(22 119 255 / 12%);
  border: 1px solid rgb(22 119 255 / 20%);
  border-radius: 6px;
  font-size: 13px;
}

.listener-selection-info :deep(button) {
  min-height: auto;
  padding: 0;
  color: var(--el-color-primary);
}

.listener-panel :deep(.listener-grid) {
  height: 100%;
  min-height: 0;
}

.listener-panel :deep(.vxe-grid) {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding: 14px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
}

.listener-panel :deep(.vxe-grid--toolbar-wrapper) {
  margin-bottom: 8px;
}

.listener-panel :deep(.vxe-grid--table-wrapper) {
  flex: 1;
  min-height: 0;
}

.listener-panel :deep(.vxe-grid--pager-wrapper) {
  padding-top: 12px;
  margin-top: auto;
}

.listener-panel :deep(.vxe-pager) {
  justify-content: flex-end;
}

.listener-panel :deep(.vxe-header--column) {
  font-size: 14px;
  font-weight: 600;
}

.listener-panel :deep(.vxe-body--column) {
  font-size: 14px;
}

.listener-panel
  :deep(.listener-grid__header-cell.col--ellipsis .vxe-cell--title) {
  cursor: help;
}

.listener-panel :deep(.col--ellipsis) {
  cursor: help;
}

@media (max-width: 1200px) {
  .listener-toolbar-actions,
  .listener-toolbar-tools {
    flex-wrap: wrap;
  }

  .listener-toolbar-tools {
    justify-content: flex-end;
  }
}
</style>
