<template>
  <Dialog>
    <DialogContent :show-close-button="false" :tabindex="null">
      <DialogHeader>
        <DialogTitle class="flex">
          <Icon icon="lucide:github" />
          <span class="ml-2">Add from GitHub</span>
        </DialogTitle>
        <DialogDescription>
          Note that if the repository is private, your linked GitHub account must have read access
          to that repository.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-8 my-3">
        <div class="grid gap-2">
          <Label for="repository">Repository</Label>
          <Input id="repository" name="repository" default-value="rfc-editor-drafts/draft-" />
        </div>
        <div class="grid gap-2">
          <Label for="filepath">File Path</Label>
          <Input id="filepath" name="filepath" placeholder="draft-ietf-foo-bar.xml" />
        </div>
        <div class="grid gap-2">
          <Label for="revision">Commit SHA / Branch / Tag</Label>
          <Input id="revision" name="revision" />
          <span class="italic text-xs">(optional, latest from default branch if empty)</span>
        </div>
      </div>
      <DialogFooter>
        <DialogClose as-child>
          <Button variant="outline" class="cursor-pointer">Cancel</Button>
        </DialogClose>
        <Button type="submit" class="cursor-pointer">Import</Button>
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
