<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import image1 from '~/assets/images/the-fragant-flower-blooms.jpg'

const pending = ref(false)
const showAlert = ref(false)
const alertMessage = ref('')
const products = ref<any[]>([])
const categories = ref<any[]>([])
const favoriteProductIds = ref(new Set<number>())
const searchQuery = ref('') // 🔍 arama metni

const route = useRoute()
const router = useRouter()
const selectedCategorySlug = ref<string | null>(null)

function slugify(name: string) {
  return name
      .toLowerCase()
      .replaceAll('ı', 'i')
      .replaceAll('ğ', 'g')
      .replaceAll('ü', 'u')
      .replaceAll('ş', 's')
      .replaceAll('ö', 'o')
      .replaceAll('ç', 'c')
      .replace(/\s+/g, '-')
}

async function fetchData() {
  try {
    pending.value = true
    const productRes = await $fetch('/api/supabase/product')
    const categoryRes = await $fetch('/api/supabase/product/category')

    if (productRes.error || categoryRes.error)
      throw new Error(productRes.error || categoryRes.error)

    products.value = productRes.products || []
    categories.value = categoryRes.products || []
  } catch (err: any) {
    console.error('Veri çekme hatası:', err)
    showMessage('Veriler alınamadı: ' + err.message)
  } finally {
    pending.value = false
  }
}

onMounted(() => {
  fetchData()
  if (route.query.category) {
    selectedCategorySlug.value = String(route.query.category)
  }
})

watch(() => route.query.category, (val) => {
  selectedCategorySlug.value = val ? String(val) : null
})

function toggleFavorite(product: any) {
  if (favoriteProductIds.value.has(product.id)) {
    favoriteProductIds.value.delete(product.id)
    showMessage('Favorilerden çıkarıldı')
  } else {
    favoriteProductIds.value.add(product.id)
    showMessage('Favorilere eklendi')
  }
}

async function addToCart(product: any) {
  try {
    showMessage('Sepete ekleniyor...')

    const res = await $fetch('/api/supabase/cart', {
      method: 'POST',
      body: { product_id: product.id, quantity: 1 }
    })

    if (res.error) {
      showMessage('Sepete eklenemedi: ' + res.message)
    } else {
      showMessage(`${product.name} sepete eklendi!`)
    }
  } catch (err: any) {
    console.error(err)
    showMessage('Sepete eklenirken hata oluştu: ' + err.message)
  }
}

function showMessage(msg: string) {
  alertMessage.value = msg
  showAlert.value = true
  setTimeout(() => (showAlert.value = false), 1500)
}

function selectCategory(category: any | null) {
  selectedCategorySlug.value = category ? slugify(category.name) : null
  router.push({
    query: category ? { category: slugify(category.name) } : {},
  })
}

// 🔹 Filtreli ürünler (kategori + arama)
const filteredProducts = computed(() => {
  let list = products.value

  if (selectedCategorySlug.value) {
    const selectedCategory = categories.value.find(
        c => slugify(c.name) === selectedCategorySlug.value
    )
    if (selectedCategory) {
      list = list.filter(p => p.category_id === selectedCategory.id)
    }
  }

  if (searchQuery.value.trim() !== '') {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(p => p.name.toLowerCase().includes(q))
  }

  return list
})
</script>

<template>
  <v-card class="mx-auto mt-10" max-width="1200" color="black">
    <div class="tw-px-4 tw-pt-4">
      <o-search-bar
          v-model="searchQuery"
          :index="1"
          :pending="pending"
          :text="`Aradığınız Ürün...`"
          class="tw-w-full"
      />
    </div>

    <div class="tw-px-4 tw-mt-3 tw-mb-10">
      <div class="tw-flex tw-gap-2 tw-w-full tw-justify-between tw-flex-wrap md:tw-flex-nowrap">
        <div class="tw-flex-1 tw-text-center">
          <v-btn
              variant="outlined"
              color="orange"
              size="small"
              class="tw-w-full tw-text-white tw-border-orange-500 hover:tw-text-black tw-transition"
              :class="{ 'tw-bg-orange-500 tw-text-black': !selectedCategorySlug }"
              @click="selectCategory(null)"
          >
            TÜMÜ
          </v-btn>
        </div>

        <!-- Dinamik Kategoriler -->
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
              :class="{
              'tw-bg-orange-500 tw-text-black': slugify(category.name) === selectedCategorySlug
            }"
              @click="selectCategory(category)"
          >
            {{ category.name }}
          </v-btn>
        </div>
      </div>
    </div>

    <!-- 🔹 Ürünler -->
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
          v-for="product in filteredProducts"
          :key="product.id"
          cols="6"
          md="4"
          lg="2"
      >
        <v-card
            class="tw-h-full tw-relative tw-overflow-hidden tw-bg-zinc-900 tw-transition tw-duration-200 hover:tw-scale-[1.02] hover:tw-shadow-lg"
            :to="`/products/${product.id}`"
            color="black"
        >
          <v-img
              :src="product.image || image1"
              height="220"
              cover
              class="tw-rounded-b-none"
          />

          <div class="tw-absolute tw-top-2 tw-right-2 tw-flex tw-flex-col tw-gap-1 tw-z-10">
            <v-btn
                icon
                size="x-small"
                color="red"
                variant="outlined"
                class="tw-bg-black/60 tw-text-white"
                @click.stop.prevent="toggleFavorite(product)"
            >
              <v-icon>
                {{ favoriteProductIds.has(product.id) ? 'mdi-heart' : 'mdi-heart-outline' }}
              </v-icon>
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

          <div class="tw-px-2 tw-py-3 tw-text-white tw-flex tw-flex-col tw-gap-1">
            <div class="tw-font-semibold tw-text-sm tw-truncate">
              {{ product.name }}
            </div>
            <div class="tw-flex tw-items-center tw-justify-between">
              <span class="tw-text-orange-400 tw-font-bold">
                {{ product.price }}₺
              </span>
              <span class="tw-text-gray-400 tw-text-xs">
                ⭐ {{ product.rating }} ({{ product.rate_count || 0 }})
              </span>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <div
        class="tw-fixed tw-bottom-4 tw-right-4 tw-bg-black/80 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-text-sm tw-flex tw-items-center tw-gap-2 tw-z-50"
    >
      <v-icon color="red" small>mdi-alert-circle</v-icon>
      <p class="tw-m-0">Bütün ürünler örnektir, yapım aşamasında örnek olarak kullanılmaktadır...</p>
    </div>

    <v-alert
        v-if="showAlert"
        type="success"
        variant="flat"
        style="position: fixed; bottom: 16px; right: 16px; z-index: 9999;"
    >
      {{ alertMessage }}
    </v-alert>
  </v-card>
</template>

<style scoped>
.v-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
</style>
