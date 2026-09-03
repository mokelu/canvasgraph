export default class MarkdownPlugin {
  onload(api) {
    this.id = api.registerContentType('markdown', () => import('./MarkdownView.vue'))
  }

  onunload(api) {
    api.unregisterContentType(this.id)
  }
}
