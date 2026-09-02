<template>
  <div class="right-dock">
    <span
      v-for="icon in rightIcons"
      :key="icon.id"
      class="icon"
      :class="{ active: panels.right.activeIcon === icon.id }"
      @click="panels.right.activeIcon = icon.id"
    >{{ icon.symbol }}</span>
  </div>
</template>

<script setup>
import { panels } from '../../machines/panels.js'
import { rightIcons } from '../../machines/icons.js'
</script>

<style scoped>
.right-dock {
  background: var(--bg-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: var(--spacing-md);
  gap: var(--spacing-sm);
  width: var(--dock-width);
  border-left: var(--border-width) solid var(--border-color);
}

.icon {
  font-size: var(--icon-size);
  cursor: pointer;
  padding: var(--spacing-md);
}

.icon:hover {
  background: var(--hover-bg);
}

.icon.active {
  background: var(--hover-bg);
}

@media (max-width: 640px) {
  .right-dock {
    display: none;
  }
}
</style>
