import express from "express"

import bookmarkController from "../BookmarkController"

export const bookmarkRouter = express.Router()

bookmarkRouter.post("/", bookmarkController.createBookmark)
bookmarkRouter.get("/", bookmarkController.getBookmarksByUserId)
bookmarkRouter.delete("/:postId", bookmarkController.deleteBookmarkByPostId)