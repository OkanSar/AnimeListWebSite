<script setup lang="ts">
import { ref } from "vue"
import image from "~/assets/images/demon-slayer-infinity-castle.jpg"

const anime = ref({
  id: 1,
  title: "Demon Slayer: Infinity Castle",
  description:
      "İblis Avcıları Birliği, Tanjiro, Nezuko ve Hashira'nın Muzan Kibutsuji ile son savaşı... görsel şölen!",
  rating: 7.0,
  reviews: 90716,
  image,
})

const seasons = ref([
  {
    name: "1. Sezon",
    episodes: Array.from({ length: 31 }, (_, i) => ({
      name: `Bölüm ${i + 1}`,
      rating: (Math.random() * 5 + 5).toFixed(1)
    }))
  },
  {
    name: "2. Sezon",
    episodes: Array.from({ length: 15 }, (_, i) => ({
      name: `Bölüm ${i + 1}`,
      rating: (Math.random() * 5 + 5).toFixed(1)
    }))
  },
  {
    name: "3. Sezon",
    episodes: Array.from({ length: 25 }, (_, i) => ({
      name: `Bölüm ${i + 1}`,
      rating: (Math.random() * 5 + 5).toFixed(1)
    }))
  },
  {
    name: "4. Sezon",
    episodes: Array.from({ length: 29 }, (_, i) => ({
      name: `Bölüm ${i + 1}`,
      rating: (Math.random() * 5 + 5).toFixed(1)
    }))
  }
])
const getRatingColor = (rating: number) => {
  if (rating >= 9 && rating <= 10) return "#007f00"
  else if (rating >= 8) return "#16a34a"
  else if (rating >= 7) return '#bcbf00'
  else if (rating >= 6) return 'orange'
  else return '#7e22ce'
}
const activeSeason = ref(0)
</script>

