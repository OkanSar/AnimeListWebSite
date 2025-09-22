// server/api/anime/page.ts
export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const config = useRuntimeConfig()
    const clientId = config.malClientId

    const page = Number(query.page || 1)
    const search = String(query.q || "Solo")
    const limit = 50
    const offset = (page - 1) * limit

    const url = `https://api.myanimelist.net/v2/anime?q=${encodeURIComponent(search)}&limit=${limit}&offset=${offset}&fields=id,title,mean,num_scoring_users,num_episodes,genres`

    try {
        const response: any = await $fetch(url, {
            headers: { "X-MAL-CLIENT-ID": clientId }
        })

        return {
            data: response.data.map((item: any) => item.node),
            total: response.paging?.total || 1000,
            page,
            limit
        }
    } catch (err: any) {
        console.error("MAL API ERROR:", err)
        throw createError({ statusCode: 500, statusMessage: err.message || "Anime listesi alınamadı" })
    }
})
