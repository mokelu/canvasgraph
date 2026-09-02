<template>
  <div class="left-content">{{ panels.left.activeIcon || 'No panel' }}</div>
</template>

<script setup>
import { panels } from '../../machines/panels.js'
</script>

<style scoped>
.left-content {
  background: var(--bg-secondary);
  color: var(--text-primary);
  padding: var(--spacing-lg);
  border-right: var(--border-width) solid var(--border-color);
  overflow-y: auto;
}
</style>
