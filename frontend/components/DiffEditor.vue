<template>
  <DiffHeader />
  <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
    <div
      id="editor"
      ref="editor"
      class="bg-muted/50 min-h-content flex-1 rounded-xl contain-paint"></div>
  </div>
</template>

<script setup>
import { onMounted, useTemplateRef, watch } from 'vue'
import { useColorMode } from '@vueuse/core'
import { debounce } from 'es-toolkit/function'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.main'

import { useEditorStore } from '@/stores/editor.js'
import { useSessionsStore } from '@/stores/sessions.js'
import DiffHeader from './DiffHeader.vue'

const colorMode = useColorMode({ disableTransition: false })
const editorStore = useEditorStore()
const sessions = useSessionsStore()

monaco.languages.register({ id: 'xml' })
monaco.languages.register({ id: 'markdown' })
const editorRef = useTemplateRef('editor')

onMounted(async () => {
  // Create diff editor
  const diffEditor = monaco.editor.createDiffEditor(editorRef.value, {
    allowOverflow: false,
    copyWithSyntaxHighlighting: false,
    cursorBlinking: 'blink',
    originalEditable: true,
    automaticLayout: true,
    lineNumbersMinChars: 4,
    fontSize: editorStore.fontSize,
    padding: { top: 10, bottom: 10 },
    renderWhitespace: editorStore.flags.includes('showWhitespaces') ? 'all' : 'selection',
    scrollBeyondLastLine: false,
    renderSideBySide: editorStore.viewMode !== 'inline',
    wordWrap: editorStore.flags.includes('wordwrap') ? 'on' : 'off',
    hideUnchangedRegions: editorStore.flags.includes('foldUnchanged')
      ? {
          enabled: true,
          minimumLineCount: 10,
          revealLineCount: 10
        }
      : { enabled: false },
    theme: colorMode.state.value === 'light' ? 'vs' : 'vs-dark'
  })

  // Update Models on change
  watch(
    [() => sessions.leftDocId, () => sessions.rightDocId, () => editorStore.contentType],
    () => {
      diffEditor.setModel({
        original: monaco.editor.createModel(
          sessions.leftDoc?.contents ?? '',
          `text/${editorStore.contentType}`
        ),
        modified: monaco.editor.createModel(
          sessions.rightDoc?.contents ?? '',
          `text/${editorStore.contentType}`
        )
      })
    },
    {
      immediate: true
    }
  )

  // Update Theme on change
  watch(
    () => colorMode.store.value,
    (newColor) => {
      diffEditor.updateOptions({
        theme: newColor === 'light' ? 'vs-light' : 'vs-dark'
      })
    }
  )

  // Update View Mode on change
  watch(
    () => editorStore.viewMode,
    (newViewMode) => {
      diffEditor.updateOptions({
        renderSideBySide: newViewMode !== 'inline'
      })
    }
  )

  // Update Editor Flags on change
  watch(
    () => editorStore.flags,
    (newFlags) => {
      diffEditor.updateOptions({
        wordWrap: newFlags.includes('wordwrap') ? 'on' : 'off',
        renderWhitespace: newFlags.includes('showWhitespaces') ? 'all' : 'selection',
        hideUnchangedRegions: newFlags.includes('foldUnchanged')
          ? {
              enabled: true,
              minimumLineCount: 10,
              revealLineCount: 10
            }
          : { enabled: false }
      })
    }
  )

  // Update Font Size on change
  watch(
    () => editorStore.fontSize,
    (newFontSize) => {
      diffEditor.updateOptions({
        fontSize: newFontSize
      })
    }
  )
})
</script>
