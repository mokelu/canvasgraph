import { createMachine, assign } from 'xstate';

// v3 — TWO axes instead of one.
// v1 and v2 only asked "which platform?" and picked ONE backend per platform
// (desktop -> file system, web -> IndexedDB). That collapses "file system"
// and "database" into a single concept, when they're actually different
// KINDS of storage that both exist on both platforms.
//
// v3 asks two questions per request:
//   1. platform:     'desktop' | 'web'
//   2. storageType:  'fs' (user data / files)  |  'db' (internal app state)
//
// That gives 4 real backends instead of 2:
//   desktop + fs -> native file system
//   desktop + db -> SQLite
//   web     + fs -> OPFS (Origin Private File System)
//   web     + db -> IndexedDB
//
// Example: a "plugins list" is small structured metadata the app queries
// (installed? version? enabled?) -> storageType: 'db' on both platforms.
// Downloaded plugin bundle files/assets, if any -> storageType: 'fs'.

const storageAssistantMachine = createMachine({
  context: {
    // 👇 CHANGE THESE to see the routing change
    platform: 'desktop',   // 'desktop' | 'web'

    storageType: null,     // 'fs' | 'db' — set per-request, not fixed per platform
    operation: null,       // 'save' | 'load' | 'delete' | 'list_all'
    storageKey: 'plugins_list',
    pluginId: null,
    payload: null,
    result: null,
    error: null
  },
  id: 'Robot Helper (v3 — platform x storageType)',
  initial: 'Idle',
  states: {
    Idle: {
      on: {
        SAVE: {
          target: 'Routing',
          actions: assign({
            operation: 'save',
            storageType: ({ event }) => event.storageType, // caller decides fs vs db
            payload: ({ event }) => event.data
          })
        },
        LOAD: {
          target: 'Routing',
          actions: assign({
            operation: 'load',
            storageType: ({ event }) => event.storageType,
            pluginId: ({ event }) => event.id
          })
        },
        DELETE: {
          target: 'Routing',
          actions: assign({
            operation: 'delete',
            storageType: ({ event }) => event.storageType,
            pluginId: ({ event }) => event.id
          })
        },
        LIST_ALL: {
          target: 'Routing',
          actions: assign({
            operation: 'list_all',
            storageType: ({ event }) => event.storageType
          })
        }
      }
    },

    // Single decision point checking BOTH axes at once.
    Routing: {
      always: [
        // --- Desktop / File system ---
        { target: 'Desktop FS Save',   cond: ({ context }) => context.platform === 'desktop' && context.storageType === 'fs' && context.operation === 'save' },
        { target: 'Desktop FS Load',   cond: ({ context }) => context.platform === 'desktop' && context.storageType === 'fs' && context.operation === 'load' },
        { target: 'Desktop FS Delete', cond: ({ context }) => context.platform === 'desktop' && context.storageType === 'fs' && context.operation === 'delete' },
        { target: 'Desktop FS List',   cond: ({ context }) => context.platform === 'desktop' && context.storageType === 'fs' && context.operation === 'list_all' },

        // --- Desktop / Database (SQLite) ---
        { target: 'Desktop DB Save',   cond: ({ context }) => context.platform === 'desktop' && context.storageType === 'db' && context.operation === 'save' },
        { target: 'Desktop DB Load',   cond: ({ context }) => context.platform === 'desktop' && context.storageType === 'db' && context.operation === 'load' },
        { target: 'Desktop DB Delete', cond: ({ context }) => context.platform === 'desktop' && context.storageType === 'db' && context.operation === 'delete' },
        { target: 'Desktop DB List',   cond: ({ context }) => context.platform === 'desktop' && context.storageType === 'db' && context.operation === 'list_all' },

        // --- Web / File system (OPFS) ---
        { target: 'Web FS Save',       cond: ({ context }) => context.platform === 'web' && context.storageType === 'fs' && context.operation === 'save' },
        { target: 'Web FS Load',       cond: ({ context }) => context.platform === 'web' && context.storageType === 'fs' && context.operation === 'load' },
        { target: 'Web FS Delete',     cond: ({ context }) => context.platform === 'web' && context.storageType === 'fs' && context.operation === 'delete' },
        { target: 'Web FS List',       cond: ({ context }) => context.platform === 'web' && context.storageType === 'fs' && context.operation === 'list_all' },

        // --- Web / Database (IndexedDB) ---
        { target: 'Web DB Save',       cond: ({ context }) => context.platform === 'web' && context.storageType === 'db' && context.operation === 'save' },
        { target: 'Web DB Load',       cond: ({ context }) => context.platform === 'web' && context.storageType === 'db' && context.operation === 'load' },
        { target: 'Web DB Delete',     cond: ({ context }) => context.platform === 'web' && context.storageType === 'db' && context.operation === 'delete' },
        { target: 'Web DB List',       cond: ({ context }) => context.platform === 'web' && context.storageType === 'db' && context.operation === 'list_all' },

        // No matching route — caller forgot to set storageType, etc.
        { target: 'Error', actions: assign({ error: () => 'No matching platform/storageType/operation route' }) }
      ]
    },

    // --- Desktop / File system ---
    'Desktop FS Save':   { invoke: { src: 'saveToFileSystem',     onDone: doneTo('Done'), onError: errTo('Error') } },
    'Desktop FS Load':   { invoke: { src: 'loadFromFileSystem',   onDone: doneTo('Done'), onError: errTo('Error') } },
    'Desktop FS Delete': { invoke: { src: 'deleteFromFileSystem', onDone: doneTo('Done'), onError: errTo('Error') } },
    'Desktop FS List':   { invoke: { src: 'listAllFromFileSystem', onDone: doneTo('Done'), onError: errTo('Error') } },

    // --- Desktop / Database (SQLite) ---
    'Desktop DB Save':   { invoke: { src: 'saveToSQLite',     onDone: doneTo('Done'), onError: errTo('Error') } },
    'Desktop DB Load':   { invoke: { src: 'loadFromSQLite',   onDone: doneTo('Done'), onError: errTo('Error') } },
    'Desktop DB Delete': { invoke: { src: 'deleteFromSQLite', onDone: doneTo('Done'), onError: errTo('Error') } },
    'Desktop DB List':   { invoke: { src: 'listAllFromSQLite', onDone: doneTo('Done'), onError: errTo('Error') } },

    // --- Web / File system (OPFS) ---
    'Web FS Save':   { invoke: { src: 'saveToOPFS',     onDone: doneTo('Done'), onError: errTo('Error') } },
    'Web FS Load':   { invoke: { src: 'loadFromOPFS',   onDone: doneTo('Done'), onError: errTo('Error') } },
    'Web FS Delete': { invoke: { src: 'deleteFromOPFS', onDone: doneTo('Done'), onError: errTo('Error') } },
    'Web FS List':   { invoke: { src: 'listAllFromOPFS', onDone: doneTo('Done'), onError: errTo('Error') } },

    // --- Web / Database (IndexedDB) ---
    'Web DB Save':   { invoke: { src: 'saveToIndexedDB',     onDone: doneTo('Done'), onError: errTo('Error') } },
    'Web DB Load':   { invoke: { src: 'loadFromIndexedDB',   onDone: doneTo('Done'), onError: errTo('Error') } },
    'Web DB Delete': { invoke: { src: 'deleteFromIndexedDB', onDone: doneTo('Done'), onError: errTo('Error') } },
    'Web DB List':   { invoke: { src: 'listAllFromIndexedDB', onDone: doneTo('Done'), onError: errTo('Error') } },

    Done: {
      on: { RESET: { target: 'Idle', actions: assign({ result: null, operation: null, storageType: null, pluginId: null }) } }
    },
    Error: {
      on: { RETRY: { target: 'Idle', actions: assign({ error: null, operation: null, storageType: null }) } }
    }
  }
}, {
  services: {
    // --- Desktop / File system: real files on disk ---
    saveToFileSystem: async ({ payload, storageKey }) => ({ message: `✅ File system: saved "${payload?.name}"`, saved: payload }),
    loadFromFileSystem: async ({ pluginId }) => ({ message: `📂 File system: loaded "${pluginId}"`, data: { id: pluginId } }),
    deleteFromFileSystem: async ({ pluginId }) => ({ message: `🗑️ File system: deleted "${pluginId}"` }),
    listAllFromFileSystem: async () => ({ message: `📋 File system: listed all`, data: [] }),

    // --- Desktop / Database: SQLite ---
    saveToSQLite: async ({ payload, storageKey }) => ({ message: `✅ SQLite: saved "${payload?.name}"`, saved: payload }),
    loadFromSQLite: async ({ pluginId }) => ({ message: `📂 SQLite: loaded "${pluginId}"`, data: { id: pluginId } }),
    deleteFromSQLite: async ({ pluginId }) => ({ message: `🗑️ SQLite: deleted "${pluginId}"` }),
    listAllFromSQLite: async () => ({ message: `📋 SQLite: listed all`, data: ['Plugin-A', 'Plugin-B'] }),

    // --- Web / File system: OPFS ---
    saveToOPFS: async ({ payload, storageKey }) => ({ message: `✅ OPFS: saved "${payload?.name}"`, saved: payload }),
    loadFromOPFS: async ({ pluginId }) => ({ message: `📂 OPFS: loaded "${pluginId}"`, data: { id: pluginId } }),
    deleteFromOPFS: async ({ pluginId }) => ({ message: `🗑️ OPFS: deleted "${pluginId}"` }),
    listAllFromOPFS: async () => ({ message: `📋 OPFS: listed all`, data: [] }),

    // --- Web / Database: IndexedDB ---
    saveToIndexedDB: async ({ payload, storageKey }) => ({ message: `✅ IndexedDB: saved "${payload?.name}"`, saved: payload }),
    loadFromIndexedDB: async ({ pluginId }) => ({ message: `📂 IndexedDB: loaded "${pluginId}"`, data: { id: pluginId } }),
    deleteFromIndexedDB: async ({ pluginId }) => ({ message: `🗑️ IndexedDB: deleted "${pluginId}"` }),
    listAllFromIndexedDB: async () => ({ message: `📋 IndexedDB: listed all`, data: ['Plugin-X', 'Plugin-Y'] })
  }
});

// Small helpers so the 16 leaf states above stay readable.
function doneTo(target) {
  return { target, actions: assign({ result: ({ event }) => event.data }) };
}
function errTo(target) {
  return { target, actions: assign({ error: ({ event }) => event.data }) };
}

export default storageAssistantMachine;

