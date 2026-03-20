import { defineStore } from 'pinia'

export const useEditorStore = defineStore('editor', {
  state: () => ({
    viewMode: 'side-by-side',
    flags: ['foldUnchanged', 'stripWhitespaces', 'wordwrap'],
    fontSize: 14,
    contentType: 'xml'
  }),
  persist: {
    pick: ['viewMode', 'flags', 'fontSize']
  }
})
