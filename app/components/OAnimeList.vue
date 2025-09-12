<script setup lang="ts">
const props = defineProps({
  animeList: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  pending: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <v-container class="tw-px-6 tw-mt-10" fluid>
    <v-row>
      <v-col
          v-for="anime in animeList"
          :key="anime.id"
          cols="6"
          md="3"
          lg="2"
      >
        <v-card :to="`/animes/${anime.id}`" class="tw-h-full" color="black">
          <v-img
              :src="anime.main_picture?.medium || ''"
              cover
              class="tw-h-72"
          />
          <div class="tw-h-[60px] tw-overflow-hidden tw-flex tw-flex-col tw-justify-between tw-px-1 tw-py-0">
            <div class="tw-mt-4 tw-font-bold tw-text-sm tw-leading-snug tw-truncate">
              {{ anime.title }}
            </div>
            <div class="tw-flex tw-items-center tw-justify-between tw-text-xs tw-max-h-5">
              <v-rating
                  :model-value="anime.mean || 0"
                  color="amber"
                  density="compact"
                  size="small"
                  half-increments
                  readonly
                  class="tw-text-xs"
              />
              <span class="text-grey">
                {{ anime.mean || '-' }} ({{ anime.num_scoring_users || 0 }})
              </span>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
