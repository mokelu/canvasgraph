import { createMachine, assign } from 'xstate';

const storageAssistantMachine = createMachine({
  context: {
    // 👇 CHANGE THIS to 'web' or 'desktop' 
    platform: 'desktop',
    
    operation: null, // 'save', 'load', 'delete', 'list_all'
    storageKey: 'plugins_list',
    pluginId: null,   // Which plugin to delete or load?
    payload: null,    // The data we are saving
    result: null,     // The data we got back
    error: null
  },
  id: 'Robot Helper (Full Storage)',
  initial: 'Idle',
  states: {
    Idle: {
      on: {
        // Save a plugin (add or update)
        SAVE: {
          target: 'Deciding Where to Go',
          actions: assign({ 
            operation: 'save',
            payload: ({ event }) => event.data 
          })
        },
        // Load a specific plugin (by ID)
        LOAD: {
          target: 'Deciding Where to Go',
          actions: assign({ 
            operation: 'load',
            pluginId: ({ event }) => event.id 
          })
        },
        // Delete a specific plugin (by ID)
        DELETE: {
          target: 'Deciding Where to Go',
          actions: assign({ 
            operation: 'delete',
            pluginId: ({ event }) => event.id 
          })
        },
        // LIST_ALL (this is your "query" - just get everything)
        LIST_ALL: {
          target: 'Deciding Where to Go',
          actions: assign({ 
            operation: 'list_all'
          })
        }
      }
    },

    'Deciding Where to Go': {
      always: [
        // --- Desktop Paths (Big Toy Box) ---
        { target: 'Desktop Save',   cond: ({ platform, operation }) => platform === 'desktop' && operation === 'save' },
        { target: 'Desktop Load',   cond: ({ platform, operation }) => platform === 'desktop' && operation === 'load' },
        { target: 'Desktop Delete', cond: ({ platform, operation }) => platform === 'desktop' && operation === 'delete' },
        { target: 'Desktop List',   cond: ({ platform, operation }) => platform === 'desktop' && operation === 'list_all' },
        
        // --- Web Paths (Glove Compartment) ---
        { target: 'Web Save',   cond: ({ platform, operation }) => platform === 'web' && operation === 'save' },
        { target: 'Web Load',   cond: ({ platform, operation }) => platform === 'web' && operation === 'load' },
        { target: 'Web Delete', cond: ({ platform, operation }) => platform === 'web' && operation === 'delete' },
        { target: 'Web List',   cond: ({ platform, operation }) => platform === 'web' && operation === 'list_all' }
      ]
    },

    // --- DESKTOP ACTIONS (Big Toy Box) ---
    'Desktop Save': { invoke: { src: 'saveToFileSystem', onDone: { target: 'Done', actions: assign({ result: ({ event }) => event.data }) }, onError: { target: 'Error', actions: assign({ error: ({ event }) => event.data }) } } },
    'Desktop Load': { invoke: { src: 'loadFromFileSystem', onDone: { target: 'Done', actions: assign({ result: ({ event }) => event.data }) }, onError: { target: 'Error', actions: assign({ error: ({ event }) => event.data }) } } },
    'Desktop Delete': { invoke: { src: 'deleteFromFileSystem', onDone: { target: 'Done', actions: assign({ result: ({ event }) => event.data }) }, onError: { target: 'Error', actions: assign({ error: ({ event }) => event.data }) } } },
    'Desktop List': { invoke: { src: 'listAllFromFileSystem', onDone: { target: 'Done', actions: assign({ result: ({ event }) => event.data }) }, onError: { target: 'Error', actions: assign({ error: ({ event }) => event.data }) } } },

    // --- WEB ACTIONS (Glove Compartment) ---
    'Web Save': { invoke: { src: 'saveToIndexedDB', onDone: { target: 'Done', actions: assign({ result: ({ event }) => event.data }) }, onError: { target: 'Error', actions: assign({ error: ({ event }) => event.data }) } } },
    'Web Load': { invoke: { src: 'loadFromIndexedDB', onDone: { target: 'Done', actions: assign({ result: ({ event }) => event.data }) }, onError: { target: 'Error', actions: assign({ error: ({ event }) => event.data }) } } },
    'Web Delete': { invoke: { src: 'deleteFromIndexedDB', onDone: { target: 'Done', actions: assign({ result: ({ event }) => event.data }) }, onError: { target: 'Error', actions: assign({ error: ({ event }) => event.data }) } } },
    'Web List': { invoke: { src: 'listAllFromIndexedDB', onDone: { target: 'Done', actions: assign({ result: ({ event }) => event.data }) }, onError: { target: 'Error', actions: assign({ error: ({ event }) => event.data }) } } },

    'Done': {
      on: { RESET: { target: 'Idle', actions: assign({ result: null, operation: null, pluginId: null }) } }
    },
    'Error': {
      on: { RETRY: { target: 'Idle', actions: assign({ error: null, operation: null }) } }
    }
  }
}, {
  services: {
    // --- Fake Desktop Helpers ---
    saveToFileSystem: async ({ payload, storageKey }) => ({ message: `✅ Big Toy Box: Saved "${payload.name}"`, saved: payload }),
    loadFromFileSystem: async ({ pluginId, storageKey }) => ({ message: `📂 Big Toy Box: Loaded plugin "${pluginId}"`, data: { id: pluginId, name: 'Cool Plugin' } }),
    deleteFromFileSystem: async ({ pluginId, storageKey }) => ({ message: `🗑️ Big Toy Box: Deleted plugin "${pluginId}"` }),
    listAllFromFileSystem: async ({ storageKey }) => ({ message: `📋 Big Toy Box: Full List`, data: ['Plugin-A', 'Plugin-B', 'Plugin-C'] }),
    
    // --- Fake Web Helpers ---
    saveToIndexedDB: async ({ payload, storageKey }) => ({ message: `✅ Glove Compartment: Saved "${payload.name}"`, saved: payload }),
    loadFromIndexedDB: async ({ pluginId, storageKey }) => ({ message: `📂 Glove Compartment: Loaded plugin "${pluginId}"`, data: { id: pluginId, name: 'Web Plugin' } }),
    deleteFromIndexedDB: async ({ pluginId, storageKey }) => ({ message: `🗑️ Glove Compartment: Deleted plugin "${pluginId}"` }),
    listAllFromIndexedDB: async ({ storageKey }) => ({ message: `📋 Glove Compartment: Full List`, data: ['Plugin-X', 'Plugin-Y', 'Plugin-Z'] })
  }
});

