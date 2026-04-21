<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { ElCard } from 'element-plus';

import { getAboutInfoApi, getMockAboutInfo } from '#/api';
import { $t } from '#/locales';

defineOptions({ name: 'About' });

const aboutInfo = ref(getMockAboutInfo());

const releaseTitle = computed(() => {
  return `${aboutInfo.value.version} ${$t('page.about.releaseDetails')}`;
});

const updates = computed(() => aboutInfo.value.updates);

async function loadAboutInfo() {
  try {
    aboutInfo.value = await getAboutInfoApi();
  } catch {
    aboutInfo.value = getMockAboutInfo();
  }
}

onMounted(() => {
  loadAboutInfo();
});
</script>

<template>
  <div class="about-page">
    <h1 class="about-title">{{ $t('page.about.title') }}</h1>

    <ElCard shadow="never" class="about-card">
      <template #header>
        <div class="about-card__title">{{ releaseTitle }}</div>
      </template>

      <ul class="about-list">
        <li v-for="item in updates" :key="item" class="about-list__item">
          {{ item }}
        </li>
      </ul>
    </ElCard>
  </div>
</template>

<style scoped>
.about-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 12px;
}

.about-title {
  margin: 0;
  color: var(--el-text-color-primary);
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
}

.about-card {
  width: min(100%, 660px);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
}

.about-card :deep(.el-card__header) {
  padding: 16px 22px;
}

.about-card :deep(.el-card__body) {
  padding: 18px 22px 20px;
}

.about-card__title {
  color: var(--el-text-color-primary);
  font-size: 16px;
  font-weight: 700;
}

.about-list {
  margin: 0;
  padding-left: 18px;
  color: var(--el-text-color-primary);
  font-size: 14px;
  line-height: 1.9;
}

.about-list__item + .about-list__item {
  margin-top: 2px;
}
</style>
