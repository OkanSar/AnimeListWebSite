// ~/server/api/supabase/cart/index.delete.ts
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

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

    try {
        // Aktif sepeti bul
        const { data: cart } = await client
            .from('carts')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .single()

        if (!cart) {
            return { error: true, message: 'Aktif sepet bulunamadı.' }
        }

        // Ürünü sepette bul
        const { data: existingItem } = await client
            .from('cart_items')
            .select('*')
            .eq('cart_id', cart.id)
            .eq('product_id', product_id)
            .single()

        if (!existingItem) {
            return { error: true, message: 'Ürün sepette yok.' }
        }

        // Ürünü sil
        const { error: deleteError } = await client
            .from('cart_items')
            .delete()
            .eq('id', existingItem.id)

        if (deleteError) throw deleteError

        // Toplam fiyatı yeniden hesapla
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

        return {
            error: false,
            message: 'Ürün sepetten silindi.',
            cart_id: cart.id,
            total_price: totalPrice
        }
    } catch (err: any) {
        console.error('Sepetten silme hatası:', err)
        return { error: true, message: err.message || 'Ürün silinemedi.' }
    }
})
