<script setup lang="ts">
import { ref, useSlots } from 'vue';

import { Eye, EyeOff } from '@vben-core/icons';
import { cn } from '@vben-core/shared/utils';

import { Input } from '../../ui';
import PasswordStrength from './password-strength.vue';

interface Props {
  class?: any;
  /**
   * 是否显示密码强度
   */
  passwordStrength?: boolean;
}

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<Props>();

const modelValue = defineModel<string>();

const slots = useSlots();

const show = ref(false);
</script>

<template>
  <div class="relative w-full">
    <Input
      v-bind="$attrs"
      v-model="modelValue"
      :class="cn(props.class)"
      :type="show ? 'text' : 'password'"
    />
    <template v-if="passwordStrength">
      <PasswordStrength :password="modelValue" />
      <p v-if="slots.strengthText" class="text-muted-foreground mt-1.5 text-xs">
        <slot name="strengthText"> </slot>
      </p>
    </template>
    <div
      :class="{
        'top-3': !!passwordStrength,
        'top-1/2 -translate-y-1/2': !passwordStrength,
      }"
      class="text-foreground/60 hover:text-foreground absolute right-3 z-10 flex cursor-pointer items-center justify-center text-lg leading-none"
      @click="show = !show"
    >
      <Eye v-if="show" class="size-4" />
      <EyeOff v-else class="size-4" />
    </div>
  </div>
</template>
