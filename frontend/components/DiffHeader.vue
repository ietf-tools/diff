<template>
  <header class="flex h-16 shrink-0 items-center gap-2">
    <div class="flex items-center gap-2 px-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <SidebarTrigger class="-ml-1 cursor-pointer" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle Sidebar</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
      <div class="flex gap-4">
        <!-- <ButtonGroup class="hidden sm:flex">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button variant="outline" size="icon" class="cursor-pointer" aria-label="Go Back">
                  <Icon icon="lucide:save" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save Session</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </ButtonGroup> -->
        <NativeSelect v-model="editorStore.contentType">
          <NativeSelectOption value="markdown"> Markdown </NativeSelectOption>
          <NativeSelectOption value="plain"> Plain Text </NativeSelectOption>
          <NativeSelectOption value="xml"> XML </NativeSelectOption>
        </NativeSelect>
        <ToggleGroup
          :model-value="editorStore.viewMode"
          @update:model-value="
            (val) => {
              if (val) {
                editorStore.viewMode = val
              }
            }
          "
          variant="outline"
          type="single">
          <ToggleGroupItem value="side-by-side" class="cursor-pointer">
            <Icon icon="lucide:square-split-horizontal" />
            <span>Side-by-side</span>
            <span
              :class="
                'flex size-2 rounded-full ' +
                (editorStore.viewMode === 'side-by-side' ? 'bg-emerald-500' : 'bg-rose-500')
              "></span>
          </ToggleGroupItem>
          <ToggleGroupItem value="inline" class="cursor-pointer">
            <Icon icon="lucide:between-horizontal-start" />
            <span>Inline</span>
            <span
              :class="
                'flex size-2 rounded-full ' +
                (editorStore.viewMode === 'inline' ? 'bg-emerald-500' : 'bg-rose-500')
              "></span>
          </ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup v-model="editorStore.flags" variant="outline" type="multiple">
          <ToggleGroupItem value="foldUnchanged" class="cursor-pointer">
            <Icon icon="lucide:fold-vertical" />
            <span>Fold Unchanged Regions</span>
            <span
              :class="
                'flex size-2 rounded-full ' +
                (editorStore.flags.includes('foldUnchanged') ? 'bg-emerald-500' : 'bg-rose-500')
              "></span>
          </ToggleGroupItem>
          <ToggleGroupItem value="showWhitespaces" class="cursor-pointer">
            <Icon icon="lucide:brackets" />
            <span>Show Whitespaces</span>
            <span
              :class="
                'flex size-2 rounded-full ' +
                (editorStore.flags.includes('showWhitespaces') ? 'bg-emerald-500' : 'bg-rose-500')
              "></span>
          </ToggleGroupItem>
          <ToggleGroupItem value="wordwrap" class="cursor-pointer">
            <Icon icon="lucide:text-wrap" />
            <span>Wordwrap</span>
            <span
              :class="
                'flex size-2 rounded-full ' +
                (editorStore.flags.includes('wordwrap') ? 'bg-emerald-500' : 'bg-rose-500')
              "></span>
          </ToggleGroupItem>
        </ToggleGroup>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <NumberField id="fontsize" v-model="editorStore.fontSize" :min="8">
                <NumberFieldContent>
                  <NumberFieldDecrement class="cursor-pointer" />
                  <NumberFieldInput class="w-30" />
                  <NumberFieldIncrement class="cursor-pointer" />
                </NumberFieldContent>
              </NumberField>
            </TooltipTrigger>
            <TooltipContent>
              <p>Font Size</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div class="flex items-center">
          <Spinner class="size-5 text-purple-400" v-show="isFetching" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useIsFetching } from '@tanstack/vue-query'
import { useEditorStore } from '../stores/editor.js'

import { Button } from '@/components/ui/button/index.js'
import { ButtonGroup } from '@/components/ui/button-group/index.js'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select/index.js'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput
} from '@/components/ui/number-field/index.js'
import { Separator } from '@/components/ui/separator/index.js'
import { SidebarTrigger } from '@/components/ui/sidebar/index.js'
import { Spinner } from '@/components/ui/spinner'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group/index.js'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip/index.js'
import { Icon } from '@iconify/vue'

const editorStore = useEditorStore()

const isFetching = useIsFetching()
</script>
