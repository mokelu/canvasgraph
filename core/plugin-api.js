import { reactive } from 'vue'

export const contentTypes = reactive(new Map())
export const commands = reactive(new Map())
export const ribbonIcons = reactive(new Map())

let nextCommandId = 0
let nextRibbonId = 0

export const pluginApi = {
  registerContentType(id, loader) {
    contentTypes.set(id, loader)
    return id
  },

  unregisterContentType(id) {
    contentTypes.delete(id)
  },

  addCommand(id, fn) {
    commands.set(id, fn)
    return { id }
  },

  removeCommand(id) {
    commands.delete(id)
  },

  addRibbonIcon(icon, fn) {
    const id = `ribbon-${nextRibbonId++}`
    ribbonIcons.set(id, { icon, fn })
    return { id }
  },

  removeRibbonIcon(id) {
    ribbonIcons.delete(id)
  }
}
