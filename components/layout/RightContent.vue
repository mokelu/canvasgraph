<template>
  <div class="right-content">{{ panels.right.activeIcon || 'No panel' }}</div>
</template>

<script setup>
import { panels } from '../../machines/panels.js'
</script>

<style scoped>
.right-content {
  background: var(--bg-secondary);
  color: var(--text-primary);
  padding: var(--spacing-lg);
  border-left: var(--border-width) solid var(--border-color);
  overflow-y: auto;
}
</style>
