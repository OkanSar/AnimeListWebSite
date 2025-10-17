import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)

    const { data: { user }, error: userError } = await client.auth.getUser()
    if (userError || !user?.id) {
        event.node.res.statusCode = 401
        return { error: 'Unauthorized' }
    }

    const { data: profile, error } = await client
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (error) {
        event.node.res.statusCode = 500
        return { error: error.message }
    }

    return { profile }
})
