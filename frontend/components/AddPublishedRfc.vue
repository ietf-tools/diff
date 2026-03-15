<template>
  <Dialog>
    <DialogContent :show-close-button="false" :tabindex="null">
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
          <Input id="searchq" name="searchq" placeholder="e.g. 1234 or IP over Avian Carriers" />
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
</script>
