import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useEditorStore = defineStore('editor', () => {
  const viewMode = useStorage('editorViewMode', 'side-by-side')
  const flags = useStorage('editorFlags', ['foldUnchanged', 'stripWhitespaces', 'wordwrap'])
  const fontSize = useStorage('editorFontSize', 14)
  const contentType = useStorage('editorContentType', 'xml')

  return {
    viewMode,
    flags,
    fontSize,
    contentType
  }
})
