export interface Post {
    id: string,
    userId: string,
    description: string,
    image: string,
    likes: string[]
}

export interface CreatePostDTO {
    description: string,
    image: string,
    likes?: string[],
}

export interface PostCRUDDTO {
    id: string
}

export interface UpdatePostDDTO {
    id: string,
    userId?: string,
    description?: string,
    image?: string,
    likes?: [],
}

export interface GetPostsByUsernameDTO {
    username: string
}