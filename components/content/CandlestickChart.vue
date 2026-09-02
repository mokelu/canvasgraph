<template>
  <div ref="container" class="chart-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const container = ref(null)

const data = [
  { i: 0, open: 40, high: 55, low: 35, close: 50 },
  { i: 1, open: 50, high: 60, low: 45, close: 48 },
  { i: 2, open: 48, high: 52, low: 30, close: 35 },
  { i: 3, open: 35, high: 58, low: 33, close: 55 },
  { i: 4, open: 55, high: 65, low: 50, close: 60 },
  { i: 5, open: 60, high: 62, low: 40, close: 42 },
  { i: 6, open: 42, high: 50, low: 20, close: 25 },
  { i: 7, open: 25, high: 45, low: 22, close: 40 },
  { i: 8, open: 40, high: 70, low: 38, close: 65 },
  { i: 9, open: 65, high: 68, low: 55, close: 58 },
  { i: 10, open: 58, high: 60, low: 30, close: 33 },
  { i: 11, open: 33, high: 50, low: 28, close: 45 }
]

let app = null

function loadScript(url) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = url
    s.onload = resolve
    s.onerror = reject
    document.head.appendChild(s)
  })
}

onMounted(async () => {
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pixi.js/7.4.2/pixi.min.js')
  await loadScript('https://d3js.org/d3.v7.min.js')
  const PIXI = window.PIXI
  const d3 = window.d3

  const margin = { top: 10, right: 10, bottom: 20, left: 30 }
  const width = container.value.clientWidth - margin.left - margin.right
  const height = container.value.clientHeight - margin.top - margin.bottom

  app = new PIXI.Application({
    width: container.value.clientWidth,
    height: container.value.clientHeight,
    backgroundColor: 0xffffff,
    antialias: true
  })
  container.value.appendChild(app.view)

  const root = new PIXI.Container()
  root.position.set(margin.left, margin.top)
  app.stage.addChild(root)

  const candlesLayer = new PIXI.Container()
  const axesLayer = new PIXI.Container()
  root.addChild(candlesLayer)
  root.addChild(axesLayer)

  const x = d3.scaleLinear()
    .domain([0, data.length])
    .range([0, width])

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.high)])
    .range([height, 0])

  function clearContainer(container) {
    container.removeChildren().forEach(child => child.destroy())
  }

  function draw(scale) {
    clearContainer(candlesLayer)
    clearContainer(axesLayer)

    const step = scale(1) - scale(0)
    const barWidth = step * 0.9

    data.forEach(d => {
      const cx = scale(d.i) + step / 2
      const color = d.close > d.open ? 0x008000 : 0xff0000

      const g = new PIXI.Graphics()

      g.lineStyle(1, 0x000000, 1)
      g.moveTo(cx, y(d.high))
      g.lineTo(cx, y(d.low))

      const bodyX = scale(d.i) + step * 0.1
      const bodyY = y(Math.max(d.open, d.close))
      const bodyH = Math.abs(y(d.open) - y(d.close))

      g.beginFill(color)
      g.drawRect(bodyX, bodyY, barWidth, bodyH)
      g.endFill()

      candlesLayer.addChild(g)
    })

    const axes = new PIXI.Graphics()
    axes.lineStyle(1, 0x000000, 1)

    axes.moveTo(0, height)
    axes.lineTo(width, height)

    scale.ticks().forEach(t => {
      const px = scale(t)
      axes.moveTo(px, height)
      axes.lineTo(px, height + 5)

      const label = new PIXI.Text(t, { fontSize: 10, fill: 0x000000 })
      label.anchor.set(0.5, 0)
      label.position.set(px, height + 6)
      axesLayer.addChild(label)
    })

    axes.moveTo(0, 0)
    axes.lineTo(0, height)

    y.ticks().forEach(t => {
      const py = y(t)
      axes.moveTo(-5, py)
      axes.lineTo(0, py)

      const label = new PIXI.Text(t, { fontSize: 10, fill: 0x000000 })
      label.anchor.set(1, 0.5)
      label.position.set(-7, py)
      axesLayer.addChild(label)
    })

    axesLayer.addChild(axes)
  }

  draw(x)

  const zoom = d3.zoom()
    .scaleExtent([1, 10])
    .on('zoom', (event) => {
      const newX = event.transform.rescaleX(x)
      draw(newX)
    })

  d3.select(app.view).call(zoom)
})

onUnmounted(() => {
  if (app) {
    app.destroy(true)
    app = null
  }
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
}
</style>
