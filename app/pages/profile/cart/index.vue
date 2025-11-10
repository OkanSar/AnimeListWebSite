<script setup lang="ts">
import { useRouter } from 'vue-router'
import imagePlaceholder from '~/assets/images/the-fragant-flower-blooms.jpg'

const router = useRouter()
const pending = ref(false)
const showAlert = ref(false)
const alertMessage = ref('')

const cart = ref<any>(null)
const items = ref<any[]>([])

async function fetchCart() {
  try {
    pending.value = true
    const res: any = await $fetch('/api/supabase/cart')
    if (!res.error && res.cart) {
      cart.value = res.cart
      items.value = res.items || []
    } else {
      cart.value = null
      items.value = []
      showMessage(res.message)
    }
  } catch (err: any) {
    console.error(err)
    showMessage('Sepet getirilemedi.')
  } finally {
    pending.value = false
  }
}

onMounted(() => fetchCart())

function showMessage(msg: string) {
  alertMessage.value = msg
  showAlert.value = true
  setTimeout(() => (showAlert.value = false), 2000)
}

const totalPrice = computed(() =>
    items.value.reduce(
        (sum, item) => sum + (item.products?.price || 0) * item.quantity,
        0
    )
)

async function increment(item: any) {
  await $fetch('/api/supabase/cart', {
    method: 'PUT',
    body: { product_id: item.product_id, quantity: item.quantity + 1 }
  })
  item.quantity += 1 // anlık güncelle
}

async function decrement(item: any) {
  if (item.quantity <= 1) {
    await removeItem(item)
    return
  }
  await $fetch('/api/supabase/cart', {
    method: 'PUT',
    body: { product_id: item.product_id, quantity: item.quantity - 1 }
  })
  item.quantity -= 1
}

async function removeItem(item: any) {
  await $fetch(`/api/supabase/cart?product_id=${item.product_id}`, {
    method: 'DELETE'
  })
  items.value = items.value.filter(i => i.id !== item.id)
}

function checkout() {
  showMessage('Sipariş tamamlanıyor...')
  // Ödeme veya sipariş tamamlama logic’i buraya
}
</script>

<template>
  <v-container class="tw-mt-20 tw-max-w-6xl mx-auto">
    <h1 class="tw-text-3xl tw-font-bold tw-text-orange-400">Sepetim</h1>
    <v-divider color="warning" class="tw-mb-6 mt-2" />

    <!-- Loading -->
    <div v-if="pending" class="tw-space-y-4">
      <v-skeleton-loader type="list-item" class="tw-h-24" v-for="n in 3" :key="n"/>
    </div>

    <!-- Boş sepet -->
    <!-- Boş sepet -->
    <div v-else-if="!items.length" class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-4 tw-mt-20">
      <!-- Büyük sepet ikonu -->
      <v-icon size="96" color="gray" outlined>mdi-cart-outline</v-icon>

      <!-- Mesaj -->
      <div class="tw-text-center tw-text-gray-400 tw-text-lg">
        Sepetinizde ürün yok.
      </div>

      <!-- Ürünlere göz at butonu -->
      <v-btn
          color="orange"
          class="tw-w-64 tw-mt-4"
          variant="outlined"
          @click="$router.push('/products')"
      >
        Hemen ürünlere göz at
      </v-btn>
    </div>

    <!-- Ürünler -->
    <div v-else>
      <!-- Mobil: Satır satır -->
      <div class="tw-flex tw-flex-col md:tw-hidden tw-space-y-4">
        <div v-for="item in items" :key="item.id" class="tw-flex tw-bg-black tw-rounded-lg tw-p-4 tw-items-center tw-gap-4 hover:tw-shadow-lg tw-transition">
          <v-img
              :src="item.products?.image || imagePlaceholder"
              height="150"
              width="20"
              cover
              class="tw-rounded"
          />
          <div class="tw-flex-1 tw-flex tw-flex-col tw-justify-between">
            <div>
              <div class="tw-text-white tw-font-semibold tw-text-sm truncate">{{ item.products?.name }}</div>
              <div class="tw-text-gray-400 tw-mt-1">{{ item.products?.price }}₺</div>
            </div>
            <div class="tw-flex tw-items-center tw-justify-between tw-mt-2">
              <div class="tw-flex tw-items-center tw-gap-2">
                <v-btn size="x-small" icon variant="outlined" color="orange" @click="decrement(item)">
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
                <span class="tw-text-white">{{ item.quantity }}</span>
                <v-btn size="x-small" icon variant="outlined" color="orange" @click="increment(item)">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>
              <v-btn size="x-small" icon color="red" @click="removeItem(item)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
        <v-divider />
      </div>

      <!-- Tablet/PC: 3 sütunlu kart -->
      <div class="tw-hidden md:tw-grid md:tw-grid-cols-3 md:tw-gap-6">
        <div v-for="item in items" :key="item.id" class="tw-bg-black tw-rounded-lg tw-overflow-hidden hover:tw-shadow-lg tw-transition">
          <v-img
              :src="item.products?.image || imagePlaceholder"
              height="200"
              cover
          />
          <div class="tw-p-4 tw-flex tw-flex-col tw-gap-2">
            <div class="tw-font-semibold tw-text-white tw-text-lg truncate">{{ item.products?.name }}</div>
            <div class="tw-text-orange-400 tw-font-bold">{{ item.products?.price }}₺</div>
            <div class="tw-flex tw-items-center tw-justify-between">
              <div class="tw-flex tw-items-center tw-gap-2">
                <v-btn size="x-small" icon color="orange" @click="decrement(item)">
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
                <span class="tw-text-white">{{ item.quantity }}</span>
                <v-btn size="x-small" icon color="orange" @click="increment(item)">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>
              <v-btn size="x-small" icon color="red" @click="removeItem(item)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </div>
          <v-divider />
        </div>
      </div>
    </div>

    <!-- Sepet toplam ve checkout -->
    <div v-if="items.length" class="tw-mt-6 tw-flex tw-justify-end">
      <v-card color="black" class="tw-p-4  tw-w-full md:tw-w-1/3 tw-rounded-lg">
        <div class="tw-flex tw-justify-between tw-mb-4">
          <span class="tw-text-gray-400">Toplam</span>
          <span class="tw-text-white tw-font-bold">{{ totalPrice }}₺</span>
        </div>
        <v-btn color="orange" class="tw-w-full" @click="checkout">Siparişi Tamamla</v-btn>
      </v-card>
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
  </v-container>
</template>

<style scoped>
.v-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
</style>
