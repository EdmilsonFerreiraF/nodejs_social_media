export class Post {
    constructor(
        private id: string,
        private postId: string,
        private description: string,
        private image: string,
        private likes: string,
    ) { }

    getId() {
        return this.id
    }

    getPostId() {
        return this.postId
    }

    getDescription() {
        return this.description
    }

    getImage() {
        return this.image
    }

    getLikes() {
        return this.likes
    }

    setId(id: string) {
        this.id = id
    }

    setPostId(postId: string) {
        this.postId = postId
    }

    setDescription(description: string) {
        this.description = description
    }

    setImage(image: string) {
        this.image = image
    }

    setLikes(likes: string) {
        this.likes = likes
    }

    static toPostModel(post: any): Post {
        return new Post(post.id, post.postId, post.description, post.image, post.likes)
    }
}

export default Post