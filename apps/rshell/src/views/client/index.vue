<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';

import { VbenButton } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { ElInput, ElOption, ElSelect } from 'element-plus';

import { $t } from '#/locales';

import '../_shared/management-page.css';
import ManagementTableTools from '../_shared/management-table-tools.vue';
import ManagementToolbar from '../_shared/management-toolbar.vue';

import ClientForwardDrawer from './client-forward-drawer.vue';
import { useClientManagement } from './use-client-management';

defineOptions({ name: 'Client' });
const forwardDrawerRef = ref<{ reset: () => Promise<void> } | null>(null);
const {
  ForwardDrawer,
  Grid,
  batchSelectionEnabled,
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
} = useClientManagement(forwardDrawerRef);

const keywordInputRef = ref<{ focus: () => void } | null>(null);

watch(showSearch, async (visible) => {
  if (!visible) {
    return;
  }
  await nextTick();
  keywordInputRef.value?.focus();
});
</script>

<template>
  <div class="client-page management-page">
    <h1 class="client-title management-page__title">{{ $t('page.client.title') }}</h1>

    <div class="client-panel management-page__panel">
      <ForwardDrawer>
        <ClientForwardDrawer ref="forwardDrawerRef" @submit="handleForwardConnect" />
      </ForwardDrawer>

      <Transition name="client-search-collapse">
        <div v-show="showSearch" class="client-search-card management-page__card">
          <div class="client-search-grid">
            <div class="client-search-field client-search-field--keyword">
              <label class="client-search-label">{{ $t('page.client.search.keyword') }}</label>
              <ElInput
                ref="keywordInputRef"
                v-model="searchKeyword"
                :placeholder="$t('page.client.search.keywordPlaceholder')"
                clearable
                @keyup.enter="handleQuery"
              />
            </div>

            <div class="client-search-field client-search-field--status">
              <label class="client-search-label">{{ $t('page.client.search.status') }}</label>
              <ElSelect v-model="searchStatus" clearable>
                <ElOption :label="$t('page.client.search.statusAll')" value="" />
                <ElOption :label="$t('page.client.online')" value="1" />
                <ElOption :label="$t('page.client.offline')" value="0" />
              </ElSelect>
            </div>
          </div>

          <div class="client-search-actions">
            <VbenButton variant="outline" @click="handleReset">
              {{ $t('page.client.search.reset') }}
            </VbenButton>
            <VbenButton @click="handleQuery">
              {{ $t('page.client.search.query') }}
            </VbenButton>
          </div>
        </div>
      </Transition>

      <ManagementToolbar>
        <template #actions>
          <div
            v-if="batchSelectionEnabled && hasSelection"
            class="management-page__selection-info"
          >
            <IconifyIcon icon="ant-design:info-circle-filled" />
            <span>
              {{ $t('page.client.selectedPrefix') }}{{ selectedCount
              }}{{ $t('page.client.selectedSuffix') }}
            </span>
            <VbenButton size="xs" variant="link" @click="handleClearSelection">
              {{ $t('page.client.clear') }}
            </VbenButton>
          </div>

          <VbenButton
            :variant="showSearch ? 'default' : 'outline'"
            @click="handleToggleSearch"
          >
            <IconifyIcon icon="ant-design:search-outlined" />
            <span>{{ $t('page.client.search.toggle') }}</span>
          </VbenButton>

          <VbenButton variant="outline" @click="handleBatchSelect">
            <IconifyIcon icon="ant-design:select-outlined" />
            <span>{{ $t('page.client.batchSelect') }}</span>
          </VbenButton>

          <VbenButton
            v-if="batchSelectionEnabled"
            :disabled="!hasSelection"
            variant="destructive"
            @click="handleBatchDelete"
          >
            <IconifyIcon icon="ant-design:delete-outlined" />
            <span>{{ $t('page.client.batchDelete') }}</span>
          </VbenButton>
        </template>

        <template #tools>
          <ManagementTableTools
            :columns-title="$t('page.client.tools.columns')"
            :density="gridDensity"
            :density-compact-text="$t('page.client.tools.densityCompact')"
            :density-comfortable-text="$t('page.client.tools.densityComfortable')"
            :density-default-text="$t('page.client.tools.densityDefault')"
            :density-title="$t('page.client.tools.density')"
            dropdown-class="client-toolbar-dropdown-menu"
            :refresh-title="$t('page.client.tools.refresh')"
            @columns="handleOpenColumnSettings"
            @density-change="handleDensityChange"
            @refresh="gridApi.reload()"
          >
            <template #primary>
              <VbenButton @click="handleOpenForwardDrawer">
                <IconifyIcon icon="ant-design:plus-outlined" />
                <span>{{ $t('page.client.forwardConnect') }}</span>
              </VbenButton>
            </template>
          </ManagementTableTools>
        </template>
      </ManagementToolbar>

      <div class="client-table-card management-page__card management-page__table-card">
        <Grid />
      </div>
    </div>
  </div>
