import { createMachine, assign } from 'xstate';

const storageAssistantMachine = createMachine({
  context: {
    // 👇 CHANGE THIS to 'web' or 'desktop' in the visualizer to see the magic!
    platform: 'desktop', 
    
    operation: null, // 'save' or 'load'
    storageKey: 'my_plugins_list',
    payload: null,   // The data we are saving
    result: null,    // The data we loaded back
    error: null
  },
  id: 'Robot Helper (Abstract Storage)',
  initial: 'Idle',
  states: {
    // 1. The Robot is waiting for a command
    Idle: {
      on: {
        SAVE: {
          target: 'Deciding Where to Go',
          actions: assign({ 
            operation: 'save',
            payload: ({ event }) => event.data // Grab the toys to store
          })
        },
        LOAD: {
          target: 'Deciding Where to Go',
          actions: assign({ 
            operation: 'load'
          })
        }
      }
    },

    // 2. The Assistant checks: Are we at home (PC) or in the car (Browser)?
    'Deciding Where to Go': {
      always: [
        // --- Path A: Home (Desktop / PC) ---
        { 
          target: 'Writing to File System (Big Box)',
          cond: ({ platform, operation }) => platform === 'desktop' && operation === 'save'
        },
        { 
          target: 'Reading from File System (Big Box)',
          cond: ({ platform, operation }) => platform === 'desktop' && operation === 'load'
        },
        // --- Path B: Car (Browser / Web) ---
        { 
          target: 'Writing to IndexedDB (Glove Box)',
          cond: ({ platform, operation }) => platform === 'web' && operation === 'save'
        },
        { 
          target: 'Reading from IndexedDB (Glove Box)',
          cond: ({ platform, operation }) => platform === 'web' && operation === 'load'
        }
      ]
    },

    // --- ACTIONS FOR THE BIG TOY BOX (Desktop) ---
    'Writing to File System (Big Box)': {
      invoke: {
        src: 'saveToFileSystem',
        onDone: { target: 'Done (Success)', actions: assign({ result: ({ event }) => event.data }) },
        onError: { target: 'Error (Uh oh!)', actions: assign({ error: ({ event }) => event.data }) }
      }
    },
    'Reading from File System (Big Box)': {
      invoke: {
        src: 'loadFromFileSystem',
        onDone: { target: 'Done (Success)', actions: assign({ result: ({ event }) => event.data }) },
        onError: { target: 'Error (Uh oh!)', actions: assign({ error: ({ event }) => event.data }) }
      }
    },

    // --- ACTIONS FOR THE GLOVE COMPARTMENT (Browser) ---
    'Writing to IndexedDB (Glove Box)': {
      invoke: {
        src: 'saveToIndexedDB',
        onDone: { target: 'Done (Success)', actions: assign({ result: ({ event }) => event.data }) },
        onError: { target: 'Error (Uh oh!)', actions: assign({ error: ({ event }) => event.data }) }
      }
    },
    'Reading from IndexedDB (Glove Box)': {
      invoke: {
        src: 'loadFromIndexedDB',
        onDone: { target: 'Done (Success)', actions: assign({ result: ({ event }) => event.data }) },
        onError: { target: 'Error (Uh oh!)', actions: assign({ error: ({ event }) => event.data }) }
      }
    },

    // 3. The final results
    'Done (Success)': {
      on: {
        RESET: { target: 'Idle', actions: assign({ result: null, operation: null }) }
      }
    },
    'Error (Uh oh!)': {
      on: {
        RETRY: { target: 'Idle', actions: assign({ error: null, operation: null }) }
      }
    }
  }
}, {
  services: {
    // These are the fake "helpers" just for the visualizer to show results
    saveToFileSystem: async ({ payload, storageKey }) => {
      return { message: `✅ Stored in the BIG TOY BOX! Key: ${storageKey}`, savedData: payload };
    },
    loadFromFileSystem: async ({ storageKey }) => {
      return { message: `📂 Found in the BIG TOY BOX!`, loadedData: ['Plugin-A', 'Plugin-B'] };
    },
    saveToIndexedDB: async ({ payload, storageKey }) => {
      return { message: `✅ Stored in the GLOVE COMPARTMENT! Key: ${storageKey}`, savedData: payload };
    },
    loadFromIndexedDB: async ({ storageKey }) => {
      return { message: `📂 Found in the GLOVE COMPARTMENT!`, loadedData: ['Plugin-C', 'Plugin-D'] };
    }
  }
});


