import type { ClientListRecord } from '#/api';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { h } from 'vue';

import { IconifyIcon } from '@vben/icons';
import { ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus';

export type ClientActionType =
  | 'deleteFile'
  | 'deleteHost'
  | 'hostManage'
  | 'tunnelProxy';

interface CreateClientActionsColumnOptions {
  onAction: (action: ClientActionType, row: ClientListRecord) => void;
  t: (key: string) => string;
}

export function createClientActionsColumn({
  onAction,
  t,
}: CreateClientActionsColumnOptions): NonNullable<
  VxeTableGridOptions<ClientListRecord>['columns']
>[number] {
  return {
    field: 'actions',
    fixed: 'right',
    showHeaderOverflow: false,
    showOverflow: false,
    title: t('page.client.columns.actions'),
    minWidth: 236,
    slots: {
      default: (params: { row: ClientListRecord }) =>
        h(
          'div',
          {
            style: {
              alignItems: 'center',
              display: 'flex',
              gap: '0',
              justifyContent: 'center',
              width: '100%',
              whiteSpace: 'nowrap',
            },
          },
          [
            ...(params.row.IsConnect
              ? [
                  renderActionButton({
                    action: 'hostManage',
                    icon: 'ant-design:appstore-outlined',
                    label: t('page.client.actions.hostManage'),
                    onAction,
                    row: params.row,
                  }),
                  h('span', {
                    style: {
                      background: 'var(--el-border-color)',
                      display: 'inline-flex',
                      height: '11px',
                      margin: '0 8px 0 1px',
                      width: '1px',
                    },
                  }),
                  renderActionButton({
                    action: 'tunnelProxy',
                    icon: 'ant-design:global-outlined',
                    label: t('page.client.actions.tunnelProxy'),
                    onAction,
                    row: params.row,
                  }),
                ]
              : []),
            renderMoreDropdown({
              onAction,
              row: params.row,
              t,
            }),
          ],
        ),
    },
  };
}

function renderActionButton({
  action,
  icon,
  label,
  onAction,
  row,
}: {
  action: ClientActionType;
  icon: string;
  label: string;
  onAction: (action: ClientActionType, row: ClientListRecord) => void;
  row: ClientListRecord;
}) {
  return h(
    'button',
    {
      style: {
        alignItems: 'center',
        appearance: 'none',
        background: 'transparent',
        border: 'none',
        color: 'var(--el-color-primary)',
        cursor: 'pointer',
        display: 'inline-flex',
        fontSize: '12px',
        gap: '3px',
        height: '22px',
        lineHeight: '1',
        padding: '0 6px 0 0',
        whiteSpace: 'nowrap',
      },
      type: 'button',
      onClick: () => onAction(action, row),
    },
    [
      h(IconifyIcon, { icon, style: { fontSize: '13px' } }),
      h('span', label),
    ],
  );
}

function renderMoreDropdown({
  onAction,
  row,
  t,
}: {
  onAction: (action: ClientActionType, row: ClientListRecord) => void;
  row: ClientListRecord;
  t: (key: string) => string;
}) {
  return h(
    ElDropdown,
    {
      popperClass: 'client-actions-dropdown',
      placement: 'bottom-end',
      teleported: true,
      trigger: 'hover',
      onCommand: (command: string | number | object) =>
        onAction(command as ClientActionType, row),
    },
    {
      default: () =>
        h(
          'button',
          {
            style: {
              alignItems: 'center',
              appearance: 'none',
              background: 'transparent',
              border: 'none',
              color: 'var(--el-color-primary)',
              cursor: 'pointer',
              display: 'inline-flex',
              fontSize: '17px',
              height: '22px',
              justifyContent: 'center',
              lineHeight: '1',
              padding: '0 0 0 8px',
              width: '24px',
            },
            type: 'button',
          },
          '...',
        ),
      dropdown: () =>
        h(
          ElDropdownMenu,
          {},
          () =>
            [
              row.IsConnect
                ? h(
                    ElDropdownItem,
                    {
                      command: 'deleteFile',
                    },
                    () => [
                      h(IconifyIcon, {
                        icon: 'ant-design:delete-outlined',
                        style: { fontSize: '14px', marginRight: '8px' },
                      }),
                      t('page.client.actions.deleteFile'),
                    ],
                  )
                : null,
              h(
                ElDropdownItem,
                {
                  command: 'deleteHost',
                  divided: row.IsConnect,
                },
                () => [
                  h(IconifyIcon, {
                    icon: 'ant-design:close-outlined',
                    style: { fontSize: '14px', marginRight: '8px' },
                  }),
                  t('page.client.actions.deleteHost'),
                ],
              ),
            ].filter(Boolean),
        ),
    },
  );
}
