<script setup lang="ts">
import { Icon } from '@iconify/vue'

import { Button } from '@/components/ui/button'
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
    url: string
  }[]
}>()

const { isMobile } = useSidebar()
</script>

<template>
  <SidebarGroup class="group-data-[collapsible=icon]:hidden">
    <SidebarGroupLabel class="pr-0.5">
      <span class="w-full">Sessions</span>
      <a
        class="text-sm hover:bg-accent px-1 py-0.5 rounded cursor-pointer"
        aria-label="New Session">
        <Icon icon="lucide:plus" />
      </a>
    </SidebarGroupLabel>
    <SidebarMenu>
      <SidebarMenuItem v-for="item in docs" :key="item.name">
        <SidebarMenuButton is-active as-child>
          <a :href="item.url">
            <Icon icon="lucide:gallery-vertical-end" />
            <span>{{ item.name }}</span>
          </a>
        </SidebarMenuButton>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <SidebarMenuAction class="cursor-pointer" show-on-hover>
              <Icon icon="lucide:more-horizontal" />
              <span class="sr-only">More</span>
            </SidebarMenuAction>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            class="w-48 rounded-lg"
            :side="isMobile ? 'bottom' : 'right'"
            :align="isMobile ? 'end' : 'start'">
            <DropdownMenuItem>
              <Icon icon="lucide:edit" />
              <span>Rename</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Icon icon="lucide:x" />
              <span>Close Session</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
</template>
