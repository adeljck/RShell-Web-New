<script setup lang="ts">
import type { BuiltinThemeType, LayoutType } from '@vben/types';

import { usePreferences } from '@vben/preferences';

import { useVbenDrawer } from '@vben-core/popup-ui';

import {
  Block,
  BuiltinTheme,
  Layout,
} from './blocks';

const appLayout = defineModel<LayoutType>('appLayout');
const themeColorPrimary = defineModel<string>('themeColorPrimary');
const themeBuiltinType = defineModel<BuiltinThemeType>('themeBuiltinType');

const { isDark } = usePreferences();

const [Drawer] = useVbenDrawer();
</script>

<template>
  <div>
    <Drawer
      :show-cancel-button="false"
      :show-confirm-button="false"
      title="主题设置"
      class="border-0! sm:max-w-sm"
    >
      <div>
        <Block title="主题颜色">
          <BuiltinTheme
            v-model="themeBuiltinType"
            v-model:theme-color-primary="themeColorPrimary"
            :is-dark="isDark"
          />
        </Block>
        <Block title="导航栏模式">
          <Layout v-model="appLayout" />
        </Block>
      </div>
    </Drawer>
  </div>
</template>
