import { contextBridge, ipcRenderer } from 'electron'

const CHANNEL = 'fairy:storage'

contextBridge.exposeInMainWorld('fairyStorage', {
  getItem: (key) => ipcRenderer.invoke(`${CHANNEL}:getItem`, key),
  setItem: (key, value) => ipcRenderer.invoke(`${CHANNEL}:setItem`, key, value),
  removeItem: (key) => ipcRenderer.invoke(`${CHANNEL}:removeItem`, key),
  getKeys: (base) => ipcRenderer.invoke(`${CHANNEL}:getKeys`, base),
  clear: (base) => ipcRenderer.invoke(`${CHANNEL}:clear`, base),
})
