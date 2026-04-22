import type { ListenerListResult, ListenerRecord } from '#/api';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { h } from 'vue';

import { VbenButton } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

type ActionVariant = 'danger' | 'primary' | 'text';
export type ListenerActionType =
  | 'command'
  | 'delete'
  | 'disable'
  | 'edit'
  | 'enable';

type ListenerSortState =
  | {
      field?: keyof ListenerRecord | string;
      order?: string | null;
    }
  | null
  | undefined;

type ListenerTranslate = (key: string) => string;

interface CreateListenerGridOptionsOptions {
  getListenerResult: () => Promise<ListenerListResult>;
  onAction: (action: ListenerActionType, row: ListenerRecord) => void;
  showCheckboxColumn?: boolean;
  t: ListenerTranslate;
}

interface ListenerActionConfig {
  action: ListenerActionType;
  icon: string;
  key: string;
  variant?: ActionVariant;
}

const LISTENER_ACTIONS: ListenerActionConfig[] = [
  {
    action: 'enable',
    icon: 'ant-design:play-circle-outlined',
    key: 'page.listener.actions.enable',
  },
  {
    action: 'disable',
    icon: 'ant-design:pause-circle-outlined',
    key: 'page.listener.actions.disable',
  },
  {
    action: 'edit',
    icon: 'ant-design:edit-outlined',
    key: 'page.listener.actions.edit',
  },
  {
    action: 'command',
    icon: 'ant-design:code-outlined',
    key: 'page.listener.actions.command',
    variant: 'primary',
  },
  {
    action: 'delete',
    icon: 'ant-design:delete-outlined',
    key: 'page.listener.actions.delete',
    variant: 'danger',
  },
];

export function getExternalAddr(item: ListenerRecord) {
  return item.WsConnectAddr || item.ConnectAddr || '-';
}

