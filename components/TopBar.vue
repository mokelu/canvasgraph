<template>
  <div class="top-bar">{{ app.title }}</div>
</template>

<script setup>
import { app } from '../state/app.js'
</script>

<style scoped>
.top-bar {
  background: var(--bg-primary);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-lg);
  height: var(--topbar-height);
  border-bottom: var(--border-width) solid var(--border-color);
}
</style>
