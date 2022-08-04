import { IdGenerator } from "./services/idGenerator"
import { AuthenticationData, TokenGenerator } from "./services/tokenGenerator"

import { FriendRequestDatabase } from "../data/FriendRequestDatabase"

import { FriendRequest } from "../data/model/FriendRequest"
import {
   CreateFriendRequestDTO
} from "./entities/friendRequest"

import { CustomError } from "../errors/CustomError"

export class FriendRequestBusiness {
   constructor(
      private idGenerator: IdGenerator,
      private bookmarkDatabase: FriendRequestDatabase,
      private tokenGenerator: TokenGenerator
   ) { }

   public async createFriendRequest(
      input: CreateFriendRequestDTO,
      token: string
   ): Promise<FriendRequest> {
      try {
         if (
            !input.to
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

         const result = await this.bookmarkDatabase.createFriendRequest(
            new FriendRequest(
               id,
               isTokenValid.id,
               input.to,
            )
         )

         return result
      } catch (error: any) {
         const { message } = error
         console.log('message', message)
         throw new CustomError(error.statusCode, error.message)
      }
   }
}

export default new FriendRequestBusiness(new IdGenerator(), new FriendRequestDatabase(), new TokenGenerator())