"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const UserController_1 = __importDefault(require("../UserController"));
exports.userRouter = express_1.default.Router();
exports.userRouter.post("/signup", UserController_1.default.createUser);
exports.userRouter.post("/login", UserController_1.default.getUserByEmail);
exports.userRouter.put("/", UserController_1.default.updateUser);
exports.userRouter.delete("/", UserController_1.default.deleteUser);
exports.userRouter.get("/:username", UserController_1.default.getUserByIdOrUsername);
exports.userRouter.get("/", UserController_1.default.getUserByIdOrUsername);
exports.userRouter.get("/:id/friends", UserController_1.default.getFriends);
exports.userRouter.put("/:id/follow", UserController_1.default.followUser);
exports.userRouter.put("/:id/unfollow", UserController_1.default.unfollowUser);
