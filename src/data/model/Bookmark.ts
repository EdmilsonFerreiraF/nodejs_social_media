export class Bookmark {
    constructor(
        private id: string,
        private postId: string,
        private userId: string,
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

    setId(id: string) {
        this.id = id
    }

    setPostId(postId: string) {
        this.postId = postId
    }

    setUserId(userId: string) {
        this.userId = userId
    }

    static toBookmarkModel(bookmark: any): Bookmark {
        return new Bookmark(bookmark.id, bookmark.postId, bookmark.userId)
    }
}

export default Bookmark