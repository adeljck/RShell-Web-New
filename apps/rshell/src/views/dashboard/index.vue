<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';

import { IconifyIcon } from '@vben/icons';

import { ElCard, ElProgress } from 'element-plus';

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
  loadDashboardData();
});
</script>

<template>
  <div class="dashboard-page">
    <div class="summary-grid">
      <ElCard
        v-for="card in summaryCards"
        :key="card.label"
        shadow="never"
        class="summary-card"
      >
        <div class="summary-head">{{ card.label }}</div>
        <div class="summary-body">
          <div class="summary-value">{{ card.value }}</div>
          <div
            class="summary-icon"
            :style="{ backgroundColor: `${card.accent}14`, color: card.accent }"
          >
            <IconifyIcon :icon="card.icon" />
          </div>
        </div>
      </ElCard>
    </div>

    <div class="panel-grid">
      <ElCard shadow="never" class="panel-card">
        <template #header>
          <div class="panel-title">{{ $t('page.dashboard.configInfo') }}</div>
        </template>
        <div class="info-list">
          <div v-for="item in configItems" :key="item.label" class="info-row">
            <span class="info-label">{{ item.label }}</span>
            <span class="info-value">{{ item.value }}</span>
          </div>
        </div>
      </ElCard>

      <ElCard shadow="never" class="panel-card">
        <template #header>
          <div class="panel-title">{{ $t('page.dashboard.systemInfo') }}</div>
        </template>
        <div class="system-content">
          <div class="progress-list">
            <div
              v-for="item in systemProgressItems"
              :key="item.label"
              class="progress-item"
            >
              <div class="progress-label-row">
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

          <div class="info-list compact">
            <div
              v-for="item in systemInfoItems"
              :key="item.label"
              class="info-row"
            >
              <span class="info-label">{{ item.label }}</span>
              <span class="info-value">{{ item.value }}</span>
            </div>
          </div>
        </div>
      </ElCard>
    </div>
  </div>
</template>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 12px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
}

.summary-card,
.panel-card {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 16px;
}

.summary-card :deep(.el-card__body) {
  padding: 0;
}

.summary-head {
  padding: 16px 20px;
  font-size: 16px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.summary-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 138px;
  padding: 22px 24px;
}

.summary-value {
  font-size: 46px;
  font-weight: 700;
  line-height: 1;
  color: var(--el-text-color-primary);
}

.summary-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68px;
  height: 68px;
  border-radius: 18px;
}

.summary-icon :deep(svg) {
  width: 34px;
  height: 34px;
}

.panel-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.panel-card :deep(.el-card__header) {
  padding: 18px 22px;
}

.panel-card :deep(.el-card__body) {
  padding: 22px;
}

.panel-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--el-text-color-primary);
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.info-list.compact {
  margin-top: 28px;
}

.info-row {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
}

.info-label {
  font-size: 15px;
  color: var(--el-text-color-primary);
}

.info-value {
  font-size: 15px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  text-align: right;
}

.system-content {
  display: flex;
  flex-direction: column;
}

.progress-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.progress-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 15px;
  color: var(--el-text-color-primary);
}

@media (max-width: 1200px) {
  .summary-grid,
  .panel-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 900px) {
  .summary-grid,
  .panel-grid {
    grid-template-columns: 1fr;
  }
}
</style>