<template>
  <div class="tw-relative tw-min-h-screen tw-text-white">
    <v-img :src="anime.image" cover min-height="100vh">
      <div
          class="tw-absolute tw-inset-0"
          style="background: linear-gradient(to bottom, rgba(0,0,0,0.4) 10%, rgba(0,0,0,1) 100%);"
      />
      <div class="tw-relative tw-z-20 tw-w-[95%] md:tw-w-[90%] lg:tw-w-[80%] tw-mx-auto tw-pt-24">
        <v-card
            class="tw-rounded-2xl tw-shadow-lg tw-mt-36"
            elevation="8"
            color="black"
        >
          <v-row class="tw-items-start tw-justify-between tw-px-4 md:tw-px-0">
            <!-- SOL TARAF -->
            <v-col cols="12" md="6" class="tw-flex tw-flex-col tw-gap-6 md:tw-ml-10 tw-px-3 md:tw-px-0">
              <h1 class="tw-font-bold tw-break-words tw-text-2xl sm:tw-text-3xl md:tw-text-4xl tw-mt-5">
                {{ anime.title }}
              </h1>

              <div class="tw-flex tw-gap-3 tw-text-gray-300 tw-text-sm">
                <span>4 Sezon</span>
                <span> / </span>
                <span>179 Bölüm</span>
              </div>

              <p class="tw-text-gray-300 tw-text-justify tw-text-sm sm:tw-text-base tw-break-words">
                {{ anime.description }}
              </p>

              <div class="tw-flex tw-items-center tw-gap-4">
                <v-rating
                    :model-value="anime.rating / 2"
                    half-increments
                    readonly
                    color="amber"
                    size="small"
                />
                <span class="tw-text-gray-400 tw-text-sm">
                  {{ anime.rating }} ({{ anime.reviews.toLocaleString() }})
                </span>
              </div>

              <div class="tw-flex tw-flex-col md:tw-flex-row tw-gap-3 tw-flex-wrap">
                <v-btn color="orange" class="tw-text-white">
                  <v-icon start>mdi-play</v-icon>
                  İzle
                </v-btn>
                <v-btn variant="tonal" color="orange" class="tw-text-white">
                  <v-icon start>mdi-play</v-icon>
                  Fragmanı İzle
                </v-btn>
                <v-btn variant="outlined" color="orange" class="tw-border-orange-500 tw-text-white">
                  <v-icon start>mdi-bookmark</v-icon>
                  LİSTEME Ekle
                </v-btn>
              </div>
            </v-col>

            <!-- SAĞ TARAF -->
            <v-col cols="12" md="5" class="tw-flex tw-items-center tw-gap-4 tw-justify-end">
              <!-- Skor Panelleri -->
              <div class="tw-flex tw-flex-col tw-gap-6 tw-mr-2">
                <div class="tw-flex tw-flex-col tw-items-center">
                  <span class="tw-text-xs tw-text-gray-400 tw-mb-1">MyAnimeList</span>
                  <v-progress-circular :model-value="70" size="60" width="6" color="blue">
                    <span class="tw-text-lg tw-font-bold">7</span>
                  </v-progress-circular>
                  <span class="tw-text-xs tw-text-gray-400 tw-mt-1">90.716</span>
                </div>

                <div class="tw-flex tw-flex-col tw-items-center">
                  <span class="tw-text-xs tw-text-gray-400 tw-mb-1">ANiZM</span>
                  <v-progress-circular :model-value="90" size="60" width="6" color="purple">
                    <span class="tw-text-lg tw-font-bold">9</span>
                  </v-progress-circular>
                  <span class="tw-text-xs tw-text-gray-400 tw-mt-1">1</span>
                </div>
              </div>

              <v-img
                  :src="anime.image"
                  class="tw-rounded-lg tw-shadow-lg"
                  min-width="200"
                  min-height="270"
                  aspect-ratio="16/9"
                  cover
              />
            </v-col>
          </v-row>
          <o-category-chip />
          <!-- Sezon Sekmeleri -->
          <v-tabs v-model="activeSeason" background-color="transparent" class="tw-mt-6 tw-text-white">
            <v-tab
                v-for="(season, index) in seasons"
                :key="index"
                :value="index"
            >
              {{ season.name }}
            </v-tab>
          </v-tabs>

          <v-row class="tw-justify-around md:tw-justify-end md:tw-gap-4 px-6 tw-items-center tw-py-6 tw-mt-3">
            <div class="tw-flex tw-items-center tw-gap-2">
              <div class="tw-w-3 tw-h-3 tw-rounded-full" style="background-color:#007f00;"></div>
              <span class="tw-text-xs">10 - 9</span>
            </div>
            <div class="tw-flex tw-items-center tw-gap-2">
              <div class="tw-w-3 tw-h-3 tw-rounded-full" style="background-color:#16a34a;"></div>
              <span class="tw-text-xs">8.9 - 8</span>
            </div>
            <div class="tw-flex tw-items-center tw-gap-2">
              <div class="tw-w-3 tw-h-3 tw-rounded-full" style="background-color:#bcbf00;"></div>
              <span class="tw-text-xs">7.9 - 7</span>
            </div>
            <div class="tw-flex tw-items-center tw-gap-2">
              <div class="tw-w-3 tw-h-3 tw-rounded-full" style="background-color:orange;"></div>
              <span class="tw-text-xs">6.9 - 6</span>
            </div>
            <div class="tw-flex tw-items-center tw-gap-2">
              <div class="tw-w-3 tw-h-3 tw-rounded-full" style="background-color:purple;"></div>
              <span class="tw-text-xs">5.9 - 0</span>
            </div>
          </v-row>

          <v-tabs-window v-model="activeSeason" class="tw-w-full tw-flex-1 tw-min-h-[800px] md:tw-min-h-80">
            <v-tabs-window-item
                v-for="(season, index) in seasons"
                :key="index"
                :value="index"
            >
              <v-row class="tw-flex-nowrap tw-gap-5 tw-ml-5 px-5 py-10 tw-text-white">
                <v-chip
                    v-for="episode in season.episodes"
                    :key="episode.name"
                    text-color="white"
                    outlined
                    medium
                    class="tw-px-4 tw-py-3 tw-text-lg tw-justify-center"
                    :style="{
            backgroundColor: getRatingColor(Number(episode.rating)),
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
        </v-card>
      </div>
    </v-img>
  </div>
</template>