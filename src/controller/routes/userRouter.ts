import express from "express"

import userController from "../UserController"

export const userRouter = express.Router()

userRouter.post("/signup", userController.createUser)
userRouter.post("/login", userController.getUserByEmail)
userRouter.put("/", userController.updateUser)
userRouter.delete("/", userController.deleteUser)
userRouter.get("/", userController.getUserById)
userRouter.get("/friends", userController.getFriends)
userRouter.put("/:id/follow", userController.followUser)
userRouter.put("/:id/unfollow", userController.unfollowUser)