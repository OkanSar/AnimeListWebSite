import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.resolve("./server/data")
const DATA_FILE = path.join(DATA_DIR, "weeklyAnime.json")

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const clientId = config.malClientId

    const fields = [
        "id","title","main_picture","start_date","end_date",
        "synopsis","mean","rank","popularity","num_list_users","num_scoring_users",
        "genres", "num_episodes", "rating"
    ].join(",")

    const today = new Date()
    const afterWeek = new Date(today)
    afterWeek.setDate(today.getDate() + 7)

    // Klasörü oluştur
    await fs.mkdir(DATA_DIR, { recursive: true }).catch(console.error)

    // Daha önceki cache'i oku
    let stored: any = {}
    try {
        const raw = await fs.readFile(DATA_FILE, "utf-8")
        stored = JSON.parse(raw)
    } catch {
        stored = {}
    }

    const isNewWeek = !stored.afterWeek || new Date(stored.afterWeek) <= today
    let weeklyAnimes = stored.animes || []

    if (isNewWeek) {
        try {
            const searchUrl = `https://api.myanimelist.net/v2/anime/ranking?ranking_type=all&limit=50&fields=id`
            const searchResponse: any = await $fetch(searchUrl, {
                headers: { "X-MAL-CLIENT-ID": clientId },
            })

            const allAnimes = searchResponse.data.map((item: any) => item.node)

            const selectedIds: number[] = []
            while (selectedIds.length < 2 && allAnimes.length > 0) {
                const idx = Math.floor(Math.random() * allAnimes.length)
                selectedIds.push(allAnimes[idx].id)
                allAnimes.splice(idx, 1)
            }

            weeklyAnimes = await Promise.all(
                selectedIds.map(async (id) => {
                    try {
                        const detailUrl = `https://api.myanimelist.net/v2/anime/${id}?fields=${fields}`
                        return await $fetch(detailUrl, { headers: { "X-MAL-CLIENT-ID": clientId } })
                    } catch {
                        return null
                    }
                })
            )

            // null değerleri filtrele
            weeklyAnimes = weeklyAnimes.filter(Boolean)

            stored = {
                currentWeek: today.toISOString(),
                afterWeek: afterWeek.toISOString(),
                animes: weeklyAnimes,
            }

            await fs.writeFile(DATA_FILE, JSON.stringify(stored, null, 2), "utf-8")
        } catch (err) {
            console.error("Error fetching weekly anime:", err.message || err)
        }
    }

    return {
        currentWeek: stored.currentWeek,
        afterWeek: stored.afterWeek,
        data: weeklyAnimes,
    }
})
