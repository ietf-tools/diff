<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer">
            <Avatar class="h-8 w-8 rounded-lg">
              <AvatarImage :src="userPicture" :alt="userName" />
              <AvatarFallback class="rounded-lg"> {{ userInitial }} </AvatarFallback>
            </Avatar>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">{{ userName }}</span>
              <span class="truncate text-xs">{{ subtitle }}</span>
            </div>
            <Icon icon="radix-icons:caret-sort" class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          :side="isMobile ? 'bottom' : 'right'"
          align="end"
          :side-offset="4">
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar class="h-8 w-8 rounded-lg">
                <AvatarImage :src="userPicture" :alt="userName" />
                <AvatarFallback class="rounded-lg"> {{ userInitial }} </AvatarFallback>
              </Avatar>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">{{ userName }}</span>
                <span class="truncate text-xs">{{ userEmail }}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <template v-if="isLoggedIn">
            <DropdownMenuGroup>
              <DropdownMenuItem
                as="a"
                href="https://datatracker.ietf.org/accounts/profile/"
                class="cursor-pointer">
                <Icon icon="lucide:user-round-cog" />
                Manage Account
              </DropdownMenuItem>
              <DropdownMenuItem
                v-if="ghUsername"
                as="a"
                href="/login/unlink-github"
                class="cursor-pointer">
                <Icon icon="lucide:github" />
                Unlink GitHub ({{ ghUsername }})
              </DropdownMenuItem>
              <DropdownMenuItem v-else as="a" href="/login/link-github" class="cursor-pointer">
                <Icon icon="lucide:github" />
                Link to GitHub
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem as="a" href="/logout" class="cursor-pointer">
              <Icon icon="lucide:log-out" />
              Log out
            </DropdownMenuItem>
          </template>
          <template v-else>
            <DropdownMenuItem as="a" href="/login" class="cursor-pointer">
              <Icon icon="lucide:log-in" />
              Login with IETF Account
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              as="a"
              href="https://datatracker.ietf.org/accounts/create/"
              class="cursor-pointer">
              <Icon icon="lucide:user-round-plus" />
              Create an IETF Account
            </DropdownMenuItem>
          </template>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { Icon } from '@iconify/vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'

const { isMobile } = useSidebar()

const { isFetching, isError, data, error } = useQuery<{
  id: string
  name: string
  email: string
  picture: string
  ghUsername: string
}>({
  queryKey: ['auth/userinfo', { method: 'POST' }],
  placeholderData: {
    id: '',
    name: 'Guest',
    email: 'guest@rfc-editor.org',
    picture: '',
    ghUsername: ''
  }
})

const isLoggedIn = computed(() => {
  return Boolean(data.value?.id)
})
const userName = computed(() => {
  return data.value?.name ?? 'Guest'
})
const userEmail = computed(() => {
  return data.value?.email ?? 'guest@rfc-editor.org'
})
const userPicture = computed(() => {
  return data.value?.picture ?? ''
})
const userInitial = computed(() => {
  return data.value?.name?.substring(0, 1).toUpperCase() ?? 'G'
})
const ghUsername = computed(() => {
  return data.value?.ghUsername ?? ''
})

const subtitle = computed(() => {
  if (isFetching.value) {
    return 'Refreshing...'
  } else if (isError.value) {
    return 'Failed to refresh'
  } else if (data.value.id) {
    return data.value.email
  } else {
    return 'Login / Register'
  }
})
</script>
