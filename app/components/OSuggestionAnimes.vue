<script setup lang="ts">

</script>

<template>
  <h1 class="text-orange tw-font-bold tw-mt-40 tw-text-center tw-px-6 md:tw-pl-16 md:tw-pr-0">
    Bu Haftanın Önerileri
  </h1>
  <v-card class="tw-mt-10 tw-mb-6 tw-max-w-[80%] tw-m-auto" color="black">
    <v-row>
      <v-col cols="12" md="6">
        <v-img
            src="~/assets/images/demon-slayer-infinity-castle.jpg"
            height="100%"
            cover
        />
      </v-col>
      <v-col cols="12" md="6" class="tw-flex tw-flex-col tw-justify-center tw-m-auto">
        <v-card-title class="suggestionTitle tw-mb-3">Demon Slayer</v-card-title>
        <v-card-text class="suggestionDescription mb-10">
          İblis Avcıları Birliği, Tanjiro, Nezuko ve Hashira'nın Muzan Kibutsuji ile son savaşı başlarken, korkunç Üst Sınıf iblislerle çaresiz bir savaşa girdikleri Sonsuzluk Kalesi'ne çekilir.Tanjiro ve arkadaşları, Muzan’la yüzleşmek için ölümcül bir savaşın içine girer...
        </v-card-text>
        <v-row class="tw-gap-y-2 tw-gap-x-2" align="stretch" no-gutters>
          <v-col cols="12" lg="6">
            <v-btn block class="tw-h-full tw-w-full" color="orange">
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
  <v-card class="tw-mt-10 tw-mb-6 tw-max-w-[80%] tw-m-auto" color="black">
    <v-row>
      <v-col cols="12" md="6">
        <v-img
            src="~/assets/images/the-fragant-flower-blooms.jpg"
            height="100%"
            cover
        />
      </v-col>

      <v-col cols="12" md="6" class="tw-flex tw-flex-col tw-justify-center tw-m-auto">
        <v-card-title class="suggestionTitle tw-mb-3">The Fragrant Flower Blooms with Dignity</v-card-title>
        <v-card-text class="suggestionDescription mb-10">
          Chidori Lisesi, toplumun en düşük notlara sahip kesimini kabul eden bir erkek okuludur. Yanındaki Kikyo Kız Lisesi ise varlıklı, üst sınıf ailelerin değerli kızlarını gönderdiği bir okuldur. Sert bir yüze ama nazik bir kalbe sahip olan Chidori ikinci sınıf öğrencisi Rintaro, Kaoruko adında bir kızla tanıştığı zaman, ailesinin pastanesinde yardım etmektedir. İkili hemen kaynaşır...
        </v-card-text>
        <v-row class="tw-gap-y-2 tw-gap-x-2" align="stretch" no-gutters>
          <v-col cols="12" lg="6">
            <v-btn block class="tw-h-full tw-w-full" color="orange">
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