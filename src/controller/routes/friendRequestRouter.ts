import express from "express"

import friendRequestController from "../FriendRequestController"

export const friendRequestRouter = express.Router()

friendRequestRouter.post("/:to", friendRequestController.createFriendRequest)