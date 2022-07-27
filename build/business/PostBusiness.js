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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostBusiness = void 0;
const idGenerator_1 = require("./services/idGenerator");
const tokenGenerator_1 = require("./services/tokenGenerator");
const PostDatabase_1 = require("../data/PostDatabase");
const Post_1 = require("../data/model/Post");
const CustomError_1 = require("../errors/CustomError");
class PostBusiness {
    constructor(idGenerator, postDatabase, tokenGenerator) {
        this.idGenerator = idGenerator;
        this.postDatabase = postDatabase;
        this.tokenGenerator = tokenGenerator;
    }
    createPost(input, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!input.description ||
                    !input.image) {
                    console.log('PostBusiness - 422');
                    throw new CustomError_1.CustomError(422, "Missing input");
                }
                const id = this.idGenerator.generate();
                if (!token) {
                    console.log('PostBusiness - 422');
                    throw new CustomError_1.CustomError(422, "Missing token");
                }
                const isTokenValid = this.tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token);
                if (!isTokenValid) {
                    console.log('PostBusiness - 409');
                    throw new CustomError_1.CustomError(409, "Invalid token");
                }
                if (isTokenValid.isAdmin !== true) {
                    console.log('PostBusiness - 422');
                    throw new CustomError_1.CustomError(422, "Only admins can access this feature");
                }
                yield this.postDatabase.createPost(new Post_1.Post(id, isTokenValid.id, input.description, input.image, input.likes));
            }
            catch (error) {
                throw new CustomError_1.CustomError(error.statusCode, error.message);
            }
        });
    }
    getPostById(input, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!input.id) {
                    throw new CustomError_1.CustomError(422, "Missing input");
                }
                if (!token) {
                    throw new CustomError_1.CustomError(422, "Missing input");
                }
                const isTokenValid = this.tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token);
                if (!isTokenValid) {
                    throw new CustomError_1.CustomError(422, "Invalid token");
                }
                const result = yield this.postDatabase.getPostById(input);
                return result;
            }
            catch (error) {
                throw new CustomError_1.CustomError(error.statusCode, error.message);
            }
        });
    }
    updatePost(input, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!input.id) {
                    throw new CustomError_1.CustomError(422, "Missing input");
                }
                if (!input.id &&
                    !input.userId &&
                    !input.description &&
                    !input.image &&
                    !input.likes) {
                    throw new CustomError_1.CustomError(422, "Missing input");
                }
                if (!token) {
                    throw new CustomError_1.CustomError(422, "Missing token");
                }
                const isTokenValid = this.tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token);
                if (!isTokenValid) {
                    throw new CustomError_1.CustomError(409, "Invalid token");
                }
                if (isTokenValid.isAdmin !== true) {
                    throw new CustomError_1.CustomError(422, "Only admins can access this feature");
                }
                yield this.postDatabase.updatePost(input, isTokenValid.id);
            }
            catch (error) {
                throw new CustomError_1.CustomError(error.statusCode, error.message);
            }
        });
    }
    deletePost(input, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!input.id) {
                    throw new CustomError_1.CustomError(422, "Missing token");
                }
                if (!token) {
                    throw new CustomError_1.CustomError(422, "Missing token");
                }
                const isTokenValid = this.tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token);
                if (!isTokenValid) {
                    throw new CustomError_1.CustomError(409, "Invalid token");
                }
                if (isTokenValid.isAdmin !== true) {
                    throw new CustomError_1.CustomError(403, "Only admins can access this feature");
                }
                yield this.postDatabase.deletePost({ id: isTokenValid.id });
            }
            catch (error) {
                throw new CustomError_1.CustomError(error.statusCode, error.message);
            }
        });
    }
    likePost(input, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!input.id) {
                    throw new CustomError_1.CustomError(417, "Missing input");
                }
                if (!token) {
                    throw new CustomError_1.CustomError(422, "Missing token");
                }
                const isTokenValid = this.tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token);
                if (!isTokenValid) {
                    throw new CustomError_1.CustomError(409, "Invalid token");
                }
                const post = yield this.postDatabase.likePost(input, isTokenValid.id);
                return post;
            }
            catch (error) {
                throw new CustomError_1.CustomError(error.statusCode, error.message);
            }
        });
    }
    getTimelinePosts(input, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!input.id) {
                    throw new CustomError_1.CustomError(417, "Missing input");
                }
                if (!token) {
                    throw new CustomError_1.CustomError(422, "Missing token");
                }
                const isTokenValid = this.tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token);
                if (!isTokenValid) {
                    throw new CustomError_1.CustomError(409, "Invalid token");
                }
                const result = yield this.postDatabase.getTimelinePosts(input);
                return result;
            }
            catch (error) {
                console.log('error', error);
                throw new CustomError_1.CustomError(error.statusCode, error.message);
            }
        });
    }
    getPostsByUsername(input, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!input.username) {
                    throw new CustomError_1.CustomError(417, "Missing input");
                }
                if (!token) {
                    throw new CustomError_1.CustomError(422, "Missing token");
                }
                const isTokenValid = this.tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token);
                if (!isTokenValid) {
                    throw new CustomError_1.CustomError(409, "Invalid token");
                }
                const result = yield this.postDatabase.getPostsByUsername(input);
                return result;
            }
            catch (error) {
                throw new CustomError_1.CustomError(error.statusCode, error.message);
            }
        });
    }
}
exports.PostBusiness = PostBusiness;
exports.default = new PostBusiness(new idGenerator_1.IdGenerator(), new PostDatabase_1.PostDatabase(), new tokenGenerator_1.TokenGenerator());
