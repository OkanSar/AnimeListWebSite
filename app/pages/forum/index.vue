<script setup lang="ts">
import { ref, onMounted } from 'vue'

const page = ref(1)
const animeList = ref<any[]>([])
const pending = ref(false)
const error = ref<Error | null>(null)
const total = ref(0)
const limit = 50

const loadPage = async () => {
  pending.value = true
  try {
    const { data } = await useFetch(`/api/anime/ranking?page=${page.value}`)
    animeList.value = data.value?.data || []
    total.value = data.value?.total || 0
  } catch (err: any) {
    error.value = err
  } finally {
    pending.value = false
  }
}

onMounted(() => loadPage())

const nextPage = () => {
  if (animeList.value.length === limit) { // sadece mevcut page doluysa
    page.value++
    loadPage()
  }
}

const prevPage = () => {
  if (page.value > 1) {
    page.value--
    loadPage()
  }
}
</script>

<template>

</template>
