<template>
  <header class="flex h-16 shrink-0 items-center gap-2">
    <div class="flex items-center gap-2 px-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <SidebarTrigger class="-ml-1 cursor-pointer" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle Sidebar</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
      <ButtonGroup>
        <ButtonGroup class="hidden sm:flex">
          <Button variant="outline" size="icon" class="cursor-pointer" aria-label="Go Back">
            <Icon icon="lucide:save" />
          </Button>
        </ButtonGroup>
        <ToggleGroup
          :model-value="editorStore.viewMode"
          @update:model-value="
            (val) => {
              if (val) {
                editorStore.viewMode = val
              }
            }
          "
          variant="outline"
          type="single">
          <ToggleGroupItem value="side-by-side" class="cursor-pointer">
            <Icon icon="lucide:square-split-horizontal" />
            <span>Side-by-side</span>
            <span
              :class="
                'flex size-2 rounded-full ' +
                (editorStore.viewMode === 'side-by-side' ? 'bg-emerald-500' : 'bg-rose-500')
              "></span>
          </ToggleGroupItem>
          <ToggleGroupItem value="inline" class="cursor-pointer">
            <Icon icon="lucide:between-horizontal-start" />
            <span>Inline</span>
            <span
              :class="
                'flex size-2 rounded-full ' +
                (editorStore.viewMode === 'inline' ? 'bg-emerald-500' : 'bg-rose-500')
              "></span>
          </ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup v-model="editorStore.flags" variant="outline" type="multiple">
          <ToggleGroupItem value="foldUnchanged" class="cursor-pointer">
            <Icon icon="lucide:fold-vertical" />
            <span>Fold Unchanged Regions</span>
            <span
              :class="
                'flex size-2 rounded-full ' +
                (editorStore.flags.includes('foldUnchanged') ? 'bg-emerald-500' : 'bg-rose-500')
              "></span>
          </ToggleGroupItem>
          <ToggleGroupItem value="stripWhitespaces" class="cursor-pointer">
            <Icon icon="lucide:brackets" />
            <span>Strip Whitespaces</span>
            <span
              :class="
                'flex size-2 rounded-full ' +
                (editorStore.flags.includes('stripWhitespaces') ? 'bg-emerald-500' : 'bg-rose-500')
              "></span>
          </ToggleGroupItem>
          <ToggleGroupItem value="wordwrap" class="cursor-pointer">
            <Icon icon="lucide:text-wrap" />
            <span>Wordwrap</span>
            <span
              :class="
                'flex size-2 rounded-full ' +
                (editorStore.flags.includes('wordwrap') ? 'bg-emerald-500' : 'bg-rose-500')
              "></span>
          </ToggleGroupItem>
        </ToggleGroup>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <NumberField id="fontsize" v-model="editorStore.fontSize" :min="8">
                <NumberFieldContent>
                  <NumberFieldDecrement class="cursor-pointer" />
                  <NumberFieldInput class="w-30" />
                  <NumberFieldIncrement class="cursor-pointer" />
                </NumberFieldContent>
              </NumberField>
            </TooltipTrigger>
            <TooltipContent>
              <p>Font Size</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </ButtonGroup>
    </div>
  </header>
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

import { useEditorStore } from '../stores/editor.js'

import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput
} from '@/components/ui/number-field'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Icon } from '@iconify/vue'

const colorMode = useColorMode({ disableTransition: false })

const editorStore = useEditorStore()

monaco.languages.register({ id: 'xml' })
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
    renderWhitespace: 'all',
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

  // Store changes
  // diffEditor.onDidUpdateDiff(
  //   debounce((ev, bob) => {
  //     console.log(ev, bob)
  //   }, 500)
  // )

  // Load sample data
  const dataLeft = await fetch('/sample-data/draft-halen-fedae-03.xml').then((r) => r.text())
  const dataRight = await fetch('/sample-data/rfc9932.notprepped.xml').then((r) => r.text())

  diffEditor.setModel({
    original: monaco.editor.createModel(dataLeft, 'text/xml'),
    modified: monaco.editor.createModel(dataRight, 'text/xml')
  })

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
