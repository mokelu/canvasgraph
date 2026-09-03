import { createMachine, assign } from 'xstate';

export const fairyMachine = createMachine({
  id: 'fairy',
  initial: 'boot',
  context: {
    installedPlugins: [],
    activePlugins: [],
    currentPlugin: null,
  },
  states: {
    boot: {
      description: 'Starts up, loads installed plugins from memory',
      invoke: {
        src: 'loadInstalledPlugins',
        onDone: {
          target: 'workspace',
          actions: 'assignLoadedPlugins',
        },
        onError: 'error',
      },
    },

    workspace: {
      description: 'Main workspace - arrange and use plugins',
      on: {
        OPEN_PLUGIN: {
          target: 'pluginActive',
          actions: 'assignCurrentPlugin',
        },
        OPEN_MARKETPLACE: 'marketplace',
      },
    },

    pluginActive: {
      description: 'A plugin is active and being used',
      on: {
        CLOSE_PLUGIN: {
          target: 'workspace',
          actions: 'clearCurrentPlugin',
        },
        SWITCH_PLUGIN: {
          target: 'pluginActive',
          actions: 'assignCurrentPlugin',
        },
      },
    },

    marketplace: {
      description: 'Browse, search, install, remove plugins',
      on: {
        INSTALL_PLUGIN: {
          target: 'installing',
          actions: 'assignTargetPlugin',
        },
        UNINSTALL_PLUGIN: {
          target: 'uninstalling',
          actions: 'assignTargetPlugin',
        },
        BACK_TO_WORKSPACE: 'workspace',
      },
    },

    installing: {
      invoke: {
        src: 'installPlugin',
        onDone: {
          target: 'marketplace',
          actions: 'addToInstalled',
        },
        onError: 'marketplace',
      },
    },

    uninstalling: {
      invoke: {
        src: 'uninstallPlugin',
        onDone: {
          target: 'marketplace',
          actions: 'removeFromInstalled',
        },
        onError: 'marketplace',
      },
    },

    error: {
      on: {
        RETRY: 'boot',
      },
    },
  },
}, {
  services: {
    loadInstalledPlugins: async (context) => {
      // Reads from localStorage
      return JSON.parse(localStorage.getItem('installedPlugins') || '[]');
    },
    installPlugin: async (context, event) => {
      // Fetches plugin zip, writes files, loads plugin
      const { plugin } = event;
      // ... installation logic
      return plugin;
    },
    uninstallPlugin: async (context, event) => {
      // Calls plugin.onunload(), deletes files
      const { plugin } = event;
      // ... uninstallation logic
      return plugin;
    },
  },
  actions: {
    assignLoadedPlugins: assign({
      installedPlugins: (context, event) => event.data,
    }),
    assignCurrentPlugin: assign({
      currentPlugin: (context, event) => event.plugin,
    }),
    clearCurrentPlugin: assign({
      currentPlugin: null,
    }),
    assignTargetPlugin: assign({
      targetPlugin: (context, event) => event.plugin,
    }),
    addToInstalled: assign({
      installedPlugins: (context, event) => [
        ...context.installedPlugins,
        event.data,
      ],
    }),
    removeFromInstalled: assign({
      installedPlugins: (context, event) =>
        context.installedPlugins.filter((p) => p.id !== event.data.id),
    }),
  },
});
