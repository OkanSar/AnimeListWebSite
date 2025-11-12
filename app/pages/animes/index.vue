<script setup lang="ts">
const page = ref(1)
const animeList = ref<any[]>([])
const pending = ref(true)
const error = ref<Error | null>(null)
const total = ref(0)
const limit = 50
const searchQuery = ref("")
// const animeCategories = ref([
//   { id: 1, name: "Aksiyon" },
//   { id: 2, name: "Macera" },
//   { id: 3, name: "Komedi" },
//   { id: 4, name: "Dram" },
//   { id: 5, name: "Oyun" },
//   { id: 6, name: "Tarih" },
//   { id: 7, name: "Korku" },
//   { id: 8, name: "Josei" },
//   { id: 9, name: "Büyü" },
//   { id: 10, name: "Mecha" },
//   { id: 11, name: "Askeri" },
//   { id: 12, name: "Müzik" },
//   { id: 13, name: "Gizem" },
//   { id: 14, name: "Parodi" },
//   { id: 15, name: "Psikolojik" },
//   { id: 16, name: "Romantik" },
//   { id: 17, name: "Samuray" },
//   { id: 18, name: "Okul" },
//   { id: 19, name: "Bilim Kurgu" },
//   { id: 20, name: "Hayat Kesitleri" },
//   { id: 21, name: "Uzay" },
//   { id: 22, name: "Spor" },
//   { id: 23, name: "Süper Güç" },
//   { id: 24, name: "Doğaüstü" },
//   { id: 25, name: "Gerilim" },
//   { id: 26, name: "Vampir" },
//   { id: 27, name: "Arabalar" },
// ])

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
        v-model="searchQuery"
        :index="1"
        text="Aradığınız animeyi yazınız..."
        @search="onSearch"
        @input="onSearch"
        @update:modelValue="onSearch"
        :pending="pending"
    />
<!--    <o-category-chip :categories="animeCategories" :pending="pending" />-->
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
