<template>
  <v-app-bar flat absolute class="transparent-bar" height="64">
    <v-container class="d-flex align-center tw-text-white">
      <v-app-bar-title>OKANMİME</v-app-bar-title>
      <v-spacer />
      <template v-if="!xs">
        <v-btn v-for="link in navLinks" :key="link.text" text :to="link.to">
          {{ link.text }}
        </v-btn>

        <template v-if="!user">
          <v-btn text @click="login">Giriş Yap</v-btn>
          <v-btn text @click="register">Kayıt Ol</v-btn>
          <v-btn @click="theme.toggle()" text="Dark Mod"><v-icon :icon="mdiMenu"/></v-btn>
        </template>

        <template v-else>
          <v-menu v-model="userMenu" offset-y>
            <template #activator="{ props }">
              <v-btn v-bind="props" text>
                <v-avatar size="32" class="mr-2">
                  <img :src="user.avatar" alt="avatar" />
                </v-avatar>
                {{ user.name }}
              </v-btn>
            </template>
            <div>
            </div>
            <v-list>
              <v-list-item :to="'/profile'"><v-list-item-title>Profilim</v-list-item-title></v-list-item>
              <v-list-item :to="'/my-list'"><v-list-item-title>Listem</v-list-item-title></v-list-item>
              <v-list-item :to="'/cart'"><v-list-item-title>Sepetim</v-list-item-title></v-list-item>
              <v-list-item @click="logout"><v-list-item-title>Çıkış Yap</v-list-item-title></v-list-item>
            </v-list>
          </v-menu>
          <v-btn @click="theme.toggle()" text="Dark Mod"><v-icon :icon="mdiThemeLightDark"/></v-btn>

        </template>
      </template>

      <template v-if="xs">
        <v-btn icon @click="drawer = true">
          <v-icon icon="mdi-menu" />
        </v-btn>
      </template>
    </v-container>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" right temporary>
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
        <v-list-item @click="login"><v-list-item-title>Giriş Yap</v-list-item-title></v-list-item>
        <v-list-item @click="register"><v-list-item-title>Kayıt Ol</v-list-item-title></v-list-item>
        <v-list-item>
          <v-btn @click="theme.toggle()" text="Dark Mod"><v-icon :icon="mdiThemeLightDark"/></v-btn>
        </v-list-item>
      </template>

      <template v-else>
        <v-list-item>
          <v-menu v-model="profileMenu" offset-y>
            <template #activator="{ props }">
              <v-btn v-bind="props" text block>
                <v-avatar size="32" class="mr-2">
                  <img :src="user.avatar" alt="avatar" />
                </v-avatar>
                {{ user.name }}
              </v-btn>
            </template>

            <v-list>
              <v-list-item :to="'/profile'" @click="profileMenu = false; drawer = false">
                <v-list-item-title>Profilim</v-list-item-title>
              </v-list-item>
              <v-list-item :to="'/my-list'" @click="profileMenu = false; drawer = false">
                <v-list-item-title>Listem</v-list-item-title>
              </v-list-item>
              <v-list-item :to="'/cart'" @click="profileMenu = false; drawer = false">
                <v-list-item-title>Sepetim</v-list-item-title>
              </v-list-item>
              <v-list-item @click="logout">
                <v-list-item-title>Çıkış Yap</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn @click="theme.toggle()" text="Dark Mod"><v-icon :icon="mdiThemeLightDark"/></v-btn>
        </v-list-item>

      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import { useTheme } from 'vuetify'
import {mdiMenu, mdiThemeLightDark} from '@mdi/js';

const theme = useTheme()
const { xs } = useDisplay()

const userMenu = ref(false)
const drawer = ref(false)
const profileMenu = ref(false)

const user = ref<{ name: string; avatar: string } | null>({ name: 'Okan', avatar: 'https://i.pravatar.cc/150?img=3' })

const navLinks = [
  { text: 'Anasayfa', to: '/' },
  { text: 'Animeler', to: '/animes' },
  { text: 'Ürünler', to: '/products' },
  { text: 'Forum', to: '/forum' },
]

const logout = () => { user.value = null; drawer.value = false; profileMenu.value = false }
const login = () => { user.value = { name: 'Okan', avatar: 'https://i.pravatar.cc/150?img=3' } }
const register = () => alert('Kayıt ol tıklandı')
</script>

<style scoped>
.v-btn {
  text-transform: none;
}
.v-main {
  padding: 0 !important;
  margin: 0 !important;
}

.pages-container {
  padding: 0 !important;
  margin: 0 !important;
}
.transparent-bar {
  background-color: rgba(0, 0, 0, 0.3) !important;
  backdrop-filter: blur(10px);
  box-shadow: none !important;
}
</style>
