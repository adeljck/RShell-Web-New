<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';

import { IconifyIcon } from '@vben/icons';

import { ElCard, ElProgress } from 'element-plus';

import '#/views/_shared/workspace-page.css';

import { getDashboardOverviewApi, getMockDashboardOverview } from '#/api';
import { $t } from '#/locales';

defineOptions({ name: 'Dashboard' });

const dashboardData = ref(getMockDashboardOverview());

const summaryCards = computed(() => [
  {
    accent: '#334155',
    icon: 'mdi:magic-staff',
    label: $t('page.dashboard.listenerCount'),
    value: dashboardData.value.listenerCount,
  },
  {
    accent: '#0ea5b7',
    icon: 'mdi:headphones',
    label: $t('page.dashboard.listenerOnlineCount'),
    value: dashboardData.value.listenerOnlineCount,
  },
  {
    accent: '#475569',
    icon: 'mdi:devices',
    label: $t('page.dashboard.clientCount'),
    value: dashboardData.value.clientCount,
  },
  {
    accent: '#2563eb',
    icon: 'mdi:laptop',
    label: $t('page.dashboard.clientOnlineCount'),
    value: dashboardData.value.clientOnlineCount,
  },
]);

const configItems = computed(() => [
  {
    label: $t('page.dashboard.webPort'),
    value: dashboardData.value.web_port || '-',
  },
  {
    label: $t('page.dashboard.basicAuth'),
    value: formatBoolean(dashboardData.value.web_basic_auth),
  },
  {
    label: $t('page.dashboard.version'),
    value: dashboardData.value.version || '-',
  },
]);

const systemProgressItems = computed(() => [
  { label: $t('page.dashboard.cpu'), value: dashboardData.value.cpu },
  { label: $t('page.dashboard.disk'), value: dashboardData.value.disk },
  {
    label: $t('page.dashboard.memory'),
    value: dashboardData.value.virtual_mem,
  },
  {
    label: $t('page.dashboard.swapMemory'),
    value: dashboardData.value.swap_mem,
  },
]);

const systemInfoItems = computed(() => [
  { label: $t('page.dashboard.tcpCount'), value: dashboardData.value.tcpCount },
  { label: $t('page.dashboard.udpCount'), value: dashboardData.value.udpCount },
  {
    label: $t('page.dashboard.exportFlow'),
    value: formatBytes(dashboardData.value.exportFlowCount),
  },
  {
    label: $t('page.dashboard.inletFlow'),
    value: formatBytes(dashboardData.value.inletFlowCount),
  },
]);

async function loadDashboardData() {
  try {
    dashboardData.value = await getDashboardOverviewApi();
  } catch {
    dashboardData.value = getMockDashboardOverview();
  }
}

function formatBoolean(value: boolean) {
  return value ? $t('page.dashboard.enabled') : $t('page.dashboard.disabled');
}

function formatBytes(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return '0 B';
  }
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = value;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(size >= 100 || unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
}

onMounted(() => {
  void loadDashboardData();
});
</script>

