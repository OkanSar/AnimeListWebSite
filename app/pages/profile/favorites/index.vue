<script setup lang="ts">
import imagePlaceholder from '~/assets/images/the-fragant-flower-blooms.jpg'

const favorites = ref<any[]>([])
const pending = ref(true)
const showAlert = ref(false)
const alertMessage = ref('')
const confirmDialog = ref(false)
const selectedItem = ref<any>(null)

function askRemoveFavorite(item: any) {
  selectedItem.value = item
  confirmDialog.value = true
}

async function confirmRemove() {
  if (!selectedItem.value) return
  await removeFavorite(selectedItem.value)
  confirmDialog.value = false
  selectedItem.value = null
}

async function fetchFavorites() {
  try {
    pending.value = true
    const res = await $fetch('/api/supabase/favorites')
    if (!res.error) favorites.value = res.favorites || []
  } catch (err) {
    console.error(err)
    showMessage('Favoriler yüklenemedi')
  } finally {
    pending.value = false
  }
}

async function removeFavorite(item: any) {
  try {
    const productId = item.product_id || item.products?.id

    const res = await $fetch(`/api/supabase/favorites?product_id=${productId}`, {
      method: 'DELETE'
    })

    if (res.error) throw new Error(res.message)

    // 🟢 Sayfa yenilemeden listeden çıkar
    favorites.value = favorites.value.filter(f => {
      const currentId = f.product_id || f.products?.id
      const removedId = item.product_id || item.products?.id
      return currentId !== removedId
    })

    showMessage('Favorilerden çıkarıldı')
  } catch (err: any) {
    console.error(err)
    showMessage('Favoriden çıkarılamadı')
  }
}

function showMessage(msg: string) {
  alertMessage.value = msg
  showAlert.value = true
  setTimeout(() => (showAlert.value = false), 2000)
}

onMounted(() => fetchFavorites())
</script>

<template>
  <v-container class="tw-mt-24 tw-max-w-6xl mx-auto">
    <h1 class="tw-text-3xl tw-font-bold tw-text-orange-400">Favorilerim</h1>
    <v-divider color="warning" class="tw-mb-6 mt-2" />

    <!-- Loading -->
    <div v-if="pending" class="tw-space-y-4">
      <v-skeleton-loader color="black" type="list-item" class="tw-h-24" v-for="n in 3" :key="n"/>
    </div>

    <!-- Boş Favoriler -->
    <div v-else-if="!favorites.length" class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-4 tw-mt-20">
      <v-icon size="96" color="gray" outlined>mdi-heart-outline</v-icon>
      <div class="tw-text-center tw-text-gray-400 tw-text-lg">
        Henüz favorilere ürün eklemediniz.
      </div>
      <v-btn
          color="orange"
          class="tw-w-64 tw-mt-4"
          variant="outlined"
          @click="$router.push('/products')"
      >
        Ürünlere Göz At
      </v-btn>
    </div>

    <!-- Ürünler -->
    <div v-else>
      <!-- Mobil görünüm -->
      <div class="tw-flex tw-flex-col md:tw-hidden tw-space-y-4">
        <div
            v-for="fav in favorites"
            :key="fav.id"
            class="tw-flex tw-bg-black tw-rounded-lg tw-p-4 tw-items-center tw-gap-4 hover:tw-shadow-lg tw-transition"
        >
          <v-img
              :src="fav.products?.image || imagePlaceholder"
              height="120"
              width="120"
              cover
              class="tw-rounded"
          />
          <div class="tw-flex-1 tw-flex tw-flex-col tw-justify-between">
            <div>
              <div class="tw-text-white tw-font-semibold tw-text-sm tw-break-words">
                {{ fav.products?.name }}
              </div>
              <div class="tw-text-orange-400 tw-mt-1 tw-font-bold">{{ fav.products?.price }}₺</div>
            </div>
            <div class="tw-flex tw-justify-between tw-items-center tw-mt-2">
              <v-btn size="x-small" icon color="red" @click="askRemoveFavorite(fav)">
                <v-icon>mdi-heart-off</v-icon>
              </v-btn>
              <v-btn size="x-small" icon color="orange" :to="`/products/${fav.products?.id}`">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
      </div>

      <!-- Tablet / PC görünümü -->
      <div class="tw-hidden md:tw-grid md:tw-grid-cols-3 md:tw-gap-6">
        <div
            v-for="fav in favorites"
            :key="fav.id"
            class="tw-bg-black tw-rounded-lg tw-overflow-hidden hover:tw-shadow-lg tw-transition"
        >
          <v-img
              :src="fav.products?.image || imagePlaceholder"
              height="200"
              cover
          />
          <div class="tw-p-4 tw-flex tw-flex-col tw-gap-2">
            <div class="tw-font-semibold tw-text-white tw-text-lg tw-break-words">
              {{ fav.products?.name }}
            </div>
            <div class="tw-text-orange-400 tw-font-bold">{{ fav.products?.price }}₺</div>
            <div class="tw-flex tw-justify-between tw-items-center">
              <v-btn size="x-small" icon color="red" @click="askRemoveFavorite(fav)">
                <v-icon>mdi-heart-off</v-icon>
              </v-btn>
              <v-btn size="x-small" icon color="orange" :to="`/products/${fav.products?.id}`">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
            </div>
          </div>
          <v-divider />
        </div>
      </div>
    </div>

    <!-- Uyarı -->
    <v-alert
        v-if="showAlert"
        type="success"
        variant="flat"
        style="position: fixed; bottom: 16px; right: 16px; z-index: 9999;"
    >
      {{ alertMessage }}
    </v-alert>
    <v-dialog v-model="confirmDialog" max-width="400">
      <v-card class="tw-bg-zinc-900 tw-text-white">
        <v-card-title class="tw-text-lg tw-font-semibold">Favorilerden çıkarılsın mı?</v-card-title>
        <v-card-text>
          <p>{{ selectedItem?.products?.name }} adlı ürünü favorilerden kaldırmak istediğinize emin misiniz?</p>
        </v-card-text>
        <v-card-actions class="tw-justify-end">
          <v-btn variant="text" color="gray" @click="confirmDialog = false">Vazgeç</v-btn>
          <v-btn color="red" variant="flat" @click="confirmRemove">Evet, Kaldır</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<style scoped>
.v-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
</style>
