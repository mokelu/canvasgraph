const registry = new Map()

export function getPlugin(pluginId) {
  return registry.get(pluginId) || null
}

export function getAllPlugins() {
  return [...registry.entries()].map(([id, data]) => ({
    id,
    ...data
  }))
}

export function setPlugin(pluginId, data) {
  registry.set(pluginId, data)
}

export function deletePlugin(pluginId) {
  registry.delete(pluginId)
}
