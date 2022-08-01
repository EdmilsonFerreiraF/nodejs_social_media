export interface Comment {
    id: string
    userId: string
    postId: string
    content: string
}

export interface CreateCommentDTO {
    postId: string
    content: string
}

export interface CommentCRUDDTO {
    userId: string
    postId: string
    content: string
}