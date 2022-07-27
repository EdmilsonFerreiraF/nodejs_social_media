"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const BaseDatabase_1 = __importDefault(require("./BaseDatabase"));
const User_1 = require("./model/User");
const config_1 = __importDefault(require("./config"));
class UserDatabase extends BaseDatabase_1.default {
    constructor() {
        super();
        this.userSchema = new Schema({
            id: {
                type: String,
                required: true,
            },
            username: {
                type: String,
                required: true,
                min: 3,
                max: 20,
                unique: true
            },
            email: {
                type: String,
                required: true,
                max: 50,
                unique: true
            },
            password: {
                type: String,
                required: true,
                min: 6
            },
            profilePicture: {
                type: String,
                default: ""
            },
            coverPicture: {
                type: String,
                default: ""
            },
            followers: {
                type: [String],
                default: []
            },
            following: {
                type: [String],
                default: []
            },
            isAdmin: {
                type: Boolean,
                default: false
            },
            description: {
                type: String,
                max: 50
            },
            city: {
                type: String,
                max: 50
            },
            from: {
                type: String,
                max: 50
            },
            relationship: {
                type: Number
            }
        }, { timestamps: true });
        this.tableName = "user";
    }
    getUserSchema() {
        return this.userSchema;
    }
    getUserModel() {
        return config_1.default;
    }
    getTableName() {
        return this.tableName;
    }
    toModel(dbModel) {
        return (dbModel &&
            new User_1.User(dbModel.id, dbModel.username, dbModel.email, dbModel.password, dbModel.isAdmin, dbModel.profilePicture, dbModel.coverPicture, dbModel.followers, dbModel.following, dbModel.description, dbModel.city, dbModel.from, dbModel.relationship));
    }
    createUser(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userDocument = {
                    id: input.getId(),
                    username: input.getUsername(),
                    email: input.getEmail(),
                    password: input.getPassword(),
                    isAdmin: input.getIsAdmin(),
                };
                yield BaseDatabase_1.default.connect;
                const userModel = new config_1.default(userDocument);
                yield userModel.save();
            }
            catch (error) {
                throw new Error(error.statusCode);
            }
        });
    }
    getUserByEmail(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield BaseDatabase_1.default.connect;
                const user = yield this.getUserModel().findOne({ email: input.email });
                return this.toModel(user);
            }
            catch (error) {
                throw new Error(error.statusCode);
            }
        });
    }
    updateUser(input, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield BaseDatabase_1.default.connect;
                yield this.getUserModel().updateOne({ id }, { $set: { password: input.password } });
            }
            catch (error) {
                throw new Error(error.statusCode);
            }
        });
    }
    deleteUser(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield BaseDatabase_1.default.connect;
                yield this.getUserModel().deleteOne({ id: input.id });
            }
            catch (error) {
                throw new Error(error.statusCode);
            }
        });
    }
    getUserByIdOrUsername(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield BaseDatabase_1.default.connect;
                let user;
                if (input.username) {
                    user = yield this.getUserModel().findOne({ username: input.username });
                }
                else {
                    user = yield this.getUserModel().findOne({ id: input.id });
                }
                return this.toModel(user);
            }
            catch (error) {
                console.log('error', error);
                throw new Error(error.statusCode);
            }
        });
    }
    getUserById(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield BaseDatabase_1.default.connect;
                const user = yield this.getUserModel().findOne({ id: input.id });
                return this.toModel(user);
            }
            catch (error) {
                throw new Error(error.statusCode);
            }
        });
    }
    getFriends(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield BaseDatabase_1.default.connect;
                const user = yield this.getUserModel().findOne({ id: input.id });
                const friends = yield Promise.all(user === null || user === void 0 ? void 0 : user.following.map((friendId) => {
                    return this.getUserModel().findOne({ id: friendId });
                }));
                let friendList = [];
                friends.map((friend) => {
                    const { id, username, profilePicture } = friend;
                    friendList.push({ id, username, profilePicture });
                });
                return friendList;
            }
            catch (error) {
                throw new Error(error.statusCode);
            }
        });
    }
    followUser(input, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield BaseDatabase_1.default.connect;
                const user = yield this.getUserModel().findOne({ id: input.id });
                if (!user) {
                    throw new Error("User not found");
                }
                const currentUser = yield this.getUserModel().findOne({ id: userId });
                const followers = user === null || user === void 0 ? void 0 : user.followers;
                if (!followers.includes(userId)) {
                    yield (user === null || user === void 0 ? void 0 : user.updateOne({ $push: { followers: userId } }));
                    yield (currentUser === null || currentUser === void 0 ? void 0 : currentUser.updateOne({ $push: { following: input.id } }));
                }
                else {
                    throw new Error("You have already followed this user");
                }
            }
            catch (error) {
                throw new Error(error.statusCode);
            }
        });
    }
    unfollowUser(input, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield BaseDatabase_1.default.connect;
                const user = yield this.getUserModel().findOne({ id: input.id });
                if (!user) {
                    throw new Error("User not found");
                }
                const currentUser = yield this.getUserModel().findOne({ id: userId });
                const followers = user.followers = [];
                if (!followers.includes(userId)) {
                    yield (user === null || user === void 0 ? void 0 : user.updateOne({ $push: { followers: userId } }));
                    yield (currentUser === null || currentUser === void 0 ? void 0 : currentUser.updateOne({ $push: { following: input.id } }));
                }
                else {
                    throw new Error("You have already followed this user");
                }
            }
            catch (error) {
                throw new Error(error.statusCode);
            }
        });
    }
}
exports.UserDatabase = UserDatabase;
exports.default = new UserDatabase();
