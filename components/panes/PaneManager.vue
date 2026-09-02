<template>
  <div class="pane-manager">
    <Pane :pane="panes.tree" />
  </div>
</template>

<script setup>
import { panes } from '../../machines/panes.js'
import Pane from './Pane.vue'
</script>

<style scoped>
.pane-manager {
  width: 100%;
  height: 100%;
}
</style>
