import { IdGenerator } from "./services/idGenerator"
import { AuthenticationData, TokenGenerator } from "./services/tokenGenerator"

import { PostDatabase } from "../data/PostDatabase"

import { Post } from "../data/model/Post"
import { CreatePostDTO, GetPostsByUserIDDTO, PostCRUDDTO, UpdatePostDDTO } from "./entities/post"

import { CustomError } from "../errors/CustomError"

export class PostBusiness {
   constructor(
      private idGenerator: IdGenerator,
      private postDatabase: PostDatabase,
      private tokenGenerator: TokenGenerator
   ) { }

   public async createPost(
      input: CreatePostDTO,
      token: string
   ): Promise<Post> {
      try {
         if (
            !input.description ||
            !input.audience ||
            !input.image
         ) {
            throw new CustomError(422, "Missing input")
         }

         const id: string = this.idGenerator.generate()

         if (!token) {
            throw new CustomError(422, "Missing token")
         }

         const isTokenValid: AuthenticationData = this.tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token)

         if (!isTokenValid) {
            throw new CustomError(409, "Invalid token")
         }

         if (isTokenValid.isAdmin !== true) {
            throw new CustomError(422, "Only admins can access this feature")
         }

         const result = await this.postDatabase.createPost(
            new Post(
               id,
               isTokenValid.id,
               input.description,
               input.audience,
               input.image,
               input.likes as string[],
            )
         )

         return result
      } catch (error: any) {
         throw new CustomError(error.statusCode, error.message)
      }
   }

   public async getPostById(input: PostCRUDDTO, token: string): Promise<Post> {
      try {
         if (!input.id) {
            throw new CustomError(422, "Missing input")
         }

         if (!token) {
            throw new CustomError(422, "Missing input")
         }

         const isTokenValid: AuthenticationData = this.tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token)

         if (!isTokenValid) {
            throw new CustomError(422, "Invalid token")
         }

         const result: Post = await this.postDatabase.getPostById(input)

         return result
      } catch (error: any) {
         throw new CustomError(error.statusCode, error.message)
      }
   }

   public async updatePost(input: UpdatePostDDTO, token: string): Promise<void> {
      try {
         if (
            !input.id
         ) {
            throw new CustomError(422, "Missing input")
         }

         if (
            !input.id &&
            !input.userId &&
            !input.description &&
            !input.audience &&
            !input.image &&
            !input.likes
         ) {
            throw new CustomError(422, "Missing input")
         }

         if (!token) {
            throw new CustomError(422, "Missing token")
         }

         const isTokenValid: AuthenticationData = this.tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token)

         if (!isTokenValid) {
            throw new CustomError(409, "Invalid token")
         }

         if (isTokenValid.isAdmin !== true) {
            throw new CustomError(422, "Only admins can access this feature")
         }

         await this.postDatabase.updatePost(input, isTokenValid.id)
      } catch (error: any) {
         throw new CustomError(error.statusCode, error.message)
      }
   }

   public async deletePost(input: any, token: string): Promise<void> {
      try {
         if (!input.id) {
            throw new CustomError(422, "Missing token")
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

         await this.postDatabase.deletePost({ id: input.id })
      } catch (error: any) {
         throw new CustomError(error.statusCode, error.message)
      }
   }

   public async likePost(input: PostCRUDDTO, token: string): Promise<Post> {
      try {
         if (!input.id) {
            throw new CustomError(417, "Missing input")
         }

         if (!token) {
            throw new CustomError(422, "Missing token")
         }

         const isTokenValid: AuthenticationData = this.tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token)

         if (!isTokenValid) {
            throw new CustomError(409, "Invalid token")
         }

         const post = await this.postDatabase.likePost(input, isTokenValid.id)

         return post
      } catch (error: any) {
         throw new CustomError(error.statusCode, error.message)
      }
   }

   public async getTimelinePosts(input: PostCRUDDTO, token: string): Promise<Post[]> {
      try {
         if (!input.id) {
            throw new CustomError(417, "Missing input")
         }

         if (!token) {
            throw new CustomError(422, "Missing token")
         }

         const isTokenValid: AuthenticationData = this.tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token)

         if (!isTokenValid) {
            throw new CustomError(409, "Invalid token")
         }

         const result: Post[] = await this.postDatabase.getTimelinePosts(input)

         return result
      } catch (error: any) {
         throw new CustomError(error.statusCode, error.message)
      }
   }

   public async getPostsByUserId(input: GetPostsByUserIDDTO, token: string) {
      try {
         if (!input.userId) {
            throw new CustomError(417, "Missing input")
         }

         if (!token) {
            throw new CustomError(422, "Missing token")
         }

         const isTokenValid: AuthenticationData = this.tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token)

         if (!isTokenValid) {
            throw new CustomError(409, "Invalid token")
         }

         const result = await this.postDatabase.getPostsByUserId(input, isTokenValid.id)

         return result
      } catch (error: any) {
         throw new CustomError(error.statusCode, error.message)
      }
   }
}

export default new PostBusiness(new IdGenerator(), new PostDatabase(), new TokenGenerator())