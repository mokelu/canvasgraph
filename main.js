import { createApp } from 'vue'
import App from './App.vue'
import './theme.css'
import { loadPlugin } from './core/plugin-loader.js'
import { pluginStorage } from './core/storage/plugin.js'

const builtIns = ['chart', 'markdown', 'spreadsheet']
const installed = await pluginStorage.getAll()
const installedIds = installed.map(p => p.id)

for (const id of new Set([...builtIns, ...installedIds])) {
  await loadPlugin(id)
}

createApp(App).mount('#app')
