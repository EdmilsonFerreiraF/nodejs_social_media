export enum Relationship {
    SINGLE = "Single",
    DATING = "Dating",
    MARRIED = "Married",
    DIVORCED = "Divorced"
}

export interface User {
    id: string,
    username: string,
    email: string,
    password: string,
    isAdmin: boolean,
    profilePicture: string,
    coverPicture: string,
    followers: [],
    following: [],
    description: string,
    from: string,
    relationship: Relationship
}

export type SignupInputDTO = {
    username: string,
    email: string,
    password: string,
    isAdmin: boolean,
}

export type LoginInputDTO = {
    email: string,
    password: string
}

export type UpdateUserDTO = {
    password: string
}

export type GetUserDataDTO = {
    id: string
}

export type GetUserByUsernameDataDTO = {
    id?: string,
    username?: string
}

export type GetUserDataByUsernameDTO = {
    username: string
}

export type FollowUserDTO = {
    id: string
}

export type Friend = {
    id: string,
    username: string,
    profilePicture: string
}