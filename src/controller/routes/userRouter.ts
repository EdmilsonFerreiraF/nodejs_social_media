import express from "express"

import userController from "../UserController"

export const userRouter = express.Router()

userRouter.post("/signup", userController.createUser)
userRouter.post("/login", userController.getUserByEmail)
userRouter.put("/", userController.updateUser)
userRouter.delete("/", userController.deleteUser)
userRouter.get("/:username", userController.getUserByIdOrUsername)
userRouter.get("/", userController.getUserByIdOrUsername)
userRouter.get("/:id/friends", userController.getFriends)
userRouter.put("/:id/follow", userController.followUser)
userRouter.put("/:id/add", userController.addFriend)
userRouter.put("/:id/unfollow", userController.unfollowUser)