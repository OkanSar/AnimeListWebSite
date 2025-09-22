export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const clientId = config.malClientId
    const query = getQuery(event)
    const page = Number(query.page || 1)
    const limit = 50
    const offset = (page - 1) * limit

    try {
        const url = `https://api.myanimelist.net/v2/anime/ranking?ranking_type=all&limit=${limit}&offset=${offset}&fields=id,title,mean,num_episodes,genres,num_scoring_users`
        const response: any = await $fetch(url, {
            headers: { "X-MAL-CLIENT-ID": clientId }
        })

        const animeData = response.data.map((item: any) => item.node)

        return {
            data: animeData,
            total: response.paging?.total || 0
        }
    } catch (err: any) {
        console.error("MAL API ERROR:", err)
        throw createError({ statusCode: 500, statusMessage: err.message || "Anime listesi alınamadı" })
    }
})
