export default class ChartPlugin {
  onload(api) {
    this.id = api.registerContentType('chart', () => import('./ChartView.vue'))
  }

  onunload(api) {
    api.unregisterContentType(this.id)
  }
}
