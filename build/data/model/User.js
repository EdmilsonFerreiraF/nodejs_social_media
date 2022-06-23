"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(id, username, email, password, isAdmin, profilePicture, coverPicture, followers, following, description, city, from, relationship) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.isAdmin = isAdmin;
        this.profilePicture = profilePicture;
        this.coverPicture = coverPicture;
        this.followers = followers;
        this.following = following;
        this.description = description;
        this.city = city;
        this.from = from;
        this.relationship = relationship;
    }
    getId() {
        return this.id;
    }
    getUsername() {
        return this.username;
    }
    getEmail() {
        return this.email;
    }
    getPassword() {
        return this.password;
    }
    getIsAdmin() {
        return this.isAdmin;
    }
    setId(id) {
        this.id = id;
    }
    setUsername(username) {
        this.username = username;
    }
    setEmail(email) {
        this.email = email;
    }
    setPassword(password) {
        this.password = password;
    }
    setIsAdmin(isAdmin) {
        this.isAdmin = isAdmin;
    }
    static toUserModel(user) {
        return new User(user.id, user.username, user.email, user.password, user.isAdmin);
    }
}
exports.User = User;
