"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
class Post {
    constructor(id, userId, description, image, likes) {
        this.id = id;
        this.userId = userId;
        this.description = description;
        this.image = image;
        this.likes = likes;
    }
    getId() {
        return this.id;
    }
    getUserId() {
        return this.userId;
    }
    getDescription() {
        return this.description;
    }
    getImage() {
        return this.image;
    }
    getLikes() {
        return this.likes;
    }
    setId(id) {
        this.id = id;
    }
    setUserId(userId) {
        this.userId = userId;
    }
    setDescription(description) {
        this.description = description;
    }
    setImage(image) {
        this.image = image;
    }
    setLikes(likes) {
        this.likes = likes;
    }
    static toPostModel(post) {
        return new Post(post.id, post.userId, post.description, post.image, post.likes);
    }
}
exports.Post = Post;
exports.default = Post;
