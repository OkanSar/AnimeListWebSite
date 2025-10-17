import {serverSupabaseClient} from "#supabase/server";

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const userList = await client
        .from('user_anime_list')
        .select('*')
        .single()
    return userList
})