<template>
  <v-app>
    <v-layout>
      <Navbar :theme="theme" />
      <v-main class="tw-bg-black tw-min-h-screen tw-text-white tw-mt-[-64px]">
        <slot />
      </v-main>

    </v-layout>
  </v-app>
</template>

<script setup lang="ts">
import { useTheme } from "vuetify";
import Navbar from '~/layouts/Navbar.vue'
const theme = useTheme();
</script>
