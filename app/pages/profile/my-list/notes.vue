<script setup lang="ts">
import { ref, onMounted } from 'vue'
import draggable from 'vuedraggable'

interface Anime {
  id: number
  title: string
  main_picture_medium?: string
}

interface Note {
  anime_id: number
  text: string
  created_at: string
}

const notes = ref<Note[]>([])
const loadingNotes = ref(true)

const showModal = ref(false)
const editMode = ref(false)
const selectedAnimeIds = ref<number[]>([])
const noteText = ref('')
const watchedIds = ref<number[]>([])
const toBeWatchedIds = ref<number[]>([])
const animeOptions = ref<Anime[]>([])
const loadingAnime = ref(true)
const watchingOrder = ref<Anime[]>([])
const hasWatchingOrder = computed(() => watchingOrder.value.length > 0)
const showAddToOrderModal = ref(false)
const selectedOrderAnimeIds = ref<number[]>([])
async function fetchNotes() {
  const notesResponse = await $fetch('/api/supabase/user_notes', {
    method: 'GET'
  })
  notes.value = notesResponse?.notes ?? []
  if (animeOptions.value.length) {
    watchingOrder.value = notesResponse.watching_order
        .map((id: number) => animeOptions.value.find(a => a.id === id))
        .filter(Boolean) as Anime[]
  } else {
    watchingOrder.value = notesResponse.watching_order.map((id: number) => ({ id, title: '', main_picture_medium: '' }))
  }
  loadingNotes.value = false
}

async function fetchAnimeList() {
  const data = await $fetch('/api/supabase/user_anime_list', {
    method: 'GET'
  })

  if (data) {
    animeOptions.value = data.all || []
    watchedIds.value = data.watched?.map((a: any) => a.id) || []
    toBeWatchedIds.value = data.toBeWatched?.map((a: any) => a.id) || []
    watchingOrder.value = watchingOrder.value.map(item => {
      const anime = animeOptions.value.find(a => a.id === item.id)
      return anime || item
    })
  }

  loadingAnime.value = false
}

async function addNote() {
  if (!noteText.value || selectedAnimeIds.value.length === 0) return

  const payload = {
    anime_ids: selectedAnimeIds.value,
    text: noteText.value
  }

  await $fetch('/api/supabase/user_notes', {
    method: 'POST',
    body: payload
  })

  showModal.value = false
  noteText.value = ''
  selectedAnimeIds.value = []

  await fetchNotes()
}

async function addToWatchingOrder() {
  const newOrder = selectedOrderAnimeIds.value
      .map(id => animeOptions.value.find(a => a.id === id))
      .filter(Boolean) as Anime[]

  watchingOrder.value = newOrder

  showAddToOrderModal.value = false
  selectedOrderAnimeIds.value = []

  await saveOrder()
}

async function saveOrder() {
  const payload = {
    watching_order: watchingOrder.value.map(a => a.id)
  }
  await $fetch('/api/supabase/user_notes', { method: 'PUT', body: payload })
  editMode.value = false
}

watchEffect(() => {
  fetchNotes()
  fetchAnimeList()
})
watch(showAddToOrderModal, (newVal) => {
  if (newVal) {
    selectedOrderAnimeIds.value = watchingOrder.value.map(a => a.id)
  }
})

</script>

