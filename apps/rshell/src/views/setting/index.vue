<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';

import { ElButton, ElInput, ElMessage } from 'element-plus';

import { getMockSetting, getSettingApi, updateSettingApi } from '#/api';
import { $t } from '#/locales';

import '../_shared/workspace-page.css';

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
  <div class="setting-page workspace-page">
    <div class="setting-header workspace-page__header">
      <h1 class="setting-title workspace-page__title">{{ $t('page.setting.pageTitle') }}</h1>
      <p class="setting-subtitle workspace-page__description">{{ $t('page.setting.subtitle') }}</p>
    </div>

    <div class="setting-panel workspace-page__surface">
      <div v-if="loading" class="setting-loading">
        {{ $t('page.setting.loading') }}
      </div>

      <div v-else class="setting-form workspace-page__section">
        <div class="setting-row workspace-page__field-row">
          <div class="setting-label workspace-page__field-label">
            {{ $t('page.setting.fields.dingToken') }}
          </div>
          <div class="setting-control workspace-page__field-control">
            <ElInput
              v-model="settingForm.dingding_access_token"
              :disabled="saveLoading"
              :placeholder="$t('page.setting.placeholder')"
              clearable
            />
          </div>
        </div>

        <div class="setting-row workspace-page__field-row">
          <div class="setting-label workspace-page__field-label">
            {{ $t('page.setting.fields.dingKeyword') }}
          </div>
          <div class="setting-control workspace-page__field-control">
            <ElInput
              v-model="settingForm.dingding_key_word"
              :disabled="saveLoading"
              :placeholder="$t('page.setting.placeholder')"
              clearable
            />
          </div>
        </div>

        <div class="setting-row workspace-page__field-row">
          <div class="setting-label workspace-page__field-label">{{ $t('page.setting.fields.wxKey') }}</div>
          <div class="setting-control workspace-page__field-control">
            <ElInput
              v-model="settingForm.wx_key"
              :disabled="saveLoading"
              :placeholder="$t('page.setting.placeholder')"
              clearable
            />
          </div>
        </div>

        <div class="setting-actions workspace-page__actions">
          <ElButton type="primary" :loading="saveLoading" @click="handleSave">
            {{ $t('page.setting.save') }}
          </ElButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.setting-loading {
  padding: 28px 24px;
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.setting-form {
  padding: 8px 4px 0;
}
</style>
