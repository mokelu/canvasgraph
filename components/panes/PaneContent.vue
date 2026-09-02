<template>
  <div class="pane-content">
    <CandlestickChart v-if="content === 'chart'" />
    <div v-else class="placeholder">{{ content }}</div>
  </div>
</template>

<script setup>
import CandlestickChart from '../content/CandlestickChart.vue'

defineProps({
  content: String
})
</script>

<style scoped>
.pane-content {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: var(--bg-primary);
  color: var(--text-primary);
}
</style>