<template>
  <v-container fluid class="tw-mt-8">
    <v-row>
      <v-col cols="12" sm="12" md="7" lg="8" class="tw-flex tw-flex-col">
        <v-card class="tw-bg-gray-900 tw-rounded-xl tw-p-4">
          <div class="tw-flex tw-justify-between tw-items-center tw-mb-2 tw-mt-2">
            <h2 class="tw-text-orange-600 tw-font-bold ml-10">Notlarım</h2>
            <v-btn size="small" color="green" variant="outlined" @click="showModal = true" class="tw-mr-4">
              <v-icon size="small">mdi-plus</v-icon>
            </v-btn>
          </div>

          <v-skeleton-loader v-if="loadingNotes" type="list-item-three-line" class="tw-mb-2" v-for="n in 5" :key="n" />

          <v-list v-else>
            <v-list-item
                v-for="note in notes"
                :key="note.anime_id + note.created_at"
                class="tw-bg-gray-800 tw-rounded-lg tw-mb-2 tw-px-4 tw-py-3 tw-transition tw-duration-200 hover:tw-bg-gray-700"
            >
              <v-list-item-title>
                <div class="tw-flex tw-flex-wrap tw-gap-1 tw-mb-2">
                  <v-chip
                      v-for="id in note.anime_ids"
                      :key="id"
                      class="tw-text-xs tw-h-5 tw-px-2 tw-bg-amber-500/20 tw-text-amber-300 tw-border tw-border-amber-500/40 hover:tw-bg-amber-500/30"
                      size="x-small"
                      pill
                      outlined
                      :to="`/animes/${id}`"
                      clickable
                  >
                    {{ animeOptions.find(a => a.id === id)?.title }}
                  </v-chip>
                </div>

                <div class="tw-text-white tw-font-medium tw-leading-snug tw-mb-1">
                  {{ note.text }}
                </div>

                <div class="tw-text-gray-400 tw-text-xs tw-italic">
                  Eklenme: {{
                    new Date(note.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
                  }} -
                  {{
                    new Date(note.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
                  }}
                </div>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- İzleme Sırası -->
      <v-col cols="12" sm="12" md="5" lg="4" class="tw-flex tw-flex-col">
        <v-card class="tw-bg-gray-900 tw-rounded-xl tw-p-4 tw-shadow-md tw-h-full">
          <div class="tw-flex tw-justify-between tw-items-center tw-flex-wrap tw-gap-2 tw-mb-2 tw-mt-2">
            <h2 class="tw-text-orange-600 tw-font-bold tw-ml-2 sm:tw-ml-4">İzleme Sırası</h2>
            <div class="tw-flex tw-gap-2">
              <v-btn size="small" color="green" variant="outlined" @click="showAddToOrderModal = true">
                <v-icon size="small">mdi-plus</v-icon>
              </v-btn>
              <v-btn size="small" color="blue" variant="outlined" @click="editMode = !editMode">
                <v-icon size="small">mdi-pencil</v-icon>
              </v-btn>
            </div>
          </div>

          <template v-if="!hasWatchingOrder">
            <div class="tw-text-gray-400 tw-text-center tw-py-8">
              İzleme Sıranızı Oluşturun
            </div>
          </template>

          <template v-if="hasWatchingOrder">
            <!-- Normal Görünüm -->
            <v-list v-if="!editMode" class="tw-flex tw-flex-col tw-gap-2">
              <v-list-item
                  v-for="(element, index) in watchingOrder"
                  :key="element.id"
                  class="tw-bg-gray-800 tw-rounded-lg tw-px-4 tw-py-2"
              >
                <v-list-item-content class="tw-flex tw-items-center tw-gap-3">
                  <!-- Sıra numarası -->
                  <div class="tw-text-gray-400 tw-font-bold tw-w-6 tw-text-center tw-flex-shrink-0">
                    {{ index + 1 }}.
                  </div>

                  <!-- Anime görseli -->
                  <img
                      :src="element.main_picture_medium"
                      alt="Anime Resmi"
                      class="tw-w-10 tw-h-14 tw-object-cover tw-rounded-md tw-border tw-border-gray-700 tw-flex-shrink-0"
                  />

                  <!-- Başlık + ikonlar -->
                  <div class="tw-flex tw-items-center tw-gap-2 tw-text-white tw-font-medium tw-flex-wrap tw-flex-1">
                  <span class="tw-whitespace-normal tw-break-words tw-leading-snug tw-flex-1 tw-text-center">
                    {{ element.title }}
                  </span>

                    <v-icon
                        v-if="watchedIds.includes(element.id)"
                        color="green"
                        size="small"
                    >
                      mdi-check-circle
                    </v-icon>

                    <v-icon
                        v-else-if="toBeWatchedIds.includes(element.id)"
                        color="gray"
                        size="small"
                    >
                      mdi-clock-outline
                    </v-icon>
                  </div>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <!-- Düzenleme Modu (Draggable + Drag Handle Icon) -->
            <draggable
                v-else
                v-model="watchingOrder"
                item-key="id"
                handle=".drag-handle"
                class="tw-flex tw-flex-col tw-gap-2"
            >
              <template #item="{ element }">
                <v-list-item class="tw-bg-gray-800 tw-rounded-lg tw-px-4 tw-py-2 tw-cursor-grab">
                  <v-list-item-content class="tw-flex tw-items-center tw-gap-3">
                    <!-- Drag handle ikonu -->
                    <v-icon
                        class="drag-handle tw-text-gray-400 tw-flex-shrink-0 tw-cursor-grab hover:tw-text-gray-200"
                        size="small"
                    >
                      mdi-drag
                    </v-icon>

                    <img
                        :src="element.main_picture_medium"
                        alt="Anime Resmi"
                        class="tw-w-10 tw-h-14 tw-object-cover tw-rounded-md tw-border tw-border-gray-700 tw-flex-shrink-0"
                    />

                    <div class="tw-flex tw-items-center tw-gap-2 tw-text-white tw-font-medium tw-flex-wrap tw-flex-1">
            <span class="tw-whitespace-normal tw-break-words tw-leading-snug tw-flex-1 tw-text-center">
              {{ element.title }}
            </span>

                      <v-icon
                          v-if="watchedIds.includes(element.id)"
                          color="green"
                          size="small"
                      >
                        mdi-check-circle
                      </v-icon>

                      <v-icon
                          v-else-if="toBeWatchedIds.includes(element.id)"
                          color="gray"
                          size="small"
                      >
                        mdi-clock-outline
                      </v-icon>
                    </div>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </draggable>
          </template>

          <template v-else>
            <div class="tw-text-gray-400 tw-text-center tw-py-8">
              İzleme Sıranızı Oluşturun
            </div>
          </template>

          <div v-if="editMode && hasWatchingOrder" class="tw-flex tw-justify-end tw-gap-2 tw-mt-2">
            <v-btn color="gray" text @click="editMode = false">İptal</v-btn>
            <v-btn color="amber" @click="saveOrder">Kaydet</v-btn>
          </div>
        </v-card>

      </v-col>
    </v-row>

    <v-dialog v-model="showModal" max-width="600">
      <v-card class="tw-bg-gray-800 tw-rounded-xl tw-p-4">
        <h2 class="tw-text-orange-600 tw-font-bold tw-ml-2 sm:tw-ml-4 mt-2 mb-2">Yeni Not Ekle</h2>

        <v-select
            v-model="selectedAnimeIds"
            :items="animeOptions"
            item-value="id"
            item-title="title"
            label="Listenden Anime Seç"
            multiple
            chips
            class="tw-mb-4"
            :loading="loadingAnime"
        />

        <v-textarea v-model="noteText" label="Not" rows="5" class="tw-mb-4" />

        <v-card-actions class="tw-justify-end">
          <v-btn text color="white" @click="showModal = false">İptal</v-btn>
          <v-btn color="amber" @click="addNote">Kaydet</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showAddToOrderModal" max-width="600">
      <v-card class="tw-bg-gray-800 tw-rounded-xl tw-p-4 tw-mb-40">
        <h2 class="tw-text-orange-600 tw-font-bold tw-ml-2 sm:tw-ml-4 mt-2 mb-2">Anime Ekle</h2>
        <v-select
            v-model="selectedOrderAnimeIds"
            :items="animeOptions"
            item-value="id"
            item-title="title"
            label="Anime Seç"
            multiple
            chips
            class="tw-mb-4"
            :loading="loadingAnime"
        />

        <v-card-actions class="tw-justify-end">
          <v-btn text color="white" @click="showAddToOrderModal = false">İptal</v-btn>
          <v-btn color="amber" @click="addToWatchingOrder">Ekle</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.tw-bg-gray-800 { background-color: rgba(25, 25, 35, 0.9); }
.tw-bg-gray-900 { background-color: rgba(20, 20, 30, 0.9); }
.tw-rounded-xl { border-radius: 16px; }
.tw-rounded-lg { border-radius: 12px; }
</style>
