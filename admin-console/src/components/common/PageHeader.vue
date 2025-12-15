<template>
  <div class="page-header">
    <h2>{{ title }}</h2>
    <p v-if="description" class="page-description">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<style scoped lang="scss">
.page-header {
  margin-bottom: 20px;

  h2 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #303133;
  }

  .page-description {
    font-size: 14px;
    color: #909399;
    margin: 0;
  }
}
</style>
