const loaded = new Map()

export async function ensureLibrary(name, url) {
  if (loaded.has(name)) return loaded.get(name)
  const mod = await import(/* @vite-ignore */ url)
  loaded.set(name, mod)
  return mod
}

export function isLibraryLoaded(name) {
  return loaded.has(name)
}
