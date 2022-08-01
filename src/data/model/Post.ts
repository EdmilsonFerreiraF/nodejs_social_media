export class Post {
    constructor(
        private id: string,
        private userId: string,
        private description: string,
        private audience: string,
        private image: string,
        private likes: string[],
        private createdAt?: string,
        private updatedAt?: string,
    ) { }

    getId() {
        return this.id
    }

    getUserId() {
        return this.userId
    }

    getDescription() {
        return this.description
    }

    getAudience() {
        return this.audience
    }

    getImage() {
        return this.image
    }

    getLikes() {
        return this.likes
    }

    getCreatedAt() {
        return this.createdAt
    }

    getUpdatedAt() {
        return this.updatedAt
    }

    setId(id: string) {
        this.id = id
    }

    setUserId(userId: string) {
        this.userId = userId
    }

    setDescription(description: string) {
        this.description = description
    }

    setImage(image: string) {
        this.image = image
    }

    setLikes(likes: string[]) {
        this.likes = likes
    }

    setCreatedAt(createdAt: string) {
        this.createdAt = createdAt
    }

    setUpdatedAt(updatedAt: string) {
        this.updatedAt = updatedAt
    }

    static toPostModel(post: any): Post {
        return new Post(post.id, post.userId, post.description, post.audience, post.image, post.likes, post.createdAt, post.updatedAt)
    }
}

export default Post