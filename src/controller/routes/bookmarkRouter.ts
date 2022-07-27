import express from "express"

import bookmarkController from "../BookmarkController"

export const bookmarkRouter = express.Router()

bookmarkRouter.post("/", bookmarkController.createBookmark)