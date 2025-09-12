// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'vuetify-nuxt-module'],
  css: ['~/assets/css/tailwind.css'],
  runtimeConfig: {
    malClientId: process.env.MAL_CLIENT_ID,
    public: {
      malClientId: process.env.MAL_CLIENT_ID
    }
  }
})