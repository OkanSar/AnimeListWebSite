<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSupabaseClient } from '#imports'
import defaultUser from '~/assets/images/default-user-foto.png'
import defaultUser2 from '~/assets/images/default-user-foto-2.png'
import defaultUser3 from '~/assets/images/default-user-foto-3.png'
import defaultUser4 from '~/assets/images/default-user-foto-4.png'
import defaultUser5 from '~/assets/images/default-user-foto-5.png'
import defaultUser6 from '~/assets/images/default-user-foto-6.png'
import defaultUser7 from '~/assets/images/default-user-foto-7.png'

const supabase = useSupabaseClient()

const username = ref('')
const fullName = ref('')
const email = ref('')
const selectedAvatar = ref(defaultUser)

const profileData = ref<any>(null)

const avatarOptions = [
  defaultUser,
  defaultUser2,
  defaultUser3,
  defaultUser4,
  defaultUser5,
  defaultUser6,
  defaultUser7,
]

const userAvatar = computed(() => selectedAvatar.value)
const formFields = ref<{ label: string, model: any }[]>([])

const showAvatarModal = ref(false)
onMounted(async () => {
  try {
    const data = await $fetch('/api/supabase/profile', { credentials: 'include' })
    profileData.value = data.profile

    if (profileData.value) {
      formFields.value = [
        { label: 'Kullanıcı Adı', model: username },
        { label: 'Ad Soyad', model: fullName },
        { label: 'Email', model: email },
      ]

      username.value = profileData.value.username
      fullName.value = profileData.value.full_name
      email.value = profileData.value.email
      selectedAvatar.value = profileData.value.avatar_url || defaultUser
    }
  } catch (err) {
    console.error('Profile fetch error:', err)
  }
})


const saveProfile = async () => {
  try {
    const payload = {
      username: username.value,
      full_name: fullName.value,
      email: email.value,
      avatar_url: selectedAvatar.value
    }

    const res = await $fetch('/api/supabase/profile', {
      method: 'PUT',
      body: payload,
      credentials: 'include'
    })
    if (res?.error) throw new Error(res.error)
    alert('Profil güncellendi ✅')
  } catch (err) {
    console.error(err)
    alert('Profil güncellenirken hata oluştu ❌')
  }
}

const logout = async () => {
  await supabase.auth.signOut()
  navigateTo('/')
}
</script>

<template>
  <v-container class="tw-mt-20">
    <v-card class="pa-6 glass-card ma-auto" max-width="500" mx="auto">

      <v-row justify="center" class="tw-relative mb-6">
        <template v-if="!profileData">
          <v-skeleton-loader type="avatar" class="mx-auto" />
        </template>
        <template v-else>
          <v-avatar size="120" class="border-4 border-pink-400">
            <v-img :src="userAvatar" />
          </v-avatar>
          <v-btn
              icon
              small
              class="tw-absolute tw-top-0 tw-right-1 tw-bg-gray-800/70 hover:tw-bg-pink-500 tw-border tw-border-gray-700"
              @click="showAvatarModal = true"
          >
            <v-icon color="white">mdi-pencil</v-icon>
          </v-btn>
        </template>
      </v-row>

      <!-- Modal -->
      <v-dialog v-model="showAvatarModal" max-width="500">
        <v-card class="tw-bg-gray-900 tw-rounded-xl tw-p-4">
          <h3 class="tw-text-white tw-font-bold tw-mb-4">Avatar Seç</h3>
          <div class="tw-grid tw-grid-cols-4 tw-gap-2">
            <div
                v-for="(avatar, i) in avatarOptions"
                :key="i"
                class="tw-cursor-pointer tw-border-4 tw-rounded-full"
                :class="selectedAvatar === avatar ? 'tw-border-pink-400' : 'tw-border-transparent'"
                @click="selectedAvatar = avatar"
            >
              <v-img :src="avatar" class="tw-w-16 tw-h-16 tw-rounded-full" />
            </div>
          </div>

          <v-card-actions class="tw-justify-end tw-mt-4">
            <v-btn text color="white" @click="showAvatarModal = false">Kapat</v-btn>
            <v-btn color="pink-accent-2" @click="showAvatarModal = false">Seç</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Form alanları alt alta -->
      <v-row class="tw-mb-4" justify="center" dense>
        <v-col cols="12" v-for="(field, i) in formFields" :key="i">
          <template v-if="!profileData">
            <v-skeleton-loader type="text" />
          </template>
          <template v-else>
            <v-text-field v-model="field.model" :label="field.label" outlined dense class="w-full" />
          </template>
        </v-col>
      </v-row>

      <v-divider class="my-4" />

      <v-row justify="center" class="tw-gap-4">
        <template v-if="!profileData">
          <v-skeleton-loader type="button" class="w-1/2" />
          <v-skeleton-loader type="button" class="w-1/2" />
        </template>
        <template v-else>
          <v-btn color="pink-accent-2" @click="saveProfile" class="text-white">
            Profili Kaydet
          </v-btn>
          <v-btn outlined color="white" @click="logout">
            Çıkış Yap
          </v-btn>
        </template>
      </v-row>
    </v-card>
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
.v-avatar {
  transition: all 0.2s ease-in-out;
}
.v-avatar:hover {
  transform: scale(1.1);
  border-color: #ff77ff !important;
}
</style>
