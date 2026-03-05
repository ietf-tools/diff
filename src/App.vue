<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2">
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1 cursor-pointer" />
          <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink href="#">rfc-editor-drafts</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>draft-abc-def-ghi</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div
          id="editor"
          ref="editor"
          class="bg-muted/50 min-h-content flex-1 rounded-xl contain-paint"></div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<script>
export const description = 'An inset sidebar with secondary navigation.'
export const iframeHeight = '800px'
</script>

<script setup>
import { onMounted, useTemplateRef, watch } from 'vue'
import { useColorMode } from '@vueuse/core'
import { debounce } from 'es-toolkit/function'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.main'

import AppSidebar from '@/components/AppSidebar.vue'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

const colorMode = useColorMode({ disableTransition: false })

monaco.languages.register({ id: 'xml' })
const editorRef = useTemplateRef('editor')

const originalModel = monaco.editor.createModel(`hello world`, 'text/xml')
const modifiedModel = monaco.editor.createModel(`Hello World!`, 'text/xml')

onMounted(() => {
  // Create diff editor
  const diffEditor = monaco.editor.createDiffEditor(editorRef.value, {
    allowOverflow: false,
    copyWithSyntaxHighlighting: false,
    cursorBlinking: 'blink',
    originalEditable: true,
    automaticLayout: true,
    padding: { top: 10, bottom: 10 },
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    theme: colorMode.state.value === 'light' ? 'vs-light' : 'vs-dark'
  })

  // diffEditor.onDidChangeModel(
  //   debounce((ev) => {
  //     console.log(ev)
  //   }, 500)
  // )
  // diffEditor.onDidUpdateDiff((ev) => {
  //   console.log(ev)
  // })

  diffEditor.setModel({
    original: originalModel,
    modified: modifiedModel
  })

  // Update theme on change
  watch(
    () => colorMode.store.value,
    (newColor) => {
      diffEditor.updateOptions({
        theme: newColor === 'light' ? 'vs-light' : 'vs-dark'
      })
    }
  )
})
</script>
