<script setup lang="ts">
const props = defineProps<{
  upcoming : {
    id: number
    title: string
    description: string
    medium_image: string
    trailer: string
    aired_from: string
  }[]
}>()

const formatDate = (dateString: string) => {
  if (!dateString) return 'Kesin Değil'
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
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
        v-for="(anime, index) in upcoming"
        :key="index"
    >
      <v-card
          class="tw-mt-10 tw-mb-6 tw-mx-auto tw-w-[233px] md:tw-w-[700px] tw-mr-4 tw-ml-6"
          color="black"
      >
        <v-row no-gutters class="tw-h-full tw-flex-wrap">
          <v-col cols="12" md="5">
            <v-img
                :src="anime.medium_image"
                class="tw-w-full"
                height="216px"
                cover
            />
          </v-col>

          <v-col cols="12" md="7" class="tw-flex tw-flex-col tw-justify-between tw-p-4">
            <div style="overflow: hidden; max-height: 180px;">
              <v-card-title class="suggestionTitle tw-mb-2">
                {{ anime.title }}
              </v-card-title>
              <v-card-subtitle>
                Çıkış Tarihi: {{ formatDate(anime.aired_from) }}
              </v-card-subtitle>
              <v-card-text class="suggestionDescription tw-mb-4 tw-h-[100px]">
                {{ anime.description?.length > 50 ? anime.description.slice(0, 100) + '...' : anime.description }}
              </v-card-text>
            </div>

            <v-row>
              <v-col cols="12" md="5">
                <v-btn :to="{ path: '/animes/upcoming/',query: { trailerId: anime.id }}" block class="tw-h-full md:tw-ml-4" color="orange">
                  <v-icon class="tw-mr-2">mdi-play</v-icon>
                  FRAGMANI İZLE
                </v-btn>
              </v-col>
              <v-col cols="12" md="6">
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

