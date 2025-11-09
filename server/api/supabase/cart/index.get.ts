// ~/server/api/supabase/cart/index.get.ts
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const { data: { user }, error: userError } = await client.auth.getUser()

    if (userError || !user?.id) {
        event.node.res.statusCode = 401
        return { error: true, message: 'Unauthorized' }
    }

    try {
        const { data: cart, error: cartError } = await client
            .from('carts')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .single()

        if (cartError && cartError.code !== 'PGRST116') throw cartError // PGRST116 = no rows found

        // Eğer aktif sepet yoksa boş döndür
        if (!cart) {
            return {
                error: false,
                message: 'Kullanıcının aktif sepeti yok.',
                cart: null,
                items: []
            }
        }

        // 2️⃣ Sepete ait ürünleri getir
        const { data: items, error: itemsError } = await client
            .from('cart_items')
            .select(`
                    id,
                    quantity,
                    product_id,
                    products (
                      id,
                      name,
                      price,
                      image
                    )
                  `)
            .eq('cart_id', cart.id)

        if (itemsError) throw itemsError

        const totalPrice = items.reduce(
            (sum, item) => sum + (item.products?.price || 0) * item.quantity,
            0
        )

        return {
            error: false,
            cart: {
                ...cart,
                total_price: totalPrice
            },
            items
        }
    } catch (err: any) {
        console.error('Sepet getirme hatası:', err)
        return {
            error: true,
            message: err.message || 'Sepet getirilemedi.'
        }
    }
})
