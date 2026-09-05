// fairy/core/storage/index.ab.js

const hasElectronBridge = typeof window !== 'undefined' && !!window.fairyStorage;

let storage;

if (hasElectronBridge) {
  storage = window.fairyStorage;
} else {
  const { storage: browserStorage } = await import('./browser.js');
  storage = browserStorage;
}

export { storage };
