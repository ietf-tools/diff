<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <DiffEditor />
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup>
import { useColorMode } from '@vueuse/core'
import AppSidebar from '@/components/AppSidebar.vue'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import DiffEditor from './components/DiffEditor.vue'

const colorMode = useColorMode({ disableTransition: false })
</script>
