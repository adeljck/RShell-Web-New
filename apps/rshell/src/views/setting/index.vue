<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';

import { ElButton, ElInput, ElMessage } from 'element-plus';

import { getMockSetting, getSettingApi, updateSettingApi } from '#/api';
import { $t } from '#/locales';

defineOptions({ name: 'Setting' });

const loading = ref(false);
const saveLoading = ref(false);
const settingForm = reactive(getMockSetting());

async function loadSettingData() {
  loading.value = true;
  try {
    Object.assign(settingForm, await getSettingApi());
  } catch {
    Object.assign(settingForm, getMockSetting());
  } finally {
    loading.value = false;
  }
}

async function handleSave() {
  saveLoading.value = true;
  try {
    const result = await updateSettingApi({ ...settingForm });
    Object.assign(settingForm, result);
    ElMessage.success($t('page.setting.saveSuccess'));
  } catch {
    ElMessage.error($t('page.setting.saveError'));
  } finally {
    saveLoading.value = false;
  }
}

onMounted(() => {
  loadSettingData();
});
</script>

<template>
  <div class="setting-page">
    <div class="setting-header">
      <h1 class="setting-title">{{ $t('page.setting.pageTitle') }}</h1>
      <p class="setting-subtitle">{{ $t('page.setting.subtitle') }}</p>
    </div>

    <div class="setting-panel">
      <div v-if="loading" class="setting-loading">
        {{ $t('page.setting.loading') }}
      </div>

      <div v-else class="setting-form">
        <div class="setting-row">
          <div class="setting-label">
            {{ $t('page.setting.fields.dingToken') }}
          </div>
          <div class="setting-control">
            <ElInput
              v-model="settingForm.dingding_access_token"
              :disabled="saveLoading"
              :placeholder="$t('page.setting.placeholder')"
              clearable
            />
          </div>
        </div>

        <div class="setting-row">
          <div class="setting-label">
            {{ $t('page.setting.fields.dingKeyword') }}
          </div>
          <div class="setting-control">
            <ElInput
              v-model="settingForm.dingding_key_word"
              :disabled="saveLoading"
              :placeholder="$t('page.setting.placeholder')"
              clearable
            />
          </div>
        </div>

        <div class="setting-row">
          <div class="setting-label">{{ $t('page.setting.fields.wxKey') }}</div>
          <div class="setting-control">
            <ElInput
              v-model="settingForm.wx_key"
              :disabled="saveLoading"
              :placeholder="$t('page.setting.placeholder')"
              clearable
            />
          </div>
        </div>

        <div class="setting-actions">
          <ElButton type="primary" :loading="saveLoading" @click="handleSave">
            {{ $t('page.setting.save') }}
          </ElButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.setting-page {
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 12px 8px 0;
}

.setting-header {
  padding: 8px 8px 0;
}

.setting-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.25;
  color: var(--el-text-color-primary);
}

.setting-subtitle {
  margin: 18px 0 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--el-text-color-regular);
}

.setting-panel {
  min-height: 280px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
}

.setting-loading {
  padding: 28px 24px;
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.setting-form {
  padding: 32px 28px 30px;
}

.setting-row {
  display: flex;
  gap: 28px;
  align-items: center;
  margin-bottom: 26px;
}

.setting-label {
  width: 120px;
  font-size: 14px;
  color: var(--el-text-color-primary);
  text-align: right;
  white-space: nowrap;
}

.setting-control {
  width: 600px;
  max-width: 100%;
}

.setting-actions {
  padding-left: 148px;
}

@media (max-width: 900px) {
  .setting-form {
    padding: 24px 20px 28px;
  }

  .setting-row {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
    margin-bottom: 20px;
  }

  .setting-label,
  .setting-control {
    width: 100%;
    text-align: left;
  }

  .setting-actions {
    padding-left: 0;
  }
}
</style>
