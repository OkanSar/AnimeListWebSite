<script setup lang="ts">
interface Slide {
  img: string
  title: string
  description: string
}

const props = defineProps<{
  slides: Slide[],
  pending: boolean
}>()
</script>

<template>
  <v-skeleton-loader v-if="props.pending" color="black" type="paragraph" class="carousel-sheet" />

    <v-carousel
        v-else
        class="full-screen-carousel tw-min-h-[700px]"
        height="700"
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
  height: 700px; /* mobil varsayılan */
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

@media (min-width: 1024px) {
  .carousel-sheet {
    height: 1000px;
  }
  .overlay-text { max-width: 50%; }
  .title { font-size: 35px; }
  .description { font-size: 20px; }
}

@media (max-width: 1024px) {
  .overlay-text { max-width: 60%; }
  .title { font-size: 28px; }
  .description { font-size: 18px; }
}

@media (max-width: 768px) {
  .overlay-text {
    max-width: 80%;
    margin: 0 0 200px 20px;
    text-align: center;
  }

  .title { font-size: 24px; }
  .description { font-size: 16px; }
}

@media (max-width: 480px) {
  .overlay-text {
    max-width: 90%;
    margin: 0 0 200px 20px;
    text-align: center;
  }

  .title { font-size: 20px; }
  .description { font-size: 14px; }
}

</style>
