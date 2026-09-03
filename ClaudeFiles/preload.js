// Preload script — the ONLY bridge between renderer code and main-process
// storage. Runs with Node access, but only exposes this minimal, safe
// surface to the renderer via contextBridge (no raw ipcRenderer, no fs).

import { contextBridge, ipcRenderer } from 'electron';

const CHANNEL = 'fairy:storage';

contextBridge.exposeInMainWorld('fairyStorage', {
  getItem: (key) => ipcRenderer.invoke(`${CHANNEL}:getItem`, key),
  setItem: (key, value) => ipcRenderer.invoke(`${CHANNEL}:setItem`, key, value),
  removeItem: (key) => ipcRenderer.invoke(`${CHANNEL}:removeItem`, key),
  getKeys: (base) => ipcRenderer.invoke(`${CHANNEL}:getKeys`, base),
  clear: (base) => ipcRenderer.invoke(`${CHANNEL}:clear`, base),
});

// Renderer code checks `window.fairyStorage` to know it's running inside
// the Electron desktop shell — see core/storage/index.js.
