// Runs ONLY in the Electron MAIN process.
// Owns the real file-system-backed storage and exposes it to renderers
// over ipcMain, so renderer code never touches `fs` directly.
// This is what makes it work correctly with contextIsolation: true /
// nodeIntegration: false — the current recommended, secure Electron setup.

import { app, ipcMain } from 'electron';
import path from 'node:path';
import { createStorage } from 'unstorage';
import fsDriver from 'unstorage/drivers/fs';

const storage = createStorage({
  driver: fsDriver({
    base: path.join(app.getPath('userData'), 'fairy-data'),
  }),
});

const CHANNEL = 'fairy:storage';

// Call this once during app startup, after app.whenReady().
export function registerStorageIpc() {
  ipcMain.handle(`${CHANNEL}:getItem`, (_e, key) => storage.getItem(key));
  ipcMain.handle(`${CHANNEL}:setItem`, (_e, key, value) => storage.setItem(key, value));
  ipcMain.handle(`${CHANNEL}:removeItem`, (_e, key) => storage.removeItem(key));
  ipcMain.handle(`${CHANNEL}:getKeys`, (_e, base) => storage.getKeys(base));
  ipcMain.handle(`${CHANNEL}:clear`, (_e, base) => storage.clear(base));
}

// Exported in case main-process code (not just renderers) ever needs
// direct access — e.g. a startup migration script.
export { storage as mainStorage };
