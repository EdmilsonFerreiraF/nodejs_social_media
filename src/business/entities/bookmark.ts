export interface Bookmark {
    id: string
    postId: string
    userId: string
}

export interface CreateBookmarkDTO {
    postId: string
}

export interface BookmarkCRUDDTO {
    postId: string
}