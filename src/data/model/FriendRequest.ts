export class FriendRequest {
    constructor(
        private id: string,
        private from: string,
        private to: string,
    ) { }

    getId() {
        return this.id
    }

    getFrom() {
        return this.from
    }

    getTo() {
        return this.to
    }

    setId(id: string) {
        this.id = id
    }

    setFrom(from: string) {
        this.from = from
    }

    setTo(to: string) {
        this.to = to
    }

    static toFriendRequestModel(bookmark: any): FriendRequest {
        return new FriendRequest(bookmark.id, bookmark.from, bookmark.to)
    }
}

export default FriendRequest