<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'

import { Command } from 'lucide-vue-next'

import NavMain from '@/components/NavMain.vue'
import NavDocs from '@/components/NavDocs.vue'
import NavSessions from './NavSessions.vue'
import NavSecondary from '@/components/NavSecondary.vue'
import NavUser from '@/components/NavUser.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'

const props = withDefaults(defineProps<SidebarProps>(), {
  variant: 'inset'
})

const data = {
  user: {
    name: 'Guest',
    email: 'guest@rfc-editor.org',
    avatar: '/avatars/shadcn.jpg'
  },
  docs: [
    {
      id: '123',
      name: 'draft-halen-fedae-03.xml'
    },
    {
      id: '234',
      name: 'rfc9932.notprepped.xml'
    },
    {
      id: '345',
      name: 'Untitled-1.xml'
    }
  ],
  sessions: [
    {
      name: 'Untitled 1',
      url: '#'
    }
  ]
}
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <a>
              <div
                class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Command class="size-4" />
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-medium">RFC-Editor</span>
                <span class="truncate text-xs">Diff Viewer</span>
              </div>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <NavMain />
      <NavSessions :docs="data.sessions" />
      <NavDocs :docs="data.docs" />
      <NavSecondary class="mt-auto" />
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="data.user" />
    </SidebarFooter>
  </Sidebar>
</template>
