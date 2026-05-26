<template>
  <Dialog ref="diag">
    <DialogContent :show-close-button="false" @pointerDownOutside.prevent :tabindex="null">
      <DialogHeader>
        <DialogTitle class="flex">
          <Icon icon="lucide:upload" />
          <span class="ml-2">Upload</span>
        </DialogTitle>
      </DialogHeader>
      <div class="grid gap-8 my-3">
        <div class="grid gap-2">
          <Input
            id="docupl"
            type="file"
            name="docupl"
            accept=".md, .txt, .xml"
            @change="handleUploadSelection" />
        </div>
        <Dialog v-model:open="state.isImporting">
          <DialogContent
            :show-close-button="false"
            @pointer-down-outside.prevent
            @escape-key-down.prevent
            class="sm:max-w-md">
            <DialogHeader>
              <DialogTitle class="flex">
                <Spinner class="size-5 text-purple-400" />
                <span class="text-sm ml-2">Importing...</span>
              </DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Dialog v-model:open="state.isError">
          <DialogContent :show-close-button="false" class="sm:max-w-md">
            <DialogHeader>
              <DialogTitle class="flex justify-center-safe items-center">
                <Icon icon="lucide:octagon-alert" class="text-red-400 size-8" />
                <span class="text-sm font-normal text-red-800 dark:text-red-300 ml-4"
                  >Failed to read file contents. Make sure you have read permissions.</span
                >
              </DialogTitle>
            </DialogHeader>
            <DialogFooter>
              <DialogClose as-child>
                <Button variant="outline" class="cursor-pointer">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <DialogFooter>
        <DialogClose as-child>
          <Button variant="outline" class="cursor-pointer">Cancel</Button>
        </DialogClose>
        <Button type="submit" :disabled="!state.canUpload" @click="importDoc" class="cursor-pointer"
          >Import</Button
        >
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { nextTick, reactive, useTemplateRef } from 'vue'
import { Temporal } from '@js-temporal/polyfill'

import { useSessionsStore } from '@/stores/sessions.js'

import { Icon } from '@iconify/vue'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

const diag = useTemplateRef('diag')

const sessions = useSessionsStore()

const state = reactive({
  canUpload: false,
  isError: false,
  isImporting: false
})

let contents = ''
let fileName = ''
let lastModified = 0

// Handle File Selection

function handleUploadSelection(ev) {
  state.canUpload = false
  state.isError = false
  contents = ''

  const file = ev.target.files?.[0]
  if (!file) {
    return
  }

  fileName = file.name
  lastModified = file.lastModified

  // Read file contents
  const reader = new FileReader()
  reader.addEventListener('load', () => {
    contents = reader.result
    state.canUpload = true
  })
  reader.addEventListener('error', () => {
    state.isError = true
  })
  reader.readAsText(file)
}

// Import

async function importDoc() {
  state.isImporting = true
  await nextTick()
  try {
    await sessions.addDocument(
      fileName,
      contents,
      Temporal.Instant.fromEpochMilliseconds(lastModified).toLocaleString('en', {
        month: 'short',
        year: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      })
    )
    state.canUpload = false
    contents = ''
    diag.value?.$emit('update:open', false)
  } catch (err) {
    console.warn(err)
    state.isImporting = false
    state.isError = true
  }
  state.isImporting = false
}
</script>
