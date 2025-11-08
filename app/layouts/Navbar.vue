<script setup lang="ts">
import { useSupabaseClient, useSupabaseUser } from '#imports'
import { useDisplay } from 'vuetify'
import defaultUser from '~/assets/images/default-user-foto.png'
import defaultUser2 from '~/assets/images/default-user-foto-2.png'
import defaultUser3 from '~/assets/images/default-user-foto-3.png'
import defaultUser4 from '~/assets/images/default-user-foto-4.png'
import defaultUser5 from '~/assets/images/default-user-foto-5.png'
import defaultUser6 from '~/assets/images/default-user-foto-6.png'
import defaultUser7 from '~/assets/images/default-user-foto-7.png'

const { xs } = useDisplay()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const desktopUserMenu = ref(false)
const mobileUserMenu = ref(false)
const userMenu = ref(false)
const drawer = ref(false)

const navLinks = [
  { text: 'Anasayfa', to: '/' },
  { text: 'Animeler', to: '/animes' },
  { text: 'Ürünler', to: '/products' },
  { text: 'Forum', to: '/forum' },
]

const logout = async () => {
  await supabase.auth.signOut()
  drawer.value = false
  userMenu.value = false
  navigateTo('/')
}
const userProfile = ref<any>(null)

onMounted(async ()=> {
  try {
    const profileData = await $fetch('/api/supabase/profile', { credentials: 'include' })
    userProfile.value = profileData.profile
  } catch (err) {
    console.error('Profile fetch error:', err)
  }
})

const userAvatar = computed(() => {
  return userProfile.value?.avatar_url || defaultUser
})

const userName = computed(() => {
  return userProfile.value?.full_name || user.value?.email || 'Kullanıcı'
})
</script>

<template>
  <v-app-bar flat absolute class="transparent-bar" height="64">
    <v-container class="d-flex align-center tw-text-white">
      <v-app-bar-title class="font-weight-bold text-h6 neon-text">OKANİME</v-app-bar-title>
      <v-spacer />

      <!-- Masaüstü görünüm -->
      <template v-if="!xs">
        <v-btn
            v-for="link in navLinks"
            :key="link.text"
            :to="link.to"
            text
            class="text-white"
        >
          {{ link.text }}
        </v-btn>

        <template v-if="!user">
          <v-btn text color="pink-accent-2" @click="navigateTo('/auth')">Giriş Yap</v-btn>
        </template>

        <template v-else>
          <v-menu v-model="desktopUserMenu" offset-y>
            <template #activator="{ props }">
              <v-btn v-bind="props" text>
                <v-avatar size="32" class="mr-2">
                  <v-img :src="userAvatar" alt="Kullanıcı avatarı" cover />
                </v-avatar>
                {{ userName }}
              </v-btn>
            </template>

            <v-list class="transparent-bar">
              <v-list-item to="/profile"><v-list-item-title>Profilim</v-list-item-title></v-list-item>
              <v-list-item to="/profile/my-list"><v-list-item-title>Listem</v-list-item-title></v-list-item>
              <v-list-item to="/cart"><v-list-item-title>Sepetim</v-list-item-title></v-list-item>
              <v-list-item @click="logout"><v-list-item-title>Çıkış Yap</v-list-item-title></v-list-item>
            </v-list>
          </v-menu>
        </template>
      </template>

      <!-- Mobil görünüm -->
      <template v-if="xs">
        <v-btn icon @click="drawer = true">
          <v-icon icon="mdi-menu" />
        </v-btn>
      </template>
    </v-container>
  </v-app-bar>

  <!-- Mobil Drawer -->
  <v-navigation-drawer v-model="drawer" right temporary class="transparent-bar">
    <v-list>
      <v-list-item
          v-for="link in navLinks"
          :key="link.text"
          :to="link.to"
          @click="drawer = false"
      >
        <v-list-item-title>{{ link.text }}</v-list-item-title>
      </v-list-item>

      <v-divider />

      <template v-if="!user">
        <v-list-item>
          <v-btn block color="pink-accent-2" class="text-white" @click="navigateTo('/auth')">
            Giriş Yap
          </v-btn>
        </v-list-item>
      </template>

      <template v-else>
        <v-list-item>
          <v-menu v-model="mobileUserMenu" offset-y>
            <template #activator="{ props }">
              <v-btn v-bind="props" block text class="transparent-bar tw-flex tw-items-center tw-justify-start">
                <v-avatar size="32" class="mr-2 tw-bg-transparent tw-overflow-hidden">
                  <img
                      :src="userAvatar"
                      alt="Kullanıcı avatarı"
                      class="tw-w-full tw-h-full tw-object-contain"
                  />
                </v-avatar>
                <span class="tw-truncate">{{ userName }}</span>
              </v-btn>
            </template>

            <v-list class="transparent-bar">
              <v-list-item to="/profile" @click="drawer = false"><v-list-item-title>Profilim</v-list-item-title></v-list-item>
              <v-list-item to="/profile/my-list" @click="drawer = false"><v-list-item-title>Listem</v-list-item-title></v-list-item>
              <v-list-item to="/cart" @click="drawer = false"><v-list-item-title>Sepetim</v-list-item-title></v-list-item>
              <v-list-item @click="logout"><v-list-item-title>Çıkış Yap</v-list-item-title></v-list-item>
            </v-list>
          </v-menu>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
.transparent-bar {
  background-color: rgba(0, 0, 0, 0.3) !important;
  backdrop-filter: blur(10px);
  box-shadow: none !important;
}
.neon-text {
  color: #ff77ff;
  text-shadow: 0 0 6px #ff77ff, 0 0 12px #ff77ff;
}
.v-btn {
  text-transform: none;
}
</style>
