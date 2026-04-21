<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';

import { ElMessage } from 'element-plus';

import { getMockSetting, getSettingApi, updateSettingApi } from '#/api';

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
    ElMessage.success('保存成功');
  } catch {
    ElMessage.error('保存失败');
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
      <h1 class="setting-title">设置</h1>
      <p class="setting-subtitle">无需重启修改部分设置</p>
    </div>

    <div class="setting-panel">
      <div v-if="loading" class="setting-loading">加载中...</div>

      <div v-else class="setting-form">
        <div class="setting-row">
          <div class="setting-label">钉钉 token</div>
          <div class="setting-control">
            <ElInput
              v-model="settingForm.dingding_access_token"
              :disabled="saveLoading"
              clearable
              placeholder="请输入"
            />
          </div>
        </div>

        <div class="setting-row">
          <div class="setting-label">钉钉 key_word</div>
          <div class="setting-control">
            <ElInput
              v-model="settingForm.dingding_key_word"
              :disabled="saveLoading"
              clearable
              placeholder="请输入"
            />
          </div>
        </div>

        <div class="setting-row">
          <div class="setting-label">微信 wx_key</div>
          <div class="setting-control">
            <ElInput
              v-model="settingForm.wx_key"
              :disabled="saveLoading"
              clearable
              placeholder="请输入"
            />
          </div>
        </div>

        <div class="setting-actions">
          <ElButton type="primary" :loading="saveLoading" @click="handleSave">
            保存
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
  gap: 24px;
  padding: 12px;
}

.setting-header {
  padding: 8px 6px 0;
}

.setting-title {
  margin: 0;
  color: var(--el-text-color-primary);
  font-size: 20px;
  font-weight: 700;
}

.setting-subtitle {
  margin: 28px 0 0;
  color: var(--el-text-color-regular);
  font-size: 14px;
}

.setting-panel {
  min-height: 360px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  background: var(--el-bg-color);
}

.setting-loading {
  padding: 28px 24px;
  color: var(--el-text-color-regular);
  font-size: 14px;
}

.setting-form {
  padding: 40px 48px 48px;
}

.setting-row {
  display: flex;
  align-items: center;
  gap: 28px;
  margin-bottom: 36px;
}

.setting-label {
  width: 140px;
  color: var(--el-text-color-primary);
  font-size: 16px;
  text-align: right;
  white-space: nowrap;
}

.setting-control {
  width: 480px;
  max-width: 100%;
}

.setting-actions {
  padding-left: 168px;
}

@media (max-width: 900px) {
  .setting-form {
    padding: 24px 20px 32px;
  }

  .setting-row {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    margin-bottom: 24px;
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
