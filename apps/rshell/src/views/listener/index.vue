<script setup lang="ts">
import type { ListenerListResult, ListenerRecord, ListenerUpsertPayload } from '#/api';

import { computed, nextTick, ref } from 'vue';
import { IconifyIcon } from '@vben/icons';
import {
  confirm,
  useVbenDrawer,
  VbenButton,
} from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  addListenerApi,
  editListenerApi,
  deleteListenerApi,
  deleteListenerListApi,
  getListenerListApi,
  getMockListenerList,
  startListenerApi,
  stopListenerApi,
} from '#/api';
import { $t } from '#/locales';

import '../_shared/management-page.css';
import ManagementTableTools from '../_shared/management-table-tools.vue';
import ManagementToolbar from '../_shared/management-toolbar.vue';

import {
  createListenerGridOptions,
  type ListenerActionType,
} from './listener-table';
import ListenerCommandDrawer from './listener-command-drawer.vue';
import ListenerCreateDrawer from './listener-create-drawer.vue';

defineOptions({ name: 'Listener' });

const LISTENER_REQUEST_TIMEOUT = 1500;
type GridDensity = 'medium' | 'mini' | 'small';
const batchSelectionEnabled = ref(false);
const selectedRows = ref<ListenerRecord[]>([]);
const gridDensity = ref<GridDensity>('small');
const listenerDrawerRef = ref<{
  reset: () => Promise<void>;
  setValues: (record: ListenerRecord) => Promise<void>;
  submit: () => Promise<ListenerUpsertPayload | null>;
} | null>(null);
const commandDrawerRef = ref<{
  setListener: (record: ListenerRecord) => void;
} | null>(null);
const drawerMode = ref<'create' | 'edit'>('create');

const selectedCount = computed(() => selectedRows.value.length);
const hasSelection = computed(() => selectedCount.value > 0);
const batchDeleteIds = computed(() => selectedRows.value.map((item) => item.Id));

function getGridOptions(showCheckboxColumn = batchSelectionEnabled.value) {
  return createListenerGridOptions({
    getListenerResult,
    onAction: handleRowAction,
    showCheckboxColumn,
    size: gridDensity.value,
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
    case 'edit': {
      await handleOpenEditDrawer(row);
      return;
    }
    case 'command': {
      await handleOpenCommandDrawer(row);
      return;
    }
    default: {
      return;
    }
  }
}

async function handleDrawerConfirm() {
  const payload = await listenerDrawerRef.value?.submit();
  if (!payload) {
    return;
  }

  listenerDrawerApi.lock();
  try {
    if (drawerMode.value === 'edit') {
      await editListenerApi(payload);
      ElMessage.success($t('page.listener.messages.editSuccess'));
    } else {
      await addListenerApi(payload);
      ElMessage.success($t('page.listener.messages.addSuccess'));
    }
    listenerDrawerApi.close();
    await gridApi.reload();
    syncSelectedRows();
  } catch {
  } finally {
    listenerDrawerApi.unlock();
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
  gridClass: 'listener-grid management-grid',
  gridEvents: {
    checkboxAll: syncSelectedRows,
    checkboxChange: syncSelectedRows,
  },
  gridOptions: getGridOptions(false),
});

const [ListenerDrawer, listenerDrawerApi] = useVbenDrawer({
  confirmText: $t('page.listener.drawer.create'),
  destroyOnClose: true,
  onConfirm: handleDrawerConfirm,
  placement: 'right',
  title: $t('page.listener.drawer.title'),
});

const [CommandDrawer, commandDrawerApi] = useVbenDrawer({
  destroyOnClose: true,
  footer: false,
  placement: 'right',
  showCancelButton: false,
  showConfirmButton: false,
  title: $t('page.listener.commandDrawer.title'),
});

function handleDensityChange(size: GridDensity) {
  gridDensity.value = size;
  gridApi.setGridOptions({
    size,
  });
}

function handleOpenColumnSettings() {
  const table = gridApi.grid as any;
  void table?.openCustom?.();
}

function handleBatchSelect() {
  if (batchSelectionEnabled.value) {
    exitBatchSelectionMode();
    return;
  }

  batchSelectionEnabled.value = true;
  gridApi.setGridOptions({
    columns: getGridOptions(true).columns,
  });
}

async function handleOpenCreateDrawer() {
  drawerMode.value = 'create';
  listenerDrawerApi.setState({
    confirmText: $t('page.listener.drawer.create'),
    title: $t('page.listener.drawer.title'),
  });
  listenerDrawerApi.open();
  await nextTick();
  await listenerDrawerRef.value?.reset?.();
}

async function handleOpenEditDrawer(record: ListenerRecord) {
  drawerMode.value = 'edit';
  listenerDrawerApi.setState({
    confirmText: $t('page.listener.drawer.update'),
    title: $t('page.listener.drawer.editTitle'),
  });
  listenerDrawerApi.open();
  await nextTick();
  await listenerDrawerRef.value?.setValues?.(record);
}

async function handleOpenCommandDrawer(record: ListenerRecord) {
  commandDrawerApi.setState({
    title: $t('page.listener.commandDrawer.title'),
  });
  commandDrawerApi.open();
  await nextTick();
  commandDrawerRef.value?.setListener(record);
}

function handleClearSelection() {
  const table = gridApi.grid as any;
  table?.clearCheckboxRow?.();
  syncSelectedRows();
}

function exitBatchSelectionMode() {
  const table = gridApi.grid as any;
  table?.clearCheckboxRow?.();
  selectedRows.value = [];
  batchSelectionEnabled.value = false;
  gridApi.setGridOptions({
    columns: getGridOptions(false).columns,
  });
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
    exitBatchSelectionMode();
    await gridApi.reload();
  } catch {}
}

