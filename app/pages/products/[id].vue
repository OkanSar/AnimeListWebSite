<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import imagePlaceholder from '~/assets/images/the-fragant-flower-blooms.jpg'

const route = useRoute()
const productId = Number(route.params.id)

const product = ref<any>(null)
const relatedProducts = ref<any[]>([])
const pending = ref(true)
const addingToCart = ref(false)
const favorite = ref(false)

const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

function showSnackbar(msg: string, color: string = 'success') {
  snackbarText.value = msg
  snackbarColor.value = color
  snackbar.value = true
  setTimeout(() => (snackbar.value = false), 2000)
}

// 🟢 Ürünü getir
async function fetchProduct() {
  try {
    pending.value = true
    const res = await $fetch(`/api/supabase/product/${productId}`)
    if (res.error) throw new Error(res.error)
    product.value = res.product

    if (product.value?.category_id) {
      const relatedRes = await $fetch(`/api/supabase/product?category_id=${product.value.category_id}`)
      if (relatedRes.error) throw new Error(relatedRes.error)
      relatedProducts.value = relatedRes.products.filter((p: any) => p.id !== product.value.id)
    }

    // 🧡 Favori kontrolü
    await checkFavorite()
  } catch (err: any) {
    console.error(err)
    showSnackbar('Ürün yüklenemedi.', 'error')
  } finally {
    pending.value = false
  }
}

// 🧡 Bu ürün favorilerde mi kontrol et
async function checkFavorite() {
  try {
    const res = await $fetch(`/api/supabase/favorites`)
    if (res.error) return
    favorite.value = res.favorites.some((f: any) => f.products.id === productId)
  } catch (err) {
    console.error('Favori kontrol hatası:', err)
  }
}

// 🧡 Favoriye ekle / kaldır
async function toggleFavorite() {
  if (!product.value) return

  try {
    if (favorite.value) {
      // 🔴 Favoriden kaldır
      const res = await $fetch('/api/supabase/favorites', {
        method: 'DELETE',
        body: { product_id: product.value.id }
      })
      if (res.error) throw new Error(res.message)
      favorite.value = false
      showSnackbar('Favorilerden kaldırıldı', 'error')
    } else {
      // 🟢 Favoriye ekle
      const res = await $fetch('/api/supabase/favorites', {
        method: 'POST',
        body: { product_id: product.value.id }
      })
      if (res.status === 401) {
        showSnackbar('Favorilere eklemek için giriş yapmalısınız.', 'error')
        return
      }
      if (res.error) throw new Error(res.message)
      favorite.value = true
      showSnackbar('Favorilere eklendi')
    }
  } catch (err: any) {
    console.error('Favori hatası:', err)
    showSnackbar('İşlem yapılamadı.', 'error')
  }
}

// 🛒 Sepete ekle
async function addToCart() {
  if (!product.value) return
  addingToCart.value = true
  try {
    const res = await $fetch('/api/supabase/cart', {
      method: 'POST',
      body: { product_id: product.value.id, quantity: 1 }
    })

    if (res.error) {
      showSnackbar('Sepete eklenemedi: ' + res.message, 'error')
    } else {
      showSnackbar(`🛍️ ${product.value.name} sepete eklendi!`)
    }
  } catch (err: any) {
    console.error(err)
    showSnackbar('Sepete eklenirken bir hata oluştu.', 'error')
  } finally {
    addingToCart.value = false
  }
}

const ratingStars = computed(() => {
  if (!product.value) return []
  const full = Math.floor(product.value.rating)
  const half = product.value.rating - full >= 0.5 ? 1 : 0
  const empty = 5 - full - half
  return [...Array(full).fill('full'), ...Array(half).fill('half'), ...Array(empty).fill('empty')]
})

onMounted(() => fetchProduct())
</script>

