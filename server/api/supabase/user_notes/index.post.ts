import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event)

    const { data: { user } } = await client.auth.getUser()
    if (!user?.id) return { error: 'Unauthorized' }

    const { data: profile } = await client
        .from('profiles')
        .select('notes')
        .eq('id', user.id)
        .single()

    if (!profile?.notes) return { error: 'User notes not found' }

    const { data: current } = await client
        .from('user_notes')
        .select('notes')
        .eq('id', profile.notes)
        .single()

    const newNote = {
        anime_ids: body.anime_ids ?? [],
        text: body.text,
        created_at: new Date().toISOString()
    }

    const updatedNotes = [...(current?.notes ?? []), newNote]

    const { error } = await client
        .from('user_notes')
        .update({ notes: updatedNotes })
        .eq('id', profile.notes)

    if (error) return { error }

    return { success: true, notes: updatedNotes }
})
