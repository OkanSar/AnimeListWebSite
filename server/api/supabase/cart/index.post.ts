import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const { data: { user }, error: userError } = await client.auth.getUser()

    if (userError || !user?.id) {
        event.node.res.statusCode = 401
        return { error: true, message: 'Unauthorized' }
    }

    const body = await readBody(event)
    const { product_id, quantity = 1 } = body

    if (!product_id) return { error: true, message: 'Ürün ID gerekli.' }

    try {
        let { data: cart, error: cartError } = await client
            .from('carts')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .single()

        if (cartError && cartError.code === 'PGRST116') {
            const { data: newCart, error: newCartError } = await client
                .from('carts')
                .insert({ user_id: user.id, total_price: 0, status: 'active' })
                .select('*')
                .single()

            if (newCartError) throw newCartError
            cart = newCart
        } else if (cartError) {
            throw cartError
        }

        // 🔹 Ürün fiyatını al
        const { data: product, error: productError } = await client
            .from('products')
            .select('price')
            .eq('id', product_id)
            .single()

        if (productError || !product) throw new Error('Ürün bulunamadı')

        // 🔹 Sepette ürün var mı kontrol et
        const { data: existingItem } = await client
            .from('cart_items')
            .select('*')
            .eq('cart_id', cart.id)
            .eq('product_id', product_id)
            .single()

        if (existingItem) {
            // 🔸 Varsa miktarı artır
            const { error: updateError } = await client
                .from('cart_items')
                .update({ quantity: existingItem.quantity + quantity })
                .eq('id', existingItem.id)
            if (updateError) throw updateError
        } else {
            // 🔸 Yoksa yeni kayıt ekle
            const { error: insertError } = await client
                .from('cart_items')
                .insert({
                    cart_id: cart.id,
                    product_id,
                    quantity,
                    price: product.price
                })
            if (insertError) throw insertError
        }

        // 🔹 Toplam fiyatı güncelle
        const { data: items } = await client
            .from('cart_items')
            .select(`quantity, price`)
            .eq('cart_id', cart.id)

        const totalPrice = items?.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0) || 0

        await client.from('carts').update({ total_price: totalPrice }).eq('id', cart.id)

        return { error: false, message: 'Ürün sepete eklendi.', cart_id: cart.id, total_price: totalPrice }
    } catch (err: any) {
        console.error('Sepete ekleme hatası:', err)
        return { error: true, message: err.message || 'Sepete eklenemedi.' }
    }
})
