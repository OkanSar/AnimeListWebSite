<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const animeId = route.params.id as string

const anime = ref<any>(null)
const pending = ref(false)
const error = ref<Error | null>(null)

const loadAnime = async () => {
  pending.value = true
  error.value = null
  try {
    anime.value = await $fetch(`/api/anime/5114`)
  } catch (err: any) {
    error.value = err
    anime.value = null
  } finally {
    pending.value = false
  }
}

onMounted(loadAnime)
</script>

<template>
</template>
