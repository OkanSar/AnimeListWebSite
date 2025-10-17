import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event);

    // 1️⃣ Kullanıcıyı al
    const { data: { user }, error: userError } = await client.auth.getUser();
    if (userError || !user?.id) {
        event.node.res.statusCode = 401;
        return { error: "Unauthorized" };
    }

    // 2️⃣ Profilden animelist id al
    const { data: profile, error: profileError } = await client
        .from("profiles")
        .select("animelist")
        .eq("id", user.id)
        .single();

    if (profileError) {
        event.node.res.statusCode = 500;
        return { error: profileError.message };
    }

    const animelistId = profile.animelist;
    if (!animelistId) {
        event.node.res.statusCode = 404;
        return { error: "User animelist not found" };
    }

    // 3️⃣ Body'den animeId al
    const body = await readBody(event);
    const { animeId } = body;
    if (!animeId) {
        event.node.res.statusCode = 400;
        return { error: "animeId required" };
    }

    // 4️⃣ user_anime_list tablosundan ilgili row'u al
    const { data: animeListData, error: fetchError } = await client
        .from("user_anime_list")
        .select("anime_id")
        .eq("id", animelistId) // <-- profile.animelist id'si
        .single();

    if (fetchError) {
        event.node.res.statusCode = 500;
        return { error: fetchError.message };
    }

    const currentAnimeIds = animeListData.anime_id || {
        all: [],
        watched: [],
        toBeWatched: [],
        favorite: []
    };

    if (currentAnimeIds.all.includes(animeId)) {
        currentAnimeIds.all = currentAnimeIds.all.filter((id: number) => id !== animeId);
    } else {
        currentAnimeIds.all.push(animeId);
    }
    if (currentAnimeIds.favorite.includes(animeId)) {
        currentAnimeIds.favorite = currentAnimeIds.favorite.filter((id: number) => id !== animeId);
    } else {
        currentAnimeIds.favorite.push(animeId);
    }

    const { data, error: updateError } = await client
        .from("user_anime_list")
        .update({ anime_id: currentAnimeIds })
        .eq("id", animelistId)
        .select()
        .single();

    if (updateError) {
        event.node.res.statusCode = 500;
        return { error: updateError.message };
    }

    return { success: true, animeList: data.anime_id };
});
