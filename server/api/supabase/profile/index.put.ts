import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const { data: { user } } = await client.auth.getUser()

    if (!user?.id) {
        event.node.res.statusCode = 401
        return { error: 'Unauthorized' }
    }

    const body = await readBody(event)
    const { username, full_name, email, avatar_url } = body

    if (!username && !full_name && !email && !avatar_url) {
        return { error: 'No data to update' }
    }

    const { data: profile, error: profileError } = await client
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (profileError || !profile) {
        return { error: 'Profile not found' }
    }

    const updates: Record<string, any> = {}
    if (username) updates.username = username
    if (full_name) updates.full_name = full_name
    if (email) updates.email = email
    if (avatar_url) updates.avatar_url = avatar_url

    const { data: updatedProfile, error: updateError } = await client
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .single()

    if (updateError) {
        event.node.res.statusCode = 500
        return { error: 'Failed to update profile', details: updateError.message }
    }

    return { profile: updatedProfile }
})
