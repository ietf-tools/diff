<template>
  <Dialog>
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
        <div class="flex items-center gap-3">
          <Checkbox id="unprepped" v-model="state.unprepped" />
          <Label for="unprepped">Use unprepped version</Label>
        </div>
      </div>
      <DialogFooter>
        <DialogClose as-child>
          <Button variant="outline" class="cursor-pointer">Cancel</Button>
        </DialogClose>
        <Button type="submit" :disabled="true" class="cursor-pointer">Import</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
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
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { reactive } from 'vue'

const state = reactive({
  q: '',
  format: 'xml',
  unprepped: false
})
</script>
