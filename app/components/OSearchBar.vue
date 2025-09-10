<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'

// Props
const props = defineProps<{
  index: number
}>()

// Emit
const emit = defineEmits<{
  (e: 'search', value: string): void
  (e: 'filter-applied', sort: string | null, categories: string[]): void
}>()

// Arama ve filtre state
const loaded = ref(false)
const loading = ref(false)
const selectedSort = ref<string | null>(null)
const selectedCategories = ref<string[]>([])

const sortOptions = [
  { label: 'A-Z', key: 'az' },
  { label: 'Ratinge göre', key: 'rating' },
  { label: 'Popüleritesine göre', key: 'popularity' },
  { label: 'Değerlendirmesine göre', key: 'reviews' }
]

const categories = ['Aksiyon', 'Macera', 'Doğaüstü', 'Romantik', 'Büyü', 'Gerilim', 'Gizem', 'Korku', 'Okul', 'Seinen']

function onClickSearch() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    loaded.value = true
    emit('search', `Arama yapıldı! Index: ${props.index}`)
  }, 1000)
}

function toggleSort(optionKey: string) {
  selectedSort.value = optionKey
}

function toggleCategory(cat: string) {
  const idx = selectedCategories.value.indexOf(cat)
  if (idx >= 0) selectedCategories.value.splice(idx, 1)
  else selectedCategories.value.push(cat)
}

function applyFilters(menuRef: any) {
  emit('filter-applied', selectedSort.value, selectedCategories.value)
  menuRef.close()
}
</script>

<template>
  <v-text-field
      :loading="loading"
      density="compact"
      label="Aradığınız Anime . . ."
      variant="outlined"
      hide-details
      single-line
      color="orange"
      class="tw-font-bold tw-mt-14"
      @keydown.enter="onClickSearch"
  >
    <template v-slot:append-inner>
      <v-icon class="tw-cursor-pointer tw-opacity-100" @click="onClickSearch" color="orange">
        mdi-magnify
      </v-icon>

      <v-divider vertical color="white" class="mx-2 border-opacity-75" />

      <v-menu location="bottom end" offset="8" :close-on-content-click="false" ref="filterMenu">
        <template #activator="{ props }">
          <v-icon v-bind="props" class="tw-cursor-pointer tw-opacity-100" color="orange">
            mdi-filter-variant
          </v-icon>
        </template>

        <v-card min-width="250" max-width="500" class="bg-gray-800 tw-text-white">
          <v-list>
            <v-list-subheader class="tw-text-orange tw-font-bold">
              Filtrele
            </v-list-subheader>

            <v-list-item
                v-for="option in sortOptions"
                :key="option.key"
                @click="toggleSort(option.key)"
                class="tw-cursor-pointer"
            >
              <v-list-item-title class="tw-flex tw-justify-between tw-items-center">
                {{ option.label }}
                <v-icon small v-if="selectedSort === option.key">mdi-check</v-icon>
              </v-list-item-title>
            </v-list-item>

            <v-divider class="my-2" />

            <v-list-subheader class="tw-text-orange tw-font-bold">Kategorilere göre</v-list-subheader>

            <v-chip-group multiple selected-class="bg-orange-600">
              <v-chip v-for="cat in categories" :key="cat" @click="toggleCategory(cat)">
                {{ cat }}
                <v-icon small v-if="selectedCategories.includes(cat)">mdi-check</v-icon>
              </v-chip>
            </v-chip-group>

            <v-divider class="my-2" />

            <v-list-item class="tw-justify-center">
              <v-btn color="orange" variant="outlined" @click="applyFilters($refs.filterMenu)">
                Filtrele
              </v-btn>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </template>
  </v-text-field>
</template>
