export interface Post {
    id: string,
    userId: string,
    description: string,
    audience: Audience,
    image: string,
    likes: string[]
}

export interface CreatePostDTO {
    description: string,
    audience: Audience,
    image: string,
    likes?: string[],
}

export interface PostCRUDDTO {
    id: string
}

export enum Audience {
    PUBLIC = "PUBLIC",
    FRIENDS = "FRIENDS",
    FRIEND_OF_FRIENDS = "FRIEND_OF_FRIENDS",
    ONLY_ME = "ONLY_ME"
}

export interface UpdatePostDDTO {
    id: string,
    userId?: string,
    description?: string,
    audience: Audience,
    image?: string,
    likes?: [],
}

export interface GetPostsByUserIDDTO {
    userId: string
}