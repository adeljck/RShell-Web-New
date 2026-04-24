import type { TunnelListRecord } from '#/api';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { h } from 'vue';

import { IconifyIcon } from '@vben/icons';

export type TunnelActionType = 'delete' | 'disable' | 'edit' | 'enable';

interface CreateTunnelActionsColumnOptions {
  onAction: (action: TunnelActionType, row: TunnelListRecord) => void;
  t: (key: string) => string;
}

export function createTunnelActionsColumn({
  onAction,
  t,
}: CreateTunnelActionsColumnOptions): NonNullable<
  VxeTableGridOptions<TunnelListRecord>['columns']
>[number] {
  return {
    field: 'actions',
    fixed: 'right',
    title: t('page.tunnel.columns.actions'),
    minWidth: 260,
    slots: {
      default: (params: { row: TunnelListRecord }) =>
        h(
          'div',
          {
            style: {
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center',
              whiteSpace: 'nowrap',
              width: '100%',
            },
          },
          [
            renderActionButton({
              action: 'enable',
              disabled: params.row.RunStatus,
              icon: 'ant-design:play-circle-outlined',
              isLast: false,
              label: t('page.tunnel.actions.enable'),
              onAction,
              row: params.row,
            }),
            renderActionButton({
              action: 'disable',
              disabled: !params.row.RunStatus,
              icon: 'ant-design:pause-circle-outlined',
              isLast: false,
              label: t('page.tunnel.actions.disable'),
              onAction,
              row: params.row,
            }),
            renderActionButton({
              action: 'edit',
              disabled: false,
              icon: 'ant-design:edit-outlined',
              isLast: false,
              label: t('page.tunnel.actions.edit'),
              onAction,
              row: params.row,
            }),
            renderActionButton({
              action: 'delete',
              disabled: false,
              icon: 'ant-design:delete-outlined',
              isLast: true,
              label: t('page.tunnel.actions.delete'),
              onAction,
              row: params.row,
              variant: 'danger',
            }),
          ],
        ),
    },
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
  variant = 'primary',
}: {
  action: TunnelActionType;
  disabled: boolean;
  icon: string;
  isLast: boolean;
  label: string;
  onAction: (action: TunnelActionType, row: TunnelListRecord) => void;
  row: TunnelListRecord;
  variant?: 'danger' | 'primary';
}) {
  return h(
    'span',
    {
      style: {
        alignItems: 'center',
        display: 'inline-flex',
        flexShrink: '0',
      },
    },
    [
      h(
        'button',
        {
          disabled,
          style: {
            alignItems: 'center',
            appearance: 'none',
            background: 'transparent',
            border: 'none',
            color: disabled
              ? 'var(--el-text-color-disabled)'
              : variant === 'danger'
                ? 'var(--el-color-danger)'
                : 'var(--el-color-primary)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            fontSize: '12px',
            gap: '4px',
            lineHeight: '1',
            opacity: disabled ? '0.5' : '1',
            padding: '0',
            whiteSpace: 'nowrap',
          },
          type: 'button',
          onClick: () => {
            if (disabled) {
              return;
            }
            onAction(action, row);
          },
        },
        [
          h(IconifyIcon, { icon, style: { fontSize: '14px' } }),
          h('span', label),
        ],
      ),
      !isLast
        ? h('span', {
            style: {
              background: 'var(--el-border-color)',
              display: 'inline-flex',
              height: '12px',
              margin: '0 14px',
              width: '1px',
            },
          })
        : null,
    ],
  );
}
