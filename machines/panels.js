import { reactive } from 'vue'

export const panels = reactive({
  left: {
    open: true,
    activeIcon: null
  },
  right: {
    open: true,
    activeIcon: null
  },
  mobile: {
    active: 'center'
  }
})

