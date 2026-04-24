import type { ClientListRecord } from '#/api';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { h } from 'vue';

import { IconifyIcon } from '@vben/icons';

import {
  createClientActionsColumn,
  type ClientActionType,
} from './client-table-actions';

interface CreateClientColumnsOptions {
  editingRemarkId: number | null;
  editingRemarkValue: string;
  onCancelRemarkEdit: () => void;
  onChangeRemark: (value: string) => void;
  onAction: (action: ClientActionType, row: ClientListRecord) => void;
  onSaveRemark: (row: ClientListRecord) => void;
  onStartRemarkEdit: (row: ClientListRecord) => void;
  showCheckboxColumn?: boolean;
  t: (key: string) => string;
}

export function createClientColumns({
  editingRemarkId,
  editingRemarkValue,
  onCancelRemarkEdit,
  onChangeRemark,
  onAction,
  onSaveRemark,
  onStartRemarkEdit,
  showCheckboxColumn = false,
  t,
}: CreateClientColumnsOptions): NonNullable<
  VxeTableGridOptions<ClientListRecord>['columns']
> {
  const columns: NonNullable<VxeTableGridOptions<ClientListRecord>['columns']> =
    [];

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
      title: t('page.client.columns.id'),
      width: 72,
    },
    {
      field: 'Remark',
      title: t('page.client.columns.remark'),
      minWidth: 184,
      slots: {
        default: (params: { row: ClientListRecord }) =>
          editingRemarkId === params.row.Id
            ? h(
                'div',
                {
                  style: {
                    alignItems: 'center',
                    display: 'flex',
                    gap: '6px',
                    justifyContent: 'center',
                    paddingLeft: '8px',
                    width: '100%',
                  },
                },
                [
                  h('input', {
                    value: editingRemarkValue,
                    style: {
                      width: '122px',
                      height: '30px',
                      padding: '0 8px',
                      color: 'var(--el-text-color-primary)',
                      background: 'var(--el-fill-color-blank)',
                      border: '1px solid rgb(22 119 255 / 88%)',
                      borderRadius: '6px',
                      outline: 'none',
                      textAlign: 'center',
                      fontSize: '13px',
                      lineHeight: '30px',
                      boxShadow: '0 0 0 1px rgb(22 119 255 / 10%) inset',
                    },
                    onInput: (event: Event) =>
                      onChangeRemark((event.target as HTMLInputElement).value),
                    onKeydown: (event: KeyboardEvent) => {
                      if (event.key === 'Enter') {
                        onSaveRemark(params.row);
                      }
                      if (event.key === 'Escape') {
                        onCancelRemarkEdit();
                      }
                    },
                  }),
                  h(
                    'div',
                    {
                      style: {
                        alignItems: 'center',
                        display: 'inline-flex',
                        flexShrink: '0',
                        gap: '6px',
                      },
                    },
                    [
                      h(
                        'button',
                        {
                          style: remarkEditActionStyle('#fff'),
                          type: 'button',
                          onClick: () => onSaveRemark(params.row),
                        },
                        [h(IconifyIcon, { icon: 'ant-design:check-outlined' })],
                      ),
                      h(
                        'button',
                        {
                          style: remarkEditActionStyle('rgb(255 255 255 / 72%)'),
                          type: 'button',
                          onClick: onCancelRemarkEdit,
                        },
                        [h(IconifyIcon, { icon: 'ant-design:close-outlined' })],
                      ),
                    ],
                  ),
                ],
              )
            : h(
                'div',
                {
                  style: {
                    alignItems: 'center',
                    display: 'flex',
                    gap: '8px',
                    justifyContent: 'space-between',
                    width: '100%',
                  },
                },
                [
                  h(
                    'span',
                    {
                      style: {
                        color: params.row.Remark
                          ? 'var(--el-text-color-primary)'
                          : 'transparent',
                        flex: '1',
                        overflow: 'hidden',
                        textAlign: 'center',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      },
                    },
                    params.row.Remark || '',
                  ),
                  h(
                    'button',
                    {
                      style: {
                        alignItems: 'center',
                        appearance: 'none',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--el-text-color-secondary)',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        flexShrink: '0',
                        fontSize: '14px',
                        height: '20px',
                        justifyContent: 'center',
                        padding: '0',
                        width: '20px',
                      },
                      type: 'button',
                      onClick: () => onStartRemarkEdit(params.row),
                    },
                    [
                      h(IconifyIcon, {
                        icon: 'ant-design:edit-outlined',
                        style: {
                          fontSize: '14px',
                        },
                      }),
                    ],
                  ),
                ],
              ),
      },
    },
    {
      field: 'Tp',
      title: t('page.client.columns.tp'),
      width: 92,
    },
    {
      field: 'Addr',
      showOverflow: 'tooltip',
      title: t('page.client.columns.addr'),
      minWidth: 118,
    },
    {
      field: 'Location',
      showOverflow: 'tooltip',
      title: t('page.client.columns.location'),
      minWidth: 150,
    },
    {
      field: 'LocalIP',
      showOverflow: 'tooltip',
      title: t('page.client.columns.localIp'),
      minWidth: 120,
    },
    {
      field: 'UserName',
      showOverflow: 'tooltip',
      title: t('page.client.columns.userName'),
      minWidth: 120,
    },
    {
      field: 'HostName',
      showOverflow: 'tooltip',
      title: t('page.client.columns.hostName'),
      minWidth: 132,
    },
    {
      field: 'OsName',
      showOverflow: 'tooltip',
      title: t('page.client.columns.osName'),
      minWidth: 120,
    },
    {
      field: 'ProcessName',
      showOverflow: 'tooltip',
      title: t('page.client.columns.processName'),
      minWidth: 128,
    },
    {
      field: 'IsConnect',
      showHeaderOverflow: false,
      showOverflow: false,
      title: t('page.client.columns.status'),
      width: 74,
      slots: {
        default: (params: { row: ClientListRecord }) =>
          h(
            'span',
            {
              class: 'client-status-badge',
              style: {
                background: params.row.IsConnect
                  ? 'rgb(16 185 129 / 14%)'
                  : 'rgb(148 163 184 / 18%)',
                border: params.row.IsConnect
                  ? '1px solid rgb(16 185 129 / 24%)'
                  : '1px solid rgb(148 163 184 / 24%)',
                borderRadius: '999px',
                color: params.row.IsConnect ? '#10b981' : '#94a3b8',
                display: 'inline-flex',
                fontSize: '11px',
                fontWeight: '600',
                justifyContent: 'center',
                minWidth: '40px',
                padding: '0 6px',
              },
            },
            params.row.IsConnect
              ? t('page.client.online')
              : t('page.client.offline'),
          ),
      },
    },
    {
      field: 'PingCheckTime',
      showHeaderOverflow: false,
      showOverflow: false,
      title: t('page.client.columns.pingCheckTime'),
      width: 64,
      slots: {
        default: (params: { row: ClientListRecord }) =>
          h(
            'span',
            {
              style: {
                background:
                  params.row.PingCheckTime === 0
                    ? 'rgb(34 197 94 / 12%)'
                    : 'rgb(245 158 11 / 12%)',
                border:
                  params.row.PingCheckTime === 0
                    ? '1px solid rgb(34 197 94 / 20%)'
                    : '1px solid rgb(245 158 11 / 20%)',
                borderRadius: '6px',
                color:
                  params.row.PingCheckTime === 0 ? '#22c55e' : '#f59e0b',
                display: 'inline-flex',
                fontSize: '11px',
                justifyContent: 'center',
                minWidth: '22px',
                padding: '0 5px',
              },
            },
            String(params.row.PingCheckTime),
          ),
      },
    },
    createClientActionsColumn({ onAction, t }),
  );

  return columns;
}

function remarkEditActionStyle(color: string) {
  return {
    alignItems: 'center',
    appearance: 'none',
    background: 'transparent',
    border: 'none',
    color,
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: '18px',
    height: '20px',
    justifyContent: 'center',
    padding: '0',
    transition: 'opacity 0.2s ease',
    width: '16px',
  };
}
