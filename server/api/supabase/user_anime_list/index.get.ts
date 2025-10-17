import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const config = useRuntimeConfig()
    const malClientId = config.malClientId

    const { data: { user } } = await client.auth.getUser()
    if (!user?.id) {
        event.node.res.statusCode = 401
        return { error: 'Unauthorized' }
    }

    const { data: profileData, error: profileError } = await client
        .from('profiles')
        .select('animelist')
        .eq('id', user.id)
        .single()

    if (profileError || !profileData?.animelist) {
        return { animeList: [] }
    }

    const { data: userAnimeList, error: animeError } = await client
        .from('user_anime_list')
        .select('anime_id')
        .eq('id', profileData.animelist)
        .single()

    if (animeError || !userAnimeList?.anime_id) {
        return { animeList: [] }
    }

    const categories = ['all', 'watched', 'toBeWatched', 'favorite'] as const

    const result: IUserAnimeList = Object.fromEntries(
        await Promise.all(
            categories.map(async (cat) => {
                const ids: string[] = userAnimeList.anime_id[cat] ?? []
                const animes: Anime[] = await Promise.all(
                    ids.map(async (id) => {
                        try {
                            const url = `https://api.myanimelist.net/v2/anime/${id}?fields=title,main_picture,mean,num_scoring_users`
                            const response = await $fetch(url, {
                                headers: { "X-MAL-CLIENT-ID": malClientId }
                            })
                            return {
                                id,
                                title: response.title,
                                mean: response.mean,
                                main_picture_medium: response.main_picture?.medium,
                                num_scoring_users: response.num_scoring_users,
                            }
                        } catch {
                            return null
                        }
                    })
                ).then(arr => arr.filter(a => a !== null))

                return [cat, animes]
            })
        )
    ) as IUserAnimeList
    return result
})
