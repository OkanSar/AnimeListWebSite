<script setup lang="ts">
import { ref } from 'vue'

const page = ref(1)
const animeList = ref<any[]>([])
const pending = ref(false)
const error = ref<Error | null>(null)

const loadPage = async () => {
  pending.value = true
  try {
    const { data } = await useFetch(`/api/anime/page?page=2&q=Naruto=${page.value}`)
    animeList.value = data.value?.data || []
  } catch (err: any) {
    error.value = err
  } finally {
    pending.value = false
  }
}

onMounted(() => {
  loadPage()
})

const nextPage = () => {
  page.value++
  loadPage()
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
