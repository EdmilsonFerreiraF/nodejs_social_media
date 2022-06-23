"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const express_1 = __importDefault(require("express"));
const PostController_1 = __importDefault(require("../PostController"));
exports.postRouter = express_1.default.Router();
exports.postRouter.post("/", PostController_1.default.createPost);
exports.postRouter.get("/:id", PostController_1.default.getPostById);
exports.postRouter.put("/:id", PostController_1.default.updatePost);
exports.postRouter.delete("/", PostController_1.default.deletePost);
exports.postRouter.put("/:id/like", PostController_1.default.likePost);
exports.postRouter.get("/timeline/:id", PostController_1.default.getTimelinePosts);
exports.postRouter.get("/profile/:username", PostController_1.default.getPostsByUsername);
