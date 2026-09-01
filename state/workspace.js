import { reactive } from 'vue'

export const workspace = reactive({
  name: 'Untitled',
  files: [],
  activeFile: null
})
