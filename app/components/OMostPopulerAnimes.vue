<script setup lang="ts">
const currentYear = new Date().getFullYear()

const props = defineProps<{
  pending: boolean,
  anime: {
    id: number
    title: string
    mean?: number
    num_scoring_users?: number
    main_picture?: {
      medium?: string
      large?: string
    }
  }[]
}>()
</script>

<template>
  <div v-if="pending">
    <h2 class="text-orange tw-font-bold tw-mt-10 tw-text-center md:tw-text-left tw-px-6 md:tw-pl-24 md:tw-pr-0">
      {{ currentYear }} En Popüler Animeler
    </h2>

    <v-slide-group
        class="full-width no-scrollbar"
        :show-arrows="$vuetify.display.mdAndUp"
        align="start"
    >
      <v-slide-group-item
          v-for="n in 8"
          :key="n"
      >
        <v-card class="mx-5 my-10 tw-w-56" color="black">
          <v-skeleton-loader
              type="image"
              class="tw-h-72"
              color="black"
          />
          <div class="tw-h-[60px] tw-flex tw-flex-col tw-justify-between tw-px-1 tw-py-0">
            <v-skeleton-loader color="black" type="text" class="tw-mt-4 tw-w-40 tw-h-4" />
            <div class="tw-flex tw-items-center tw-justify-between tw-mt-2">
              <v-skeleton-loader color="black" type="text" class="tw-w-20 tw-h-4" />
              <v-skeleton-loader color="black" type="text" class="tw-w-16 tw-h-4" />
            </div>
          </div>
        </v-card>
      </v-slide-group-item>
    </v-slide-group>
  </div>

  <div v-else>
    <h2 class="text-orange tw-font-bold tw-mt-10 tw-text-center md:tw-text-left tw-px-6 md:tw-pl-24 md:tw-pr-0">
      {{ currentYear }} En Popüler Animeler
    </h2>

    <v-slide-group
        class="full-width no-scrollbar"
        :show-arrows="$vuetify.display.mdAndUp"
        align="start"
    >
      <v-slide-group-item
          v-for="anime in props.anime"
          :key="anime.id"
      >
        <v-card :to="'/animes/'+anime.id" class="mx-5 my-10 tw-w-56" color="black">
          <v-img
              :src="anime.main_picture?.medium || ''"
              cover
              class="tw-h-72"
          />
          <div class="tw-h-[60px] tw-overflow-hidden tw-flex tw-flex-col tw-justify-between tw-px-1 tw-py-0">
            <div class="tw-mt-4 tw-font-bold tw-text-sm tw-leading-snug tw-truncate">
              {{ anime.title }}
            </div>
            <div class="tw-flex tw-items-center tw-justify-between tw-text-xs">
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
      </v-slide-group-item>
    </v-slide-group>
  </div>
</template>