<template>
  <div class="workspace-page dashboard-page">
    <section class="workspace-page__header dashboard-page__header">
      <h1 class="workspace-page__title">{{ $t('page.dashboard.title') }}</h1>
      <p class="workspace-page__description dashboard-page__description">
        {{ $t('page.dashboard.systemInfo') }} / {{ $t('page.dashboard.configInfo') }}
      </p>
    </section>

    <section class="dashboard-summary-grid">
      <ElCard
        v-for="card in summaryCards"
        :key="card.label"
        shadow="never"
        class="dashboard-summary-card"
      >
        <div class="dashboard-summary-card__head">{{ card.label }}</div>
        <div class="dashboard-summary-card__body">
          <div class="dashboard-summary-card__value">{{ card.value }}</div>
          <div
            class="dashboard-summary-card__icon"
            :style="{ backgroundColor: `${card.accent}16`, color: card.accent }"
          >
            <IconifyIcon :icon="card.icon" />
          </div>
        </div>
      </ElCard>
    </section>

    <section class="workspace-page__surface dashboard-surface">
      <div class="dashboard-panel-grid">
        <ElCard shadow="never" class="dashboard-panel-card">
          <template #header>
            <div class="dashboard-panel-card__title">{{ $t('page.dashboard.configInfo') }}</div>
          </template>
          <div class="dashboard-info-list">
            <div v-for="item in configItems" :key="item.label" class="dashboard-info-row">
              <span class="dashboard-info-row__label">{{ item.label }}</span>
              <span class="dashboard-info-row__value">{{ item.value }}</span>
            </div>
          </div>
        </ElCard>

        <ElCard shadow="never" class="dashboard-panel-card">
          <template #header>
            <div class="dashboard-panel-card__title">{{ $t('page.dashboard.systemInfo') }}</div>
          </template>
          <div class="dashboard-system-content">
            <div class="dashboard-progress-list">
              <div
                v-for="item in systemProgressItems"
                :key="item.label"
                class="dashboard-progress-item"
              >
                <div class="dashboard-progress-item__label-row">
                  <span>{{ item.label }}</span>
                  <span>{{ item.value }}%</span>
                </div>
                <ElProgress
                  :percentage="item.value"
                  :show-text="false"
                  :stroke-width="12"
                />
              </div>
            </div>

            <div class="dashboard-info-list dashboard-info-list--compact">
              <div
                v-for="item in systemInfoItems"
                :key="item.label"
                class="dashboard-info-row"
              >
                <span class="dashboard-info-row__label">{{ item.label }}</span>
                <span class="dashboard-info-row__value">{{ item.value }}</span>
              </div>
            </div>
          </div>
        </ElCard>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dashboard-page {
  gap: 22px;
}

.dashboard-page__header {
  gap: 6px;
}

.dashboard-page__description {
  max-width: 560px;
}

.dashboard-summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.dashboard-summary-card,
.dashboard-panel-card {
  overflow: hidden;
  background:
    linear-gradient(180deg, rgb(255 255 255 / 2%), rgb(255 255 255 / 0%)),
    var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 14px;
  box-shadow: 0 8px 18px rgb(0 0 0 / 8%);
}

.dashboard-summary-card :deep(.el-card__body) {
  padding: 0;
}

.dashboard-summary-card__head {
  padding: 16px 18px;
  font-size: 15px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.dashboard-summary-card__body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 136px;
  padding: 22px 22px 24px;
}

.dashboard-summary-card__value {
  font-size: 42px;
  font-weight: 700;
  line-height: 1;
  color: var(--el-text-color-primary);
}

.dashboard-summary-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 18px;
}

.dashboard-summary-card__icon :deep(svg) {
  width: 32px;
  height: 32px;
}

.dashboard-surface {
  min-height: auto;
}

.dashboard-panel-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.dashboard-panel-card :deep(.el-card__header) {
  padding: 18px 20px;
}

.dashboard-panel-card :deep(.el-card__body) {
  padding: 20px;
}

.dashboard-panel-card__title {
  font-size: 17px;
  font-weight: 700;
  color: var(--el-text-color-primary);
}

.dashboard-info-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dashboard-info-list--compact {
  margin-top: 24px;
}

.dashboard-info-row {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
}

.dashboard-info-row__label {
  font-size: 14px;
  color: var(--el-text-color-primary);
}

.dashboard-info-row__value {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  text-align: right;
}

.dashboard-system-content {
  display: flex;
  flex-direction: column;
}

.dashboard-progress-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.dashboard-progress-item__label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--el-text-color-primary);
}

@media (max-width: 1200px) {
  .dashboard-summary-grid,
  .dashboard-panel-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .dashboard-summary-grid,
  .dashboard-panel-grid {
    grid-template-columns: 1fr;
  }
}
</style>
