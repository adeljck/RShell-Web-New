import type { TunnelListRecord } from '#/api';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { h } from 'vue';

import { IconifyIcon } from '@vben/icons';

import {
  createTunnelActionsColumn,
  type TunnelActionType,
} from './tunnel-table-actions';

interface CreateTunnelColumnsOptions {
  onAction: (action: TunnelActionType, row: TunnelListRecord) => void;
  showCheckboxColumn?: boolean;
  t: (key: string) => string;
}

export function createTunnelColumns({
  onAction,
  showCheckboxColumn = false,
  t,
}: CreateTunnelColumnsOptions): NonNullable<
  VxeTableGridOptions<TunnelListRecord>['columns']
> {
  const columns: NonNullable<VxeTableGridOptions<TunnelListRecord>['columns']> =
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
      title: t('page.tunnel.columns.id'),
      width: 80,
    },
    {
      field: 'ClientId',
      sortable: true,
      title: t('page.tunnel.columns.clientId'),
      width: 110,
    },
    {
      field: 'Remark',
      title: t('page.tunnel.columns.remark'),
      minWidth: 140,
      slots: {
        default: (params: { row: TunnelListRecord }) =>
          h(
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
              h(IconifyIcon, {
                icon: 'ant-design:edit-outlined',
                style: {
                  color: 'var(--el-text-color-secondary)',
                  flexShrink: '0',
                  fontSize: '14px',
                },
              }),
            ],
          ),
      },
    },
    {
      field: 'Mode',
      title: t('page.tunnel.columns.mode'),
      width: 110,
    },
    {
      field: 'Port',
      sortable: true,
      title: t('page.tunnel.columns.port'),
      width: 110,
    },
    {
      field: 'Target',
      showOverflow: 'tooltip',
      title: t('page.tunnel.columns.target'),
      minWidth: 170,
      slots: {
        default: (params: { row: TunnelListRecord }) => h('span', params.row.Target || '-'),
      },
    },
    {
      field: 'Username',
      showOverflow: 'tooltip',
      title: t('page.tunnel.columns.username'),
      minWidth: 120,
      slots: {
        default: (params: { row: TunnelListRecord }) => h('span', params.row.Username || '-'),
      },
    },
    {
      field: 'Password',
      showOverflow: 'tooltip',
      title: t('page.tunnel.columns.password'),
      minWidth: 120,
      slots: {
        default: (params: { row: TunnelListRecord }) => h('span', params.row.Password || '-'),
      },
    },
    {
      field: 'RunStatus',
      sortable: true,
      title: t('page.tunnel.columns.runStatus'),
      width: 110,
      slots: {
        default: (params: { row: TunnelListRecord }) =>
          h(
            'span',
            { style: tunnelStatusBadgeStyle(params.row.RunStatus) },
            params.row.RunStatus ? t('page.tunnel.enabled') : t('page.tunnel.disabled'),
          ),
      },
    },
    {
      field: 'IsConnect',
      sortable: true,
      title: t('page.tunnel.columns.clientStatus'),
      width: 110,
      slots: {
        default: (params: { row: TunnelListRecord }) =>
          h(
            'span',
            { style: tunnelClientStatusBadgeStyle(params.row.IsConnect) },
            params.row.IsConnect ? t('page.tunnel.online') : t('page.tunnel.offline'),
          ),
      },
    },
    createTunnelActionsColumn({ onAction, t }),
  );

  return columns;
}

function tunnelStatusBadgeStyle(enabled: boolean) {
  return {
    background: enabled ? 'rgb(16 185 129 / 14%)' : 'rgb(148 163 184 / 18%)',
    border: enabled ? '1px solid rgb(16 185 129 / 24%)' : '1px solid rgb(148 163 184 / 24%)',
    borderRadius: '999px',
    color: enabled ? '#10b981' : '#94a3b8',
    display: 'inline-flex',
    fontSize: '12px',
    fontWeight: '600',
    justifyContent: 'center',
    minWidth: '44px',
    padding: '0 8px',
  };
}

function tunnelClientStatusBadgeStyle(online: boolean) {
  return {
    background: online ? 'rgb(16 185 129 / 14%)' : 'rgb(148 163 184 / 18%)',
    border: online ? '1px solid rgb(16 185 129 / 24%)' : '1px solid rgb(148 163 184 / 24%)',
    borderRadius: '999px',
    color: online ? '#10b981' : '#94a3b8',
    display: 'inline-flex',
    fontSize: '12px',
    fontWeight: '600',
    justifyContent: 'center',
    minWidth: '44px',
    padding: '0 8px',
  };
}
