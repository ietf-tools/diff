<script setup lang="ts">
import { Icon } from '@iconify/vue'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { useColorMode } from '@vueuse/core'
import { computed } from 'vue'

const mode = useColorMode({ disableTransition: false })

function toggleDark() {
  if (mode.value === 'light') {
    mode.value = 'dark'
  } else {
    mode.value = 'light'
  }
}
const inverseTheme = computed(() => (mode.value === 'dark' ? 'light' : 'dark'))
</script>

<template>
  <SidebarGroup>
    <SidebarGroupContent>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton as-child size="sm">
            <a href="https://www.rfc-editor.org/contact/">
              <Icon icon="lucide:circle-question-mark" />
              <span>Help &amp; Support</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton as-child size="sm">
            <a @click="toggleDark()" class="cursor-pointer">
              <Icon
                icon="lucide:moon-star"
                class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Icon
                icon="lucide:sun"
                class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span>Switch to {{ inverseTheme }} theme</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
</template>
