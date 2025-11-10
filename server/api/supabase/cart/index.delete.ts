import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const { data: { user }, error: userError } = await client.auth.getUser()

    if (userError || !user?.id) {
        event.node.res.statusCode = 401
        return { error: true, message: 'Unauthorized' }
    }

    const { product_id } = getQuery(event)

    if (!product_id) {
        return { error: true, message: 'Ürün ID gerekli.' }
    }

    try {
        const { data: cart } = await client
            .from('carts')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .single()

        if (!cart) {
            return { error: true, message: 'Aktif sepet bulunamadı.' }
        }

        const { data: existingItem } = await client
            .from('cart_items')
            .select('*')
            .eq('cart_id', cart.id)
            .eq('product_id', product_id)
            .single()

        if (!existingItem) {
            return { error: true, message: 'Ürün sepette yok.' }
        }

        const { error: deleteError } = await client
            .from('cart_items')
            .delete()
            .eq('id', existingItem.id)

        if (deleteError) throw deleteError

        const { data: items } = await client
            .from('cart_items')
            .select(`quantity, products(price)`)
            .eq('cart_id', cart.id)

        const totalPrice = items?.reduce(
            (sum, item) => sum + (item.products?.price || 0) * item.quantity,
            0
        ) || 0

        await client
            .from('carts')
            .update({ total_price: totalPrice })
            .eq('id', cart.id)

        return { error: false, message: 'Ürün sepetten silindi.', total_price: totalPrice }
    } catch (err: any) {
        console.error('Sepetten silme hatası:', err)
        return { error: true, message: err.message || 'Ürün silinemedi.' }
    }
})
