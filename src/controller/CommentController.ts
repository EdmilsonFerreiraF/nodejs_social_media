import { Request, Response } from "express"

import { IdGenerator } from "../business/services/idGenerator"
import { TokenGenerator } from "../business/services/tokenGenerator"

import { CommentBusiness } from "../business/CommentBusiness"
import { CommentDatabase } from "../data/CommentDatabase"

import { CreateCommentDTO, GetCommentDTO } from "../business/entities/comment"
import { Comment } from "../data/model/Comment"

const commentBusiness =
   new CommentBusiness(
      new IdGenerator(),
      new CommentDatabase(),
      new TokenGenerator(),
   )

export class CommentController {
   public async createComment(req: Request, res: Response): Promise<void> {
      try {
         const { postId, content } = req.body
         const token = req.headers.authorization as string

         const input: CreateCommentDTO = {
            postId,
            content
         }

         const result = await commentBusiness.createComment(
            input,
            token
         )

         res.status(200).send(result)
      } catch (error: any) {
         const { statusCode, message } = error
         res.status(statusCode || 400).send({ message })
      }
   }

   public async getCommentsByPostId(req: Request, res: Response): Promise<void> {
      try {
         const { postId } = req.params
         const token = req.headers.authorization as string

         const input: GetCommentDTO = { postId }

         const result: Comment = await commentBusiness.getCommentsByPostId(input, token)

         res.status(200).send(result)
      } catch (error: any) {
         const { statusCode, message } = error
         res.status(statusCode || 400).send({ message })
      }
   }
}

export default new CommentController()