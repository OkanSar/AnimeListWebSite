<script setup lang="ts">

</script>

<template>
  <v-container class="tw-px-6 tw-mt-10" fluid>
    <v-row>
      <v-col v-for="i in 20" :key="i" cols="6" md="3" lg="2">
        <v-card to="/animes/deneme/" class="tw-h-full" color="black">
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
              <v-rating
                  :model-value="4.5"
                  color="amber"
                  density="compact"
                  size="small"
                  half-increments
                  readonly
                  class="tw-text-xs"
              />
              <span class="text-grey">4.5 (413)</span>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
