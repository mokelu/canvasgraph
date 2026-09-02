<template>
  <div class="top-bar">
    <span class="title">{{ app.title }}</span>
    <LayoutPicker />
  </div>
</template>

<script setup>
import { app } from '../../machines/app.js'
import LayoutPicker from '../panes/LayoutPicker.vue'
</script>

<style scoped>
.top-bar {
  background: var(--bg-primary);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-lg);
  height: var(--topbar-height);
  border-bottom: var(--border-width) solid var(--border-color);
}

.title {
  font-weight: bold;
}
</style>
