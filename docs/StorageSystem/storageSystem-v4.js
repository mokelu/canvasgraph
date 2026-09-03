import { createMachine, assign } from 'xstate'

export const storageMachine = createMachine(
  {
    id: 'fairyStorage',
    initial: 'detecting',
    context: {
      backend: null,       // 'indexeddb' | 'electron'
      storage: null,       // the storage instance or bridge
      plugins: [],         // installed plugins list
      currentPlugin: null, // plugin being operated on
      error: null,
    },
    states: {
      // ──────────────────────────────────────────────
      // PHASE 1: Detect environment
      // ──────────────────────────────────────────────
      detecting: {
        invoke: {
          src: 'detectEnvironment',
          onDone: [
            {
              target: 'browser',
              cond: 'isBrowser',
              actions: 'assignBrowserStorage',
            },
            {
              target: 'desktop',
              cond: 'isDesktop',
              actions: 'assignDesktopStorage',
            },
          ],
          onError: 'error',
        },
      },

      // ──────────────────────────────────────────────
      // PHASE 2A: Browser path (IndexedDB)
      // ──────────────────────────────────────────────
      browser: {
        initial: 'idle',
        states: {
          idle: {
            on: {
              GET_ALL: 'loading',
              ADD: { target: 'adding', actions: 'assignCurrentPlugin' },
              REMOVE: { target: 'removing', actions: 'assignPluginId' },
              HAS: { target: 'checking', actions: 'assignPluginId' },
            },
          },
          loading: {
            invoke: {
              src: 'browserGetAll',
              onDone: {
                target: 'idle',
                actions: 'assignPlugins',
              },
              onError: {
                target: 'idle',
                actions: 'assignError',
              },
            },
          },
          adding: {
            invoke: {
              src: 'browserAdd',
              onDone: {
                target: 'idle',
                actions: 'assignPlugins',
              },
              onError: {
                target: 'idle',
                actions: 'assignError',
              },
            },
          },
          removing: {
            invoke: {
              src: 'browserRemove',
              onDone: {
                target: 'idle',
                actions: 'assignPlugins',
              },
              onError: {
                target: 'idle',
                actions: 'assignError',
              },
            },
          },
          checking: {
            invoke: {
              src: 'browserHas',
              onDone: {
                target: 'idle',
                actions: 'assignHasResult',
              },
              onError: {
                target: 'idle',
                actions: 'assignError',
              },
            },
          },
        },
      },

      // ──────────────────────────────────────────────
      // PHASE 2B: Desktop path (Electron IPC → FS)
      // ──────────────────────────────────────────────
      desktop: {
        initial: 'idle',
        states: {
          idle: {
            on: {
              GET_ALL: 'loading',
              ADD: { target: 'adding', actions: 'assignCurrentPlugin' },
              REMOVE: { target: 'removing', actions: 'assignPluginId' },
              HAS: { target: 'checking', actions: 'assignPluginId' },
            },
          },
          loading: {
            invoke: {
              src: 'desktopGetAll',
              onDone: {
                target: 'idle',
                actions: 'assignPlugins',
              },
              onError: {
                target: 'idle',
                actions: 'assignError',
              },
            },
          },
          adding: {
            invoke: {
              src: 'desktopAdd',
              onDone: {
                target: 'idle',
                actions: 'assignPlugins',
              },
              onError: {
                target: 'idle',
                actions: 'assignError',
              },
            },
          },
          removing: {
            invoke: {
              src: 'desktopRemove',
              onDone: {
                target: 'idle',
                actions: 'assignPlugins',
              },
              onError: {
                target: 'idle',
                actions: 'assignError',
              },
            },
          },
          checking: {
            invoke: {
              src: 'desktopHas',
              onDone: {
                target: 'idle',
                actions: 'assignHasResult',
              },
              onError: {
                target: 'idle',
                actions: 'assignError',
              },
            },
          },
        },
      },

      // ──────────────────────────────────────────────
      // ERROR
      // ──────────────────────────────────────────────
      error: {
        on: {
          RETRY: 'detecting',
        },
      },
    },
  },
  {
    // ──────────────────────────────────────────────
    // GUARDS
    // ──────────────────────────────────────────────
    guards: {
      isBrowser: (context, event) => event.data.backend === 'indexeddb',
      isDesktop: (context, event) => event.data.backend === 'electron',
    },

    // ──────────────────────────────────────────────
    // ACTIONS
    // ──────────────────────────────────────────────
    actions: {
      assignBrowserStorage: assign({
        backend: () => 'indexeddb',
        storage: (_, event) => event.data.storage,
      }),
      assignDesktopStorage: assign({
        backend: () => 'electron',
        storage: (_, event) => event.data.storage,
      }),
      assignCurrentPlugin: assign({
        currentPlugin: (_, event) => event.plugin,
      }),
      assignPluginId: assign({
        pluginId: (_, event) => event.pluginId,
      }),
      assignPlugins: assign({
        plugins: (_, event) => event.data,
      }),
      assignHasResult: assign({
        hasResult: (_, event) => event.data,
      }),
      assignError: assign({
        error: (_, event) => event.data,
      }),
    },

    // ──────────────────────────────────────────────
    // SERVICES (actors)
    // ──────────────────────────────────────────────
    services: {
      // Detect which environment we're in
      detectEnvironment: async () => {
        const hasBridge =
          typeof window !== 'undefined' && !!window.fairyStorage

        if (hasBridge) {
          return {
            backend: 'electron',
            storage: window.fairyStorage,
          }
        }

        // Dynamic import for browser only
        const { storage } = await import('./browser.js')
        return {
          backend: 'indexeddb',
          storage,
        }
      },

      // ── Browser services ──
      browserGetAll: async (context) => {
        const plugins = await context.storage.getItem('installed_plugins')
        return plugins || []
      },
      browserAdd: async (context) => {
        const plugins = await context.storage.getItem('installed_plugins') || []
        const updated = [
          ...plugins.filter((p) => p.id !== context.currentPlugin.id),
          context.currentPlugin,
        ]
        await context.storage.setItem('installed_plugins', updated)
        return updated
      },
      browserRemove: async (context) => {
        const plugins = await context.storage.getItem('installed_plugins') || []
        const updated = plugins.filter((p) => p.id !== context.pluginId)
        await context.storage.setItem('installed_plugins', updated)
        return updated
      },
      browserHas: async (context) => {
        const plugins = await context.storage.getItem('installed_plugins') || []
        return plugins.some((p) => p.id === context.pluginId)
      },

      // ── Desktop services (IPC to main process) ──
      desktopGetAll: async (context) => {
        const plugins = await context.storage.getItem('installed_plugins')
        return plugins || []
      },
      desktopAdd: async (context) => {
        const plugins = await context.storage.getItem('installed_plugins') || []
        const updated = [
          ...plugins.filter((p) => p.id !== context.currentPlugin.id),
          context.currentPlugin,
        ]
        await context.storage.setItem('installed_plugins', updated)
        return updated
      },
      desktopRemove: async (context) => {
        const plugins = await context.storage.getItem('installed_plugins') || []
        const updated = plugins.filter((p) => p.id !== context.pluginId)
        await context.storage.setItem('installed_plugins', updated)
        return updated
      },
      desktopHas: async (context) => {
        const plugins = await context.storage.getItem('installed_plugins') || []
        return plugins.some((p) => p.id === context.pluginId)
      },
    },
  }
)
