<script setup lang="ts">
import { VbenIconButton } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus';

defineOptions({ name: 'ManagementTableTools' });

type GridDensity = 'medium' | 'mini' | 'small';

defineProps<{
  columnsTitle: string;
  density: GridDensity;
  densityCompactText: string;
  densityDefaultText: string;
  densityComfortableText: string;
  densityTitle: string;
  dropdownClass?: string;
  refreshTitle: string;
}>();

const emit = defineEmits<{
  (event: 'columns'): void;
  (event: 'densityChange', value: GridDensity): void;
  (event: 'refresh'): void;
}>();
</script>

<template>
  <div class="management-page__toolbar-tool-group">
    <slot name="primary" />

    <VbenIconButton :title="refreshTitle" @click="emit('refresh')">
      <IconifyIcon icon="ant-design:redo-outlined" />
    </VbenIconButton>

    <VbenIconButton :title="densityTitle">
      <ElDropdown placement="bottom-end" trigger="click" @command="emit('densityChange', $event)">
        <span class="management-page__toolbar-dropdown-trigger">
          <IconifyIcon icon="ant-design:column-height-outlined" />
        </span>
        <template #dropdown>
          <ElDropdownMenu :class="dropdownClass">
            <ElDropdownItem :command="'medium'" :class="{ 'is-active': density === 'medium' }">
              {{ densityComfortableText }}
            </ElDropdownItem>
            <ElDropdownItem :command="'small'" :class="{ 'is-active': density === 'small' }">
              {{ densityDefaultText }}
            </ElDropdownItem>
            <ElDropdownItem :command="'mini'" :class="{ 'is-active': density === 'mini' }">
              {{ densityCompactText }}
            </ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
    </VbenIconButton>

    <VbenIconButton :title="columnsTitle" @click="emit('columns')">
      <IconifyIcon icon="ant-design:setting-outlined" />
    </VbenIconButton>

    <slot />
  </div>
</template>
