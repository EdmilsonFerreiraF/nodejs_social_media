import { Request, Response } from "express"

import { IdGenerator } from "../business/services/idGenerator"
import { TokenGenerator } from "../business/services/tokenGenerator"

import { FriendRequestBusiness } from "../business/FriendRequestBusiness"
import { FriendRequestDatabase } from "../data/FriendRequestDatabase"

import { FriendRequestCRUDDTO, CreateFriendRequestDTO } from "../business/entities/friendRequest"
import { FriendRequest } from "../data/model/FriendRequest"

const friendRequestBusiness =
   new FriendRequestBusiness(
      new IdGenerator(),
      new FriendRequestDatabase(),
      new TokenGenerator(),
   )

export class FriendRequestController {
   public async createFriendRequest(req: Request, res: Response): Promise<void> {
      try {
         const {
            to } = req.params

         const token = req.headers.authorization as string

         const input: CreateFriendRequestDTO = {
            to,
         }

         const result = await friendRequestBusiness.createFriendRequest(
            input,
            token
         )

         res.status(200).send(result)
      } catch (error: any) {
         const { statusCode, message } = error
         res.status(statusCode || 400).send({ message })
      }
   }


   public async getFriendRequest(req: Request, res: Response): Promise<void> {
      try {
         const token = req.headers.authorization as string as string as string

         const result = await friendRequestBusiness.getFriendRequest(
            token
         )

         res.status(200).send(result)
      } catch (error: any) {
         const { statusCode, message } = error
         res.status(statusCode || 400).send({ message })
      }
   }
}

export default new FriendRequestController()