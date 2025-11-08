<script setup lang="ts">
import { ref } from 'vue'
import image1 from '~/assets/images/the-fragant-flower-blooms.jpg'

const pending = ref(false)
const showAlert = ref(false)
const alertMessage = ref('')
const products = ref([
  {
    id: 1,
    name: 'Naruto Hoodie',
    image: image1,
    price: 399,
    rating: 4.5,
    rateCount: 7621
  },
  {
    id: 2,
    name: 'One Piece Figür',
    image: image1,
    price: 249,
    rating: 4.8,
    rateCount: 1872
  },
  {
    id: 3,
    name: 'Attack on Titan Poster',
    image: image1,
    price: 99,
    rating: 4.2,
    rateCount: 2524
  },
  {
    id: 4,
    name: 'Jujutsu Kaisen - Gojo Satoru Figür',
    image: image1,
    price: 1299,
    rating: 4.2,
    rateCount: 2524
  },
  {
    id: 5,
    name: 'The Eminence in Shadow Figür',
    image: image1,
    price: 1100,
    rating: 4.8,
    rateCount: 881
  },
  {
    id: 6,
    name: 'Demon Slayer Nichirin Kılıcı',
    image: image1,
    price: 4999,
    rating: 4.9,
    rateCount: 9125
  },
])
const categories = ref([
  { id: 1, name: 'FİGÜR' },
  { id: 2, name: 'MANGA' },
  { id: 3, name: 'POSTER' },
  { id: 4, name: 'OYUN KARTLARI' },
  { id: 5, name: 'GİYİM' },
  { id: 6, name: 'AKSESUARLAR' },
  { id: 7, name: 'DİĞER' },
])

const favoriteProductIds = ref(new Set())

function toggleFavorite(product) {
  if (favoriteProductIds.value.has(product.id)) {
    favoriteProductIds.value.delete(product.id)
    showMessage('Favorilerden çıkarıldı')
  } else {
    favoriteProductIds.value.add(product.id)
    showMessage('Favorilere eklendi')
  }
}

function addToCart(product) {
  showMessage(`${product.name} sepete eklendi!`)
}

function showMessage(msg) {
  alertMessage.value = msg
  showAlert.value = true
  setTimeout(() => (showAlert.value = false), 1500)
}
</script>

<template>
  <v-card class="mx-auto mt-10" max-width="1200" color="black">
    <div class="tw-px-4 tw-pt-4">
      <o-search-bar :index="1" :pending="pending" class="tw-w-full" />
    </div>

    <div class="tw-px-4 tw-mt-3 tw-mb-10">
      <div
          class="tw-flex tw-gap-2 tw-w-full tw-justify-between tw-flex-wrap md:tw-flex-nowrap"
      >
        <div
            v-for="category in categories"
            :key="category.id"
            class="tw-flex-1 tw-text-center"
        >
          <v-btn
              variant="outlined"
              color="orange"
              size="small"
              class="tw-w-full tw-text-white tw-border-orange-500 hover:tw-text-black tw-transition"
          >
            {{ category.name }}
          </v-btn>
        </div>
      </div>
    </div>

    <v-row class="tw-px-4 tw-pt-4 tw-pb-8">
      <v-col
          v-if="pending"
          v-for="n in 12"
          :key="'skeleton-' + n"
          cols="6"
          md="4"
          lg="2"
      >
        <v-skeleton-loader color="black" type="card" height="300px" />
      </v-col>

      <v-col
          v-else
          v-for="product in products"
          :key="product.id"
          cols="6"
          md="4"
          lg="2"
      >
        <v-card
            class="tw-h-full tw-relative tw-overflow-hidden tw-bg-zinc-900 tw-transition tw-duration-200 hover:tw-scale-[1.02] hover:tw-shadow-lg"
            :to="`/products/${product.id}`"
        >
          <v-img
              :src="product.image"
              height="220"
              cover
              class="tw-rounded-b-none"
          ></v-img>

          <!-- Aksiyon Butonları -->
          <div
              class="tw-absolute tw-top-2 tw-right-2 tw-flex tw-flex-col tw-gap-1 tw-z-10"
          >
            <v-btn
                icon
                size="x-small"
                color="red"
                variant="outlined"
                class="tw-bg-black/60 tw-text-white"
                @click.stop.prevent="toggleFavorite(product)"
            >
              <v-icon>{{
                  favoriteProductIds.has(product.id)
                      ? 'mdi-heart'
                      : 'mdi-heart-outline'
                }}</v-icon>
            </v-btn>

            <v-btn
                icon
                size="x-small"
                color="orange"
                variant="outlined"
                class="tw-bg-black/60 tw-text-white"
                @click.stop.prevent="addToCart(product)"
            >
              <v-icon>mdi-cart-plus</v-icon>
            </v-btn>
          </div>

          <!-- Ürün Bilgileri -->
          <div class="tw-px-2 tw-py-3 tw-text-white tw-flex tw-flex-col tw-gap-1">
            <div class="tw-font-semibold tw-text-sm tw-truncate">
              {{ product.name }}
            </div>
            <div class="tw-flex tw-items-center tw-justify-between">
              <span class="tw-text-orange-400 tw-font-bold">
                {{ product.price }}₺
              </span>
              <span class="tw-text-gray-400 tw-text-xs">
                5 / {{ product.rating }} ({{product.rateCount}})
              </span>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Sağ Alt Bildirim -->
    <v-alert
        v-if="showAlert"
        type="success"
        variant="flat"
        style="position: fixed; bottom: 16px; right: 16px; z-index: 9999;"
    >
      {{ alertMessage }}
    </v-alert>
  </v-card>

  <v-card color="black" class="tw-relative tw-h-20 tw-text-white">
    <div class="tw-absolute tw-bottom-2 tw-right-3 tw-text-sm tw-opacity-80">
      <h3>Yapım aşamasındadır, bütün hepsi örnektir...</h3>
    </div>
  </v-card>
</template>

<style scoped>
.v-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
</style>
