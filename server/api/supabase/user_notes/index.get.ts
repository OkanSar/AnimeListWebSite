import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)

    const { data: { user } } = await client.auth.getUser()
    if (!user?.id) {
        event.node.res.statusCode = 401
        return { error: 'Unauthorized' }
    }

    const { data: profile } = await client
        .from('profiles')
        .select('notes')
        .eq('id', user.id)
        .single()

    if (!profile?.notes) return { notes: [], watching_order: [] }

    const { data: userNotes } = await client
        .from('user_notes')
        .select('notes, watching_order')
        .eq('id', profile.notes)
        .single()

    return userNotes || { notes: [], watching_order: [] }
})
