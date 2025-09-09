<script setup lang="ts">
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
    <v-container class="tw-px-6 tw-mt-10" fluid>
      <v-row>
        <v-col v-for="i in 20" :key="i" cols="6" md="3" lg="2">
        <v-card class="tw-h-full" color="black">
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
  </v-card>
</template>




