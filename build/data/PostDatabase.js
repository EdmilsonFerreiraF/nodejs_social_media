"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.PostDatabase = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const { Schema } = mongoose_1.default;
const BaseDatabase_1 = __importDefault(require("./BaseDatabase"));
const Post_1 = __importDefault(require("./model/Post"));
const UserDatabase_1 = __importDefault(require("./UserDatabase"));
const config_1 = __importDefault(require("./config"));
class PostDatabase extends BaseDatabase_1.default {
    constructor() {
        super(...arguments);
        this.tableName = "post";
        this.postSchema = new Schema({
            id: String,
            userId: String,
            description: String,
            image: String,
            likes: [String],
        }, { timestamps: true });
        this.userDatabase = UserDatabase_1.default;
    }
    toModel(dbModel) {
        return (dbModel &&
            new Post_1.default(dbModel.id, dbModel.userId, dbModel.description, dbModel.image, dbModel.likes));
    }
    createPost(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postDocument = {
                    id: input.getId(),
                    userId: input.getUserId(),
                    description: input.getDescription(),
                    image: input.getImage(),
                    likes: input.getLikes()
                };
                yield BaseDatabase_1.default.connect;
                const PostModel = (0, mongoose_1.model)(this.tableName, this.postSchema);
                const NewPost = new PostModel(postDocument);
                NewPost.save();
            }
            catch (error) {
                throw new Error(error.statusCode);
            }
        });
    }
    getPostById(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield BaseDatabase_1.default.connect;
                const PostModel = (0, mongoose_1.model)(this.tableName, this.postSchema);
                const post = yield PostModel.findOne({ id: input.id });
                return this.toModel(post);
            }
            catch (error) {
                throw new Error(error.statusCode);
            }
        });
    }
    updatePost(input, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield BaseDatabase_1.default.connect;
                const PostModel = (0, mongoose_1.model)(this.tableName, this.postSchema);
                const post = yield PostModel.findOne({ id: input.id });
                if ((post === null || post === void 0 ? void 0 : post.userId) !== id) {
                    throw new Error("You can only update your own posts");
                }
                yield (post === null || post === void 0 ? void 0 : post.updateOne({ $set: input }));
            }
            catch (error) {
                throw new Error(error.statusCode);
            }
        });
    }
    deletePost(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield BaseDatabase_1.default.connect;
                const PostModel = (0, mongoose_1.model)(this.tableName, this.postSchema);
                yield PostModel.deleteOne({ id: input.id });
            }
            catch (error) {
                throw new Error(error.statusCode);
            }
        });
    }
    likePost(input, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield BaseDatabase_1.default.connect;
                const postModel = (0, mongoose_1.model)(this.tableName, this.postSchema);
                const post = yield postModel.findOne({ id: input.id });
                const likes = post.likes = [];
                if (!likes.includes(userId)) {
                    yield (post === null || post === void 0 ? void 0 : post.updateOne({ $push: { likes: userId } }));
                }
                else {
                    yield (post === null || post === void 0 ? void 0 : post.updateOne({ $pull: { likes: userId } }));
                }
                return this.toModel(post);
            }
            catch (error) {
                throw new Error(error.statusCode);
            }
        });
    }
    getTimelinePosts(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield BaseDatabase_1.default.connect;
                const PostModel = (0, mongoose_1.model)(this.tableName, this.postSchema);
                // const UserModel = model<User>(UserDatabase.getTableName(), UserModel)
                const currentUser = yield config_1.default.findOne({ id: input === null || input === void 0 ? void 0 : input.id });
                const userPosts = yield PostModel.find({ userId: currentUser === null || currentUser === void 0 ? void 0 : currentUser.id });
                const followingPosts = yield Promise.all(currentUser === null || currentUser === void 0 ? void 0 : currentUser.following.map((followingId) => {
                    return PostModel.find({ userId: followingId });
                }));
                return userPosts.concat(...followingPosts).map(post => this.toModel(post));
            }
            catch (error) {
                console.log('error - database', error);
                throw new Error(error.statusCode);
            }
        });
    }
    getPostsByUsername(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield BaseDatabase_1.default.connect;
                const PostModel = (0, mongoose_1.model)(this.tableName, this.postSchema);
                const posts = yield PostModel.find({ userId: input.username });
                return posts.map(post => this.toModel(post));
            }
            catch (error) {
                throw new Error(error.posts);
            }
        });
    }
}
exports.PostDatabase = PostDatabase;
exports.default = new PostDatabase();
