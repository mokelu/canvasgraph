import { createApp } from 'vue'
import App from './App.vue'
import './theme.css'
import { loadPlugin } from './core/plugin-loader.js'

const builtIns = ['chart']
const installed = JSON.parse(localStorage.getItem('installedPlugins') ?? '[]')

for (const id of new Set([...builtIns, ...installed])) {
  await loadPlugin(id)
}

createApp(App).mount('#app')
