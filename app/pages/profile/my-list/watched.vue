<script setup lang="ts">
const user = useSupabaseUser()
const animeList = ref<IUserAnimeList['animeList']>([])
const pending = ref(true)

watchEffect(async () => {
  if (!user.value) return

  const { data, pending: fetchPending } = await useFetch<IUserAnimeList>('/api/supabase/user_anime_list', {
    credentials: 'include'
  })
  pending.value = fetchPending.value
  animeList.value = data.value?.watched ?? []
})
</script>

<template>
  <v-container class="tw-px-6 mt-10" fluid>
    <v-row>
      <v-col
          v-if="pending"
          v-for="n in 24"
          :key="'skeleton-' + n"
          cols="6"
          md="3"
          lg="2"
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
      </v-col>
      <v-col
          v-else
          v-for="anime in animeList"
          :key="anime.id"
          cols="6"
          md="3"
          lg="2"
      >
        <v-card :to="`/animes/${anime.id}`" class="tw-h-full" color="black" max-width="200">
          <v-img
              :src="anime.main_picture_medium || ''"
              max-height="200px"
          />
          <div class="tw-h-[60px] tw-overflow-hidden tw-flex tw-flex-col tw-justify-between tw-px-1 tw-py-0">
            <div class="tw-mt-4 tw-font-bold tw-text-sm tw-leading-snug tw-truncate">
              {{ anime.title }}
            </div>
            <div class="tw-flex tw-items-center tw-text-xs tw-justify-between">
              <v-rating
                  :model-value="anime.mean * 0.5 || 0"
                  color="amber"
                  density="compact"
                  size="14"
                  half-increments
                  readonly
                  class="tw-m-0"
              />
              <span class="tw-text-gray-400 tw-whitespace-nowrap">
        {{ anime.mean || '-' }} ({{ anime.num_scoring_users?.toLocaleString() || 0 }})
      </span>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.glass-card {
  background: rgba(25, 25, 35, 0.7);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(15px);
  color: #fff;
}
.neon-text {
  color: #ff77ff;
  text-shadow: 0 0 6px #ff77ff, 0 0 12px #ff77ff;
}
.anime-card {
  background: rgba(35, 35, 45, 0.7);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: #fff;
  overflow: hidden;
  transition: transform 0.3s ease;
}
.anime-card:hover {
  transform: scale(1.05);
}
</style>
