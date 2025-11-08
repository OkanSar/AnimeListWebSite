<script setup lang="ts">
import { ref, onMounted } from "vue"

const props = defineProps<{
  suggest: any[]
  pending: boolean
}>()

// ✅ Kullanıcının eklediği anime ID'lerini tutan set
const addedAnimeIds = ref<Set<number>>(new Set())

// ✅ Alert state
const showAlert = ref(false)
const alertMessage = ref("")

// ✅ Kullanıcı anime listesini yükle (örnek API)
const loadUserAnimeList = async () => {
  try {
    const userAnimeList: any = await $fetch("/api/supabase/user_anime_list")
    if (userAnimeList?.all && Array.isArray(userAnimeList.all)) {
      addedAnimeIds.value = new Set(userAnimeList.all.map((a: any) => a.id))
    }
  } catch (err) {
    console.error("Kullanıcı anime listesi alınamadı:", err)
  }
}

onMounted(() => loadUserAnimeList())

// ✅ Listeye ekle / çıkar toggle
const toggleAnimeInList = async (anime: any) => {
  const isInList = addedAnimeIds.value.has(anime.id)

  try {
    await $fetch("/api/supabase/user_anime_list", {
      method: "PUT",
      body: { animeId: anime.id }
    })

    if (isInList) {
      addedAnimeIds.value.delete(anime.id)
      alertMessage.value = `${anime.title} listenden çıkarıldı!`
    } else {
      addedAnimeIds.value.add(anime.id)
      alertMessage.value = `${anime.title} listeye eklendi!`
    }

    showAlert.value = true
    setTimeout(() => (showAlert.value = false), 2500)
  } catch (err) {
    console.error("Liste güncelleme hatası:", err)
  }
}
</script>

<template>
  <h1 class="text-orange tw-font-bold tw-mt-36 tw-text-center tw-px-6 md:tw-pl-16 md:tw-pr-0">
    Bu Haftanın Önerileri
  </h1>

  <v-card
      v-for="sug in suggest"
      :key="sug.id"
      class="tw-mt-10 tw-mb-6 tw-max-w-[80%] tw-m-auto"
      color="black"
  >
    <v-row>
      <v-col cols="12" md="6" class="tw-max-h-96">
        <v-img
            :src="sug.main_picture?.medium"
            height="100%"
            aspect-ratio="16/9"
        />
      </v-col>

      <v-col cols="12" md="6" class="tw-flex tw-flex-col tw-justify-center tw-m-auto">
        <v-card-title class="suggestionTitle tw-mb-3">
          {{ sug.title }}
        </v-card-title>
        <v-card-text class="suggestionDescription mb-10">
          {{ sug.synopsis.length > 200 ? sug.synopsis.slice(0, 200) + "..." : sug.synopsis }}
        </v-card-text>

        <v-row class="tw-gap-y-2 tw-gap-x-2" align="stretch" no-gutters>
          <v-col cols="12" lg="6">
            <v-btn :to="'/animes/'+sug.id" block class="tw-h-full tw-w-full" color="orange">
              <v-icon class="tw-mr-2">mdi-play</v-icon>
              ANİME HAKKINDA
            </v-btn>
          </v-col>

          <v-col cols="12" lg="5">
            <v-btn
                block
                class="tw-h-full tw-w-full"
                color="orange"
                :variant="addedAnimeIds.has(sug.id) ? 'flat' : 'outlined'"
                @click.stop.prevent="toggleAnimeInList(sug)"
            >
              <v-icon class="tw-mr-2">
                {{ addedAnimeIds.has(sug.id) ? 'mdi-check' : 'mdi-bookmark' }}
              </v-icon>
              {{ addedAnimeIds.has(sug.id) ? 'Listeye Eklendi' : 'Listeme Ekle' }}
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>

  <!-- ✅ Sağ alt alert -->
  <v-alert
      v-if="showAlert"
      type="success"
      variant="flat"
      style="position: fixed; bottom: 16px; right: 16px; z-index: 9999;"
  >
    {{ alertMessage }}
  </v-alert>
</template>

<style scoped>
.suggestionTitle {
  font-size: 1.9rem;
}
.suggestionDescription {
  font-size: 0.8rem;
}
@media (max-width: 768px) {
  .suggestionTitle {
    font-size: 1.4rem;
  }
  .suggestionDescription {
    font-size: 0.7rem;
  }
}
</style>
