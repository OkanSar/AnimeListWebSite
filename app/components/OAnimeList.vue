<script setup lang="ts">
import { ref, onMounted } from "vue";

const props = defineProps({
  animeList: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  pending: {
    type: Boolean,
    default: false
  }
})

const addedAnimeIds = ref<Set<number>>(new Set())
const favoriteAnimeIds = ref<Set<number>>(new Set())

const showAlert = ref(false)
const alertMessage = ref("")

const confirmDialog = ref(false)
const animeToRemove = ref<any>(null)
const confirmMessage = ref("")

const loadUserAnimeList = async () => {
  try {
    const userAnimeList: any = await $fetch("/api/supabase/user_anime_list")
    if (userAnimeList?.all && Array.isArray(userAnimeList.all)) {
      addedAnimeIds.value = new Set(userAnimeList.all.map((a: any) => a.id))
    }
    if (userAnimeList?.favorite && Array.isArray(userAnimeList.favorite)) {
      favoriteAnimeIds.value = new Set(userAnimeList.favorite.map((a: any) => a.id))
    }
  } catch (err) {
    console.error("Kullanıcı anime listesi alınamadı:", err)
  }
}

onMounted(() => loadUserAnimeList())

const toggleAnimeInList = async (anime: any) => {
  const isInList = addedAnimeIds.value.has(anime.id)

  if (isInList) {
    animeToRemove.value = anime
    confirmMessage.value = `${anime.title} tüm listenden çıkarmak istediğine emin misin?`
    confirmDialog.value = true
    return
  }

  await updateAnimeList(anime, "add")
}

const confirmRemove = async () => {
  if (!animeToRemove.value) return
  await updateAnimeList(animeToRemove.value, "remove")
  confirmDialog.value = false
  animeToRemove.value = null
}

const updateAnimeList = async (anime: any, action: "add" | "remove") => {
  try {
    await $fetch("/api/supabase/user_anime_list", {
      method: "PUT",
      body: { animeId: anime.id }
    })

    if (action === "add") {
      addedAnimeIds.value.add(anime.id)
      alertMessage.value = `${anime.title} başarıyla listeye eklendi!`
    } else {
      addedAnimeIds.value.delete(anime.id)
      alertMessage.value = `${anime.title} tüm listenden çıkarıldı!`
      favoriteAnimeIds.value.delete(anime.id) // çıkarıldığında favorites'tan da sil
    }

    showAlert.value = true
    setTimeout(() => (showAlert.value = false), 3000)
  } catch (err) {
    console.error("Liste güncelleme hatası:", err)
  }
}

const toggleFavorite = async (anime: any) => {
  const isFavorite = favoriteAnimeIds.value.has(anime.id)
  try {
    await $fetch("/api/supabase/user_anime_list", {
      method: "PUT",
      body: { animeId: anime.id, favorite: !isFavorite }
    })

    if (isFavorite) {
      favoriteAnimeIds.value.delete(anime.id)
      alertMessage.value = `${anime.title} favorilerinden çıkarıldı!`
    } else {
      favoriteAnimeIds.value.add(anime.id)
      alertMessage.value = `${anime.title} favorilerine eklendi!`
    }

    showAlert.value = true
    setTimeout(() => (showAlert.value = false), 3000)
  } catch (err) {
    console.error("Favori güncelleme hatası:", err)
  }
}
</script>

<template>
  <v-container class="tw-px-6 tw-mt-10" fluid>
    <v-row>
      <v-col
          v-if="pending"
          v-for="n in 24"
          :key="'skeleton-' + n"
          cols="6"
          md="3"
          lg="2"
      >
        <v-skeleton-loader color="black" type="card" height="288px" />
      </v-col>

      <v-col
          v-else
          v-for="anime in animeList"
          :key="anime.id"
          cols="6"
          md="3"
          lg="2"
      >
        <v-card :to="`/animes/${anime.id}`" class="tw-h-full tw-relative tw-overflow-hidden" color="black">
          <v-img
              :src="anime.main_picture?.medium || ''"
              cover
              class="tw-h-72"
          />

          <div class="tw-absolute tw-top-0 tw-right-1 px-1 tw-flex tw-flex-col bg-black tw-rounded-b-lg tw-shadow-lg tw-z-10">
            <v-btn
                icon
                color="orange"
                variant="outlined"
                size="x-small"
                class="tw-text-white tw-transition tw-duration-150 mb-1"
                @click.stop.prevent="toggleAnimeInList(anime)"
            >
              <v-icon>{{ addedAnimeIds.has(anime.id) ? 'mdi-check' : 'mdi-plus' }}</v-icon>
            </v-btn>

            <v-btn
                icon
                color="red"
                variant="outlined"
                size="x-small"
                class="tw-transition mb-1"
                @click.stop.prevent="toggleFavorite(anime)"
            >
              <v-icon>{{ favoriteAnimeIds.has(anime.id) ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
            </v-btn>
          </div>

          <div class="tw-h-[60px] tw-overflow-hidden tw-flex tw-flex-col tw-justify-between tw-px-1 tw-py-0">
            <div class="tw-mt-4 tw-font-bold tw-text-sm tw-leading-snug tw-truncate">
              {{ anime.title }}
            </div>
            <div class="tw-flex tw-items-center tw-text-xs tw-justify-between">
              <v-rating
                  :model-value="anime.mean * 0.5 || 0"
                  color="amber"
                  density="compact"
                  size="14"
                  half-increments
                  readonly
                  class="tw-m-0"
              />
              <span class="tw-text-gray-400 tw-whitespace-nowrap">
                {{ anime.mean || '-' }} ({{ anime.num_scoring_users?.toLocaleString() || 0 }})
              </span>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Sağ alt alert -->
    <v-alert
        v-if="showAlert"
        type="success"
        variant="flat"
        style="position: fixed; bottom: 16px; right: 16px; z-index: 9999;"
    >
      {{ alertMessage }}
    </v-alert>

    <v-dialog v-model="confirmDialog" persistent max-width="400">
      <v-card class="tw-rounded-xl tw-overflow-hidden">
        <v-card-text class="tw-text-center tw-py-6">
          <v-icon color="red" size="48">mdi-alert-circle</v-icon>
          <div class="tw-mt-4 tw-text-lg font-semibold">{{ confirmMessage }}</div>
        </v-card-text>

        <v-card-actions class="tw-justify-center tw-pb-6">
          <v-btn color="red" variant="flat" @click="confirmRemove">Evet, çıkar</v-btn>
          <v-btn color="gray" variant="outlined" @click="confirmDialog=false">İptal</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

