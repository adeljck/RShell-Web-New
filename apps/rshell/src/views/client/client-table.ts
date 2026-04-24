import type { ClientListRecord, ClientListResult } from '#/api';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import type { ClientActionType } from './client-table-actions';

import { createClientColumns } from './client-table-columns';

interface CreateClientGridOptionsOptions {
  editingRemarkId: number | null;
  editingRemarkValue: string;
  getClientResult: (params: {
    page: number;
    pageSize: number;
  }) => Promise<ClientListResult>;
  onCancelRemarkEdit: () => void;
  onChangeRemark: (value: string) => void;
  onAction: (action: ClientActionType, row: ClientListRecord) => void;
  onSaveRemark: (row: ClientListRecord) => void;
  onStartRemarkEdit: (row: ClientListRecord) => void;
  showCheckboxColumn?: boolean;
  size?: 'medium' | 'mini' | 'small';
  t: (key: string) => string;
}

export type { ClientActionType } from './client-table-actions';

export function createClientGridOptions({
  editingRemarkId,
  editingRemarkValue,
  getClientResult,
  onCancelRemarkEdit,
  onChangeRemark,
  onAction,
  onSaveRemark,
  onStartRemarkEdit,
  showCheckboxColumn = false,
  size = 'small',
  t,
}: CreateClientGridOptionsOptions): VxeTableGridOptions<ClientListRecord> {
  return {
    border: false,
    checkboxConfig: {
      highlight: true,
      trigger: 'default',
    },
    columns: createClientColumns({
      editingRemarkId,
      editingRemarkValue,
      onCancelRemarkEdit,
      onChangeRemark,
      onAction,
      onSaveRemark,
      onStartRemarkEdit,
      showCheckboxColumn,
      t,
    }),
    height: '100%',
    pagerConfig: {
      enabled: true,
      pageSize: 10,
      pageSizes: [10, 20, 50],
    },
    proxyConfig: {
      ajax: {
        query: async (params: {
          page: {
            currentPage: number;
            pageSize: number;
          };
        }) =>
          await getClientResult({
            page: params.page.currentPage,
            pageSize: params.page.pageSize,
          }),
      },
    },
    rowConfig: {
      isHover: true,
      keyField: 'Id',
    },
    customConfig: {
      storage: true,
    },
    showHeaderOverflow: 'tooltip',
    showOverflow: 'tooltip',
    size,
    sortConfig: {
      trigger: 'cell',
    },
    tooltipConfig: {
      enterable: true,
      maxWidth: 420,
      theme: 'dark',
    },
  };
}
