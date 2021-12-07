import mongoose, { model } from "mongoose"
import { FollowUserDTO, Friend, GetUserDataDTO, LoginInputDTO, UpdateUserDTO } from "../business/entities/user"
const { Schema } = mongoose

import BaseDatabase from "./BaseDatabase"
import { User as UserEntity } from "../business/entities/user"
import { User } from "./model/User"

export class UserDatabase extends BaseDatabase {
   constructor(
      private userSchema = new Schema<UserEntity>({
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
         from: {
            type: String,
            max: 50
         },
         relationship: {
            type: String,
            enum: ["Single", "Dating", "Married", "Divorced"]
         }
      },
         { timestamps: true }
      ),
      protected tableName: string = "user"
   ) {
      super()
   }

   getUserSchema() {
      return this.userSchema
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
            dbModel.followers,
            dbModel.following,
            dbModel.description,
            dbModel.from,
            dbModel.relationship
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

         const UserModel = model<UserEntity>(this.getTableName(), this.getUserSchema())
         const userModel = new UserModel(userDocument)

         await userModel.save()
      } catch (error) {
         throw new Error(error.statusCode)
      }
   }

   public async getUserByEmail(input: LoginInputDTO): Promise<User> {
      try {
         await BaseDatabase.connect

         const UserModel = model<UserEntity>(this.getTableName(), this.getUserSchema())

         const user = await UserModel.findOne({ email: input.email })

         return this.toModel(user)
      } catch (error) {
         throw new Error(error.statusCode)
      }
   }

   public async updateUser(input: UpdateUserDTO, id: string): Promise<void> {
      try {
         await BaseDatabase.connect

         const UserModel = model<UserEntity>(this.getTableName(), this.getUserSchema())

         await UserModel.updateOne({ id }, { $set: { password: input.password } })
      } catch (error) {
         throw new Error(error.statusCode)
      }
   }

   public async deleteUser(input: GetUserDataDTO): Promise<void> {
      try {
         await BaseDatabase.connect

         const UserModel = model<UserEntity>(this.getTableName(), this.getUserSchema())

         await UserModel.deleteOne({ id: input.id })
      } catch (error) {
         throw new Error(error.statusCode)
      }
   }

   public async getUserById(input: GetUserDataDTO): Promise<User> {
      try {
         await BaseDatabase.connect

         const UserModel = model<UserEntity>(this.getTableName(), this.getUserSchema())

         const user = await UserModel.findOne({ id: input.id })

         return this.toModel(user)
      } catch (error) {
         throw new Error(error.statusCode)
      }
   }

   public async getFriends(input: GetUserDataDTO): Promise<Friend[]> {
      try {
         await BaseDatabase.connect

         const UserModel = model<UserEntity>(this.getTableName(), this.getUserSchema())

         const user = await UserModel.findOne({ id: input.id })

         const friends = await Promise.all(
            user.following.map((friendId: string) => {
               return UserModel.findOne({ id: friendId })
            })
         )

         let friendList: Friend[] = []

         friends.map((friend: Friend) => {
            const { id, username, profilePicture } = friend

            friendList.push({ id, username, profilePicture })
         })

         return friendList
      } catch (error) {
         throw new Error(error.statusCode)
      }
   }

   public async followUser(input: FollowUserDTO, userId: string): Promise<void> {
      try {
         await BaseDatabase.connect

         const UserModel = model<UserEntity>(this.getTableName(), this.getUserSchema())

         const user = await UserModel.findOne({ id: input.id })

         if (!user) {
            throw new Error("User not found")
         }

         const currentUser = await UserModel.findOne({ id: userId })

         const followers: string[] = user.followers

         if (!followers.includes(userId)) {
            await user.updateOne({ $push: { followers: userId } })
            await currentUser.updateOne({ $push: { following: input.id } })
         } else {
            throw new Error("You have already followed this user")
         }
      } catch (error) {
         throw new Error(error.statusCode)
      }
   }

   public async unfollowUser(input: FollowUserDTO, userId: string): Promise<void> {
      try {
         await BaseDatabase.connect

         const UserModel = model<UserEntity>(this.getTableName(), this.getUserSchema())

         const user = await UserModel.findOne({ id: input.id })

         if (!user) {
            throw new Error("User not found")
         }

         const currentUser = await UserModel.findOne({ id: userId })

         const followers: string[] = user.followers = []

         if (!followers.includes(userId)) {
            await user.updateOne({ $push: { followers: userId } })
            await currentUser.updateOne({ $push: { following: input.id } })
         } else {
            throw new Error("You have already followed this user")
         }
      } catch (error) {
         throw new Error(error.statusCode)
      }
   }
}

export default new UserDatabase()