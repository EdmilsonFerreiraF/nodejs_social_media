import mongoose, { model } from "mongoose"
import { FollowUserDTO, Friend, GetUserDataByUsernameDTO, GetUserDataDTO, GetUserByUsernameDataDTO, LoginInputDTO, UpdateUserDTO } from "../business/entities/user"
const { Schema } = mongoose

import BaseDatabase from "./BaseDatabase"
import { User as UserEntity } from "../business/entities/user"
import { User } from "./model/User"
import UserModel from "./config"

export class UserDatabase extends BaseDatabase {
   protected userSchema = new Schema<UserEntity>({
      id: {
         type: String,
         required: true,
      },
      username: {
         type: String,
         required: true,
         min: 3,
         max: 20,
         unique: true
      },
      email: {
         type: String,
         required: true,
         max: 50,
         unique: true
      },
      password: {
         type: String,
         required: true,
         min: 6
      },
      profilePicture: {
         type: String,
         default: ""
      },
      coverPicture: {
         type: String,
         default: ""
      },
      friends: {
         type: [String],
         default: []
      },
      followers: {
         type: [String],
         default: []
      },
      following: {
         type: [String],
         default: []
      },
      isAdmin: {
         type: Boolean,
         default: false
      },
      description: {
         type: String,
         max: 50
      },
      city: {
         type: String,
         max: 50
      },
      from: {
         type: String,
         max: 50
      },
      relationship: {
         type: Number
      },
   },
      { timestamps: true }
   )

   protected tableName: string = "user"

   constructor(

   ) {
      super()
   }


   getUserSchema() {
      return this.userSchema
   }

   getUserModel() {
      return UserModel
   }

   getTableName() {
      return this.tableName
   }

   private toModel(dbModel?: any): User {
      return (
         dbModel &&
         new User(
            dbModel.id,
            dbModel.username,
            dbModel.email,
            dbModel.password,
            dbModel.isAdmin,
            dbModel.profilePicture,
            dbModel.coverPicture,
            dbModel.friends,
            dbModel.followers,
            dbModel.following,
            dbModel.description,
            dbModel.city,
            dbModel.from,
            dbModel.relationship,
         )
      )
   }

   public async createUser(input: User): Promise<void> {
      try {
         const userDocument = {
            id: input.getId(),
            username: input.getUsername(),
            email: input.getEmail(),
            password: input.getPassword(),
            isAdmin: input.getIsAdmin(),
         }

         await BaseDatabase.connect
         const userModel = new UserModel(userDocument)

         await userModel.save()
      } catch (error: any) {
         throw new Error(error.statusCode)
      }
   }

   public async getUserByEmail(input: LoginInputDTO): Promise<User> {
      try {
         await BaseDatabase.connect

         const user = await this.getUserModel().findOne({ email: input.email })

         return this.toModel(user)
      } catch (error: any) {
         throw new Error(error.statusCode)
      }
   }

   public async updateUser(input: UpdateUserDTO, id: string): Promise<void> {
      try {
         await BaseDatabase.connect

         await this.getUserModel().updateOne({ id }, { $set: { password: input.password } })
      } catch (error: any) {
         throw new Error(error.statusCode)
      }
   }

   public async deleteUser(input: GetUserDataDTO): Promise<void> {
      try {
         await BaseDatabase.connect

         await this.getUserModel().deleteOne({ id: input.id })
      } catch (error: any) {
         throw new Error(error.statusCode)
      }
   }

   public async getUserByIdOrUsername(input: GetUserByUsernameDataDTO): Promise<User> {
      try {
         await BaseDatabase.connect

         let user

         if (input.username) {
            user = await this.getUserModel().findOne({ username: input.username })
         } else {
            user = await this.getUserModel().findOne({ id: input.id })
         }

         return this.toModel(user)
      } catch (error: any) {
         throw new Error(error.statusCode)
      }
   }

   public async getUserById(input: GetUserDataDTO): Promise<User> {
      try {
         await BaseDatabase.connect

         const user = await this.getUserModel().findOne({ id: input.id })

         return this.toModel(user)
      } catch (error: any) {
         throw new Error(error.statusCode)
      }
   }

   public async getFriends(input: GetUserDataDTO): Promise<Friend[]> {
      try {
         await BaseDatabase.connect

         const user: any = await this.getUserModel().findOne({ id: input.id })


         let friendList: Friend[] = []

         if (user?.friends?.length) {
            const friends: any = await Promise.all(
               user?.friends?.map((friendId: string) => {
                  return this.getUserModel().findOne({ id: friendId })
               })
            )

            friends.map((friend: any) => {
               const { id, username, profilePicture } = friend

               friendList.push({ id, username, profilePicture })
            })
         }

         return friendList
      } catch (error: any) {
         throw new Error(error.statusCode)
      }
   }

   public async followUser(input: FollowUserDTO, userId: string): Promise<void> {
      try {
         await BaseDatabase.connect

         const user: any = await this.getUserModel().findOne({ id: input.id })

         if (!user) {
            throw new Error("User not found")
         }

         const currentUser: any = await this.getUserModel().findOne({ id: userId })

         const followers: any = user?.followers

         if (!followers.includes(userId)) {
            await user?.updateOne({ $push: { followers: userId } })
            await currentUser?.updateOne({ $push: { following: input.id } })
         } else {
            throw new Error("You have already followed this user")
         }
      } catch (error: any) {
         throw new Error(error.statusCode)
      }
   }

   public async unfollowUser(input: FollowUserDTO, userId: string): Promise<void> {
      try {
         await BaseDatabase.connect

         const user: any = await this.getUserModel().findOne({ id: input.id })

         if (!user) {
            throw new Error("User not found")
         }

         const currentUser: any = await this.getUserModel().findOne({ id: userId })

         const followers: any = user.followers = []

         if (!followers.includes(userId)) {
            await user?.updateOne({ $push: { followers: userId } })
            await currentUser?.updateOne({ $push: { following: input.id } })
         } else {
            throw new Error("You have already followed this user")
         }
      } catch (error: any) {
         throw new Error(error.statusCode)
      }
   }
}

export default new UserDatabase()