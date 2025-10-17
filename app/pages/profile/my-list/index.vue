<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import PageAll from './all.vue'
import PageWatched from './watched.vue'
import PageToBeWatched from './toBeWatched.vue'
import PageFavorite from './favorite.vue'
import PageNotes from './notes.vue'

const tabs = [
  { label: 'Tüm Listem', value: 'all' },
  { label: 'İzlenenler', value: 'watched' },
  { label: 'İzlenecekler', value: 'toBeWatched' },
  { label: 'Favorilerim', value: 'favorite' },
  { label: 'Notlarım', value: 'notes' },
]

const active = ref('all')
const { width } = useWindowSize()

const tabOrientation = ref<'horizontal' | 'vertical'>('vertical')
const tabVariant = ref<'pill' | 'link'>('link')
const tabSize = ref<'sm' | 'md'>('sm')

const updateTabs = () => {
  if (width.value >= 768) {
    tabOrientation.value = 'horizontal'
    tabVariant.value = 'pill'
    tabSize.value = 'md'
  }
  else {
    tabOrientation.value = 'vertical'
    tabVariant.value = 'link'
    tabSize.value = 'sm'
  }
}

watchEffect(() => {
  updateTabs()
})

watch(width, updateTabs)
</script>

<template>
  <VContainer>
    <div class="p-6 bg-gray-50 min-h-screen tw-mt-28 text-white">
      <VTabs
          v-model="active"
          :key="tabOrientation + '-' + tabVariant + '-' + tabSize"
          item-value="value"
          class="w-full"
          :orientation="tabOrientation"
          :size="tabSize"
          :variant="tabVariant"
      >
        <v-tab
            v-for="tab in tabs"
            :key="tab.value"
            :value="tab.value"
        >
          {{ tab.label }}
        </v-tab>
      </VTabs>
      <div class="mt-6">
        <PageAll v-if="active === 'all'"/>
        <PageWatched v-if="active === 'watched'" />
        <PageToBeWatched v-else-if="active === 'toBeWatched'" />
        <PageFavorite v-else-if="active === 'favorite'" />
        <PageNotes v-else-if="active === 'notes'" />
      </div>
    </div>
  </VContainer>
</template>
