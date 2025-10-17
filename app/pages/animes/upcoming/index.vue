<script setup lang="ts">
import { ref } from 'vue'
import {useRoute, useRouter} from 'vue-router'

const { data, pending } = await useFetch('/api/anime/upcoming')

const selectedTrailer = ref<string | null>(null)
const selectedTitle = ref<string | null>(null)
const selectedAnimeId = ref<number | null>(null)

const route = useRoute()
const router = useRouter()

const isIOS = ref(false)

const formatDate = (dateString) => {
  if (!dateString) return 'Kesin Değil'
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const playTrailer = (anime) => {
  const baseUrl = anime.trailer.split('?')[0]
  let url =
      baseUrl +
      '?autoplay=0&modestbranding=1&rel=0&showinfo=0&enablejsapi=1' // autoplay=0

  if (isIOS) {
    url += '&playsinline=1'
  }

  selectedTrailer.value = url
  selectedTitle.value = anime.title
  selectedAnimeId.value = anime.id

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const generateVariants = (title: string) => {
  if (!title) return []

  const variants: string[] = []
  const prefix = title.startsWith('Re:') ? 'Re:' : ''
  let workingTitle = prefix ? title.replace(/^Re:\s*/i, '') : title

  const extraPatterns = [
    // 1-20 arası sayılar ve st/nd/rd/th ile Season
    /\b\d+(st|nd|rd|th)?\s*Season\b/gi,
    /\bFinal Season\b/gi,
    /\b(Season|Final)\b/gi,
    // Tek başına 1st, 2nd, 3rd, 4th, 5th, vb
    /\b\d+(st|nd|rd|th)\b/gi,
    /\b(I{2,4}|V|VI{0,3})\b/gi
  ]

  // 1️⃣ Önce tamamen temizlenmiş versiyon
  let cleaned = workingTitle
  extraPatterns.forEach(r => { cleaned = cleaned.replace(r, '') })
  cleaned = cleaned.replace(/\s*:\s*.*$/, '').replace(/\s{2,}/g, ' ').trim()
  if (prefix) cleaned = prefix + ' ' + cleaned
  variants.push(cleaned)

  // 2️⃣ Adım adım ekleri geri koy
  let temp = workingTitle.replace(/\s{2,}/g, ' ').trim()
  if (prefix) temp = prefix + ' ' + temp
  if (!variants.includes(temp)) variants.push(temp)

  // 3️⃣ Orijinal başlığı da ekle
  if (!variants.includes(title)) variants.push(title)

  return variants
}

const goToPreviousSeasons = async () => {
  if (!selectedTitle.value) return

  const variants = generateVariants(selectedTitle.value)
  try {
    let found = false
    for (const variant of variants) {
      const res: any = await $fetch(`/api/anime/page?q=${encodeURIComponent(variant)}`)
      if (res.data && res.data.length > 0) {
        const animeId = res.data[0].id
        router.push(`/animes/${animeId}`)
        found = true
        break
      }
    }

    if (!found) alert('Önceki sezon bulunamadı')
  } catch (err) {
    console.error(err)
    alert('Arama sırasında hata oluştu')
  }
}

onMounted(()=>{
  isIOS.value = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
  const trailerId = route.query.trailerId
  if (trailerId && data.value) {
    const anime = data.value.find(a => a.id === Number(trailerId))
    if (anime) {
      playTrailer(anime)
    }
  }
})
</script>

<template>
  <v-container class="tw-px-6 tw-mt-20" fluid max-width="1200">
    <div v-if="selectedTrailer" class="tw-w-full tw-bg-black tw-rounded-2xl tw-overflow-hidden tw-shadow-lg relative mb-8">
      <div class="tw-aspect-video">
        <iframe
            :src="selectedTrailer"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            :webkit-playsinline="isIOS ? 'true' : null"
            class="tw-w-full tw-h-full"
        ></iframe>
      </div>
      <div class="tw-p-4 tw-text-white tw-font-bold tw-text-lg">
        {{ selectedTitle }}
      </div>
    </div>

    <div
        v-if="selectedTrailer"
        class="tw-flex tw-flex-col md:tw-flex-row tw-bg-black tw-rounded-2xl tw-shadow-2xl tw-overflow-hidden tw-mb-10 tw-transition-transform tw-duration-300"
    >
      <div class="tw-flex-1 tw-p-6 tw-flex tw-flex-col tw-justify-between">
        <div>
          <h2 class="tw-text-white tw-text-2xl md:tw-text-3xl tw-font-bold tw-mb-4">
            {{ selectedTitle }}
          </h2>
          <p class="tw-text-gray-300 tw-mb-6 tw-leading-relaxed">
            {{ data.find(a => a.id === selectedAnimeId)?.description }}
          </p>
        </div>
        <div class="tw-flex tw-gap-2">
          <v-btn
              color="blue"
              variant="flat"
              size="small"
              class="hover:tw-bg-blue-700 tw-transition-colors tw-duration-300"
              @click="goToPreviousSeasons"
          >
            Önceki Sezonlar
          </v-btn>
          <v-btn
              color="red"
              variant="flat"
              size="small"
              class="hover:tw-bg-red-700 tw-transition-colors tw-duration-300"
              @click="playTrailer(data.find(a => a.id === selectedAnimeId))"
          >
            Fragmanı İzle
          </v-btn>
        </div>
      </div>

      <div class="tw-w-full md:tw-w-1/3 tw-flex tw-items-center tw-justify-center tw-p-4">
        <v-img
            :src="data.find(a => a.id === selectedAnimeId)?.medium_image"
            cover
            class="tw-rounded-xl tw-h-56 md:tw-h-64 tw-w-full tw-shadow-inner"
        />
      </div>
    </div>

    <v-row>
      <v-col v-if="pending" v-for="n in data" :key="'skeleton-' + n" cols="6" md="3" lg="2">
        <v-skeleton-loader color="black" type="card" height="288px" />
      </v-col>

      <v-col v-else v-for="anime in data" :key="anime.id" cols="12" md="4" lg="3">
        <v-card class="tw-h-full tw-text-white tw-rounded-2xl tw-overflow-hidden hover:tw-scale-105 tw-transition" color="black">
          <v-img :src="anime.medium_image || ''" cover class="tw-h-72" />
          <div class="tw-px-2 tw-py-3 tw-flex tw-flex-col tw-justify-between tw-h-full">
            <div class="tw-font-bold tw-text-sm tw-leading-snug tw-truncate tw-h-[30px]">{{ anime.title }}</div>
            <div class="tw-text-xs tw-text-gray-400 tw-h-[30px]">{{ formatDate(anime.aired_from) }}</div>
            <v-row class="tw-mt-2" dense>
              <v-col cols="6" class="tw-pr-1">
                <v-btn block color="orange" size="small" @click="playTrailer(anime)" >
                  <v-icon>mdi-play</v-icon>
                    Fragmanı İzle
                </v-btn>
              </v-col>
              <v-col cols="6" class="tw-pl-1">
                <v-btn block color="orange" variant="outlined" size="small" :to="`/animes/${anime.id}`">
                  <v-icon class="tw-mr-2">mdi-bookmark</v-icon>
                  HAKKINDA
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
