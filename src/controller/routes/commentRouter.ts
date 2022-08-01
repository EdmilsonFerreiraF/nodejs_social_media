import express from "express"

import commentController from "../BookmarkController"

export const commentRouter = express.Router()

commentRouter.post("/", commentController.createBookmark)