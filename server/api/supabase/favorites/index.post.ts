import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const { data: { user }, error: userError } = await client.auth.getUser()

    if (userError || !user?.id) {
        event.node.res.statusCode = 401
        return { error: true, message: 'Unauthorized' }
    }

    const body = await readBody(event)
    const { product_id } = body

    if (!product_id) {
        return { error: true, message: 'Ürün ID gerekli.' }
    }

    const { data: existing } = await client
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', product_id)
        .maybeSingle()

    if (existing) {
        return { error: false, message: 'Bu ürün zaten favorilerde.' }
    }

    const { error } = await client
        .from('favorites')
        .insert({ user_id: user.id, product_id })

    if (error) {
        console.error('Favori ekleme hatası:', error)
        return { error: true, message: error.message }
    }

    return { error: false, message: 'Ürün favorilere eklendi.' }
})
