export interface profile {
    uuid: string
    username: string
    full_name: string
    avatar_url: string
    email: string
    animeList: string
    updated_at: Date
}

export interface user_anime_list {
    id: string
    anime_id: string[]
    created_at: Date
}