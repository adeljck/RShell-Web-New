<script setup lang="ts">
import type { ListenerListResult, ListenerRecord } from '#/api';

import { h } from 'vue';

import { IconifyIcon } from '@vben/icons';

import { ElButton, ElMessage, ElTag } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getListenerListApi, getMockListenerList } from '#/api';
import { $t } from '#/locales';

defineOptions({ name: 'Listener' });

function getExternalAddr(item: ListenerRecord) {
  return item.WsConnectAddr || item.ConnectAddr || '-';
}

function getStatusText(status: boolean) {
  return status ? $t('page.listener.online') : $t('page.listener.offline');
}

function handlePending(action: string) {
  ElMessage.info(`${action}${$t('page.listener.pending')}`);
}

function getCellTooltipContent(row: ListenerRecord, field?: string) {
  if (!field) {
    return null;
  }

  if (field === 'ConnectAddr') {
    return getExternalAddr(row);
  }

  const value = row[field as keyof ListenerRecord];
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  return String(value);
}

async function getListenerResult(): Promise<ListenerListResult> {
  try {
    return await Promise.race([
      getListenerListApi(),
      new Promise<ListenerListResult>((_, reject) => {
        setTimeout(() => {
          reject(new Error('listener request timeout'));
        }, 1500);
      }),
    ]);
  } catch {
    return getMockListenerList();
  }
}

function normalizeSortValue(value: unknown) {
  if (typeof value === 'boolean') {
    return value ? 1 : 0;
  }
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    return value.toLowerCase();
  }
  if (value === null || value === undefined) {
    return '';
  }
  return String(value).toLowerCase();
}

function sortListenerItems(
  items: ListenerRecord[],
  sort?: null | {
    field?: keyof ListenerRecord | string;
    order?: 'asc' | 'ascend' | 'desc' | 'descend' | null;
  },
) {
  if (!sort?.field || !sort?.order) {
    return items;
  }

  const direction = ['desc', 'descend'].includes(sort.order) ? -1 : 1;
  const field = sort.field as keyof ListenerRecord;

  return [...items].toSorted((left, right) => {
    const leftValue = normalizeSortValue(left[field]);
    const rightValue = normalizeSortValue(right[field]);

    if (leftValue === rightValue) {
      return 0;
    }

    return leftValue > rightValue ? direction : -direction;
  });
}

async function queryListenerList({
  page,
  sort,
}: {
  page: {
    currentPage: number;
    pageSize: number;
  };
  sort?: null | {
    field?: keyof ListenerRecord | string;
    order?: 'asc' | 'ascend' | 'desc' | 'descend' | null;
  };
}) {
  const result = await getListenerResult();
  const sortedItems = sortListenerItems(result.items, sort);
  const start = (page.currentPage - 1) * page.pageSize;

  return {
    items: sortedItems.slice(start, start + page.pageSize),
    total: result.total,
  };
}

function renderActionButton(
  icon: string,
  label: string,
  type: 'danger' | 'primary' | 'text' = 'text',
) {
  return h(
    'button',
    {
      class: [
        'action-button',
        type === 'danger' ? 'action-button--danger' : '',
        type === 'primary' ? 'action-button--primary' : '',
      ],
      type: 'button',
      onClick: () => handlePending(label),
    },
    [h(IconifyIcon, { icon }), h('span', label)],
  );
}

