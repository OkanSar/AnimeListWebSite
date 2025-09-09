<script setup lang="ts">

</script>

<template>
  <h2 class="text-orange tw-font-bold tw-mt-20 tw-text-center md:tw-text-left tw-px-6 md:tw-pl-24 md:tw-pr-0">
    Devamı Gelecek Animeler
  </h2>
  <v-slide-group
      class="full-width no-scrollbar"
      :show-arrows="$vuetify.display.mdAndUp"
      align="start"
  >
    <v-slide-group-item
        v-for="(anime, index) in 15"
        :key="index"
    >
      <v-card
          class="tw-mt-10 tw-mb-6 tw-ml-6 tw-max-w-[300px] xl:tw-max-w-[1200px] tw-m-auto"
          color="black"
      >
        <v-row no-gutters>
          <v-col cols="12" md="5">
            <v-img
                src="~/assets/images/the-fragant-flower-blooms.jpg"
                height="100%"
                cover
            />
          </v-col>

          <v-col cols="12" md="7" class="tw-flex tw-flex-col tw-justify-center tw-p-4">
            <v-card-title class="suggestionTitle tw-mb-2">
              The Fragrant Flower Blooms with Dignity
            </v-card-title>
            <v-card-subtitle>
              2. Sezon - 16 Bölüm
            </v-card-subtitle>
            <v-card-text class="suggestionDescription tw-mb-4">
              Chidori Lisesi, toplumun en düşük notlara sahip kesimini kabul eden bir erkek okuludur...
            </v-card-text>
            <v-row>
              <v-col cols="12" md="12" lg="6">
                <v-btn block class="tw-h-full xl:tw-ml-5 sm:tw-ml-0" color="orange">
                  <v-icon class="tw-mr-2">mdi-play</v-icon>
                  HAKKINDA
                </v-btn>
              </v-col>
              <v-col cols="12" md="12" lg="6">
                <v-btn variant="outlined" block class="tw-h-full tw-text-white" color="orange">
                  <v-icon class="tw-mr-2">mdi-bookmark</v-icon>
                  LİSTEME EKLE
                </v-btn>
              </v-col>
            </v-row>
        </v-col>
        </v-row>
      </v-card>
    </v-slide-group-item>
  </v-slide-group>
</template>
<style scoped>
.suggestionTitle{
  font-size: 1.9rem;
}
.suggestionDescription{
  font-size: 0.8rem;
}
@media (max-width: 768px) {
  .suggestionTitle {
    font-size: 1.4rem;
  }

  .suggestionDescription {
    font-size: 0.7rem;
  }
}
</style>

