<template>
  <v-app>
    <v-layout>
      <!-- Navbar -->
      <Navbar />

      <!-- Ana içerik -->
      <v-main class="tw-bg-black tw-min-h-screen tw-text-white tw-mt-[-64px]">
        <slot />
      </v-main>

    </v-layout>
  </v-app>
</template>

<script setup lang="ts">
import Navbar from '~/layouts/Navbar.vue'
</script>
