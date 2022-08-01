export class Comment {
    constructor(
        private id: string,
        private postId: string,
        private userId: string,
        private content: string,
    ) { }

    getId() {
        return this.id
    }

    getPostId() {
        return this.postId
    }

    getUserId() {
        return this.userId
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

    setUserId(userId: string) {
        this.userId = userId
    }

    setContent(content: string) {
        this.content = content
    }

    static toCommentModel(comment: any): Comment {
        return new Comment(comment.id, comment.postId, comment.userId, comment.content)
    }
}

export default Comment