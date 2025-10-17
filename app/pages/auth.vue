<script setup lang="ts">
import { ref } from 'vue'
const supabase = useSupabaseClient()
const loginLoading = ref(false)
const registerLoading = ref(false)
const tab = ref<'login' | 'register'>('login')

const loginEmail = ref('')
const loginPassword = ref('')
const registerEmail = ref('')
const registerPassword = ref('')
const registerName = ref('')
const registerUserName = ref('')

const message = ref('')
const messageType = ref<'success' | 'error'>('success')

const handleLogin = async () => {
  loginLoading.value = true
  const { error } = await supabase.auth.signInWithPassword({
    email: loginEmail.value,
    password: loginPassword.value,
  })
  if (error) {
    message.value = error.message
    messageType.value = 'error'
  } else {
    message.value = 'Hoş geldiniz! Yönlendiriliyorsunuz...'
    messageType.value = 'success'
    setTimeout(() => navigateTo('/'), 1000)
    loginLoading.value = false
  }
}

const handleRegister = async () => {
  registerLoading.value = true
  // const { data: existingUsername } = await supabase
  //     .from('profiles')
  //     .select('id')
  //     .eq('username', registerUserName.value)
  //     .maybeSingle()
  //
  // if (existingUsername) {
  //   message.value = 'Bu kullanıcı adı zaten alınmış.'
  //   messageType.value = 'error'
  //   registerLoading.value = false
  //   return
  // }
  //
  // const { data: existingEmail } = await supabase
  //     .from('profiles')
  //     .select('id')
  //     .eq('email', registerEmail.value)
  //     .maybeSingle()
  //
  // if (existingEmail) {
  //   message.value = 'Bu e-posta zaten kayıtlı.'
  //   messageType.value = 'error'
  //   registerLoading.value = false
  //   return
  // }

  const { error } = await supabase.auth.signUp({
    email: registerEmail.value,
    password: registerPassword.value,
    options: {
      data: {
        full_name: registerName.value,
        username: registerUserName.value,
      }
    }
  })

  if (error) {
    message.value = error.message
    messageType.value = 'error'
    registerLoading.value = false
    return
  } else {
    message.value = 'Kayıt başarılı! E-postanızı doğrulayın.'
    messageType.value = 'success'
    tab.value = 'login'
    registerEmail.value = ''
    registerPassword.value = ''
    registerName.value = ''
    registerUserName.value = ''
    registerLoading.value = false
  }
}

const loginWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
  if (error) {
    message.value = error.message
    messageType.value = 'error'
  }
}
</script>

<template>
  <div class="auth-bg d-flex align-center justify-center">
    <v-card width="420" class="pa-6 text-center glass-card" elevation="10">
      <h2 class="text-h5 font-weight-bold mb-4 neon-text">OKANİME</h2>

      <v-tabs v-model="tab" grow class="neon-tabs">
        <v-tab value="login">Giriş Yap</v-tab>
        <v-tab value="register">Kayıt Ol</v-tab>
      </v-tabs>

      <v-window v-model="tab" class="mt-4">
        <v-window-item value="login">
          <v-form @submit.prevent="handleLogin" class="fade-in">
            <v-text-field
                v-model="loginEmail"
                label="E-posta"
                type="email"
                variant="outlined"
                color="purple-accent-2"
                prepend-inner-icon="mdi-email-outline"
                required
                class="mt-4"
            />
            <v-text-field
                v-model="loginPassword"
                label="Şifre"
                type="password"
                variant="outlined"
                color="purple-accent-2"
                prepend-inner-icon="mdi-lock-outline"
                required
            />
            <v-btn
                type="submit"
                :loading="loginLoading"
                block
                color="deep-purple-accent-2"
                class="mt-4 text-white"
            >
              Giriş Yap
            </v-btn>
          </v-form>

          <v-divider class="my-4" />
          <p class="text-caption mb-2">veya</p>

          <v-btn
              color="red-darken-1"
              class="mb-2 text-white"
              prepend-icon="mdi-google"
              block
              @click="loginWithGoogle"
          >
            Google ile Giriş Yap
          </v-btn>
        </v-window-item>

        <v-window-item value="register">
          <v-form @submit.prevent="handleRegister" class="fade-in">
            <v-text-field
                v-model="registerName"
                label="Adı Soyadı"
                variant="outlined"
                color="purple-accent-2"
                prepend-inner-icon="mdi-account-outline"
                required
                class="mt-4"
            />
            <v-text-field
                v-model="registerUserName"
                label="Kullanıcı Adı"
                variant="outlined"
                color="purple-accent-2"
                prepend-inner-icon="mdi-account-outline"
                required
                class="mt-4"
            />
            <v-text-field
                v-model="registerEmail"
                label="E-posta"
                type="email"
                variant="outlined"
                color="purple-accent-2"
                prepend-inner-icon="mdi-email-outline"
                required
            />
            <v-text-field
                v-model="registerPassword"
                label="Şifre"
                type="password"
                variant="outlined"
                color="purple-accent-2"
                prepend-inner-icon="mdi-lock-outline"
                required
            />
            <v-btn type="submit" :loading="registerLoading" block color="pink-accent-3" class="mt-4 text-white">
              Kayıt Ol
            </v-btn>
          </v-form>
        </v-window-item>
      </v-window>

      <v-alert
          v-if="message"
          :type="messageType"
          class="mt-4 text-white"
          variant="tonal"
      >
        {{ message }}
      </v-alert>

      <div class="mt-6 text-grey text-caption">
        © 2025 OKANİME. Tüm hakları saklıdır.
      </div>
    </v-card>
  </div>
</template>

<style scoped>
.auth-bg {
  background: radial-gradient(circle at 20% 20%, #2b1055, #000000 90%);
  position: relative;
  height: 100vh;
  overflow: hidden;
}
.auth-bg::before {
  content: "";
  position: absolute;
  background: url('https://images.unsplash.com/photo-1607083209264-ef97e3d6ad5e?auto=format&fit=crop&w=1470&q=80') center/cover;
  opacity: 0.25;
  inset: 0;
  z-index: 0;
}
.glass-card {
  background: rgba(25, 25, 35, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  z-index: 2;
  color: #fff;
}
.neon-text {
  color: #ff77ff;
  text-shadow: 0 0 10px #ff77ff, 0 0 20px #ff77ff;
  letter-spacing: 1px;
}
.neon-tabs {
  color: #fff;
  text-shadow: 0 0 5px #ffbdfc;
}
.fade-in {
  animation: fadeIn 0.6s ease-in;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
