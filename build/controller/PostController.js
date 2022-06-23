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
exports.PostController = void 0;
const idGenerator_1 = require("../business/services/idGenerator");
const tokenGenerator_1 = require("../business/services/tokenGenerator");
const PostBusiness_1 = require("../business/PostBusiness");
const PostDatabase_1 = require("../data/PostDatabase");
const postBusiness = new PostBusiness_1.PostBusiness(new idGenerator_1.IdGenerator(), new PostDatabase_1.PostDatabase(), new tokenGenerator_1.TokenGenerator());
class PostController {
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { description, image } = req.body;
                const token = req.headers.authorization;
                const input = {
                    description,
                    image
                };
                yield postBusiness.createPost(input, token);
                res.status(200).send("Post has been created");
            }
            catch (error) {
                const { statusCode, message } = error;
                res.status(statusCode || 400).send({ message });
            }
        });
    }
    getPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const token = req.headers.authorization;
                const input = { id };
                const result = yield postBusiness.getPostById(input, token);
                res.status(200).send(result);
            }
            catch (error) {
                const { statusCode, message } = error;
                res.status(statusCode || 400).send({ message });
            }
        });
    }
    updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { userId, description, image, likes } = req.body;
                const token = req.headers.authorization;
                const input = {
                    id,
                    userId,
                    description,
                    image,
                    likes
                };
                yield postBusiness.updatePost(input, token);
                res.status(200).send("Your post has been updated");
            }
            catch (error) {
                const { statusCode, message } = error;
                res.status(statusCode || 400).send({ message });
            }
        });
    }
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const token = req.headers.authorization;
                const input = {
                    id
                };
                yield postBusiness.deletePost(input, token);
                res.status(200).send("Your post has been updated");
            }
            catch (error) {
                const { statusCode, message } = error;
                res.status(statusCode || 400).send({ message });
            }
        });
    }
    likePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const token = req.headers.authorization;
                const input = {
                    id
                };
                const result = yield postBusiness.likePost(input, token);
                if (!result.getLikes().includes(id)) {
                    res.status(200).json("The post has been liked");
                }
                else {
                    res.status(200).json("The post has been disliked");
                }
            }
            catch (error) {
                const { statusCode, message } = error;
                res.status(statusCode || 400).send({ message });
            }
        });
    }
    getTimelinePosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const token = req.headers.authorization;
                const input = {
                    id
                };
                const result = yield postBusiness.getTimelinePosts(input, token);
                res.status(200).send(result);
            }
            catch (error) {
                const { statusCode, message } = error;
                res.status(statusCode || 400).send({ message });
            }
        });
    }
    getPostsByUsername(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username } = req.params;
                const token = req.headers.authorization;
                const input = {
                    username
                };
                const result = yield postBusiness.getPostsByUsername(input, token);
                res.status(200).send(result);
            }
            catch (error) {
                const { statusCode, message } = error;
                res.status(statusCode || 400).send({ message });
            }
        });
    }
}
exports.PostController = PostController;
exports.default = new PostController();
