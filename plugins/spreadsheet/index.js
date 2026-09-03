export default class SpreadsheetPlugin {
  onload(api) {
    this.id = api.registerContentType('spreadsheet', () => import('./SpreadsheetView.vue'))
  }

  onunload(api) {
    api.unregisterContentType(this.id)
  }
}
