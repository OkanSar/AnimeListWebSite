import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const { data: { user }, error: userError } = await client.auth.getUser()

    if (userError || !user?.id) {
        event.node.res.statusCode = 401
        return { error: true, message: 'Unauthorized' }
    }

    const { data, error } = await client
        .from('favorites')
        .select(`
      id,
      created_at,
      products (
        id,
        name,
        price,
        image
      )
    `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Favoriler alınamadı:', error)
        return { error: true, message: error.message }
    }

    return { error: false, favorites: data }
})
