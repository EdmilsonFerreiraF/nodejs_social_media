import { IdGenerator } from "./services/idGenerator"
import { AuthenticationData, TokenGenerator } from "./services/tokenGenerator"

import { BookmarkDatabase } from "../data/BookmarkDatabase"

import { Bookmark } from "../data/model/Bookmark"
import {
   CreateBookmarkDTO
} from "./entities/bookmark"

import { CustomError } from "../errors/CustomError"

export class BookmarkBusiness {
   constructor(
      private idGenerator: IdGenerator,
      private bookmarkDatabase: BookmarkDatabase,
      private tokenGenerator: TokenGenerator
   ) { }

   public async createBookmark(
      input: CreateBookmarkDTO,
      token: string
   ): Promise<Bookmark> {
      try {
         if (
            !input.postId
         ) {
            throw new CustomError(422, "Missing input")
         }

         if (!token) {
            throw new CustomError(422, "Missing token")
         }

         const id: string = this.idGenerator.generate()

         const isTokenValid: AuthenticationData = this.tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token)

         if (!isTokenValid) {
            throw new CustomError(409, "Invalid token")
         }

         if (isTokenValid.isAdmin !== true) {
            throw new CustomError(422, "Only admins can access this feature")
         }

         const result = await this.bookmarkDatabase.createBookmark(
            new Bookmark(
               id,
               input.postId,
               isTokenValid.id,
            )
         )

         return result
      } catch (error: any) {
         throw new CustomError(error.statusCode, error.message)
      }
   }

   public async getBookmarksByUserId(token: string) {
      try {
         if (!token) {
            throw new CustomError(422, "Missing token")
         }

         const isTokenValid: AuthenticationData = this.tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token)

         if (!isTokenValid) {
            throw new CustomError(409, "Invalid token")
         }

         const result = await this.bookmarkDatabase.getBookmarksByUserId(isTokenValid.id)

         return result
      } catch (error: any) {
         throw new CustomError(error.statusCode, error.message)
      }
   }

   public async deleteBookmarkByPostId(input: any, token: string): Promise<void> {
      try {
         if (!input.postId) {
            throw new CustomError(422, "Missing postId")
         }

         if (!token) {
            throw new CustomError(422, "Missing token")
         }

         const isTokenValid: AuthenticationData = this.tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token)

         if (!isTokenValid) {
            throw new CustomError(409, "Invalid token")
         }

         if (isTokenValid.isAdmin !== true) {
            throw new CustomError(403, "Only admins can access this feature")
         }

         await this.bookmarkDatabase.deleteBookmarkByPostId({ postId: input.postId }, isTokenValid.id)
      } catch (error: any) {
         throw new CustomError(error.statusCode, error.message)
      }
   }
}

export default new BookmarkBusiness(new IdGenerator(), new BookmarkDatabase(), new TokenGenerator())