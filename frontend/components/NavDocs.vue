<script setup lang="ts">
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

defineProps<{
  docs: {
    name: string
    id: string
  }[]
}>()

const { isMobile } = useSidebar()
</script>

<template>
  <SidebarGroup class="group-data-[collapsible=icon]:hidden">
    <SidebarGroupLabel>Documents</SidebarGroupLabel>
    <SidebarMenu>
      <SidebarMenuItem v-for="item in docs" :key="item.name">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <SidebarMenuButton as-child>
              <a class="cursor-pointer">
                <span
                  v-if="item.id === '123'"
                  class="rounded bg-rose-600 text-white px-1 py-0.5 text-xs font-bold"
                  >L</span
                >
                <span
                  v-else-if="item.id === '234'"
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
