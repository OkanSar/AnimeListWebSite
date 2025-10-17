import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)

    const { data: { user } } = await client.auth.getUser()
    if (!user?.id) {
        event.node.res.statusCode = 401
        return { error: 'Unauthorized' }
    }

    const body = await readBody(event)
    const { notes: updatedNotes, watching_order: updatedWatchingOrder } = body

    if (!updatedNotes && !updatedWatchingOrder) {
        return { error: 'No data to update' }
    }

    const { data: profile, error: profileError } = await client
        .from('profiles')
        .select('notes')
        .eq('id', user.id)
        .single()

    if (profileError || !profile?.notes) {
        event.node.res.statusCode = 404
        return { error: 'Profile notes not found' }
    }

    const userNotesId = profile.notes

    const { data, error } = await client
        .from('user_notes')
        .update({
            notes: updatedNotes,
            watching_order: updatedWatchingOrder
        })
        .eq('id', userNotesId)
        .select()
        .single()

    if (error) {
        event.node.res.statusCode = 500
        return { error: error.message }
    }

    return { message: 'User notes updated', data }
})
