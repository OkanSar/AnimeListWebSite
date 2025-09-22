<script setup lang="ts">
import { ref, onMounted, watch } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()
const anime = ref<any | null>(null)
const seasons = ref<any[]>([])
const activeSeason = ref(0)
const pending = ref(false)
const error = ref<string | null>(null)
const anizleUrl = computed(() => {
  if (!anime.value?.title) return "#"
  return `/api/anime/redirect?q=${encodeURIComponent(anime.value.title + " izle")}`
})

const loadAnime = async () => {
  pending.value = true
  error.value = null
  seasons.value = []
  anime.value = null

  try {
    const id = route.params.id
    if (!id) throw new Error("Anime ID gerekli")

    const res: any = await $fetch(`/api/anime/${id}`) // server { seasons: [...] }

    let fetchedSeasons = Array.isArray(res.seasons) ? res.seasons : [res]

    fetchedSeasons = fetchedSeasons.map((season, idx) => {
      const numEps = season.num_episodes || 0
      return {
        ...season,
        name: season.title || `Sezon ${idx + 1}`,
        episodes: Array.from({ length: numEps }, (_, i) => ({
          name: `Bölüm ${i + 1}`,
          rating: season.mean || 0
        }))
      }
    })

    seasons.value = fetchedSeasons
    anime.value = seasons.value[0] || null

  } catch (err: any) {
    console.error(err)
    error.value = err?.message || String(err)
  } finally {
    pending.value = false
  }
}

onMounted(loadAnime)
watch(() => route.params.id, () => loadAnime())
</script>


