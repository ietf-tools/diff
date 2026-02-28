<script setup lang="ts">
import { Icon } from '@iconify/vue'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel>Add document from...</SidebarGroupLabel>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton as-child tooltip="item.title">
          <a class="cursor-pointer">
            <Icon icon="lucide:github" />
            <span>GitHub</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton as-child tooltip="item.title">
          <a class="cursor-pointer">
            <Icon icon="lucide:landmark" />
            <span>Published RFC</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton as-child tooltip="item.title">
          <a class="cursor-pointer">
            <Icon icon="lucide:link" />
            <span>Remote URL</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton as-child tooltip="item.title">
          <a class="cursor-pointer">
            <Icon icon="lucide:upload" />
            <span>Upload</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
</template>
