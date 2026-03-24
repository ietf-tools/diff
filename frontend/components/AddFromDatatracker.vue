<template>
  <Dialog ref="diag">
    <DialogContent :show-close-button="false" @pointerDownOutside.prevent :tabindex="null">
      <DialogHeader>
        <DialogTitle class="flex">
          <Icon icon="lucide:text-select" />
          <span class="ml-2">Add from Datatracker</span>
        </DialogTitle>
        <DialogDescription> Select the draft and version to use below. </DialogDescription>
      </DialogHeader>
      <div class="grid gap-8 my-3">
        <div class="grid gap-2">
          <Label for="repository">Draft</Label>
          <Input
            id="draft"
            name="draft"
            v-model="state.draft"
            placeholder="e.g. draft-ietf-foo-bar" />
        </div>
        <div class="grid gap-2">
          <Label for="version">Version</Label>
          <Input
            id="version"
            name="version"
            v-model="state.version"
            class="w-20"
            placeholder="e.g. 01" />
        </div>
        <div class="grid gap-2">
          <Label for="format">Format</Label>
          <ToggleGroup type="single" variant="outline" v-model="state.format">
            <ToggleGroupItem value="xml" class="cursor-pointer" aria-label="XML">
              XML
            </ToggleGroupItem>
            <ToggleGroupItem value="txt" class="cursor-pointer" aria-label="Plain Text">
              Plain Text
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      <div>
        <Dialog v-model:open="state.isImporting">
          <DialogContent
            :show-close-button="false"
            @pointer-down-outside.prevent
            @escape-key-down.prevent
            class="sm:max-w-md">
            <DialogHeader>
              <DialogTitle class="flex">
                <Spinner class="size-5 text-purple-400" />
                <span class="text-sm ml-2">Importing from Datatracker...</span>
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
                  >Failed to fetch draft. Ensure the draft name and version are valid.</span
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
        <Button type="submit" :disabled="!canImport" @click="importDoc" class="cursor-pointer"
          >Import</Button
        >
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, useTemplateRef } from 'vue'
import ky from 'ky'

import { useSessionsStore } from '@/stores/sessions.js'

import { Icon } from '@iconify/vue'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

const diag = useTemplateRef('diag')

const sessions = useSessionsStore()

const state = reactive({
  draft: 'draft-',
  version: '01',
  format: 'xml',
  isImporting: false,
  isError: false
})

const canImport = computed(() => {
  return state.draft?.length >= 6 && state.draft.startsWith('draft-') && state.version?.length > 0
})

async function importDoc() {
  state.isImporting = true
  await nextTick()
  try {
    const resp = await ky.post('/api/import/datatracker', {
      json: {
        draft: state.draft,
        version: state.version,
        format: state.format
      }
    })
    const contents = await resp.text()
    const versionFormatted = state.version.padStart(2, '0')
    sessions.addDocument(
      `${state.draft}-${versionFormatted}.${state.format}`,
      contents,
      `version ${versionFormatted}`
    )
    diag.value.$emit('update:open', false)
  } catch (err) {
    console.warn(err)
    state.isImporting = false
    state.isError = true
  }
  state.isImporting = false
}
</script>
