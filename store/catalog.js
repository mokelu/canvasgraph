export const catalog = [
  {
    id: 'chart',
    name: 'Candlestick Chart',
    description: 'Interactive candlestick chart with zoom and pan',
    version: '1.0.0',
    license: 'MIT',
    author: 'FAIRY',
    type: 'app',
    builtIn: true,
    provides: ['chart'],
    requires: ['d3', 'pixi']
  },
  {
    id: 'markdown',
    name: 'Markdown Editor',
    description: 'Write and preview markdown content',
    version: '1.0.0',
    license: 'MIT',
    author: 'FAIRY',
    type: 'app',
    builtIn: false,
    provides: ['markdown'],
    requires: [],
    downloadUrl: 'https://plugins.fairy.app/markdown/v1.0.0.zip'
  },
  {
    id: 'spreadsheet',
    name: 'Spreadsheet',
    description: 'Data grid for viewing and editing tabular data',
    version: '1.0.0',
    license: 'MIT',
    author: 'FAIRY',
    type: 'app',
    builtIn: false,
    provides: ['spreadsheet'],
    requires: [],
    downloadUrl: 'https://plugins.fairy.app/spreadsheet/v1.0.0.zip'
  }
]
