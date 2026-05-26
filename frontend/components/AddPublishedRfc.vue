<template>
  <Dialog ref="diag">
    <DialogContent :show-close-button="false" @pointerDownOutside.prevent :tabindex="null">
      <DialogHeader>
        <DialogTitle class="flex">
          <Icon icon="lucide:landmark" />
          <span class="ml-2">Add a published RFC</span>
        </DialogTitle>
        <DialogDescription>
          Enter the RFC number directly or search by title, abstract, author, etc.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-8 my-3">
        <div class="grid gap-2">
          <Label for="searchq">Search</Label>
          <Input
            id="searchq"
            name="searchq"
            v-model="state.q"
            placeholder="e.g. 1234, IP over Avian Carriers, Vint Cerf, etc." />
          <div class="grid gap-1" v-if="state.hits?.length">
            <Item variant="muted" size="sm" as-child v-for="hit of state.hits">
              <a
                href="#"
                :class="[
                  'hover:text-purple-300',
                  state.selected === hit.document.rfc && 'bg-primary text-white'
                ]"
                @click.prevent="selectRfc(hit.document)">
                <ItemContent>
                  <ItemTitle>RFC {{ hit.document.rfc }}</ItemTitle>
                  <ItemDescription>{{ hit.document.title }}</ItemDescription>
                </ItemContent>
              </a>
            </Item>
          </div>
          <Alert v-if="noHits" variant="destructive">
            <AlertDescription>No matches for your search query.</AlertDescription>
          </Alert>
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
        <div v-if="state.format === 'xml'" class="flex items-center gap-3">
          <Checkbox id="unprepped" v-model="state.unprepped" />
          <Label for="unprepped">Use unprepped version</Label>
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
                  >Failed to fetch RFC. It might not exist in the selected format.</span
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
        <Button type="submit" :disabled="!state.selected" @click="importDoc" class="cursor-pointer"
          >Import</Button
        >
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import ky from 'ky'
import { debounce } from 'es-toolkit/function'
import { Temporal } from '@js-temporal/polyfill'

import { useSessionsStore } from '@/stores/sessions.js'

import { Icon } from '@iconify/vue'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { computed, nextTick, reactive, useTemplateRef, watch } from 'vue'

const diag = useTemplateRef('diag')

const sessions = useSessionsStore()

const state = reactive({
  q: '',
  format: 'xml',
  unprepped: false,
  hits: [],
  selected: '',
  selectedPubDate: 0,
  isLoading: false,
  isImporting: false,
  isError: false
})

function selectRfc(doc) {
  state.selected = doc.rfc
  state.selectedPubDate = doc.publicationDate
}

// Search

const noHits = computed(() => !state.isLoading && state.q && !state.hits?.length)

const search = debounce(async (q) => {
  try {
    const resp = await ky
      .get('https://typesense.ietf.org/collections/docs/documents/search', {
        credentials: 'omit',
        searchParams: {
          q,
          preset: 'red',
          'x-typesense-api-key': 'RuEj1KlJwMLXH3FvoReaKZXTTz3gGBnV',
          limit: 5
        }
      })
      .json()
    state.hits = resp?.hits ?? []
  } catch (err) {
    console.warn(err)
  }
  state.isLoading = false
}, 300)

watch(
  () => state.q,
  (val) => {
    state.selected = ''
    if (val) {
      state.isLoading = true
      search(val)
    } else {
      state.isLoading = false
      state.hits = []
    }
  }
)

// Import

async function importDoc() {
  state.isImporting = true
  await nextTick()
  try {
    const resp = await ky.post('/api/import/rfc', {
      json: {
        rfc: state.selected,
        format: state.format,
        unprepped: state.format === 'xml' && state.unprepped
      }
    })
    const contents = await resp.text()
    const suffix = state.unprepped ? '.notprepped' : ''
    await sessions.addDocument(
      `rfc${state.selected}${suffix}.${state.format}`,
      contents,
      Temporal.Instant.fromEpochMilliseconds(state.selectedPubDate * 1000).toLocaleString('en', {
        month: 'short',
        year: 'numeric'
      })
    )
    state.q = ''
    state.selected = ''
    state.hits = []
    diag.value?.$emit('update:open', false)
  } catch (err) {
    console.warn(err)
    state.isImporting = false
    state.isError = true
  }
  state.isImporting = false
}
</script>
