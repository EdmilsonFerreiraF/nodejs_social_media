export interface FriendRequest {
    id: string
    from: string
    to: string
    createdAt: string
    updatedAt: string
}

export interface CreateFriendRequestDTO {
    to: string
}

export interface FriendRequestCRUDDTO {
    to: string
}