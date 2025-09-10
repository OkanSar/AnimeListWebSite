<script setup lang="ts">
import OAnimeList from "~/components/OAnimeList.vue";

function onSearch(value: string) {
  console.log('Search event:', value)
}

function onFilterApplied(sort: string | null, categories: string[]) {
  console.log('Filtre uygulandı:', sort, categories)
}
</script>
<template>
  <v-card class="mx-auto mt-10" max-width="1200" color="black">
    <o-search-bar :index="1" @search="onSearch" @filter-applied="onFilterApplied" />
    <o-category-chip />
    <o-anime-list />
  </v-card>
</template>




