<script setup lang="ts">
import type { ThemeModeType } from '@vben/types';

import { computed } from 'vue';

import { $t } from '@vben/locales';

import SwitchItem from '../switch-item.vue';

defineOptions({
  name: 'PreferenceTheme',
});

const modelValue = defineModel<ThemeModeType>({ default: 'light' });
const themeSemiDarkSidebar = defineModel<boolean>('themeSemiDarkSidebar');
const themeSemiDarkSidebarSub = defineModel<boolean>('themeSemiDarkSidebarSub');
const themeSemiDarkHeader = defineModel<boolean>('themeSemiDarkHeader');

const isDarkMode = computed({
  get: () => modelValue.value === 'dark',
  set: (value) => {
    modelValue.value = value ? 'dark' : 'light';
    themeSemiDarkHeader.value = false;
    themeSemiDarkSidebar.value = false;
    themeSemiDarkSidebarSub.value = false;
  },
});

function themeLabel() {
  return isDarkMode.value
    ? $t('preferences.theme.dark')
    : $t('preferences.theme.light');
}
</script>

<template>
  <SwitchItem v-model="isDarkMode">
    {{ themeLabel() }}
  </SwitchItem>
</template>
