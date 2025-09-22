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

    const query = getQuery(event)
    const force = query.force === "true"

    const today = new Date()
    const afterWeek = new Date(today)
    afterWeek.setDate(today.getDate() + 7)

    await fs.mkdir(DATA_DIR, { recursive: true }).catch(console.error)

    let stored: any = {}
    try {
        const raw = await fs.readFile(DATA_FILE, "utf-8")
        stored = JSON.parse(raw)
    } catch {
        stored = {}
    }

    const isNewWeek = !stored.afterWeek || new Date(stored.afterWeek) <= today
    let weeklyAnimes = stored.animes || []
    let currentLetter: string = stored.currentLetter || "a"

    if (isNewWeek || force) {
        // 1. Harfi al
        let letter = currentLetter
        if (force) {
            // force durumunda stored.currentLetter kullan, değiştirme
            letter = stored.currentLetter || "a"
        }

        // 2. API çağrısı
        const searchUrl = `https://api.myanimelist.net/v2/anime?q=${letter}&limit=50&fields=id`
        const searchResponse: any = await $fetch(searchUrl, {
            headers: { "X-MAL-CLIENT-ID": clientId },
        })

        const allAnimes = searchResponse.data.map((item: any) => item.node)

        // 3. Rastgele 2 seç
        const selectedIds: number[] = []
        while (selectedIds.length < 2 && allAnimes.length > 0) {
            const idx = Math.floor(Math.random() * allAnimes.length)
            selectedIds.push(allAnimes[idx].id)
            allAnimes.splice(idx, 1)
        }

        weeklyAnimes = await Promise.all(
            selectedIds.map(async (id) => {
                const detailUrl = `https://api.myanimelist.net/v2/anime/${id}?fields=${fields}`
                return await $fetch(detailUrl, { headers: { "X-MAL-CLIENT-ID": clientId } })
            })
        )

        // 4. Sonraki harfi hazırla
        let nextLetter = String.fromCharCode(letter.charCodeAt(0) + 1)
        if (letter === "z") nextLetter = "a"

        stored = {
            currentWeek: today.toISOString(),
            afterWeek: afterWeek.toISOString(),
            currentLetter: nextLetter,
            animes: weeklyAnimes,
        }

        await fs.writeFile(DATA_FILE, JSON.stringify(stored, null, 2), "utf-8")
    }

    return {
        currentWeek: stored.currentWeek,
        afterWeek: stored.afterWeek,
        letter: stored.currentLetter || currentLetter,
        data: weeklyAnimes,
    }
})
