<template>
  <DiffHeader />
  <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
    <div
      id="editor"
      ref="editor"
      class="bg-muted/50 min-h-content flex-1 rounded-xl contain-paint"></div>
  </div>
  <Dialog v-model:open="state.isComputing">
    <DialogContent
      :show-close-button="false"
      @pointer-down-outside.prevent
      @escape-key-down.prevent
      @open-auto-focus.prevent
      class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle class="flex items-center">
          <Spinner class="size-5 text-purple-400" />
          <span class="ml-2 flex flex-col">
            <span class="text-sm">Computing diff...</span>
            <span class="text-xs font-normal text-gray-600 dark:text-gray-400">{{
              randomFunnyMsg
            }}</span>
          </span>
        </DialogTitle>
      </DialogHeader>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, useTemplateRef, watch } from 'vue'
import { useColorMode } from '@vueuse/core'
import { sample } from 'es-toolkit/array'
import { debounce } from 'es-toolkit/function'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.main'

import { useEditorStore } from '@/stores/editor.js'
import { useSessionsStore } from '@/stores/sessions.js'
import DiffHeader from './DiffHeader.vue'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'

const colorMode = useColorMode({ disableTransition: false })
const editorStore = useEditorStore()
const sessions = useSessionsStore()

monaco.languages.register({ id: 'xml' })
monaco.languages.register({ id: 'markdown' })
const editorRef = useTemplateRef('editor')

const state = reactive({
  isComputing: false
})

const funnyMsgs = [
  'Reticulating splines...',
  'Realigning flux capacitor...',
  'Stabilizing positronic phase discriminator...',
  'Energizing warp drive core...',
  'Inverting quantum field containment...',
  'Powering subharmonic plasma conduit...',
  'Increasing nanowave pulse processor...',
  'De-polarizing metaphasic impulse converter...',
  'Detecting spatial interphasic anomalies...',
  'Synchronizing anaphasic particle field...',
  'Decreasing electro-plasma axionic beam...',
  'Tabulating 4D spacetime fabric velocity...'
]

const randomFunnyMsg = computed(() => {
  return state.isComputing && sample(funnyMsgs)
})

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

  diffEditor.onDidUpdateDiff(() => {
    // Event is triggered early when replacing existing new models
    // Workaround is to check getLineChanges()
    // getLineChanges() is null while the diff is computing in the background
    if (diffEditor.getLineChanges() !== null) {
      state.isComputing = false
    }
  })

  // Update Models on change
  watch(
    [() => sessions.leftDocId, () => sessions.rightDocId, () => editorStore.contentType],
    () => {
      state.isComputing = true

      nextTick(() => {
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