<template>
  <v-container class="tw-mt-36">
    <v-row v-if="pending" class="tw-justify-center">
      <v-skeleton-loader type="card" height="500px" width="100%" />
    </v-row>

    <v-row v-else class="tw-gap-8">
      <!-- Ürün Görseli ve Bilgileri Flex -->
      <div class="tw-w-full md:tw-flex md:tw-gap-8">
        <!-- Solda Görsel -->
        <div class="md:tw-w-1/2">
          <v-img
              :src="product?.image || imagePlaceholder"
              height="400"
              cover
              class="tw-rounded-xl tw-shadow-lg"
          />
        </div>

        <!-- Sağda Bilgiler -->
        <div class="md:tw-w-1/2 tw-flex tw-flex-col tw-gap-6 tw-mt-6 md:tw-mt-0">
          <h1 class="tw-text-3xl md:tw-text-4xl tw-font-bold tw-text-white">
            {{ product?.name }}
          </h1>
          <v-chip color="orange" class="tw-text-black mr-auto">{{ product?.category_name || 'Kategori Yok' }}</v-chip>
          <div class="tw-flex tw-items-center tw-gap-4">
            <span class="tw-text-2xl tw-font-bold tw-text-orange-400">{{ product?.price }}₺</span>
          </div>

          <div class="tw-flex tw-items-center tw-gap-1">
            <template v-for="(star, index) in ratingStars" :key="index">
              <v-icon v-if="star === 'full'" color="yellow darken-2">mdi-star</v-icon>
              <v-icon v-else-if="star === 'half'" color="yellow darken-2">mdi-star-half-full</v-icon>
              <v-icon v-else color="yellow darken-2">mdi-star-outline</v-icon>
            </template>
            <span class="tw-text-gray-400 tw-text-sm">({{ product?.rate_count || 0 }})</span>
          </div>

          <p class="tw-text-gray-300 tw-leading-relaxed tw-text-base">
            {{ product?.description || 'Bu ürün için açıklama bulunmamaktadır.' }}
          </p>

          <div class="tw-flex tw-gap-4 tw-mt-4">
            <v-btn
                color="orange"
                class="tw-font-semibold tw-flex-1"
                @click="addToCart"
                :loading="addingToCart"
                :disabled="addingToCart"
            >
              <v-icon left>mdi-cart-plus</v-icon>
              {{ addingToCart ? 'Ekleniyor...' : 'Sepete Ekle' }}
            </v-btn>

            <v-btn :color="favorite ? 'red' : 'grey darken-1'"
                   :variant="favorite ? 'flat' : 'outlined'"
                   class="tw-font-semibold tw-flex-1"
                   @click="toggleFavorite"
            >
              <v-icon left class="mr-2">mdi-heart</v-icon>
              {{ favorite ? 'FAVORİLERDE':'FAVORİLERE EKLE' }}
            </v-btn>
          </div>
        </div>
      </div>

      <!-- Aynı kategorideki diğer ürünler -->
      <div v-if="relatedProducts.length" class="tw-mt-12 tw-w-full">
        <h2 class="tw-text-xl tw-font-bold tw-text-orange-400 tw-mb-4">Benzer Ürünler</h2>
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
              v-for="item in relatedProducts"
              :key="item.id"
              cols="6"
              md="4"
              lg="2"
          >
            <v-card
                class="tw-h-full tw-relative tw-overflow-hidden tw-bg-zinc-900 tw-transition tw-duration-200 hover:tw-scale-[1.02] hover:tw-shadow-lg"
                :to="`/products/${item.id}`"
                color="black"
            >
              <v-img
                  :src="item.image || image1"
                  height="220"
                  cover
                  class="tw-rounded-b-none"
              />

              <div class="tw-px-2 tw-py-3 tw-text-white tw-flex tw-flex-col tw-gap-1">
                <div class="tw-font-semibold tw-text-sm tw-truncate">
                  {{ item.name }}
                </div>
                <div class="tw-flex tw-items-center tw-justify-between">
              <span class="tw-text-orange-400 tw-font-bold">
                {{ item.price }}₺
              </span>
                  <span class="tw-text-gray-400 tw-text-xs">
                ⭐ {{ item.rating }} ({{ item.rate_count || 0 }})
              </span>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-row>
    <div
        class="tw-fixed tw-bottom-4 tw-right-4 tw-bg-black/80 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-text-sm tw-flex tw-items-center tw-gap-2 tw-z-50"
    >
      <v-icon color="red" small>mdi-alert-circle</v-icon>
      <p class="tw-m-0">Bütün ürünler örnektir, yapım aşamasında örnek olarak kullanılmaktadır...</p>
    </div>

    <v-snackbar
        v-model="snackbar"
        :color="snackbarColor"
        timeout="2000"
        location="bottom right"
        multi-line
        rounded="lg"
    >
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<style scoped>
h1 {
  word-break: break-word;
}
</style>
