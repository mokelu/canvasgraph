<template>
  <div class="store-card" @click="$emit('select', item)">
    <div class="card-icon">{{ icon }}</div>
    <div class="card-info">
      <div class="card-name">{{ item.name }}</div>
      <div class="card-meta">
        <span class="card-version">v{{ item.version }}</span>
        <span class="card-dot">·</span>
        <span>{{ item.license }}</span>
      </div>
    </div>
    <div class="card-badge" v-if="item.builtIn">Built-in</div>
    <button
      v-else
      class="card-action"
      :class="{ installed }"
      @click.stop="installed ? $emit('uninstall') : $emit('install')"
    >
      {{ installed ? 'Installed' : 'Install' }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: Object,
  installed: Boolean
})

defineEmits(['select', 'install', 'uninstall'])

const icon = computed(() => {
  const icons = {
    library: '📦',
    app: '📱',
    visualization: '📊',
    rendering: '🎨',
    layout: '📐',
    editor: '✏️',
    data: '📋'
  }
  return icons[props.item.type] || '📦'
})
</script>

<style scoped>
.store-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-secondary);
  border: var(--border-width) solid var(--border-color);
  cursor: pointer;
  transition: background 0.15s;
}

.store-card:hover {
  background: var(--hover-bg);
}

.card-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  border: var(--border-width) solid var(--border-color);
  flex-shrink: 0;
}

.card-info {
  flex: 1;
  min-width: 0;
}

.card-name {
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--text-primary);
  opacity: 0.5;
  font-size: 10px;
  margin-top: 2px;
}

.card-dot {
  opacity: 0.3;
}

.card-badge {
  padding: 4px 8px;
  background: var(--bg-primary);
  border: var(--border-width) solid var(--border-color);
  color: var(--text-primary);
  opacity: 0.5;
  font-size: 10px;
  flex-shrink: 0;
}

.card-action {
  padding: 4px 12px;
  background: var(--bg-primary);
  border: var(--border-width) solid var(--border-color);
  color: var(--text-primary);
  cursor: pointer;
  font-size: 10px;
  flex-shrink: 0;
}

.card-action:hover {
  background: var(--hover-bg);
}

.card-action.installed {
  opacity: 0.5;
  cursor: default;
}
</style>
