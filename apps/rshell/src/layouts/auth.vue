<script lang="ts" setup>
import { computed } from 'vue';

import { AuthPageLayout } from '@vben/layouts';
import { preferences } from '@vben/preferences';

const appName = computed(() => preferences.app.name);
const logo = computed(() => preferences.logo.source);
const logoDark = computed(() => preferences.logo.sourceDark);
</script>

<template>
  <AuthPageLayout
    :app-name="appName"
    :logo="logo"
    :logo-dark="logoDark"
    class="rshell-auth-layout"
  >
    <template #logo></template>
    <!-- 自定义工具栏 -->
    <!-- <template #toolbar></template> -->
  </AuthPageLayout>
</template>

<style scoped>
.rshell-auth-layout:deep(.rounded-3xl.pb-20.shadow-float) {
  width: min(28rem, calc(100% - 2rem));
  max-width: 28rem;
  min-height: 28rem;
  padding-right: 2rem;
  padding-bottom: 4rem;
  padding-left: 2rem;
}

.rshell-auth-layout:deep(.side-content[data-side='bottom']) {
  max-width: 22rem;
  min-height: 22rem;
  margin-top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

@media (max-width: 768px) {
  .rshell-auth-layout:deep(.rounded-3xl.pb-20.shadow-float) {
    width: calc(100% - 1.5rem);
    min-height: auto;
    padding-right: 1.5rem;
    padding-bottom: 3rem;
    padding-left: 1.5rem;
  }

  .rshell-auth-layout:deep(.side-content[data-side='bottom']) {
    max-width: 100%;
    min-height: auto;
  }
}
</style>
