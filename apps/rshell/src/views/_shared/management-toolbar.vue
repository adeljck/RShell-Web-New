<script setup lang="ts">
defineOptions({ name: 'ManagementToolbar' });
</script>

<template>
  <div class="management-page__card management-page__toolbar-card">
    <div class="management-page__toolbar-actions">
      <slot name="actions" />
    </div>

    <div class="management-page__toolbar-tools">
      <slot name="tools" />
    </div>
  </div>
</template>
