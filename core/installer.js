import { loadPlugin, unloadPlugin } from './plugin-loader.js'

function getInstalledIds() {
  return JSON.parse(localStorage.getItem('installedPlugins') ?? '[]')
}

function setInstalledIds(ids) {
  localStorage.setItem('installedPlugins', JSON.stringify(ids))
}

export async function installPlugin(catalogEntry) {
  const res = await fetch(catalogEntry.downloadUrl)
  const zipBlob = await res.blob()
  const files = await unzip(zipBlob)
  const targetDir = `plugins/${catalogEntry.id}/`
  await writeFiles(targetDir, files)
  await loadPlugin(catalogEntry.id)

  const installed = getInstalledIds()
  if (!installed.includes(catalogEntry.id)) {
    installed.push(catalogEntry.id)
    setInstalledIds(installed)
  }
}

export async function uninstallPlugin(pluginId) {
  await unloadPlugin(pluginId)
  await deleteFiles(`plugins/${pluginId}/`)

  const installed = getInstalledIds()
  setInstalledIds(installed.filter(id => id !== pluginId))
}

export async function reinstallBuiltIns(builtInIds) {
  const installed = getInstalledIds()
  return [...new Set([...builtInIds, ...installed])]
}

async function unzip(blob) {
  const { ZipReader } = await import('https://cdn.jsdelivr.net/npm/@aspect-ratio/zip@1.0.0/+esm')
  const reader = new ZipReader(blob.stream())
  const entries = await reader.getEntries()
  const files = {}
  for (const entry of entries) {
    if (!entry.directory) {
      files[entry.filename] = await entry.getData(new Blob())
    }
  }
  return files
}

async function writeFiles(basePath, files) {
  for (const [path, blob] of Object.entries(files)) {
    const fullPath = `${basePath}${path}`
    const dir = fullPath.substring(0, fullPath.lastIndexOf('/'))
    await fetch(dir, { method: 'MKCOL' }).catch(() => {})
    const arrayBuffer = await blob.arrayBuffer()
    await fetch(fullPath, { method: 'PUT', body: arrayBuffer })
  }
}

async function deleteFiles(basePath) {
  await fetch(basePath, { method: 'DELETE' }).catch(() => {})
}
