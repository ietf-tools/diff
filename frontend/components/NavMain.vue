<script setup lang="ts">
import { Icon } from '@iconify/vue'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'

import AddFromGitHub from '@/components/AddFromGitHub.vue'
import { reactive } from 'vue'
import AddPublishedRfc from './AddPublishedRfc.vue'
import AddUpload from './AddUpload.vue'

const state = reactive({
  githubModal: false,
  publishedRfcModal: false,
  uploadModal: false
})
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel>Add document from...</SidebarGroupLabel>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton as-child tooltip="item.title" @click="state.githubModal = true">
          <a class="cursor-pointer">
            <Icon icon="lucide:github" />
            <span>GitHub</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton as-child tooltip="item.title" @click="state.publishedRfcModal = true">
          <a class="cursor-pointer">
            <Icon icon="lucide:landmark" />
            <span>Published RFC</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton as-child tooltip="item.title">
          <a class="cursor-pointer">
            <Icon icon="lucide:rows-4" />
            <span>Datatracker</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton as-child tooltip="item.title" @click="state.uploadModal = true">
          <a class="cursor-pointer">
            <Icon icon="lucide:upload" />
            <span>Upload</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
  <AddFromGitHub v-model:open="state.githubModal" />
  <AddPublishedRfc v-model:open="state.publishedRfcModal" />
  <AddUpload v-model:open="state.uploadModal" />
</template>
