<script setup lang="ts">
import { defineProps } from 'vue'

interface Slide {
  img: string
  title: string
  description: string
}

const props = defineProps<{
  slides: Slide[]
}>()
</script>

<template>
  <v-carousel
      class="full-screen-carousel"
      height="620"
      show-arrows="hover"
      cycle
      hide-delimiter-background
  >
    <v-carousel-item
        v-for="(slide, i) in props.slides"
        :key="i"
    >
      <v-sheet
          class="carousel-sheet"
          :style="{ backgroundImage: `url(${slide.img})` }"
      >
        <div class="overlay-text">
          <div class="title">{{ slide.title }}</div>
          <div class="description">{{ slide.description }}</div>
        </div>
      </v-sheet>
    </v-carousel-item>
  </v-carousel>
</template>

<style scoped>
.full-screen-carousel {
  width: 100vw;
}

.carousel-sheet {
  height: 700px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-size: cover;
  background-position: center;
  position: relative;
  padding: 0 5%;
  object-fit: fill;
}

.overlay-text {
  color: white;
  text-shadow: 1px 1px 2px black;
  max-width: 50%;
  margin-left: 5%;
}

.title {
  font-size: 35px;
  font-weight: bold;
  word-wrap: break-word;
}

.description {
  font-size: 20px;
  margin-top: 8px;
  word-wrap: break-word;
}

@media (max-width: 1024px) {
  .overlay-text { max-width: 60%; }
  .title { font-size: 28px; }
  .description { font-size: 18px; }
}

@media (max-width: 768px) {
  .overlay-text { max-width: 80%; }
  .title { font-size: 24px; }
  .description { font-size: 16px; }
}

@media (max-width: 480px) {
  .carousel-sheet {
    background-repeat: no-repeat;
    background-position: center;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 10px 5%;
  }

  .overlay-text {
    max-width: 90%;
    margin: 10px 0 0 0;
    text-align: center;
  }

  .title { font-size: 20px; }
  .description { font-size: 14px; }
}
</style>
