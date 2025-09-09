<script setup lang="ts">

</script>

<template>
  <h2 class="text-orange tw-font-bold tw-mt-20 tw-text-center md:tw-text-left tw-px-6 md:tw-pl-24 md:tw-pr-0">
    Yeni Çıkacak Animeler
  </h2>
  <v-slide-group
      class="full-width no-scrollbar"
      :show-arrows="$vuetify.display.mdAndUp"
      align="start">
    <v-slide-group-item
        v-for="(anime, index) in 15"
        :key="index"
    >
      <v-card class="mx-5 my-10 tw-w-56" color="black">
        <v-img
            src="~/assets/images/demon-slayer-infinity-castle.jpg"
            cover
            class="tw-h-72"
        />
        <div class="tw-h-[60px] tw-overflow-hidden tw-flex tw-flex-col tw-justify-between tw-px-1 tw-py-0">
          <div class="tw-mt-4 tw-font-bold tw-text-sm tw-leading-snug tw-truncate">
            Demon Slayer Infinity Castle - First Movie
          </div>
          <div class="tw-flex tw-items-center tw-justify-between tw-text-xs">
            <span class="text-grey">16 Ekim 2025</span>
          </div>
        </div>
      </v-card>
    </v-slide-group-item>
  </v-slide-group>
</template>
