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
  </AuthPageLayout>
</template>

<style scoped>
.rshell-auth-layout:deep(.rounded-3xl.pb-20.shadow-float) {
  width: min(30rem, calc(100% - 2rem));
  max-width: 30rem;
  min-height: 28.5rem;
  padding: 2.25rem 2rem 3.4rem;
  border: 1px solid var(--el-border-color-lighter);
  box-shadow: 0 16px 38px rgb(0 0 0 / 14%);
}

.rshell-auth-layout:deep(.side-content[data-side='bottom']) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.25rem;
  max-width: 23rem;
  min-height: 22rem;
  margin-top: 0;
}

@media (max-width: 768px) {
  .rshell-auth-layout:deep(.rounded-3xl.pb-20.shadow-float) {
    width: calc(100% - 1.5rem);
    min-height: auto;
    padding: 1.75rem 1.5rem 2.5rem;
  }

  .rshell-auth-layout:deep(.side-content[data-side='bottom']) {
    max-width: 100%;
    min-height: auto;
  }
}
</style>