export function createListenerGridOptions({
  getListenerResult,
  onAction,
  showCheckboxColumn = false,
  t,
}: CreateListenerGridOptionsOptions): VxeTableGridOptions<ListenerRecord> {
  const columns: NonNullable<VxeTableGridOptions<ListenerRecord>['columns']> = [];

  if (showCheckboxColumn) {
    columns.push({
      type: 'checkbox',
      showHeaderOverflow: false,
      showOverflow: false,
      width: 54,
    });
  }

  columns.push(
    {
      field: 'Id',
      sortable: true,
      showHeaderOverflow: false,
      showOverflow: false,
      title: t('page.listener.columns.id'),
      width: 80,
    },
    {
      field: 'Remark',
      showOverflow: 'tooltip',
      title: t('page.listener.columns.remark'),
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
      title: t('page.listener.columns.mode'),
      width: 100,
    },
    {
      field: 'ListenAddr',
      showOverflow: 'tooltip',
      title: t('page.listener.columns.listenAddr'),
      minWidth: 180,
    },
    {
      field: 'ConnectAddr',
      showOverflow: 'tooltip',
      title: t('page.listener.columns.connectAddr'),
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
      title: t('page.listener.columns.disconnectTimeout'),
      width: 180,
    },
    {
      field: 'PingInterval',
      sortable: true,
      showHeaderOverflow: 'tooltip',
      showOverflow: false,
      title: t('page.listener.columns.pingInterval'),
      width: 150,
    },
      {
        field: 'Status',
      sortable: true,
      showHeaderOverflow: false,
      showOverflow: false,
      title: t('page.listener.columns.status'),
        width: 110,
        slots: {
          default: (params: { row: ListenerRecord }) =>
            h(
              'span',
              {
                class: 'listener-status-badge',
                style: {
                  background: params.row.Status
                    ? 'rgb(16 185 129 / 14%)'
                    : 'rgb(148 163 184 / 18%)',
                  border: params.row.Status
                    ? '1px solid rgb(16 185 129 / 24%)'
                    : '1px solid rgb(148 163 184 / 24%)',
                  borderRadius: '999px',
                  color: params.row.Status ? '#10b981' : '#94a3b8',
                  display: 'inline-flex',
                  fontSize: '12px',
                  fontWeight: '600',
                  lineHeight: '20px',
                  minWidth: '44px',
                  justifyContent: 'center',
                  padding: '0 8px',
                },
              },
              params.row.Status
                ? t('page.listener.online')
                : t('page.listener.offline'),
            ),
        },
      },
    {
      field: 'actions',
      fixed: 'right',
      showHeaderOverflow: false,
      showOverflow: false,
      title: t('page.listener.columns.actions'),
      minWidth: 320,
      slots: {
        default: (params: { row: ListenerRecord }) =>
          h(
            'div',
            {
              class: 'actions-cell',
              style: {
                alignItems: 'center',
                display: 'flex',
                flexWrap: 'nowrap',
                gap: '0',
                justifyContent: 'center',
                width: '100%',
                whiteSpace: 'nowrap',
              },
            },
            LISTENER_ACTIONS.map((action, index) =>
              renderActionButton({
                action: action.action,
                disabled:
                  (action.action === 'enable' && params.row.Status) ||
                  (action.action === 'disable' && !params.row.Status),
                icon: action.icon,
                isLast: index === LISTENER_ACTIONS.length - 1,
                label: t(action.key),
                onAction,
                row: params.row,
                variant: action.variant ?? 'text',
              }),
            ),
          ),
      },
    },
  );

  return {
    border: false,
    checkboxConfig: {
      highlight: true,
      trigger: 'default',
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
        const { column, row } = params;
        if (!row || !column) {
          return null;
        }
        if (['actions', 'Status'].includes(String(column.field ?? ''))) {
          return null;
        }
        return getCellTooltipContent(row, String(column.field ?? ''));
      },
    },
    columns,
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
          sort?: ListenerSortState;
        }) =>
          await queryListenerList({
            getListenerResult,
            page: params.page,
            sort: params.sort,
          }),
      },
    },
    toolbarConfig: {
      custom: true,
    },
  };
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
  sort?: ListenerSortState,
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
  getListenerResult,
  page,
  sort,
}: {
  getListenerResult: () => Promise<ListenerListResult>;
  page: {
    currentPage: number;
    pageSize: number;
  };
  sort?: ListenerSortState;
}) {
  const result = await getListenerResult();
  const sortedItems = sortListenerItems(result.items, sort);
  const start = (page.currentPage - 1) * page.pageSize;

  return {
    items: sortedItems.slice(start, start + page.pageSize),
    total: result.total,
  };
}

function renderActionButton({
  action,
  disabled,
  icon,
  isLast,
  label,
  onAction,
  row,
  variant,
}: {
  action: ListenerActionType;
  disabled: boolean;
  icon: string;
  isLast: boolean;
  label: string;
  onAction: (action: ListenerActionType, row: ListenerRecord) => void;
  row: ListenerRecord;
  variant: ActionVariant;
}) {
  return h(
    'span',
    {
      style: {
        alignItems: 'center',
        display: 'inline-flex',
        flexShrink: '0',
        justifyContent: 'flex-start',
        whiteSpace: 'nowrap',
      },
    },
    [
      h(
        VbenButton,
        {
          class: 'action-button',
          disabled,
          size: 'xs',
          variant: 'link',
          style: {
            color:
              disabled
                ? 'var(--el-text-color-disabled)'
                : variant === 'danger'
                  ? 'var(--el-color-danger)'
                  : 'var(--el-color-primary)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            flexShrink: '0',
            fontSize: '12px',
            gap: '4px',
            height: 'auto',
            lineHeight: '1',
            minHeight: 'unset',
            opacity: disabled ? '0.5' : '1',
            padding: '0 4px 0 0',
          },
          onClick: () => {
            if (disabled) {
              return;
            }
            onAction(action, row);
          },
        },
        {
          default: () => [
            h(IconifyIcon, { icon, style: { fontSize: '14px' } }),
            h('span', { style: { whiteSpace: 'nowrap' } }, label),
          ],
        },
      ),
      !isLast
        ? h('span', {
            style: {
              background: 'var(--el-border-color)',
              display: 'inline-flex',
              flexShrink: '0',
              height: '12px',
              margin: '0 12px 0 8px',
              width: '1px',
            },
          })
        : null,
    ],
  );
}
