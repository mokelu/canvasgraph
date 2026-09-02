import { reactive } from 'vue'
import { layouts } from './layouts.js'

export const panes = reactive({
  count: 1,
  layoutId: '1-a',
  get tree() {
    const variants = layouts[this.count]
    const layout = variants.find(l => l.id === this.layoutId)
    return layout ? layout.tree : variants[0].tree
  }
})