const [Grid, gridApi] = useVbenVxeGrid<ListenerRecord>({
  gridClass: 'listener-grid',
  gridOptions: {
    border: false,
    checkboxConfig: {
      highlight: true,
      trigger: 'row',
    },
    headerCellClassName: 'listener-grid__header-cell',
    rowConfig: {
      isHover: true,
      keyField: 'Id',
    },
    showHeaderOverflow: 'tooltip',
    showOverflow: 'tooltip',
    sortConfig: {
      trigger: 'cell',
    },
    tooltipConfig: {
      enterable: true,
      maxWidth: 520,
      theme: 'dark',
      contentMethod: (params: {
        column: {
          field?: string;
        };
        row: ListenerRecord;
      }) => {
        const { row, column } = params;
        if (!row || !column) {
          return null;
        }
        if (['actions', 'Status'].includes(String(column.field ?? ''))) {
          return null;
        }
        return getCellTooltipContent(
          row as ListenerRecord,
          String(column.field ?? ''),
        );
      },
    },
    columns: [
      {
        type: 'checkbox',
        showHeaderOverflow: false,
        showOverflow: false,
        width: 54,
      },
      {
        field: 'Id',
        sortable: true,
        showHeaderOverflow: false,
        showOverflow: false,
        title: $t('page.listener.columns.id'),
        width: 80,
      },
      {
        field: 'Remark',
        showOverflow: 'tooltip',
        title: $t('page.listener.columns.remark'),
        minWidth: 140,
        slots: {
          default: (params: { row: ListenerRecord }) =>
            h('span', params.row.Remark || '-'),
        },
      },
      {
        field: 'Mode',
        sortable: true,
        showHeaderOverflow: false,
        showOverflow: false,
        title: $t('page.listener.columns.mode'),
        width: 100,
      },
      {
        field: 'ListenAddr',
        showOverflow: 'tooltip',
        title: $t('page.listener.columns.listenAddr'),
        minWidth: 180,
      },
      {
        field: 'ConnectAddr',
        showOverflow: 'tooltip',
        title: $t('page.listener.columns.connectAddr'),
        minWidth: 260,
        slots: {
          default: (params: { row: ListenerRecord }) =>
            h('span', getExternalAddr(params.row)),
        },
      },
      {
        field: 'DisconnectTimeout',
        sortable: true,
        showHeaderOverflow: 'tooltip',
        showOverflow: false,
        title: $t('page.listener.columns.disconnectTimeout'),
        width: 180,
      },
      {
        field: 'PingInterval',
        sortable: true,
        showHeaderOverflow: 'tooltip',
        showOverflow: false,
        title: $t('page.listener.columns.pingInterval'),
        width: 150,
      },
      {
        field: 'Status',
        sortable: true,
        showHeaderOverflow: false,
        showOverflow: false,
        title: $t('page.listener.columns.status'),
        width: 110,
        slots: {
          default: (params: { row: ListenerRecord }) =>
            h(
              ElTag,
              {
                effect: 'dark',
                round: true,
                size: 'small',
                type: params.row.Status ? 'success' : 'info',
              },
              {
                default: () => getStatusText(params.row.Status),
              },
            ),
        },
      },
      {
        field: 'actions',
        fixed: 'right',
        showHeaderOverflow: false,
        showOverflow: false,
        title: $t('page.listener.columns.actions'),
        minWidth: 320,
        slots: {
          default: () =>
            h('div', { class: 'actions-cell' }, [
              renderActionButton(
                'ant-design:play-circle-outlined',
                $t('page.listener.actions.enable'),
              ),
              renderActionButton(
                'ant-design:pause-circle-outlined',
                $t('page.listener.actions.disable'),
              ),
              renderActionButton(
                'ant-design:edit-outlined',
                $t('page.listener.actions.edit'),
              ),
              renderActionButton(
                'ant-design:code-outlined',
                $t('page.listener.actions.command'),
                'primary',
              ),
              renderActionButton(
                'ant-design:delete-outlined',
                $t('page.listener.actions.delete'),
                'danger',
              ),
            ]),
        },
      },
    ],
    height: '100%',
    keepSource: true,
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
          sort?: {
            field?: keyof ListenerRecord | string;
            order?: 'asc' | 'ascend' | 'desc' | 'descend' | null;
          };
        }) => await queryListenerList({ page: params.page, sort: params.sort }),
      },
    },
    toolbarConfig: {
      custom: true,
    },
  },
});

function handleBatchSelect() {
  const table = gridApi.grid as any;
  const selectedRows = table?.getCheckboxRecords?.() ?? [];

  if (selectedRows.length > 0) {
    table?.clearCheckboxRow?.();
    return;
  }
  table?.setAllCheckboxRow?.(true);
}
</script>

<template>
  <div class="listener-page">
    <h1 class="listener-title">{{ $t('page.listener.title') }}</h1>

    <div class="listener-panel">
      <Grid>
        <template #toolbar-actions>
          <ElButton plain @click="handleBatchSelect">
            <IconifyIcon icon="ant-design:select-outlined" />
            <span>{{ $t('page.listener.batchSelect') }}</span>
          </ElButton>
        </template>

        <template #toolbar-tools>
          <div class="listener-toolbar-tools">
            <button
              class="toolbar-icon-button"
              type="button"
              :title="$t('page.listener.tools.refresh')"
              @click="gridApi.reload()"
            >
              <IconifyIcon icon="ant-design:redo-outlined" />
            </button>

            <ElButton
              type="primary"
              @click="handlePending($t('page.listener.add'))"
            >
              <IconifyIcon icon="ant-design:plus-outlined" />
              <span>{{ $t('page.listener.add') }}</span>
            </ElButton>
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

.toolbar-icon-button,
.action-button {
  cursor: pointer;
  background: transparent;
  border: none;
}

.toolbar-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  font-size: 16px;
  color: var(--el-text-color-primary);
}

.toolbar-icon-button:hover {
  color: var(--el-color-primary);
}

.actions-cell {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.action-button {
  display: inline-flex;
  gap: 4px;
  align-items: center;
  padding: 0;
  font-size: 13px;
  color: var(--el-color-primary);
}

.action-button--danger {
  color: var(--el-color-danger);
}

.action-button--primary {
  padding: 2px 6px;
  font-size: 12px;
  color: #fff;
  background: var(--el-color-primary);
  border-radius: 4px;
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
  .listener-toolbar-tools {
    flex-wrap: wrap;
    justify-content: flex-end;
  }
}
</style>
