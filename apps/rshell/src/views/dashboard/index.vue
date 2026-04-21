<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';

import { ElCard, ElProgress } from 'element-plus';

import { IconifyIcon } from '@vben/icons';
import { getDashboardOverviewApi, getMockDashboardOverview } from '#/api';

defineOptions({ name: 'Dashboard' });

const dashboardData = ref(getMockDashboardOverview());

const summaryCards = computed(() => [
  {
    accent: '#2563eb',
    icon: 'mdi:monitor-dashboard',
    label: '终端总数',
    value: dashboardData.value.clientCount,
  },
  {
    accent: '#059669',
    icon: 'mdi:laptop',
    label: '在线终端',
    value: dashboardData.value.clientOnlineCount,
  },
  {
    accent: '#7c3aed',
    icon: 'mdi:cpu-64-bit',
    label: 'CPU 使用率',
    value: `${dashboardData.value.cpu}%`,
  },
  {
    accent: '#ea580c',
    icon: 'mdi:memory',
    label: '内存使用率',
    value: `${dashboardData.value.virtual_mem}%`,
  },
]);

const configItems = computed(() => [
  { label: 'WEB 端口', value: dashboardData.value.web_port || '-' },
  { label: 'Basic 认证', value: formatBoolean(dashboardData.value.web_basic_auth) },
  { label: '版本', value: dashboardData.value.version || '-' },
]);

const systemProgressItems = computed(() => [
  { label: '处理器', value: dashboardData.value.cpu },
  { label: '磁盘', value: dashboardData.value.disk },
  { label: '内存', value: dashboardData.value.virtual_mem },
  { label: '虚拟内存', value: dashboardData.value.swap_mem },
]);

const systemInfoItems = computed(() => [
  { label: 'TCP 连接数', value: dashboardData.value.tcpCount },
  { label: 'UDP 连接数', value: dashboardData.value.udpCount },
  { label: '流出带宽', value: formatBytes(dashboardData.value.exportFlowCount) },
  { label: '流入带宽', value: formatBytes(dashboardData.value.inletFlowCount) },
]);

async function loadDashboardData() {
  try {
    dashboardData.value = await getDashboardOverviewApi();
  } catch {
    dashboardData.value = getMockDashboardOverview();
  }
}

function formatBoolean(value: boolean) {
  return value ? '已启用' : '未启用';
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
          <div class="summary-icon" :style="{ backgroundColor: `${card.accent}14`, color: card.accent }">
            <IconifyIcon :icon="card.icon" />
          </div>
        </div>
      </ElCard>
    </div>

    <div class="panel-grid">
      <ElCard shadow="never" class="panel-card">
        <template #header>
          <div class="panel-title">配置信息</div>
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
          <div class="panel-title">系统信息</div>
        </template>
        <div class="system-content">
          <div class="progress-list">
            <div v-for="item in systemProgressItems" :key="item.label" class="progress-item">
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
            <div v-for="item in systemInfoItems" :key="item.label" class="info-row">
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
  border-bottom: 1px solid var(--el-border-color-lighter);
  color: var(--el-text-color-primary);
  font-size: 16px;
  font-weight: 700;
}

.summary-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 138px;
  padding: 22px 24px;
}

.summary-value {
  color: var(--el-text-color-primary);
  font-size: 46px;
  font-weight: 700;
  line-height: 1;
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
  color: var(--el-text-color-primary);
  font-size: 18px;
  font-weight: 700;
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
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.info-label {
  color: var(--el-text-color-primary);
  font-size: 15px;
}

.info-value {
  color: var(--el-text-color-primary);
  font-size: 15px;
  font-weight: 500;
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
  color: var(--el-text-color-primary);
  font-size: 15px;
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
