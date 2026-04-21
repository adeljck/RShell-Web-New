<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';

import { computed } from 'vue';

import { AuthenticationLogin, z } from '@vben/common-ui';
import { preferences } from '@vben/preferences';
import { $t } from '@vben/locales';

import { useAuthStore } from '#/store';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();
const appName = computed(() => preferences.app.name);
const logo = computed(() => preferences.logo.source);

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      fieldName: 'username',
      label: $t('authentication.username'),
      rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.password'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      rules: z.string().min(1, { message: $t('authentication.passwordTip') }),
    },
  ];
});
</script>

<template>
  <div class="login-panel">
    <div class="login-brand">
      <img v-if="logo" :src="logo" :alt="appName" class="login-brand__logo" />
      <span class="login-brand__name">{{ appName }}</span>
    </div>

    <AuthenticationLogin
      :form-schema="formSchema"
      :loading="authStore.loginLoading"
      :show-code-login="false"
      :show-forget-password="false"
      :show-qrcode-login="false"
      :show-register="false"
      :show-remember-me="false"
      :show-third-party-login="false"
      :show-title="false"
      @submit="authStore.authLogin"
    />
  </div>
</template>

<style scoped>
.login-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.login-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.login-brand__logo {
  width: 2.5rem;
  height: 2.5rem;
  object-fit: contain;
  flex-shrink: 0;
}

.login-brand__name {
  color: hsl(var(--foreground));
  font-size: 1.625rem;
  font-weight: 700;
  line-height: 1;
}
</style>
