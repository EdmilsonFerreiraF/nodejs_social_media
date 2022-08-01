import express from "express"

import commentController from "../CommentController"

export const commentRouter = express.Router()

commentRouter.post("/", commentController.createComment)
commentRouter.get("/:postId", commentController.getCommentsByPostId)