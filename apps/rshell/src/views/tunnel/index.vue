<script setup lang="ts">
import { ref } from 'vue';

import { VbenButton } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { $t } from '#/locales';

import '../_shared/management-page.css';
import ManagementTableTools from '../_shared/management-table-tools.vue';
import ManagementToolbar from '../_shared/management-toolbar.vue';

import TunnelCreateDrawer from './tunnel-create-drawer.vue';
import { useTunnelManagement } from './use-tunnel-management';

defineOptions({ name: 'Tunnel' });

const tunnelDrawerRef = ref<{
  reset: () => Promise<void>;
  setValues: (record: import('#/api').TunnelListRecord) => Promise<void>;
  submit: () => Promise<import('#/api').TunnelUpsertPayload | null>;
} | null>(null);

const {
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
} = useTunnelManagement(tunnelDrawerRef);
</script>

<template>
  <div class="tunnel-page management-page">
    <h1 class="management-page__title">{{ $t('page.tunnel.title') }}</h1>
    <p class="management-page__description">{{ $t('page.tunnel.description') }}</p>

    <div class="management-page__panel">
      <TunnelDrawer>
        <TunnelCreateDrawer ref="tunnelDrawerRef" />
      </TunnelDrawer>

      <ManagementToolbar>
        <template #actions>
          <div
            v-if="batchSelectionEnabled && hasSelection"
            class="management-page__selection-info"
          >
            <IconifyIcon icon="ant-design:info-circle-filled" />
            <span>
              {{ $t('page.tunnel.selectedPrefix') }}{{ selectedCount
              }}{{ $t('page.tunnel.selectedSuffix') }}
            </span>
            <VbenButton size="xs" variant="link" @click="handleClearSelection">
              {{ $t('page.tunnel.clear') }}
            </VbenButton>
          </div>

          <VbenButton variant="outline" @click="handleBatchSelect">
            <IconifyIcon icon="ant-design:select-outlined" />
            <span>{{ $t('page.tunnel.batchSelect') }}</span>
          </VbenButton>

          <VbenButton
            v-if="batchSelectionEnabled"
            :disabled="!hasSelection"
            variant="destructive"
            @click="handleBatchDelete"
          >
            <IconifyIcon icon="ant-design:delete-outlined" />
            <span>{{ $t('page.tunnel.batchDelete') }}</span>
          </VbenButton>
        </template>

        <template #tools>
          <ManagementTableTools
            :columns-title="$t('page.tunnel.tools.columns')"
            :density="gridDensity"
            :density-compact-text="$t('page.tunnel.tools.densityCompact')"
            :density-comfortable-text="$t('page.tunnel.tools.densityComfortable')"
            :density-default-text="$t('page.tunnel.tools.densityDefault')"
            :density-title="$t('page.tunnel.tools.density')"
            dropdown-class="tunnel-toolbar-dropdown-menu"
            :refresh-title="$t('page.tunnel.tools.refresh')"
            @columns="handleOpenColumnSettings"
            @density-change="handleDensityChange"
            @refresh="gridApi.reload()"
          >
            <template #primary>
              <VbenButton @click="handleAddTunnel">
                <IconifyIcon icon="ant-design:plus-outlined" />
                <span>{{ $t('page.tunnel.add') }}</span>
              </VbenButton>
            </template>
          </ManagementTableTools>
        </template>
      </ManagementToolbar>

      <div class="management-page__card management-page__table-card">
        <Grid />
      </div>
    </div>
  </div>
</template>

<style>
.tunnel-toolbar-dropdown-menu {
  min-width: 116px;
}

.tunnel-toolbar-dropdown-menu .el-dropdown-menu__item.is-active {
  color: var(--el-color-primary);
  font-weight: 600;
}
</style>
