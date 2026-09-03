<template>
  <div class="layout-picker">
    <button class="trigger" @click="open = !open">
      {{ panes.count }} panes
    </button>
    <div v-if="open" class="dropdown">
      <div v-for="n in [1, 2, 3, 4]" :key="n" class="section">
        <div class="section-header">{{ n }} pane{{ n > 1 ? 's' : '' }}</div>
        <div class="variants">
          <button
            v-for="layout in layouts[n]"
            :key="layout.id"
            class="variant"
            :class="{ active: panes.layoutId === layout.id }"
            @click="select(n, layout.id)"
          >
            <div class="thumbnail">
              <component :is="getPreview(n, layout.id)" />
            </div>
            <span class="label">{{ layout.label }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { panes } from '../../machines/panes.js'
import { layouts } from '../../machines/layouts.js'
import Preview1a from './previews/Preview1a.vue'
import Preview2a from './previews/Preview2a.vue'
import Preview2b from './previews/Preview2b.vue'
import Preview3a from './previews/Preview3a.vue'
import Preview3b from './previews/Preview3b.vue'
import Preview3c from './previews/Preview3c.vue'
import Preview4a from './previews/Preview4a.vue'
import Preview4b from './previews/Preview4b.vue'
import Preview4c from './previews/Preview4c.vue'
import Preview4d from './previews/Preview4d.vue'

const open = ref(false)

const previewMap = {
  '1-a': Preview1a,
  '2-a': Preview2a,
  '2-b': Preview2b,
  '3-a': Preview3a,
  '3-b': Preview3b,
  '3-c': Preview3c,
  '4-a': Preview4a,
  '4-b': Preview4b,
  '4-c': Preview4c,
  '4-d': Preview4d
}

function getPreview(count, layoutId) {
  return previewMap[layoutId] || Preview1a
}

function select(count, layoutId) {
  panes.count = count
  panes.layoutId = layoutId
  panes.content = {}
  open.value = false
}
</script>

<style scoped>
.layout-picker {
  position: relative;
}

.trigger {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: var(--border-width) solid var(--border-color);
  padding: 4px 12px;
  cursor: pointer;
  font-size: var(--font-size-sm);
}

.trigger:hover {
  background: var(--hover-bg);
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  background: var(--bg-secondary);
  border: var(--border-width) solid var(--border-color);
  padding: 8px;
  z-index: 100;
  min-width: 200px;
}

.section {
  margin-bottom: 8px;
}

.section:last-child {
  margin-bottom: 0;
}

.section-header {
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  padding: 4px 0;
  opacity: 0.6;
}

.variants {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.variant {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px;
  background: transparent;
  border: var(--border-width) solid transparent;
  cursor: pointer;
  color: var(--text-primary);
}

.variant:hover {
  background: var(--hover-bg);
}

.variant.active {
  border-color: var(--text-primary);
}

.thumbnail {
  width: 48px;
  height: 32px;
  border: var(--border-width) solid var(--border-color);
  display: flex;
}

.label {
  font-size: 10px;
}
</style>
