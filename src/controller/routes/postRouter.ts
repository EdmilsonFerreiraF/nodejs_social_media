import express from "express"

import postController from "../PostController"

export const postRouter = express.Router()

postRouter.post("/", postController.createPost)
postRouter.get("/:id", postController.getPostById)
postRouter.put("/:id", postController.updatePost)
postRouter.delete("/", postController.deletePost)
postRouter.put("/:id/like", postController.likePost)
postRouter.get("/timeline/:id", postController.getTimelinePosts)
postRouter.get("/profile/:username", postController.getPostsByUsername)