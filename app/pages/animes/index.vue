<script setup lang="ts">
const page = ref(1)
const animeList = ref<any[]>([])
const pending = ref(true)
const error = ref<Error | null>(null)
const total = ref(0)
const limit = 50
const searchQuery = ref("")
const animeCategories = ref([
  { id: 1, name: "Aksiyon" },
  { id: 2, name: "Macera" },
  { id: 3, name: "Komedi" },
  { id: 4, name: "Dram" },
  { id: 5, name: "Ecchi" },
  { id: 6, name: "Fantezi" },
  { id: 7, name: "Oyun" },
  { id: 8, name: "Harem" },
  { id: 9, name: "Tarih" },
  { id: 10, name: "Korku" },
  { id: 11, name: "Josei" },
  { id: 12, name: "Büyü" },
  { id: 13, name: "Dövüş Sanatları" },
  { id: 14, name: "Mecha" },
  { id: 15, name: "Askeri" },
  { id: 16, name: "Müzik" },
  { id: 17, name: "Gizem" },
  { id: 18, name: "Parodi" },
  { id: 19, name: "Psikolojik" },
  { id: 20, name: "Romantik" },
  { id: 21, name: "Samuray" },
  { id: 22, name: "Okul" },
  { id: 23, name: "Bilim Kurgu" },
  { id: 29, name: "Hayat Kesitleri" },
  { id: 30, name: "Uzay" },
  { id: 31, name: "Spor" },
  { id: 32, name: "Süper Güç" },
  { id: 33, name: "Doğaüstü" },
  { id: 34, name: "Gerilim" },
  { id: 35, name: "Vampir" },
  { id: 36, name: "Yaoi" },
  { id: 37, name: "Yuri" },
  { id: 38, name: "Arabalar" },
  { id: 39, name: "Bunama" },
])

function onSearch(value: any) {
  const q = typeof value === "string" ? value.trim() : value?.target?.value || ""
  searchQuery.value = q
  page.value = 1
  loadPage()
}

const loadPage = async () => {
  error.value = null
  try {
    const params = new URLSearchParams()
    params.set("page", String(page.value))
    if (searchQuery.value) params.set("q", searchQuery.value)
    const url = `/api/anime/page?${params.toString()}`

    const res: any = await $fetch(url)

    animeList.value = res.data || []
    total.value = res.total || animeList.value.length

  } catch (err: any) {
    console.error("loadPage error:", err)
    error.value = err
  } finally {
    pending.value = false
  }
}

onMounted(() => {
  loadPage()
})

watch(page, () => {
  animeList.value = []
  loadPage()
})
</script>

<template>
  <v-card class="mx-auto mt-10" max-width="1200" color="black">
    <o-search-bar
        :index="1"
        @search="onSearch"
        @input="onSearch"
        @update:modelValue="onSearch"
        :pending="pending"
    />
    <o-category-chip :categories="animeCategories" :pending="pending" />
    <o-anime-list :anime-list="animeList" :pending="pending" :error="error" />
    <div class="text-center mt-4">
      <v-pagination
          v-model="page"
          :length="total > 0 ? Math.ceil(total / limit) : 1"
          :total-visible="10"
      ></v-pagination>
    </div>
  </v-card>
</template>
