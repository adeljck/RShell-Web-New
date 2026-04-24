import type { ClientListQuery, ClientListRecord, ClientListResult } from '#/api';

import type { Ref } from 'vue';

import { computed, nextTick, ref } from 'vue';

import { confirm, useVbenDrawer } from '@vben/common-ui';
import { ElMessage } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteClientFileApi,
  deleteClientListApi,
  deleteClientProcessApi,
  editClientRemarkApi,
  getClientListApi,
  getMockClientList,
} from '#/api';
import { $t } from '#/locales';

import { createClientGridOptions, type ClientActionType } from './client-table';

const CLIENT_REQUEST_TIMEOUT = 1500;

export type GridDensity = 'medium' | 'mini' | 'small';

export interface ClientForwardDrawerRef {
  reset: () => Promise<void>;
}

export function useClientManagement(forwardDrawerRef: Ref<ClientForwardDrawerRef | null>) {
  const showSearch = ref(false);
  const batchSelectionEnabled = ref(false);
  const editingRemarkId = ref<number | null>(null);
  const editingRemarkValue = ref('');
  const selectedRows = ref<ClientListRecord[]>([]);
  const searchKeyword = ref('');
  const searchStatus = ref<'' | '0' | '1'>('');
  const gridDensity = ref<GridDensity>('small');
  const selectedCount = computed(() => selectedRows.value.length);
  const hasSelection = computed(() => selectedCount.value > 0);

  function getGridOptions(showCheckboxColumn = batchSelectionEnabled.value) {
    return createClientGridOptions({
      editingRemarkId: editingRemarkId.value,
      editingRemarkValue: editingRemarkValue.value,
      getClientResult,
      onCancelRemarkEdit: handleCancelRemarkEdit,
      onChangeRemark: handleChangeRemark,
      onAction: handleRowAction,
      onSaveRemark: handleSaveRemark,
      onStartRemarkEdit: handleStartRemarkEdit,
      showCheckboxColumn,
      size: gridDensity.value,
      t: $t,
    });
  }

  async function getClientResult({
    page,
    pageSize,
  }: {
    page: number;
    pageSize: number;
  }): Promise<ClientListResult> {
    const query: ClientListQuery = {
      page,
      pageSize,
      search: searchKeyword.value.trim() || undefined,
      status: searchStatus.value || undefined,
    };

    try {
      return await Promise.race([
        getClientListApi(query),
        new Promise<ClientListResult>((_, reject) => {
          setTimeout(() => reject(new Error('client request timeout')), CLIENT_REQUEST_TIMEOUT);
        }),
      ]);
    } catch {
      return getMockClientList(query);
    }
  }

  async function handleRowAction(action: ClientActionType, row: ClientListRecord) {
    if (action === 'hostManage') {
      ElMessage.info($t('page.client.messages.hostManagePending'));
      return;
    }

    if (action === 'deleteFile') {
      try {
        await confirm({
          cancelText: $t('page.client.confirm.cancel'),
          confirmText: $t('page.client.confirm.confirm'),
          content: $t('page.client.confirm.deleteFileDescription'),
          title: $t('page.client.confirm.deleteFileTitle'),
        });
      } catch {
        return;
      }
      try {
        await deleteClientFileApi({ id: row.Id });
        ElMessage.success($t('page.client.messages.deleteSuccess'));
        await gridApi.reload();
      } catch {}
      return;
    }

    if (action === 'deleteHost') {
      try {
        await confirm({
          cancelText: $t('page.client.confirm.cancel'),
          confirmText: $t('page.client.confirm.confirm'),
          content: $t('page.client.confirm.deleteHostDescription'),
          title: $t('page.client.confirm.deleteHostTitle'),
        });
      } catch {
        return;
      }
      try {
        await deleteClientProcessApi({ id: row.Id });
        ElMessage.success($t('page.client.messages.deleteSuccess'));
        await gridApi.reload();
      } catch {}
      return;
    }

    ElMessage.info($t('page.client.messages.tunnelProxyPending'));
  }

  function handleStartRemarkEdit(row: ClientListRecord) {
    editingRemarkId.value = row.Id;
    editingRemarkValue.value = row.Remark;
    gridApi.setGridOptions({
      columns: getGridOptions(batchSelectionEnabled.value).columns,
    });
  }

  function handleChangeRemark(value: string) {
    editingRemarkValue.value = value;
  }

  function handleCancelRemarkEdit() {
    editingRemarkId.value = null;
    editingRemarkValue.value = '';
    gridApi.setGridOptions({
      columns: getGridOptions(batchSelectionEnabled.value).columns,
    });
  }

  async function handleSaveRemark(row: ClientListRecord) {
    try {
      await editClientRemarkApi({
        id: row.Id,
        remark: editingRemarkValue.value,
      });
      ElMessage.success($t('page.client.messages.remarkSaveSuccess'));
      handleCancelRemarkEdit();
      await gridApi.reload();
    } catch {}
  }

  const [Grid, gridApi] = useVbenVxeGrid({
    gridClass: 'client-grid management-grid',
    gridEvents: {
      checkboxAll: syncSelectedRows,
      checkboxChange: syncSelectedRows,
    },
    gridOptions: getGridOptions(false),
  });

  const [ForwardDrawer, forwardDrawerApi] = useVbenDrawer({
    destroyOnClose: true,
    footer: false,
    placement: 'right',
    showCancelButton: false,
    showConfirmButton: false,
    title: $t('page.client.forwardDrawer.title'),
  });

  function syncSelectedRows() {
    const table = gridApi.grid as any;
    selectedRows.value = table?.getCheckboxRecords?.() ?? [];
  }

  function handleToggleSearch() {
    showSearch.value = !showSearch.value;
  }

  function handleClearSelection() {
    const table = gridApi.grid as any;
    table?.clearCheckboxRow?.();
    syncSelectedRows();
  }

  function handleQuery() {
    handleCancelRemarkEdit();
    void gridApi.reload();
  }

  function handleReset() {
    searchKeyword.value = '';
    searchStatus.value = '';
    handleCancelRemarkEdit();
    void gridApi.reload();
  }

  function handleForwardConnect() {
    ElMessage.info($t('page.client.messages.forwardPending'));
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

  function exitBatchSelectionMode() {
    const table = gridApi.grid as any;
    table?.clearCheckboxRow?.();
    selectedRows.value = [];
    batchSelectionEnabled.value = false;
    gridApi.setGridOptions({
      columns: getGridOptions(false).columns,
    });
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

  async function handleOpenForwardDrawer() {
    forwardDrawerApi.setState({
      title: $t('page.client.forwardDrawer.title'),
    });
    forwardDrawerApi.open();
    await nextTick();
    await forwardDrawerRef.value?.reset?.();
  }

  async function handleBatchDelete() {
    if (!hasSelection.value) {
      return;
    }

    try {
      await confirm({
        cancelText: $t('page.client.confirm.cancel'),
        confirmText: $t('page.client.confirm.confirm'),
        content: $t('page.client.confirm.batchDeleteDescription'),
        title: $t('page.client.confirm.batchDeleteTitle'),
      });
      await deleteClientListApi({
        id: selectedRows.value.map((item) => item.Id),
      });
      ElMessage.success($t('page.client.messages.deleteSuccess'));
      exitBatchSelectionMode();
      await gridApi.reload();
    } catch {}
  }

  return {
    ForwardDrawer,
    Grid,
    batchSelectionEnabled,
    forwardDrawerRef,
    gridApi,
    gridDensity,
    handleBatchDelete,
    handleBatchSelect,
    handleClearSelection,
    handleDensityChange,
    handleForwardConnect,
    handleOpenColumnSettings,
    handleOpenForwardDrawer,
    handleQuery,
    handleReset,
    handleToggleSearch,
    hasSelection,
    searchKeyword,
    searchStatus,
    selectedCount,
    showSearch,
  };
}
