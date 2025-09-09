<script setup lang="ts">
const categories = [
  'Aksiyon',
  'Macera',
  'Doğaüstü',
  'Romantik',
  'Büyü',
  'Gerilim',
  'Gizem',
  'Korku',
  'Okul',
  'Seinen',
  'Shounen',
  'Shoujo',
  'Mecha',
  'Fantastik',
  'Tarih',
  'Spor',
  'Müzik',
  'Psikolojik',
  'Kısa',
  'Dövüş'
]
</script>

<template>
  <div class="px-4 mb-2 mt-5 mb-10">
    <v-chip-group selected-class="bg-orange">
      <v-chip class="category tw-justify-center" v-for="category in categories "key:categories>{{category}}</v-chip>
    </v-chip-group>
  </div>
</template>

<style scoped>
.category{
  min-width: 80px;
}
</style>