</template>

<style scoped>
.client-search-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 12px 16px;
  overflow: hidden;
}

.client-search-grid {
  display: grid;
  flex: 1;
  grid-template-columns: minmax(320px, 420px) minmax(220px, 280px);
  gap: 14px 24px;
}

.client-search-field {
  display: flex;
  align-items: center;
  gap: 12px;
}

.client-search-label {
  min-width: 52px;
  color: var(--el-text-color-primary);
  font-size: 14px;
  font-weight: 600;
  text-align: right;
}

.client-search-field :deep(.el-input),
.client-search-field :deep(.el-select) {
  width: 100%;
}

.client-search-field :deep(.el-input__wrapper),
.client-search-field :deep(.el-select__wrapper) {
  min-height: 40px;
  border-radius: 8px;
  box-shadow: 0 0 0 1px var(--el-border-color) inset;
}

.client-search-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;
}

.client-search-collapse-enter-active,
.client-search-collapse-leave-active {
  transition:
    max-height 0.32s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.24s ease,
    transform 0.32s cubic-bezier(0.22, 1, 0.36, 1),
    margin 0.32s cubic-bezier(0.22, 1, 0.36, 1),
    padding 0.32s cubic-bezier(0.22, 1, 0.36, 1),
    border-width 0.32s cubic-bezier(0.22, 1, 0.36, 1);
  transform-origin: top center;
}

.client-search-collapse-enter-from,
.client-search-collapse-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-8px);
  margin: 0;
  padding-top: 0;
  padding-bottom: 0;
  border-width: 0;
}

.client-search-collapse-enter-to,
.client-search-collapse-leave-from {
  max-height: 112px;
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 1200px) {
  .client-search-card {
    align-items: flex-start;
    flex-direction: column;
  }

  .client-search-grid {
    width: 100%;
    grid-template-columns: 1fr;
  }

  .client-search-field {
    align-items: flex-start;
    flex-direction: column;
  }

  .client-search-label {
    min-width: auto;
    text-align: left;
  }

  .client-search-actions,
  .management-page__toolbar-actions,
  .management-page__toolbar-tools {
    flex-wrap: wrap;
  }
}
</style>

<style>
.client-toolbar-dropdown-menu {
  min-width: 116px;
}

.client-toolbar-dropdown-menu .el-dropdown-menu__item.is-active {
  color: var(--el-color-primary);
  font-weight: 600;
}

.client-actions-dropdown.el-popper {
  padding: 8px;
  background: #262626;
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 12px;
  box-shadow: 0 16px 32px rgb(0 0 0 / 32%);
}

.client-actions-dropdown .el-popper__arrow::before {
  background: #262626;
  border-color: rgb(255 255 255 / 10%);
}

.client-actions-dropdown .el-dropdown-menu {
  padding: 0;
  background: transparent;
  border: none;
}

.client-actions-dropdown .el-dropdown-menu__item {
  min-width: 150px;
  min-height: 42px;
  padding: 0 14px;
  color: rgb(255 255 255 / 88%);
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
}

.client-actions-dropdown .el-dropdown-menu__item:not(.is-disabled):focus,
.client-actions-dropdown .el-dropdown-menu__item:not(.is-disabled):hover {
  color: #fff;
  background: rgb(255 255 255 / 8%);
}

.client-actions-dropdown .el-dropdown-menu__item.is-divided {
  margin-top: 8px;
}

.client-actions-dropdown .el-dropdown-menu__item.is-divided::before {
  left: 0;
  right: 0;
  top: -4px;
  background: rgb(255 255 255 / 10%);
}
</style>
