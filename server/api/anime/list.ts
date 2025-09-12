// server/api/anime/all.ts
export default defineEventHandler(async () => {
    const config = useRuntimeConfig()
    const clientId = config.malClientId

    let url = `https://api.myanimelist.net/v2/anime?q=&limit=100&fields=id,title,mean,num_episodes,genres`
    let allAnime: any[] = []

    try {
        while (url) {
            const response: any = await $fetch(url, {
                headers: { "X-MAL-CLIENT-ID": clientId }
            })

            // mevcut batch ekle
            allAnime.push(...response.data.map((item: any) => item.node))

            // bir sonraki sayfa varsa devam et
            url = response.paging?.next || null

            // Her istek arasında küçük bekleme
            await new Promise(r => setTimeout(r, 500))
        }

        return allAnime
    } catch (err) {
        console.error(err)
        throw createError({ statusCode: 500, statusMessage: "Anime listesi alınamadı" })
    }
})
