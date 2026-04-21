<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { getClientOverviewApi, getMockClientOverview } from '#/api';

defineOptions({ name: 'Client' });

const clientOverview = ref(getMockClientOverview());

async function loadClientOverview() {
  try {
    clientOverview.value = await getClientOverviewApi();
  } catch {
    clientOverview.value = getMockClientOverview();
  }
}

onMounted(() => {
  loadClientOverview();
});
</script>

<template>
  <div class="space-y-4">
    <ElRow :gutter="16">
      <ElCol
        v-for="item in clientOverview.stats"
        :key="item.label"
        :lg="6"
        :md="12"
        :sm="12"
        :xs="24"
      >
        <ElCard shadow="hover">
          <div class="text-sm text-muted-foreground">{{ item.label }}</div>
          <div class="mt-3 text-2xl font-semibold">{{ item.value }}</div>
        </ElCard>
      </ElCol>
    </ElRow>

    <ElCard header="终端资产概览" shadow="never">
      <ElTable :data="clientOverview.list">
        <ElTableColumn label="终端名称" prop="name" />
        <ElTableColumn label="所属部门" prop="owner" />
        <ElTableColumn label="状态" prop="status" />
        <ElTableColumn label="IP 地址" prop="ip" />
      </ElTable>
    </ElCard>
  </div>
</template>
