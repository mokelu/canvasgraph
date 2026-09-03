Here's the version I'd actually ship — same driver choice as the last plan (`unstorage`), but with the two real problems fixed: the buggy OPFS driver is gone in favor of the official, tested IndexedDB driver, and the Electron desktop side goes through a proper main-process/IPC boundary instead of assuming the renderer can touch `fs` directly.

**Key decisions, and why they differ from the last plan:**

1. **Browser side: IndexedDB driver, not a hand-rolled OPFS driver.** The plugin list is small, structured data — exactly what IndexedDB is for. `unstorage/drivers/indexeddb` is official, already tested by thousands of projects, and sidesteps both async-iterator bugs from before. OPFS stays on the shelf until you actually need to store real files (downloaded plugin bundles) — a separate, later concern.

2. **Desktop side: storage lives in the Electron main process, not the renderer.** If you're running with `contextIsolation: true` / `nodeIntegration: false` (the current security default), the renderer can't touch `fs` at all — `process.versions.node` may not even exist there. So the real `fsDriver`-backed storage runs in main, and the renderer talks to it through a preload bridge over IPC.

3. **Environment detection changed.** Instead of sniffing `process.versions?.node` (unreliable under contextIsolation, and breaks depending on your exact Electron config), `index.js` just checks whether the preload bridge (`window.fairyStorage`) exists. If it does, you're in the desktop shell; if not, you're in a plain browser. This doesn't care *how* your Electron security settings are configured — it just works as long as the preload script ran.**Rollout order I'd follow:**

1. `npm install unstorage idb-keyval` (the `idb-keyval` peer dep was missing from the earlier `package.json` — needed by the IndexedDB driver).
2. Wire `registerStorageIpc()` into your Electron main process startup, and add `preload.js` to your `BrowserWindow`'s `webPreferences.preload`.
3. Drop `index.js`, `browser.js`, and `plugin.js` into `core/storage/`.
4. Swap `installer.js` and `main.js` to import `pluginStorage` exactly as the last plan sketched — that part didn't need to change.
5. Test the browser build first (simplest path, no IPC involved), then the desktop build.
6. Delete every `localStorage` reference in the codebase by hand, once — skip the global-override trick; a quick `grep -rn "localStorage" src/` after migrating does the same job without the runtime risk.

**Deliberately deferred, not forgotten:** SQLite for the desktop side (once you need real queries, not just a flat list) and OPFS for actual file/blob storage in the browser (once plugins ship downloadable assets, not just metadata). Both slot in as *additional* mounts alongside this, not replacements — you'd add them the same way you added IndexedDB here, without touching `plugin.js` at all.

One thing worth confirming before you build the Electron pieces: **is Fairy's desktop shell actually Electron**, or something else like Tauri or NW.js? That decides whether `electron/main-storage.js` + `electron/preload.js` are the right two files, or need swapping for that platform's equivalent (I left a note in `index.js` for both alternatives).