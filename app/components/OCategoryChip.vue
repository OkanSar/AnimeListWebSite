<script setup lang="ts">
const props = defineProps<{
  categories: { id: number; name: string; }[],
  pending: boolean,
}>()
</script>

<template>
  <div class="px-4 mb-2 mt-5 mb-10">
    <v-chip-group selected-class="bg-orange">
      <template v-if="props.pending">
        <v-skeleton-loader
            color="black"
            class="tw-h-10 tw-w-full tw-rounded-md"
            type="text"
        />
      </template>
      <template v-else>
        <v-chip
            class="category tw-justify-center"
            v-for="category in props.categories"
            :key="category.id"
        >
          {{ category.name }}
        </v-chip>
      </template>
    </v-chip-group>
  </div>
</template>




