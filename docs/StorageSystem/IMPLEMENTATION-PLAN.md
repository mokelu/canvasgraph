# Issue #1: Replace localStorage with Unstorage

## Goal
Make FAIRY self-contained by replacing browser `localStorage` with `unstorage`. App works in both browser and desktop (Electron) without code changes.

---

## Architecture (Claude's Approach)

```
Browser:  renderer → IndexedDB (via unstorage)
Desktop:  renderer → IPC bridge → main process → filesystem (via unstorage)
```

**Detection:** Check `window.fairyStorage` (preload bridge). If exists = Electron. If not = browser.

---

## Files to Create

### 1. `core/storage/index.js` — The Single Door
- Checks for `window.fairyStorage` to detect Electron
- If Electron: uses the IPC bridge directly
- If browser: imports `browser.js`
- **Every other file imports storage from here**

### 2. `core/storage/browser.js` — Browser Storage
- Uses `unstorage/drivers/indexeddb`
- One line: `createStorage({ driver: indexedDbDriver({ base: 'fairy' }) })`

### 3. `core/storage/plugin.js` — Plugin Helpers
- `getAll()` — get installed plugins list
- `add(plugin)` — add a plugin
- `remove(pluginId)` — remove a plugin
- `has(pluginId)` — check if installed
- `saveAll(plugins)` — overwrite full list

### 4. `electron/main-storage.js` — Main Process Storage
- Uses `unstorage/drivers/fs` to store in `userData/fairy-data`
- Exposes IPC handlers: `getItem`, `setItem`, `removeItem`, `getKeys`, `clear`
- Called once at app startup

### 5. `electron/preload.js` — Bridge
- Exposes `window.fairyStorage` to renderer via `contextBridge`
- Calls IPC methods to main process

---

## Files to Modify

### 6. `core/installer.js`
- Remove: `localStorage.getItem('installedPlugins')`
- Remove: `localStorage.setItem('installedPlugins', ...)`
- Add: `import { pluginStorage } from './storage/plugin.js'`
- Replace with: `await pluginStorage.add(...)` / `await pluginStorage.remove(...)`

### 7. `main.js` (app entry)
- Remove: all `localStorage` references
- Add: `import { pluginStorage } from './core/storage/plugin.js'`
- Replace with: `await pluginStorage.getAll()`

### 8. `electron/main.js` (Electron entry — if exists)
- Add: `import { registerStorageIpc } from './main-storage.js'`
- Add: `registerStorageIpc()` call after `app.whenReady()`
- Add: `webPreferences.preload` pointing to `preload.js`

### 9. `package.json`
- Add: `"unstorage": "^1.10.0"`
- Add: `"idb-keyval": "..."` (peer dep for IndexedDB driver)

---

## Implementation Order

| Step | Action | Why |
|------|--------|-----|
| 1 | `npm install unstorage idb-keyval` | Add dependencies |
| 2 | Create `core/storage/browser.js` | Browser storage (simplest, test first) |
| 3 | Create `core/storage/plugin.js` | Plugin helpers |
| 4 | Create `core/storage/index.js` | The single door |
| 5 | Update `core/installer.js` | Replace localStorage |
| 6 | Update `main.js` | Replace localStorage |
| 7 | Test browser build | Verify it works |
| 8 | Create `electron/main-storage.js` | Desktop storage |
| 9 | Create `electron/preload.js` | IPC bridge |
| 10 | Update `electron/main.js` | Wire up IPC |
| 11 | Test desktop build | Verify Electron works |
| 12 | `grep -rn "localStorage" src/` | Confirm zero localStorage left |

---

## Testing

| Test | Browser | Desktop | Pass Criteria |
|------|---------|---------|---------------|
| Install plugin | ✓ | ✓ | Plugin appears in storage |
| Uninstall plugin | ✓ | ✓ | Plugin removed from storage |
| Restart app | ✓ | ✓ | Installed plugins reload |
| Check storage | DevTools → IndexedDB | `userData/fairy-data/` folder | Data persists |

---

## What We're NOT Doing (Deliberate Simplifications)

- **No OPFS** — IndexedDB is enough for plugin metadata. OPFS later for actual plugin files.
- **No SQLite** — Not needed until we need queries/filters.
- **No localStorage override hack** — Just grep to verify it's gone.
- **No cross-platform sync** — Desktop and browser storage are independent.

---

## Success Criteria

1. Zero `localStorage` references in codebase
2. `npm run dev` works in browser
3. Electron app loads plugins from filesystem
4. Plugin install/uninstall persists across restarts
