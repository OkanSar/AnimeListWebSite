import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
    try {
        const res: any = await $fetch('https://api.jikan.moe/v4/seasons/upcoming')

        const animes = await Promise.all(res.data.map((anime: any) => ({
            id: anime.mal_id,
            title: anime.title,
            description: anime.synopsis,
            medium_image: anime.images.jpg.image_url,
            trailer: anime.trailer?.embed_url || null,
            aired_from: anime.aired.from
        })))

        return animes
    } catch (error) {
        return { error: 'Anime verileri alınamadı.' }
    }
})
