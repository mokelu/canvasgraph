<template>
  <div class="left-content">
    <Store v-if="panels.left.activeIcon === 'store'" />
    <div v-else class="placeholder">{{ panels.left.activeIcon || 'No panel' }}</div>
  </div>
</template>

<script setup>
import { panels } from '../../machines/panels.js'
import Store from '../../store/components/Store.vue'
</script>

<style scoped>
.left-content {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-right: var(--border-width) solid var(--border-color);
  overflow: hidden;
}

.placeholder {
  padding: var(--spacing-lg);
}
</style>
