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
                <span class="w-full">{{ fitTitle(item.name) }}</span>
              </a>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            class="w-48 rounded-lg"
            :side="isMobile ? 'bottom' : 'right'"
            :align="isMobile ? 'end' : 'start'">
            <DropdownMenuItem @click="sessions.leftDocId = item.id">
              <Icon icon="lucide:arrow-left-to-line" />
              <span>Open in Left Panel</span>
            </DropdownMenuItem>
            <DropdownMenuItem @click="sessions.rightDocId = item.id">
              <Icon icon="lucide:arrow-right-to-line" />
              <span>Open in Right Panel</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="deleteDocConfirm(item.id, item.name)">
              <Icon icon="lucide:trash-2" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
  <AlertDialog v-model:open="state.deleteWarnShown">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
          Document {{ state.deleteWarnTitle }} will be deleted from this session.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction @click="deleteDoc()">Delete</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup lang="ts">
import { useSessionsStore } from '@/stores/sessions.js'
import { computed, reactive } from 'vue'

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
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'

const sessions = useSessionsStore()

const { isMobile } = useSidebar()

const state = reactive({
  deleteWarnShown: false,
  deleteWarnTitle: '',
  deleteWarnId: ''
})

const docs = computed(() => {
  return sessions.current?.docs ?? []
})

function fitTitle(val: string) {
  if (val.length > 28) {
    return val.substring(0, 15) + '...' + val.substring(val.length - 10, val.length)
  }
  return val
}

function deleteDocConfirm(id: string, title: string) {
  state.deleteWarnId = id
  state.deleteWarnTitle = title
  state.deleteWarnShown = true
}

function deleteDoc() {
  sessions.current.docs = sessions.current.docs.filter((d) => d.id !== state.deleteWarnId)
  if (sessions.leftDocId === state.deleteWarnId) {
    sessions.leftDocId = ''
  }
  if (sessions.rightDocId === state.deleteWarnId) {
    sessions.rightDocId = ''
  }
  state.deleteWarnId = ''
  state.deleteWarnTitle = ''
  state.deleteWarnShown = false
}
</script>
