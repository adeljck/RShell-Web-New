<script setup lang="ts">
defineProps<{
  description: string;
  title: string;
}>();
</script>

<template>
  <div class="generator-panel__inner">
    <div class="generator-panel__header">
      <h2 class="generator-panel__title">{{ title }}</h2>
      <p class="generator-panel__description">{{ description }}</p>
    </div>

    <slot />
  </div>
</template>
