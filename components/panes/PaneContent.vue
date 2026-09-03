<template>
  <div class="pane-content">
    <template v-if="currentContent">
      <template v-if="loader">
        <Suspense>
          <component :is="asyncComponent" />
          <template #fallback>
            <div class="loading">Loading...</div>
          </template>
        </Suspense>
      </template>
      <template v-else>
        <div class="missing">
          <p>"{{ currentContent }}" was uninstalled.</p>
          <button class="close-btn" @click="clearContent">Close pane</button>
        </div>
      </template>
    </template>
    <template v-else>
      <button class="add-content" @click.stop="open = !open">+ Add content</button>
      <div v-if="open" class="picker">
        <button
          v-for="[id] in available"
          :key="id"
          class="picker-item"
          @click="addContent(id)"
        >
          {{ id }}
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, defineAsyncComponent } from 'vue'
import { contentTypes } from '../../core/plugin-api.js'
import { panes, setPaneContent } from '../../machines/panes.js'

const props = defineProps({
  path: String
})

const open = ref(false)

const currentContent = computed(() => panes.content[props.path] || null)

const loader = computed(() => {
  if (!currentContent.value) return null
  return contentTypes.get(currentContent.value) || null
})

const asyncComponent = computed(() => {
  if (!loader.value) return null
  return defineAsyncComponent(loader.value)
})

const available = computed(() => [...contentTypes.entries()])

function addContent(type) {
  setPaneContent(props.path, type)
  open.value = false
}

function clearContent() {
  setPaneContent(props.path, null)
}
</script>

<style scoped>
.pane-content {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background: var(--bg-primary);
}

.add-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 6px 12px;
  background: transparent;
  color: var(--text-primary);
  border: var(--border-width) solid var(--border-color);
  cursor: pointer;
  font-size: var(--font-size-sm);
  opacity: 0.4;
}

.add-content:hover {
  opacity: 1;
}

.picker {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--bg-secondary);
  border: var(--border-width) solid var(--border-color);
  padding: 8px;
  z-index: 10;
  min-width: 140px;
}

.picker-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  background: transparent;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  font-size: var(--font-size-sm);
}

.picker-item:hover {
  background: var(--hover-bg);
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--text-primary);
  opacity: 0.5;
  font-size: var(--font-size-sm);
}

.missing {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--text-primary);
  opacity: 0.5;
  font-size: var(--font-size-sm);
  gap: 8px;
}

.close-btn {
  padding: 4px 12px;
  background: transparent;
  color: var(--text-primary);
  border: var(--border-width) solid var(--border-color);
  cursor: pointer;
  font-size: var(--font-size-sm);
}
</style>
