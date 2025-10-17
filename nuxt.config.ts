// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'vuetify-nuxt-module',
    '@nuxtjs/supabase'
  ],
  css: ['~/assets/css/tailwind.css'],
  runtimeConfig: {
    supabase:{
      url: process.env.SUPABASE_URL,
      key: process.env.SUPABASE_KEY,
    },
    malClientId: process.env.MAL_CLIENT_ID,
    public: {
      malClientId: process.env.MAL_CLIENT_ID
    }
  },
  app:{
    head:{
      htmlAttrs:{
        lang:'en'
      },
    },
  },
  supabase: {
    redirect: false,
  },
})