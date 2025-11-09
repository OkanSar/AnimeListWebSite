// ~/server/api/supabase/cart/index.put.ts
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const { data: { user }, error: userError } = await client.auth.getUser()

    if (userError || !user?.id) {
        event.node.res.statusCode = 401
        return { error: true, message: 'Unauthorized' }
    }

    const body = await readBody(event)
    const { product_id, quantity } = body

    if (!product_id || quantity === undefined) {
        return { error: true, message: 'Ürün ID ve quantity gerekli.' }
    }

    try {
        // Aktif sepeti bul
        let { data: cart, error: cartError } = await client
            .from('carts')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .single()

        if (cartError?.code === 'PGRST116') {
            const { data: newCart, error: newCartError } = await client
                .from('carts')
                .insert({ user_id: user.id, total_price: 0, status: 'active' })
                .select('*')
                .single()
            if (newCartError) throw newCartError
            cart = newCart
        } else if (cartError) throw cartError

        // Sepetteki ürünü bul
        const { data: existingItem } = await client
            .from('cart_items')
            .select('*')
            .eq('cart_id', cart.id)
            .eq('product_id', product_id)
            .single()

        if (existingItem) {
            if (quantity <= 0) {
                await client.from('cart_items').delete().eq('id', existingItem.id)
            } else {
                await client.from('cart_items').update({ quantity }).eq('id', existingItem.id)
            }
        } else {
            // yeni ürün ekle
            await client.from('cart_items').insert({ cart_id: cart.id, product_id, quantity })
        }

        // toplam fiyatı yeniden hesapla
        const { data: items } = await client
            .from('cart_items')
            .select(`quantity, products(price)`)
            .eq('cart_id', cart.id)

        const totalPrice = items?.reduce(
            (sum, item) => sum + (item.products?.price || 0) * item.quantity,
            0
        ) || 0

        await client.from('carts').update({ total_price: totalPrice }).eq('id', cart.id)

        return { error: false, message: 'Sepet güncellendi.', cart_id: cart.id, total_price: totalPrice }
    } catch (err: any) {
        console.error('Sepeti güncelleme hatası:', err)
        return { error: true, message: err.message || 'Sepet güncellenemedi.' }
    }
})
