import type { TunnelListQuery, TunnelListRecord, TunnelListResult } from '#/api';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
export type { TunnelActionType } from './tunnel-table-actions';
import type { TunnelActionType } from './tunnel-table-actions';

import { createTunnelColumns } from './tunnel-table-columns';

interface CreateTunnelGridOptionsOptions {
  getTunnelResult: (params: TunnelListQuery) => Promise<TunnelListResult>;
  onAction: (action: TunnelActionType, row: TunnelListRecord) => void;
  showCheckboxColumn?: boolean;
  size?: 'medium' | 'mini' | 'small';
  t: (key: string) => string;
}

export function createTunnelGridOptions({
  getTunnelResult,
  onAction,
  showCheckboxColumn = false,
  size = 'small',
  t,
}: CreateTunnelGridOptionsOptions): VxeTableGridOptions<TunnelListRecord> {
  const columns = createTunnelColumns({
    onAction,
    showCheckboxColumn,
    t,
  });

  return {
    border: false,
    checkboxConfig: {
      highlight: true,
      trigger: 'default',
    },
    columns,
    customConfig: {
      storage: true,
    },
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
          await getTunnelResult({
            ClientId: 0,
            page: params.page.currentPage,
            pageSize: params.page.pageSize,
          }),
      },
    },
    rowConfig: {
      isHover: true,
      keyField: 'Id',
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
