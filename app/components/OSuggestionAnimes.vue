<script setup lang="ts">
const props = defineProps<{
  suggest: {
    id: number,
    title: string,
    synopsis: string,
    main_picture?:{
      medium:string,
      large:string,
    },
    mean?: number,
    num_scoring_users?: number
    num_episodes: number,
    genres: {
      id: number,
      name: string,
    },
  },
  pending: boolean,
}>()
</script>

<template>
  <h1 class="text-orange tw-font-bold tw-mt-40 tw-text-center tw-px-6 md:tw-pl-16 md:tw-pr-0">
    Bu Haftanın Önerileri
  </h1>
  <v-card v-for="sug in suggest" :key="suggest.id" class="tw-mt-10 tw-mb-6 tw-max-w-[80%] tw-m-auto" color="black">
    <v-row>
      <v-col cols="12" md="6" class="tw-max-h-96">
        <v-img
            :src="sug.main_picture.medium"
            height="100%"
            aspect-ratio="16/9"
        />
      </v-col>
      <v-col cols="12" md="6" class="tw-flex tw-flex-col tw-justify-center tw-m-auto">
        <v-card-title class="suggestionTitle tw-mb-3"> {{ sug.title }} </v-card-title>
        <v-card-text class="suggestionDescription mb-10">
         {{ sug.synopsis?.slice(0, 200) }}{{ sug.synopsis?.length > 200 ? "..." : "" }}
        </v-card-text>
        <v-row class="tw-gap-y-2 tw-gap-x-2" align="stretch" no-gutters>
          <v-col cols="12" lg="6">
            <v-btn :to="'/animes/'+`${sug.id}`" block class="tw-h-full tw-w-full" color="orange">
              <v-icon class="tw-mr-2">mdi-play</v-icon>
              ANİME HAKKINDA
            </v-btn>
          </v-col>

          <v-col cols="12" lg="5">
            <v-btn variant="outlined" block class="tw-h-full tw-w-full tw-text-white" color="orange">
              <v-icon class="tw-mr-3">mdi-bookmark</v-icon>
              LİSTENE EKLE
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>

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