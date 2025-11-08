import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)

    const query = getQuery(event)
    const categoryId = query.category_id

    let productsQuery = client.from('products').select('*')

    if (categoryId) {
        productsQuery = productsQuery.eq('category_id', categoryId)
    }

    const { data: products, error } = await productsQuery

    if (error) {
        event.node.res.statusCode = 500
        return { error: error.message }
    }

    return { products }
})
