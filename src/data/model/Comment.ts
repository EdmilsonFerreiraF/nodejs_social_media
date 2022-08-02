export class Comment {
    constructor(
        private id: string,
        private postId: string,
        private username: string,
        private content: string,
    ) { }

    getId() {
        return this.id
    }

    getPostId() {
        return this.postId
    }

    getUsername() {
        return this.username
    }

    getContent() {
        return this.content
    }

    setId(id: string) {
        this.id = id
    }

    setPostId(postId: string) {
        this.postId = postId
    }

    setUsername(username: string) {
        this.username = username
    }

    setContent(content: string) {
        this.content = content
    }

    static toCommentModel(comment: any): Comment {
        return new Comment(comment.id, comment.postId, comment.username, comment.content)
    }
}

export default Comment