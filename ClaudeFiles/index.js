// The single door every other module imports storage from.
//
// Detection strategy: check whether the Electron preload bridge exists on
// `window`, rather than sniffing Node internals like `process.versions.node`.
// That sniff is unreliable once contextIsolation is on (the recommended,
// secure Electron default) — `process` may not exist in the renderer at
// all. Checking for the bridge itself is the one thing that's actually
// true only when the desktop preload script ran.
//
// Both branches expose the same shape (getItem/setItem/removeItem/
// getKeys/clear), so nothing downstream — plugin.js, installer.js — needs
// to know or care which backend is active.

const hasElectronBridge =
  typeof window !== 'undefined' && !!window.fairyStorage;

let storage;

if (hasElectronBridge) {
  // Desktop (Electron, contextIsolation-safe): proxy through the preload
  // bridge into the main process, which owns the real fs-backed storage.
  storage = window.fairyStorage;
} else {
  // Browser: real unstorage instance, IndexedDB-backed.
  const { storage: browserStorage } = await import('./browser.js');
  storage = browserStorage;
}

export { storage };

// --- If you're NOT using Electron for desktop (e.g. Tauri, NW.js) ---
// The detection pattern above still works — you just need a different
// pair of files instead of electron/main-storage.js + electron/preload.js:
//   - Tauri: expose an equivalent bridge via a Tauri command + `invoke()`,
//     assigned to `window.fairyStorage` from your app's init code.
//   - NW.js: the renderer has direct Node access by default, so you can
//     skip the bridge entirely and just import the fs driver directly —
//     set `window.fairyStorage` to a thin wrapper around it at startup
//     for consistency with this file.
