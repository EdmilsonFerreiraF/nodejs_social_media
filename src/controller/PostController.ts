import { Request, Response } from "express"

import { IdGenerator } from "../business/services/idGenerator"
import { TokenGenerator } from "../business/services/tokenGenerator"

import { PostBusiness } from "../business/PostBusiness"
import { PostDatabase } from "../data/PostDatabase"

import { CreatePostDTO, GetPostsByUserIDDTO, PostCRUDDTO, UpdatePostDDTO } from "../business/entities/post"
import { Post } from "../data/model/Post"

const postBusiness =
   new PostBusiness(
      new IdGenerator(),
      new PostDatabase(),
      new TokenGenerator(),
   )

export class PostController {
   public async createPost(req: Request, res: Response): Promise<void> {
      try {
         const { description, audience, image } = req.body
         const token = req.headers.authorization as string

         const input: CreatePostDTO = {
            description,
            audience,
            image
         }

         await postBusiness.createPost(
            input,
            token
         )

         res.status(200).send("Post has been created")
      } catch (error: any) {
         const { statusCode, message } = error
         res.status(statusCode || 400).send({ message })
      }
   }

   public async getPostById(req: Request, res: Response): Promise<void> {
      try {
         const { id } = req.params
         const token = req.headers.authorization as string

         const input: PostCRUDDTO = { id }

         const result: Post = await postBusiness.getPostById(input, token)

         res.status(200).send(result)
      } catch (error: any) {
         const { statusCode, message } = error
         res.status(statusCode || 400).send({ message })
      }
   }

   public async updatePost(req: Request, res: Response): Promise<void> {
      try {
         const { id } = req.params

         const {
            userId,
            description,
            audience,
            image,
            likes,
         } = req.body

         const token = req.headers.authorization as string

         const input: UpdatePostDDTO = {
            id,
            userId,
            description,
            audience,
            image,
            likes,
         }

         await postBusiness.updatePost(
            input,
            token
         )

         res.status(200).send("Your post has been updated")
      } catch (error: any) {
         const { statusCode, message } = error
         res.status(statusCode || 400).send({ message })
      }
   }

   public async deletePost(req: Request, res: Response): Promise<void> {
      try {
         const { id } = req.params
         const token = req.headers.authorization as string

         const input: PostCRUDDTO = {
            id
         }

         await postBusiness.deletePost(
            input,
            token
         )

         res.status(200).send("Your post has been updated")
      } catch (error: any) {
         const { statusCode, message } = error
         res.status(statusCode || 400).send({ message })
      }
   }

   public async likePost(req: Request, res: Response): Promise<void> {
      try {
         const { id } = req.params
         const token = req.headers.authorization as string as string

         const input: PostCRUDDTO = {
            id
         }

         const result: Post = await postBusiness.likePost(
            input,
            token
         )

         if (!result.getLikes().includes(id)) {
            res.status(200).json("The post has been liked")
         } else {
            res.status(200).json("The post has been disliked")
         }
      } catch (error: any) {
         const { statusCode, message } = error
         res.status(statusCode || 400).send({ message })
      }
   }

   public async getTimelinePosts(req: Request, res: Response): Promise<void> {
      try {
         const { id } = req.params
         const token = req.headers.authorization as string

         const input: PostCRUDDTO = {
            id
         }

         const result: Post[] = await postBusiness.getTimelinePosts(
            input,
            token
         )

         res.status(200).send(result)
      } catch (error: any) {
         const { statusCode, message } = error
         res.status(statusCode || 400).send({ message })
      }
   }

   public async getPostsByUserId(req: Request, res: Response): Promise<void> {
      try {
         const { userId } = req.params
         const token = req.headers.authorization as string

         const input: GetPostsByUserIDDTO = {
            userId
         }

         const result = await postBusiness.getPostsByUserId(
            input,
            token
         )

         res.status(200).send(result)
      } catch (error: any) {
         const { statusCode, message } = error
         res.status(statusCode || 400).send({ message })
      }
   }
}

export default new PostController()