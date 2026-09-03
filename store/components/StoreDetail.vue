<template>
  <div class="store-detail">
    <button class="back-btn" @click="$emit('close')">← Back</button>

    <div class="detail-header">
      <div class="detail-icon">{{ icon }}</div>
      <div class="detail-title">
        <h2>{{ item.name }}</h2>
        <div class="detail-meta">
          <span>v{{ item.version }}</span>
          <span class="dot">·</span>
          <span>{{ item.license }}</span>
          <span class="dot">·</span>
          <span>{{ item.author }}</span>
        </div>
      </div>
    </div>

    <p class="detail-description">{{ item.description }}</p>

    <div class="detail-section" v-if="item.provides">
      <div class="section-label">Provides</div>
      <div class="tag-list">
        <span v-for="p in item.provides" :key="p" class="tag">{{ p }}</span>
      </div>
    </div>

    <div class="detail-section" v-if="item.requires && item.requires.length">
      <div class="section-label">Requires</div>
      <div class="tag-list">
        <span v-for="r in item.requires" :key="r" class="tag">{{ r }}</span>
      </div>
    </div>

    <div class="detail-actions">
      <div v-if="item.builtIn" class="built-in-label">Built into FAIRY</div>
      <button
        v-else
        class="detail-action-btn"
        :class="{ installed }"
        @click="installed ? $emit('uninstall') : $emit('install')"
      >
        {{ installed ? 'Uninstall' : 'Install' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: Object,
  installed: Boolean
})

defineEmits(['close', 'install', 'uninstall'])

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
.store-detail {
  padding: 20px;
}

.back-btn {
  background: transparent;
  border: none;
  color: var(--text-primary);
  opacity: 0.6;
  cursor: pointer;
  font-size: var(--font-size-sm);
  padding: 4px 0;
  margin-bottom: 20px;
}

.back-btn:hover {
  opacity: 1;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.detail-icon {
  font-size: 32px;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border: var(--border-width) solid var(--border-color);
  flex-shrink: 0;
}

.detail-title h2 {
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 500;
}

.detail-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-primary);
  opacity: 0.5;
  font-size: var(--font-size-sm);
  margin-top: 4px;
}

.dot {
  opacity: 0.3;
}

.detail-description {
  color: var(--text-primary);
  opacity: 0.7;
  font-size: var(--font-size-sm);
  line-height: 1.5;
  margin-bottom: 24px;
}

.detail-section {
  margin-bottom: 20px;
}

.section-label {
  color: var(--text-primary);
  opacity: 0.4;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  padding: 4px 8px;
  background: var(--bg-secondary);
  border: var(--border-width) solid var(--border-color);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
}

.detail-actions {
  margin-bottom: 24px;
}

.built-in-label {
  display: inline-block;
  padding: 8px 16px;
  background: var(--bg-secondary);
  border: var(--border-width) solid var(--border-color);
  color: var(--text-primary);
  opacity: 0.5;
  font-size: var(--font-size-sm);
}

.detail-action-btn {
  padding: 8px 24px;
  background: var(--bg-primary);
  border: var(--border-width) solid var(--border-color);
  color: var(--text-primary);
  cursor: pointer;
  font-size: var(--font-size-sm);
}

.detail-action-btn:hover {
  background: var(--hover-bg);
}

.detail-action-btn.installed {
  opacity: 0.5;
}
</style>
