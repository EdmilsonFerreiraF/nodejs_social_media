import { Request, Response } from "express"

import { IdGenerator } from "../business/services/idGenerator"
import { TokenGenerator } from "../business/services/tokenGenerator"

import { BookmarkBusiness } from "../business/BookmarkBusiness"
import { BookmarkDatabase } from "../data/BookmarkDatabase"

import { CreateBookmarkDTO } from "../business/entities/bookmark"
import { Bookmark } from "../data/model/Bookmark"

const bookmarkBusiness =
   new BookmarkBusiness(
      new IdGenerator(),
      new BookmarkDatabase(),
      new TokenGenerator(),
   )

export class BookmarkController {
   public async createBookmark(req: Request, res: Response): Promise<void> {
      try {
         const {
            postId } = req.body

         const token = req.headers.authorization as string

         const input: CreateBookmarkDTO = {
            postId,
         }

         await bookmarkBusiness.createBookmark(
            input,
            token
         )

         res.status(200).send("Bookmark has been created")
      } catch (error: any) {
         const { statusCode, message } = error
         res.status(statusCode || 400).send({ message })
      }
   }

   public async getBookmarksByUserId(req: Request, res: Response): Promise<void> {
      try {
         const token = req.headers.authorization as string

         const result: Bookmark[] = await bookmarkBusiness.getBookmarksByUserId(
            token
         )

         res.status(200).send(result)
      } catch (error: any) {
         const { statusCode, message } = error
         res.status(statusCode || 400).send({ message })
      }
   }
}

export default new BookmarkController()