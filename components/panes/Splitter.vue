<template>
  <div
    class="splitter"
    :class="direction"
    @mousedown="startDrag"
  ></div>
</template>

<script setup>
const props = defineProps({
  direction: String
})

const emit = defineEmits(['split'])

function startDrag(e) {
  const start = props.direction === 'horizontal' ? e.clientX : e.clientY

  function onMove(e) {
    const current = props.direction === 'horizontal' ? e.clientX : e.clientY
    emit('split', current - start)
  }

  function onUp() {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
  }

  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}
</script>

<style scoped>
.splitter {
  background: var(--border-color);
  flex-shrink: 0;
}

.splitter.horizontal {
  width: 4px;
  cursor: col-resize;
}

.splitter.vertical {
  height: 4px;
  cursor: row-resize;
}

.splitter:hover {
  background: var(--text-primary);
}
</style>
