import {serverSupabaseClient} from "#supabase/server";

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)

    const { data: products, error } = await client
        .from('categories')
        .select('*')

    if (error) {
        event.node.res.statusCode = 500
        return { error: error.message }
    }

    return { products }
})