import type { TunnelAddPayload, TunnelListQuery, TunnelListRecord, TunnelListResult, TunnelUpsertPayload } from '#/api';

import type { Ref } from 'vue';

import { computed, nextTick, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { ElMessage } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  addTunnelApi,
  deleteTunnelApi,
  deleteTunnelListApi,
  editTunnelApi,
  getMockTunnelList,
  getTunnelListApi,
  startTunnelApi,
  stopTunnelApi,
} from '#/api';
import { $t } from '#/locales';

import { type TunnelDrawerMode } from './tunnel-shared';
import { createTunnelGridOptions, type TunnelActionType } from './tunnel-table';

const TUNNEL_REQUEST_TIMEOUT = 1500;

export type GridDensity = 'medium' | 'mini' | 'small';

export interface TunnelCreateDrawerRef {
  reset: () => Promise<void>;
  setValues: (record: TunnelListRecord) => Promise<void>;
  submit: () => Promise<TunnelUpsertPayload | null>;
}

export function useTunnelManagement(tunnelDrawerRef: Ref<TunnelCreateDrawerRef | null>) {
  const batchSelectionEnabled = ref(false);
  const selectedRows = ref<TunnelListRecord[]>([]);
  const gridDensity = ref<GridDensity>('small');
  const selectedCount = computed(() => selectedRows.value.length);
  const hasSelection = computed(() => selectedCount.value > 0);
  const batchDeleteIds = computed(() => selectedRows.value.map((item) => item.Id));
  const drawerMode = ref<TunnelDrawerMode>('create');

  function getGridOptions(showCheckboxColumn = batchSelectionEnabled.value) {
    return createTunnelGridOptions({
      getTunnelResult,
      onAction: handleRowAction,
      showCheckboxColumn,
      size: gridDensity.value,
      t: $t,
    });
  }

  async function getTunnelResult(params: TunnelListQuery): Promise<TunnelListResult> {
    try {
      return await Promise.race([
        getTunnelListApi(params),
        new Promise<TunnelListResult>((_, reject) => {
          setTimeout(() => reject(new Error('tunnel request timeout')), TUNNEL_REQUEST_TIMEOUT);
        }),
      ]);
    } catch {
      return getMockTunnelList(params);
    }
  }

  async function handleRowAction(action: TunnelActionType, row: TunnelListRecord) {
    if (action === 'enable') {
      try {
        await startTunnelApi({ id: row.Id });
        ElMessage.success($t('page.tunnel.messages.startSuccess'));
        await gridApi.reload();
        syncSelectedRows();
      } catch {}
      return;
    }

    if (action === 'disable') {
      try {
        await stopTunnelApi({ id: row.Id });
        ElMessage.success($t('page.tunnel.messages.stopSuccess'));
        await gridApi.reload();
        syncSelectedRows();
      } catch {}
      return;
    }

    if (action === 'delete') {
      try {
        await confirm({
          cancelText: $t('page.listener.confirm.cancel'),
          confirmText: $t('page.listener.confirm.confirm'),
          content: $t('page.tunnel.messages.deleteConfirm'),
          title: $t('page.tunnel.messages.deleteTitle'),
        });
        await deleteTunnelApi({ id: row.Id });
        ElMessage.success($t('page.tunnel.messages.deleteSuccess'));
        await gridApi.reload();
        syncSelectedRows();
      } catch {}
      return;
    }

    await handleOpenEditDrawer(row);
  }

  const [Grid, gridApi] = useVbenVxeGrid({
    gridClass: 'tunnel-grid management-grid',
    gridEvents: {
      checkboxAll: syncSelectedRows,
      checkboxChange: syncSelectedRows,
    },
    gridOptions: getGridOptions(false),
  });

  const [TunnelDrawer, tunnelDrawerApi] = useVbenDrawer({
    confirmText: $t('page.tunnel.drawer.create'),
    destroyOnClose: true,
    onConfirm: handleDrawerConfirm,
    placement: 'right',
    title: $t('page.tunnel.drawer.title'),
  });

  function syncSelectedRows() {
    const table = gridApi.grid as any;
    selectedRows.value = table?.getCheckboxRecords?.() ?? [];
  }

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

  async function handleBatchDelete() {
    if (!hasSelection.value) {
      return;
    }
    try {
      await confirm({
        cancelText: $t('page.listener.confirm.cancel'),
        confirmText: $t('page.listener.confirm.confirm'),
        content: $t('page.tunnel.messages.batchDeleteConfirm'),
        title: $t('page.tunnel.messages.batchDeleteTitle'),
      });
      await deleteTunnelListApi({ id: batchDeleteIds.value });
      ElMessage.success($t('page.tunnel.messages.deleteSuccess'));
      await gridApi.reload();
      exitBatchSelectionMode();
    } catch {}
  }

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

  function handleAddTunnel() {
    void handleOpenCreateDrawer();
  }

  function applyDrawerState(mode: TunnelDrawerMode) {
    drawerMode.value = mode;
    tunnelDrawerApi.setState({
      confirmText:
        mode === 'edit'
          ? $t('page.tunnel.drawer.update')
          : $t('page.tunnel.drawer.create'),
      title:
        mode === 'edit'
          ? $t('page.tunnel.drawer.editTitle')
          : $t('page.tunnel.drawer.title'),
    });
  }

  async function handleOpenCreateDrawer() {
    applyDrawerState('create');
    tunnelDrawerApi.open();
    await nextTick();
    await tunnelDrawerRef.value?.reset?.();
  }

  async function handleOpenEditDrawer(row: TunnelListRecord) {
    applyDrawerState('edit');
    tunnelDrawerApi.open();
    await nextTick();
    await tunnelDrawerRef.value?.setValues?.(row);
  }

  async function handleDrawerConfirm() {
    const payload = await tunnelDrawerRef.value?.submit();
    if (!payload) {
      return;
    }

    tunnelDrawerApi.lock();
    try {
      if (drawerMode.value === 'edit') {
        await editTunnelApi(payload);
        ElMessage.success($t('page.tunnel.messages.editSuccess'));
      } else {
        await addTunnelApi(payload as TunnelAddPayload);
        ElMessage.success($t('page.tunnel.messages.addSuccess'));
      }
      tunnelDrawerApi.close();
      await gridApi.reload();
      syncSelectedRows();
    } catch {
    } finally {
      tunnelDrawerApi.unlock();
    }
  }

  return {
    Grid,
    TunnelDrawer,
    batchSelectionEnabled,
    gridApi,
    gridDensity,
    handleBatchDelete,
    handleAddTunnel,
    handleBatchSelect,
    handleClearSelection,
    handleDensityChange,
    handleOpenColumnSettings,
    hasSelection,
    selectedCount,
  };
}
