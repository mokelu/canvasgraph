import { app, ipcMain } from 'electron'
import path from 'node:path'
import { createStorage } from 'unstorage'
import fsDriver from 'unstorage/drivers/fs'

const storage = createStorage({
  driver: fsDriver({
    base: path.join(app.getPath('userData'), 'fairy-data'),
  }),
})

const CHANNEL = 'fairy:storage'

export function registerStorageIpc() {
  ipcMain.handle(`${CHANNEL}:getItem`, (_e, key) => storage.getItem(key))
  ipcMain.handle(`${CHANNEL}:setItem`, (_e, key, value) => storage.setItem(key, value))
  ipcMain.handle(`${CHANNEL}:removeItem`, (_e, key) => storage.removeItem(key))
  ipcMain.handle(`${CHANNEL}:getKeys`, (e, base) => storage.getKeys(base))
  ipcMain.handle(`${CHANNEL}:clear`, (e, base) => storage.clear(base))
}

export { storage as mainStorage }
