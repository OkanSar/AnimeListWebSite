<script setup lang="ts">
const props = defineProps<{
  categories: string[]
}>()
</script>

<template>
  <div class="px-4 mb-2 mt-5 mb-10">
    <v-chip-group selected-class="bg-orange">
      <v-chip
          class="category tw-justify-center"
          v-for="category in props.categories"
          :key="category"
      >
        {{ category.name }}
      </v-chip>
    </v-chip-group>
  </div>
</template>

<style scoped>
.category {
  min-width: 80px;
}
</style>
