export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const clientId = config.malClientId
    const params = event.context.params as { id?: string } | undefined
    const id = params?.id

    if (!id) throw createError({ statusCode: 400, statusMessage: "Anime ID gerekli" })

    const fields = [
        "id","title","main_picture","alternative_titles","start_date","end_date",
        "synopsis","mean","rank","popularity","num_list_users","num_scoring_users",
        "nsfw","created_at","updated_at","media_type","status","genres","my_list_status",
        "num_episodes","start_season","broadcast","source","average_episode_duration",
        "rating","pictures","background","related_anime","related_manga",
        "recommendations","studios","statistics"
    ].join(",")

    try {
        const url = `https://api.myanimelist.net/v2/anime/${id}?fields=${fields}`
        const response = await $fetch(url, {
            headers: { "X-MAL-CLIENT-ID": clientId }
        })

        if (!response) throw createError({ statusCode: 404, statusMessage: "Anime bulunamadı" })
        return response
    } catch (err: any) {
        console.error("MAL API ERROR:", err)
        throw createError({ statusCode: err?.statusCode || 500, statusMessage: err?.statusMessage || "Anime alınamadı" })
    }
})
