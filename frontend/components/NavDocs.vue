<template>
  <SidebarGroup class="group-data-[collapsible=icon]:hidden">
    <SidebarGroupLabel>Documents</SidebarGroupLabel>
    <SidebarMenu>
      <SidebarMenuItem v-if="docs.length < 1">
        <SidebarMenuButton as-child>
          <span class="text-gray-500 text-xs">No opened documents</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem v-for="item in docs" :key="item.id">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <SidebarMenuButton as-child>
              <a class="cursor-pointer">
                <span
                  v-if="item.id === sessions.leftDocId"
                  class="rounded bg-rose-600 text-white px-1 py-0.5 text-xs font-bold"
                  >L</span
                >
                <span
                  v-else-if="item.id === sessions.rightDocId"
                  class="rounded bg-sky-600 text-white px-1 py-0.5 text-xs font-bold"
                  >R</span
                >
                <Icon v-else icon="lucide:file-text" />
                <span class="w-full">{{ item.name }}</span>
              </a>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            class="w-48 rounded-lg"
            :side="isMobile ? 'bottom' : 'right'"
            :align="isMobile ? 'end' : 'start'">
            <DropdownMenuItem>
              <Icon icon="lucide:arrow-left-to-line" />
              <span>Open in Left Panel</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icon icon="lucide:arrow-right-to-line" />
              <span>Open in Right Panel</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Icon icon="lucide:x" />
              <span>Remove Document</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
</template>

<script setup lang="ts">
import { useSessionsStore } from '@/stores/sessions.js'
import { computed } from 'vue'

import { Icon } from '@iconify/vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'

const sessions = useSessionsStore()

const { isMobile } = useSidebar()

const docs = computed(() => {
  return sessions.current?.docs ?? []
})
</script>
