import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const productId = await event.context.params?.id

    if (!productId) {
        event.node.res.statusCode = 400
        return { error: 'Geçersiz ürün ID' }
    }

    try {
        const { data, error } = await client
            .from('products')
            .select(`*,categories(name)`)
            .eq('id', productId)
            .single()

        if (error || !data) {
            event.node.res.statusCode = 404
            return { error: error?.message || 'Ürün bulunamadı' }
        }

        const product = {
            ...data,
            category_name: data.categories?.name || null,
        }

        return { product }

    } catch (err: any) {
        event.node.res.statusCode = 500
        return { error: err.message }
    }
})
