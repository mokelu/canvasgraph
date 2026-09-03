import { pluginApi } from './plugin-api.js'
import { getPlugin, setPlugin, deletePlugin } from './plugin-registry.js'
import { ensureLibrary } from './lib-loader.js'

const pluginModules = {
  chart: () => import('../plugins/chart/index.js'),
  markdown: () => import('../plugins/markdown/index.js'),
  spreadsheet: () => import('../plugins/spreadsheet/index.js')
}

export async function loadPlugin(pluginId) {
  const manifest = await fetch(`plugins/${pluginId}/manifest.json`).then(r => r.json())

  for (const dep of manifest.requires ?? []) {
    await ensureLibrary(dep.name, dep.url)
  }

  const loadFn = pluginModules[pluginId]
  if (!loadFn) {
    console.warn(`Plugin "${pluginId}" not found in built-in modules`)
    return
  }

  const module = await loadFn()
  const plugin = new module.default()

  plugin.onload(pluginApi)
  setPlugin(pluginId, { manifest, plugin })
}

export async function unloadPlugin(pluginId) {
  const data = getPlugin(pluginId)
  if (!data) return

  data.plugin.onunload(pluginApi)
  deletePlugin(pluginId)
}
