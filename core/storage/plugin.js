import { storage } from './index.js'

const PLUGINS_KEY = 'installed_plugins'

export const pluginStorage = {
  async getAll() {
    return (await storage.getItem(PLUGINS_KEY)) || []
  },

  async saveAll(plugins) {
    await storage.setItem(PLUGINS_KEY, plugins)
  },

  async add(plugin) {
    const plugins = await this.getAll()
    const updated = [...plugins.filter((p) => p.id !== plugin.id), plugin]
    await this.saveAll(updated)
    return updated
  },

  async remove(pluginId) {
    const plugins = await this.getAll()
    const updated = plugins.filter((p) => p.id !== pluginId)
    await this.saveAll(updated)
    return updated
  },

  async has(pluginId) {
    const plugins = await this.getAll()
    return plugins.some((p) => p.id === pluginId)
  },
}
