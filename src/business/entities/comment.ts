export interface Comment {
    id: string
    postId: string
    userId: string
    content: string
}

export interface CreateCommentDTO {
    postId: string
    content: string
}

export interface GetCommentDTO {
    postId: string
}