function syncSelectedRows() {
  const table = gridApi.grid as any;
  selectedRows.value = table?.getCheckboxRecords?.() ?? [];
}
</script>

<template>
  <div class="listener-page management-page">
    <h1 class="listener-title management-page__title">{{ $t('page.listener.title') }}</h1>

    <div class="listener-panel management-page__panel">
      <ListenerDrawer>
        <ListenerCreateDrawer ref="listenerDrawerRef" />
      </ListenerDrawer>

      <CommandDrawer>
        <ListenerCommandDrawer ref="commandDrawerRef" />
      </CommandDrawer>

      <ManagementToolbar>
        <template #actions>
          <div
            v-if="batchSelectionEnabled && hasSelection"
            class="management-page__selection-info"
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
        </template>

        <template #tools>
          <ManagementTableTools
            :columns-title="$t('page.listener.tools.columns')"
            :density="gridDensity"
            :density-compact-text="$t('page.listener.tools.densityCompact')"
            :density-comfortable-text="$t('page.listener.tools.densityComfortable')"
            :density-default-text="$t('page.listener.tools.densityDefault')"
            :density-title="$t('page.listener.tools.density')"
            dropdown-class="listener-toolbar-dropdown-menu"
            :refresh-title="$t('page.listener.tools.refresh')"
            @columns="handleOpenColumnSettings"
            @density-change="handleDensityChange"
            @refresh="gridApi.reload()"
          >
            <template #primary>
              <VbenButton @click="handleOpenCreateDrawer">
                <IconifyIcon icon="ant-design:plus-outlined" />
                <span>{{ $t('page.listener.add') }}</span>
              </VbenButton>
            </template>
          </ManagementTableTools>
        </template>
      </ManagementToolbar>

      <div class="listener-table-card management-page__card management-page__table-card">
        <Grid />
      </div>
    </div>
  </div>
</template>

<style scoped>
.listener-panel
  :deep(.listener-grid__header-cell.col--ellipsis .vxe-cell--title) {
  cursor: help;
}

.listener-panel :deep(.col--ellipsis) {
  cursor: help;
}

@media (max-width: 1200px) {
  .management-page__toolbar-actions,
  .management-page__toolbar-tools {
    flex-wrap: wrap;
  }
}
</style>

<style>
.listener-toolbar-dropdown-menu {
  min-width: 116px;
}

.listener-toolbar-dropdown-menu .el-dropdown-menu__item.is-active {
  color: var(--el-color-primary);
  font-weight: 600;
}
</style>