<template>
  <div class="tw-relative tw-min-h-screen tw-text-white">
    <v-img :src="anime?.main_picture?.large || ''" cover min-height="100vh">
      <div
          class="tw-absolute tw-inset-0"
          style="background: linear-gradient(to bottom, rgba(0,0,0,0.4) 10%, rgba(0,0,0,1) 100%);"
      />
      <div class="tw-relative tw-z-20 tw-w-[95%] md:tw-w-[90%] lg:tw-w-[80%] tw-mx-auto tw-pt-24">

        <v-card class="tw-rounded-2xl tw-shadow-lg tw-mt-36" elevation="8" color="black">

          <v-row class="tw-items-start tw-justify-between tw-px-4 md:tw-px-0">

            <!-- SOL TARAF -->
            <v-col cols="12" md="6" class="tw-flex tw-flex-col tw-gap-6 md:tw-ml-10 tw-px-3 md:tw-px-0">

              <div v-if="pending">
                <v-skeleton-loader color="black" type="heading, paragraph" class="tw-h-10 tw-mb-4"/>
                <v-skeleton-loader color="black" type="paragraph, paragraph" class="tw-h-5 tw-mb-2"/>
              </div>

              <div v-else-if="anime">
                <h1 class="tw-font-bold tw-break-words tw-text-2xl sm:tw-text-3xl md:tw-text-4xl tw-mt-5 tw-mb-4">
                  {{ anime.title || "Bilinmeyen Başlık" }}
                </h1>

                <div class="tw-flex tw-gap-3 tw-text-gray-300 tw-text-sm tw-mb-4">
                  <span>{{ seasons.length }} Sezon</span>
                  <span> / </span>
                  <span>{{ anime.num_episodes || 0 }} Bölüm</span>
                </div>

                <p class="tw-text-gray-300 tw-text-justify tw-text-sm sm:tw-text-base tw-break-words">
                  {{ anime.synopsis || "Açıklama yok" }}
                </p>

                <div class="tw-flex tw-items-center tw-gap-4">
                  <v-rating
                      :model-value="anime.mean ? anime.mean / 2 : 0"
                      half-increments
                      readonly
                      color="amber"
                      size="small"
                  />
                  <span class="tw-text-gray-400 tw-text-sm">
                    {{ anime.mean || '-' }} ({{ anime.num_scoring_users?.toLocaleString() || 0 }})
                  </span>
                </div>

                <div class="tw-flex tw-flex-col md:tw-flex-row tw-gap-3 tw-flex-wrap tw-mt-4">
                  <v-btn :href="anizleUrl" color="orange" class="tw-text-white">
                    <v-icon start>mdi-play</v-icon>
                    İzle
                  </v-btn>
                  <v-btn :href="anizleUrl" variant="tonal" color="orange" class="tw-text-white">
                    <v-icon start>mdi-play</v-icon>
                    Fragmanı İzle
                  </v-btn>
                  <v-btn variant="outlined" color="orange" class="tw-border-orange-500 tw-text-white">
                    <v-icon start>mdi-bookmark</v-icon>
                    LİSTEME Ekle
                  </v-btn>
                </div>
              </div>
            </v-col>

            <v-col cols="12" md="5" class="tw-flex tw-justify-center md:tw-justify-end">
              <div class="tw-flex tw-flex-col-reverse md:tw-flex-row tw-items-center tw-gap-6">

                <div v-if="pending">
                  <v-skeleton-loader color="black" type="image" class="tw-w-48 tw-h-64"/>
                </div>
                <div v-else-if="anime" class="tw-min-w-60 md:tw-min-w-80">
                  <v-img
                      :src="anime.main_picture?.large || ''"
                      class="tw-rounded-lg tw-shadow-lg"
                      aspect-ratio="16/9"
                      cover
                  />
                </div>

                <div v-if="anime && !pending" class="tw-flex tw-flex-row md:tw-flex-col
                tw-gap-6 tw-items-center md:tw-ml-4 px-4">
                  <div class="tw-flex tw-flex-col tw-items-center">
                    <span class="tw-text-xs tw-text-gray-400 tw-mb-1">MyAnimeList</span>
                      <v-progress-circular
                          :model-value="(anime.mean || 0) * 10"
                          :size="$vuetify.display.mdAndUp ? 150 : 80"
                          width="6"
                          color="blue"
                      >
                        <span class="tw-text-base md:tw-text-lg tw-font-bold">
                          {{ anime.mean || 0 }}
                        </span>
                      </v-progress-circular>
                    <span class="tw-text-xs tw-text-gray-400 tw-mt-1">
                      {{ anime.num_scoring_users?.toLocaleString() || 0 }}
                    </span>
                  </div>

                  <div class="tw-flex tw-flex-col tw-items-center">
                    <span class="tw-text-xs tw-text-gray-400 tw-mb-1">OKANİME</span>
                    <v-progress-circular
                        :model-value="Math.min((anime.mean || 0) * 10, 100)"
                        :size="$vuetify.display.mdAndUp ? 150 : 80"
                        width="6"
                        color="purple"
                    >
                      <span class="tw-text-base md:tw-text-lg tw-font-bold">
                        {{ anime.mean ? anime.mean.toFixed(1) : 0 }}
                      </span>
                    </v-progress-circular>
                    <span class="tw-text-xs tw-text-gray-400 tw-mt-1">581</span>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>

          <o-category-chip v-if="!pending && anime" :categories="anime.genres || []" :pending="pending" />

          <!-- Sezon Sekmeleri -->
          <v-tabs v-if="!pending && seasons.length" v-model="activeSeason" background-color="transparent" class="tw-mt-6 tw-text-white">
            <v-tab v-for="(season, i) in seasons" :key="i" :value="i">
              {{ season.name }}
            </v-tab>
          </v-tabs>

          <v-tabs-window v-if="!pending && seasons.length" v-model="activeSeason" class="tw-w-full tw-flex-1 tw-min-h-[800px] md:tw-min-h-80">
            <v-tabs-window-item v-for="(season, index) in seasons" :key="index" :value="index">
              <v-row class="tw-flex-nowrap tw-gap-5 tw-ml-5 px-5 py-10 tw-text-white">
                <v-chip
                    v-for="episode in season.episodes"
                    :key="episode.name"
                    text-color="white"
                    outlined
                    medium
                    class="tw-px-4 tw-py-3 tw-text-lg tw-justify-center"
                    :style="{
                    color: 'white',
                    padding: '20px',
                    minWidth: '100px'
                  }"
                >
                  {{ episode.name }}
                </v-chip>
              </v-row>
            </v-tabs-window-item>
          </v-tabs-window>

          <!-- Hata mesajı -->
          <div v-if="error" class="tw-text-red-500 tw-text-center tw-mt-4">
            {{ error }}
          </div>

        </v-card>
      </div>
    </v-img>
  </div>
</template>
