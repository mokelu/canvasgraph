<template>
  <div class="pane" :class="pane.direction || 'horizontal'">
    <template v-if="pane.children">
      <template v-for="(child, i) in pane.children" :key="i">
        <Pane :pane="child" :path="path + '-' + i" />
        <div v-if="i < pane.children.length - 1" class="divider" :class="pane.direction"></div>
      </template>
    </template>
    <template v-else>
      <PaneContent :path="path" />
    </template>
  </div>
</template>

<script setup>
import PaneContent from './PaneContent.vue'

defineProps({
  pane: Object,
  path: { type: String, default: '0' }
})
</script>

<style scoped>
.pane {
  display: flex;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.pane.horizontal {
  flex-direction: row;
}

.pane.vertical {
  flex-direction: column;
}

.pane > * {
  flex: 1;
  min-width: 0;
  min-height: 0;
}

.divider {
  flex: 0 0 4px;
  background: var(--border-color);
}

.divider.horizontal {
  width: 4px;
  height: auto;
}

.divider.vertical {
  height: 4px;
  width: auto;
}
</style>
