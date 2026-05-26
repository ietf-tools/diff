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
      <SidebarMenuItem v-for="item in sharedSessions" :key="item.id">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <SidebarMenuButton as-child :is-active="item.id === sessions.currentId">
              <a class="cursor-pointer">
                <Icon icon="lucide:github" />
                <span>{{ fitTitle('draft-ietf-detnet-controller-plane-framework') }}</span>
              </a>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            class="w-48 rounded-lg"
            :side="isMobile ? 'bottom' : 'right'"
            :align="isMobile ? 'end' : 'start'">
            <DropdownMenuItem>
              <Icon icon="lucide:circle-play" class="text-emerald-700 dark:text-emerald-300" />
              <span class="font-semibold">Activate Session</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Icon icon="lucide:x" class="text-rose-700 dark:text-rose-300" />
              <span>Close Session</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <li v-if="sharedSessions.length > 0" class="my-1 bg-sidebar-border w-full h-px"></li>
      <SidebarMenuItem v-for="item in personalSessions" :key="item.id">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <SidebarMenuButton as-child :is-active="item.id === sessions.currentId">
              <a class="cursor-pointer">
                <Icon icon="lucide:gallery-vertical-end" />
                <span>{{ fitTitle(item.name) }}</span>
              </a>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            class="w-48 rounded-lg"
            :side="isMobile ? 'bottom' : 'right'"
            :align="isMobile ? 'end' : 'start'">
            <DropdownMenuItem>
              <Icon icon="lucide:circle-play" class="text-emerald-700 dark:text-emerald-300" />
              <span class="font-semibold">Activate Session</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Icon icon="lucide:edit" class="text-purple-700 dark:text-purple-300" />
              <span>Rename</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Icon icon="lucide:x" class="text-rose-700 dark:text-rose-300" />
              <span>Close Session</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icon icon="lucide:trash-2" class="text-rose-700 dark:text-rose-300" />
              <span>Delete Session</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
</template>

<script setup lang="ts">
import { useSessionsStore } from '@/stores/sessions.js'

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
import { computed } from 'vue'

const sessions = useSessionsStore()

const { isMobile } = useSidebar()

const sharedSessions = computed(() => sessions.all.filter((s) => s.kind !== 'personal'))
const personalSessions = computed(() => sessions.all.filter((s) => s.kind === 'personal'))

function fitTitle(val: string) {
  if (val.length > 27) {
    return val.substring(0, 8) + '...' + val.substring(val.length - 16, val.length)
  }
  return val
}
</script>
