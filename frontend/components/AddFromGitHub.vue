<template>
  <Dialog>
    <DialogContent :show-close-button="false" @pointerDownOutside.prevent :tabindex="null">
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
      <div v-if="isFetching" class="flex items-center">
        <Spinner class="size-4 text-purple-400" />
        <span class="ml-2 italic text-sm">Checking GitHub link state...</span>
      </div>
      <div v-else-if="!isLoggedIn">
        <Alert variant="destructive">
          <Icon icon="lucide:triangle-alert" />
          <AlertTitle>Login required</AlertTitle>
          <AlertDescription>
            <p>You must first login with an IETF account to import documents from GitHub.</p>
            <div class="flex gap-3 mt-2">
              <Button variant="secondary" as="a" href="/login" class="cursor-pointer">
                <Icon icon="lucide:log-in" />
                Login
              </Button>
              <Button
                variant="secondary"
                as="a"
                href="https://datatracker.ietf.org/accounts/create/"
                class="cursor-pointer">
                <Icon icon="lucide:user-round-plus" />
                Register
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
      <div v-else-if="!isGitHubLinked">
        <Alert variant="destructive">
          <Icon icon="lucide:triangle-alert" />
          <AlertTitle>GitHub account linking required</AlertTitle>
          <AlertDescription>
            <p>You must first link your GitHub account to import documents from GitHub.</p>
            <div class="flex gap-3 mt-2">
              <Button variant="secondary" as="a" href="/login/link-github" class="cursor-pointer">
                <Icon icon="lucide:github" />
                Link GitHub Account
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
      <div v-else class="grid gap-8 my-3">
        <div class="grid gap-2">
          <Label for="repository">Repository</Label>
          <Input
            id="repository"
            name="repository"
            v-model="state.repository"
            placeholder="e.g. rfc-editor-drafts/draft-ietf-foo-bar" />
        </div>
        <div class="grid gap-2">
          <Label for="filepath">File Path</Label>
          <Input
            id="filepath"
            name="filepath"
            v-model="state.filePath"
            placeholder="e.g. draft-ietf-foo-bar.xml" />
        </div>
        <div class="grid gap-2">
          <Label for="revision">Commit SHA / Branch / Tag</Label>
          <Input id="revision" name="revision" v-model="state.revision" />
          <span class="italic text-xs">(optional, latest from default branch if empty)</span>
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
                <span class="text-sm ml-2">Importing from GitHub...</span>
              </DialogTitle>
            </DialogHeader>
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
import { computed, nextTick, reactive } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { Icon } from '@iconify/vue'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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
import { Spinner } from '@/components/ui/spinner'

const state = reactive({
  repository: 'rfc-editor-drafts/draft-',
  filePath: '',
  revision: '',
  isImporting: false
})

const { isFetching, isError, data, error } = useQuery<{
  id: string
  ghUsername: string
}>({
  queryKey: ['auth/userinfo', { method: 'POST' }],
  placeholderData: {
    id: '',
    ghUsername: ''
  }
})

const isLoggedIn = computed(() => {
  return data.value?.id
})
const isGitHubLinked = computed(() => {
  return data.value?.ghUsername
})

const canImport = computed(() => {
  return !isFetching.value && state.repository?.length >= 3 && state.filePath?.length > 0
})

async function importDoc() {
  state.isImporting = true
  await nextTick()
}
</script>
