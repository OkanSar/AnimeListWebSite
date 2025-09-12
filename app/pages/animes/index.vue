<script setup lang="ts">
import OAnimeList from "~/components/OAnimeList.vue";
import {ref} from "vue";
function onSearch(value: string) {
  console.log('Search event:', value)
}
function onFilterApplied(sort: string | null, categories: string[]) {
  console.log('Filtre uygulandı:', sort, categories)
}

const page = ref(1)
const animeList = ref<any[]>([])
const pending = ref(false)
const error = ref<Error | null>(null)
const total = ref(0)
const limit = 50

const loadPage = async () => {
  pending.value = true
  try {
    await $fetch(`/api/anime/page?page=2&q=Naruto=${page.value || 1}`)
        .then((res) => {
          animeList.value = res.data || []
          total.value = res.total || 0
        })
    total.value = data.value?.total || 0
    console.log(data.value)
  } catch (err: any) {
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
    <o-search-bar :index="1" @search="onSearch" @filter-applied="onFilterApplied" />
    <o-category-chip />
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




