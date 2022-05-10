export class User {
    constructor(
        private id: string,
        private username: string,
        private email: string,
        private password: string,
        private isAdmin: boolean,
        private profilePicture?: string,
        private coverPicture?: string,
        private followers?: [],
        private following?: [],
        private description?: string,
        private city?: string,
        private from?: string,
        private relationship?: Number
    ) { }

    getId() {
        return this.id
    }

    getUsername() {
        return this.username
    }

    getEmail() {
        return this.email
    }

    getPassword() {
        return this.password
    }

    getIsAdmin() {
        return this.isAdmin
    }

    setId(id: string) {
        this.id = id
    }

    setUsername(username: string) {
        this.username = username
    }

    setEmail(email: string) {
        this.email = email
    }

    setPassword(password: string) {
        this.password = password
    }

    setIsAdmin(isAdmin: boolean) {
        this.isAdmin = isAdmin
    }

    static toUserModel(user: any): User {
        return new User(user.id, user.username, user.email, user.password, user.isAdmin)
    }
}

export interface UserInputDTO {
    username: string
    email: string
    password: string
    isAdmin: boolean
}

export interface IsAdmin {
    isAdmin: boolean
}