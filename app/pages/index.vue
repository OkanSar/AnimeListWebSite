<script setup lang="ts">
import slide1 from '~/assets/images/demon-slayer-infinity-castle.jpg'
import slide2 from '~/assets/images/my-dress-up-darling.jpg'
import slide3 from '~/assets/images/the-fragant-flower-blooms.jpg'
import slide4 from '~/assets/images/jujutsu-kaisen.jpg'
import slide5 from '~/assets/images/tokyo-ghoul.jpg'
import OSuggestionAnimes from "~/components/OSuggestionAnimes.vue";

const poppulerAnimes = ref<any[]>([])
const suggestedAnimes = ref<any[]>([])
const pending = ref(true)
const slides = [
  {
    img: slide1,
    title: 'Demon Slayer - Infinity Castle',
    description: 'Tanjiro ve arkadaşları, Muzan’la yüzleşmek için ölümcül bir savaşın içine girer. Bu bölüm, aksiyon ve dramatik sahneleriyle izleyiciyi ekran başına kilitler.'
  },
  {
    img: slide2,
    title: 'My Dress-Up Darling',
    description: 'Marin, kostüm hobisi olan Gojo ile tanışır ve birlikte cosplay dünyasında eğlenceli bir yolculuğa çıkarlar. Hikaye, arkadaşlık ve romantizmi tatlı bir şekilde harmanlar.'
  },
  {
    img: slide3,
    title: 'The Fragant Flower Blooms',
    description: 'Masalsı ve duygusal bir anlatımla, karakterlerin aşk ve hayat yolculukları işlenir. Estetik görseller ve derin karakter gelişimi ön plandadır.'
  },
  {
    img: slide4,
    title: 'Jujutsu Kaisen',
    description: 'Genç büyücü Itadori, lanetlerle dolu bir dünyada arkadaşlarıyla birlikte savaşır. Anime, aksiyon sahneleri ve doğaüstü güçleriyle dikkat çeker.'
  },
  {
    img: slide5,
    title: 'Tokyo Ghoul',
    description: 'Kaneki, insan ve ghoul dünyası arasında sıkışıp kalır ve kimliğini bulmaya çalışır. Karanlık atmosfer ve psikolojik gerilim, diziyi öne çıkarır.'
  },
]

const loadPage = async () => {
  try {
    const res = await $fetch('/api/anime/ranking')
    const sug = await $fetch('/api/anime/suggested')
    poppulerAnimes.value = res.data || []
    suggestedAnimes.value = sug.data || []
  } catch (err) {
    console.error('Ranking API error:', err)
  } finally {
    pending.value = false
  }
}
onMounted(() => {
  loadPage()
})
</script>

<template>
  <o-hero-slider :slides="slides" :pending="pending" />
  <o-most-populer-animes :anime="poppulerAnimes" :pending="pending" />
  <o-new-upcoming-animes />
  <o-suggestion-animes :suggest="suggestedAnimes" :pending="pending" />
  <o-more-upcoming-animes />
</template>

